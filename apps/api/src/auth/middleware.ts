import { HttpError, readBearerToken, type Middleware, type RequestContext } from "../http.js";
import type { Role, TokenVerifier, UserRepository } from "./types.js";

type AuthenticationOptions = {
  readonly verifier: TokenVerifier | null;
  readonly users: UserRepository | null;
};

/**
 * Validates a Firebase ID token, loads the matching domain user and attaches
 * both to the request context. Every private route must run this middleware
 * before authorization middleware.
 */
export function authenticate(options: AuthenticationOptions): Middleware {
  return async (context, next) => {
    if (!options.verifier) {
      throw new HttpError(503, "auth_not_configured");
    }

    const token = readBearerToken(context.request.headers.authorization);

    if (!token) {
      throw new HttpError(401, "unauthorized", {
        headers: { "WWW-Authenticate": 'Bearer realm="zelora-api"' },
      });
    }

    let auth;

    try {
      auth = await options.verifier.verifyIdToken(token);
    } catch {
      // Never expose verifier details (token contents, Firebase errors).
      throw new HttpError(401, "invalid_token", {
        headers: { "WWW-Authenticate": 'Bearer realm="zelora-api", error="invalid_token"' },
      });
    }

    if (!options.users) {
      throw new HttpError(503, "database_not_configured");
    }

    const actor = await options.users.findByFirebaseUid(auth.firebaseUid);

    if (!actor) {
      throw new HttpError(403, "user_not_provisioned");
    }

    if (actor.status !== "active") {
      throw new HttpError(403, "account_inactive");
    }

    context.auth = auth;
    context.actor = actor;

    await next();
  };
}

/** Requires the authenticated actor to hold at least one of the given roles. */
export function requireRole(...requiredRoles: readonly Role[]): Middleware {
  if (requiredRoles.length === 0) {
    throw new Error("requireRole needs at least one role");
  }

  return async (context, next) => {
    const actor = context.actor;

    if (!actor) {
      throw new HttpError(401, "unauthorized");
    }

    if (!requiredRoles.some((role) => actor.roles.includes(role))) {
      throw new HttpError(403, "forbidden");
    }

    await next();
  };
}

export function requireActor(context: RequestContext): NonNullable<RequestContext["actor"]> {
  if (!context.actor) {
    throw new Error("requireActor used outside the authenticate middleware");
  }

  return context.actor;
}
