import { createServer, type Server } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadApiConfig } from "./config.js";

const serviceName = "zelora-api";

export function createApiServer(): Server {
  return createServer((request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "no-store");

    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ status: "ok", service: serviceName }));
      return;
    }

    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "not_found" }));
  });
}

function start(): void {
  const { port } = loadApiConfig();
  const server = createApiServer();

  server.listen(port, "0.0.0.0", () => {
    process.stdout.write(`Zelora API listening on port ${port}\n`);
  });

  const shutdown = (signal: string): void => {
    process.stdout.write(`Received ${signal}; shutting down\n`);
    server.close((error) => {
      if (error) {
        process.stderr.write(`Shutdown failed: ${error.message}\n`);
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  start();
}
