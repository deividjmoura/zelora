import type { IncomingMessage, ServerResponse } from "node:http";
import type { AuthContext, DomainActor } from "./auth/types.js";

export type RequestContext = {
  readonly request: IncomingMessage;
  readonly response: ServerResponse;
  readonly url: URL;
  auth: AuthContext | null;
  actor: DomainActor | null;
};

export type NextFunction = () => Promise<void>;

export type Middleware = (context: RequestContext, next: NextFunction) => Promise<void>;

export type RouteHandler = (context: RequestContext) => Promise<void>;

export type Route = {
  readonly method: string;
  readonly path: string;
  readonly middleware: readonly Middleware[];
  readonly handler: RouteHandler;
};

type HttpErrorOptions = {
  readonly headers?: Record<string, string>;
};

/**
 * An error that is safe to translate into an HTTP response. The code is part of
 * the API contract; the message is only used for diagnostics and is never sent
 * to clients.
 */
export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly headers: Record<string, string> | undefined;

  constructor(statusCode: number, code: string, options: HttpErrorOptions = {}) {
    super(`HTTP ${statusCode}: ${code}`);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.headers = options.headers;
  }
}

export function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
  headers: Record<string, string> = {},
): void {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  response.end(body);
}

export function createRequestContext(
  request: IncomingMessage,
  response: ServerResponse,
): RequestContext {
  let url: URL;

  try {
    url = new URL(request.url ?? "/", "http://localhost");
  } catch {
    throw new HttpError(400, "bad_request");
  }

  return { request, response, url, auth: null, actor: null };
}

/**
 * Runs a middleware chain. The terminal handler is passed as the last link so
 * that every layer uses the same next() contract.
 */
export function runMiddleware(
  middleware: readonly Middleware[],
  context: RequestContext,
): Promise<void> {
  let lastIndex = -1;

  const dispatch = async (index: number): Promise<void> => {
    if (index <= lastIndex) {
      throw new Error("next() called multiple times");
    }

    lastIndex = index;
    const current = middleware[index];

    if (!current) {
      return;
    }

    await current(context, () => dispatch(index + 1));
  };

  return dispatch(0);
}

export function readBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const match = /^Bearer ([^\s]+)$/i.exec(authorizationHeader.trim());
  return match?.[1] ?? null;
}
