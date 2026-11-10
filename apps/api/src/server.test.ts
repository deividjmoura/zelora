import assert from "node:assert/strict";
import { once } from "node:events";
import { after, test } from "node:test";
import { createApiServer } from "./server.js";

const server = createApiServer();
server.listen(0, "127.0.0.1");
await once(server, "listening");

const address = server.address();
if (!address || typeof address === "string") {
  throw new Error("Test server did not bind to a TCP port");
}

const baseUrl = `http://127.0.0.1:${address.port}`;

after(() => new Promise<void>((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
}));

test("GET /health returns the API health payload", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok", service: "zelora-api" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("unknown routes return a JSON 404", async () => {
  const response = await fetch(`${baseUrl}/not-a-route`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "not_found" });
});
