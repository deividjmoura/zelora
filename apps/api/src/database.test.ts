import assert from "node:assert/strict";
import test from "node:test";
import { createDatabasePool } from "./database.js";

test("does not construct a database pool without an explicit connection URL", () => {
  assert.throws(
    () => createDatabasePool({}),
    /DATABASE_URL is required before opening a PostgreSQL connection/,
  );
});
