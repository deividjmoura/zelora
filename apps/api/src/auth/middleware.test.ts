import assert from "node:assert/strict";
import { once } from "node:events";
import type { Server } from "node:http";
import { after, before, test } from "node:test";
import { createApiServer } from "../server.js";
import type {
  AuthContext,
  DomainActor,
  TokenVerifier,
  UserRepository,
} from "./types.js";

const identities = new Map<string, AuthContext>([
  [
    "contractor-token",
    { firebaseUid: "firebase-contractor", email: "ana@example.com", emailVerified: true },
  ],
  [
    "admin-token",
    { firebaseUid: "firebase-admin", email: "admin@example.com", emailVerified: true },
  ],
  [
    "suspended-token",
    { firebaseUid: "firebase-suspended", email: "suspended@example.com", emailVerified: false },
  ],
  [
    "unprovisioned-token",
    { firebaseUid: "firebase-unknown", email: "unknown@example.com", emailVerified: true },
  ],
]);

const verifier: TokenVerifier = {
  async verifyIdToken(idToken) {
    const identity = identities.get(idToken);

    if (!identity) {
      throw new Error("invalid token");
    }

    return identity;
  },
};

const actors = new Map<string, DomainActor>([
  [
    "firebase-contractor",
    {
      id: "11111111-1111-4111-8111-111111111111",
      firebaseUid: "firebase-contractor",
      email: "ana@example.com",
      status: "active",
      roles: ["contractor"],
    },
  ],
  [
    "firebase-admin",
    {
      id: "22222222-2222-4222-8222-222222222222",
      firebaseUid: "firebase-admin",
      email: "admin@example.com",
      status: "active",
      roles: ["admin"],
    },
  ],
  [
    "firebase-suspended",
    {
      id: "33333333-3333-4333-8333-333333333333",
      firebaseUid: "firebase-suspended",
      email: "suspended@example.com",
      status: "suspended",
      roles: ["contractor"],
    },
  ],
]);

const users: UserRepository = {
  async findByFirebaseUid(firebaseUid) {
    return actors.get(firebaseUid) ?? null;
  },
};

let baseUrl: string;
let configuredServer: Server;
let unconfiguredServer: Server;
let unconfiguredBaseUrl: string;

before(async () => {
  configuredServer = createApiServer({ tokenVerifier: verifier, userRepository: users });
  configuredServer.listen(0, "127.0.0.1");
  await once(configuredServer, "listening");
  baseUrl = originOf(configuredServer);

  unconfiguredServer = createApiServer();
  unconfiguredServer.listen(0, "127.0.0.1");
  await once(unconfiguredServer, "listening");
  unconfiguredBaseUrl = originOf(unconfiguredServer);
});

after(async () => {
  await Promise.all([closeServer(configuredServer), closeServer(unconfiguredServer)]);
});

test("private routes reject requests without a bearer token", async () => {
  const response = await fetch(`${baseUrl}/me`);

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "unauthorized" });
  assert.match(response.headers.get("www-authenticate") ?? "", /^Bearer/);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("private routes reject invalid tokens without exposing verifier details", async () => {
  const response = await fetch(`${baseUrl}/me`, {
    headers: { Authorization: "Bearer not-a-real-token" },
  });

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "invalid_token" });
});

test("authenticated identities without a domain user are forbidden", async () => {
  const response = await fetch(`${baseUrl}/me`, {
    headers: { Authorization: "Bearer unprovisioned-token" },
  });

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: "user_not_provisioned" });
});

test("suspended accounts are forbidden", async () => {
  const response = await fetch(`${baseUrl}/me`, {
    headers: { Authorization: "Bearer suspended-token" },
  });

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: "account_inactive" });
});

test("GET /me returns the domain actor and its roles", async () => {
  const response = await fetch(`${baseUrl}/me`, {
    headers: { Authorization: "Bearer contractor-token" },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: "11111111-1111-4111-8111-111111111111",
    email: "ana@example.com",
    emailVerified: true,
    status: "active",
    roles: ["contractor"],
  });
});

test("role-protected routes reject actors without the required role", async () => {
  const response = await fetch(`${baseUrl}/admin/diagnostics`, {
    headers: { Authorization: "Bearer contractor-token" },
  });

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: "forbidden" });
});

test("role-protected routes allow actors with the required role", async () => {
  const response = await fetch(`${baseUrl}/admin/diagnostics`, {
    headers: { Authorization: "Bearer admin-token" },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    service: "zelora-api",
    scope: "admin",
  });
});

test("known paths with an unsupported method return 405 and an Allow header", async () => {
  const response = await fetch(`${baseUrl}/me`, { method: "POST" });

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET");
  assert.deepEqual(await response.json(), { error: "method_not_allowed" });
});

test("authentication fails closed when Firebase is not configured", async () => {
  const response = await fetch(`${unconfiguredBaseUrl}/me`, {
    headers: { Authorization: "Bearer contractor-token" },
  });

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "auth_not_configured" });
});

function originOf(server: Server): string {
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Test server did not bind to a TCP port");
  }

  return `http://127.0.0.1:${address.port}`;
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
