import assert from "node:assert/strict";
import test from "node:test";
import { loadApiConfig } from "./config.js";

test("loads safe defaults without configuring external services", () => {
  assert.deepEqual(loadApiConfig({}), {
    port: 3000,
    databaseUrl: undefined,
    databasePoolMax: 10,
  });
});

test("accepts a PostgreSQL URL and bounded pool size", () => {
  const config = loadApiConfig({
    PORT: "4000",
    DATABASE_URL: "postgresql://zelora:local-only@localhost:5432/zelora",
    PG_POOL_MAX: "5",
  });

  assert.equal(config.port, 4000);
  assert.equal(config.databaseUrl, "postgresql://zelora:local-only@localhost:5432/zelora");
  assert.equal(config.databasePoolMax, 5);
});

test("rejects invalid ports, pool sizes and non-PostgreSQL URLs", () => {
  assert.throws(() => loadApiConfig({ PORT: "0" }), /PORT must be an integer/);
  assert.throws(() => loadApiConfig({ PG_POOL_MAX: "100" }), /PG_POOL_MAX must be an integer/);
  assert.throws(() => loadApiConfig({ DATABASE_URL: "https://example.com" }), /postgres protocol/);
});
