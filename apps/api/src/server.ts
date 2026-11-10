import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Pool } from "pg";
import { createFirebaseTokenVerifier } from "./auth/firebase.js";
import { authenticate, requireActor, requireRole } from "./auth/middleware.js";
import { PostgresUserRepository } from "./auth/postgres-users.js";
import type { TokenVerifier, UserRepository } from "./auth/types.js";
import { loadConfig } from "./config.js";
import { createPool } from "./db/pool.js";
import { runMigrations } from "./db/migrate.js";
import {
  createRequestContext,
  HttpError,
  runMiddleware,
  sendJson,
  type Route,
  type RouteHandler,
} from "./http.js";

const serviceName = "zelora-api";

export type ApiDependencies = {
  readonly tokenVerifier?: TokenVerifier | null;
  readonly userRepository?: UserRepository | null;
  readonly logger?: Pick<Console, "error">;
};

export function createApiServer(dependencies: ApiDependencies = {}): Server {
  const tokenVerifier = dependencies.tokenVerifier ?? null;
  const userRepository = dependencies.userRepository ?? null;
  const logger = dependencies.logger ?? console;
  const routes = createRoutes(tokenVerifier, userRepository);

  return createServer((request, response) => {
    void handleRequest(request, response, routes, logger);
  });
}

function createRoutes(
  tokenVerifier: TokenVerifier | null,
  userRepository: UserRepository | null,
): Route[] {
  const authentication = authenticate({ verifier: tokenVerifier, users: userRepository });

  return [
    {
      method: "GET",
      path: "/health",
      middleware: [],
      handler: healthHandler,
    },
    {
      method: "GET",
      path: "/me",
      middleware: [authentication],
      handler: meHandler,
    },
    {
      method: "GET",
      path: "/admin/diagnostics",
      middleware: [authentication, requireRole("admin")],
      handler: adminDiagnosticsHandler,
    },
  ];
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  routes: readonly Route[],
  logger: Pick<Console, "error">,
): Promise<void> {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cache-Control", "no-store");

  let path = request.url ?? "/";

  try {
    const context = createRequestContext(request, response);
    path = context.url.pathname;
    const routesForPath = routes.filter((route) => route.path === context.url.pathname);

    if (routesForPath.length === 0) {
      throw new HttpError(404, "not_found");
    }

    const route = routesForPath.find((candidate) => candidate.method === request.method);

    if (!route) {
      const allow = routesForPath.map((candidate) => candidate.method).join(", ");
      throw new HttpError(405, "method_not_allowed", { headers: { Allow: allow } });
    }

    await runMiddleware([...route.middleware, route.handler], context);
  } catch (error) {
    if (response.headersSent) {
      response.destroy();
      return;
    }

    if (error instanceof HttpError) {
      sendJson(response, error.statusCode, { error: error.code }, error.headers);
      return;
    }

    logger.error(`Zelora API request failed: ${request.method ?? "GET"} ${path}`, error);
    sendJson(response, 500, { error: "internal_error" });
  }
}

const healthHandler: RouteHandler = async ({ response }) => {
  sendJson(response, 200, { status: "ok", service: serviceName });
};

const meHandler: RouteHandler = async (context) => {
  const actor = requireActor(context);

  sendJson(context.response, 200, {
    id: actor.id,
    email: actor.email,
    emailVerified: context.auth?.emailVerified ?? false,
    status: actor.status,
    roles: actor.roles,
  });
};

const adminDiagnosticsHandler: RouteHandler = async ({ response }) => {
  sendJson(response, 200, { status: "ok", service: serviceName, scope: "admin" });
};

async function start(): Promise<void> {
  const config = loadConfig();
  const pool = config.databaseUrl ? createPool(config.databaseUrl) : null;

  try {
    if (config.autoMigrate && pool) {
      const report = await runMigrations(pool, {
        log: (message) => process.stdout.write(`${message}\n`),
      });
      process.stdout.write(`Database migrations: ${report.applied.length} applied\n`);
    }

    const tokenVerifier = config.firebase ? createFirebaseTokenVerifier(config.firebase) : null;
    const userRepository = pool ? new PostgresUserRepository(pool) : null;
    const server = createApiServer({ tokenVerifier, userRepository });

    server.listen(config.port, "0.0.0.0", () => {
      process.stdout.write(`Zelora API listening on port ${config.port}\n`);
    });

    installShutdownHandlers(server, pool);
  } catch (error) {
    if (pool) {
      await pool.end().catch(() => undefined);
    }

    throw error;
  }
}

function installShutdownHandlers(server: Server, pool: Pool | null): void {
  const shutdown = (signal: string): void => {
    process.stdout.write(`Received ${signal}; shutting down\n`);
    server.close((error) => {
      if (error) {
        process.stderr.write(`Shutdown failed: ${error.message}\n`);
        process.exitCode = 1;
      }

      if (pool) {
        void pool.end().catch((poolError: unknown) => {
          process.stderr.write(`Closing PostgreSQL pool failed: ${String(poolError)}\n`);
          process.exitCode = 1;
        });
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  start().catch((error: unknown) => {
    process.stderr.write(`Zelora API failed to start: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
