import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "./config.js";

test("loads safe defaults without provisioning external services", () => {
  assert.deepEqual(loadConfig({}), {
    port: 3000,
    databaseUrl: null,
    autoMigrate: false,
    firebase: null,
  });
});

test("accepts a PostgreSQL URL and explicit auto-migration setting", () => {
  const config = loadConfig({
    PORT: "4000",
    DATABASE_URL: "postgresql://user:password@localhost:5432/zelora",
    AUTO_MIGRATE: "true",
  });

  assert.equal(config.port, 4000);
  assert.equal(config.databaseUrl, "postgresql://user:password@localhost:5432/zelora");
  assert.equal(config.autoMigrate, true);
});

test("rejects invalid ports and non-integer values", () => {
  assert.throws(() => loadConfig({ PORT: "0" }), /PORT must be an integer/);
  assert.throws(() => loadConfig({ PORT: "3.5" }), /PORT must be an integer/);
  assert.throws(() => loadConfig({ PORT: "65536" }), /PORT must be an integer/);
});

test("rejects malformed and non-PostgreSQL connection URLs", () => {
  assert.throws(() => loadConfig({ DATABASE_URL: "not-a-url" }), /valid PostgreSQL connection URL/);
  assert.throws(() => loadConfig({ DATABASE_URL: "https://example.test/db" }), /postgres or postgresql protocol/);
});

test("requires a database URL when automatic migrations are enabled", () => {
  assert.throws(() => loadConfig({ AUTO_MIGRATE: "true" }), /requires DATABASE_URL/);
  assert.throws(() => loadConfig({ AUTO_MIGRATE: "sometimes" }), /AUTO_MIGRATE must be true or false/);
});

test("accepts an unconfigured Firebase integration without inventing credentials", () => {
  assert.equal(loadConfig({}).firebase, null);
});

test("rejects partial Firebase service-account configuration", () => {
  assert.throws(
    () => loadConfig({ FIREBASE_PROJECT_ID: "zelora-dev" }),
    /FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY/,
  );
});

test("normalizes escaped newlines in a complete Firebase private key", () => {
  const config = loadConfig({
    FIREBASE_PROJECT_ID: "zelora-dev",
    FIREBASE_CLIENT_EMAIL: "firebase-admin@example.test",
    FIREBASE_PRIVATE_KEY: "first-line\\nsecond-line",
  });

  assert.deepEqual(config.firebase, {
    mode: "service-account",
    projectId: "zelora-dev",
    clientEmail: "firebase-admin@example.test",
    privateKey: "first-line\nsecond-line",
  });
});

test("requires a Firebase project ID when using the Auth emulator", () => {
  assert.throws(
    () => loadConfig({ FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099" }),
    /requires FIREBASE_PROJECT_ID/,
  );

  assert.deepEqual(
    loadConfig({
      FIREBASE_PROJECT_ID: "demo-zelora",
      FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
    }).firebase,
    { mode: "emulator", projectId: "demo-zelora" },
  );
});
