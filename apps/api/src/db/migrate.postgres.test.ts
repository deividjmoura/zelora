import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { Client } from "pg";
import {
  getMigrationStatus,
  loadMigrations,
  migrateDown,
  migrateUp,
} from "./migrate.js";

const connectionString = process.env.TEST_DATABASE_URL;
const skip = connectionString
  ? false
  : "Set TEST_DATABASE_URL to run the PostgreSQL migration integration test";

test("migrations apply, track history and roll back on PostgreSQL", { skip }, async (t) => {
  if (!connectionString) {
    return;
  }

  const schema = `zelora_test_${randomUUID().replaceAll("-", "")}`;
  const client = new Client({ connectionString });

  await client.connect();

  t.after(async () => {
    try {
      await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    } finally {
      await client.end();
    }
  });

  await client.query(`CREATE SCHEMA ${schema}`);
  await client.query(`SET search_path TO ${schema}`);

  const migrations = await loadMigrations();

  const firstRun = await migrateUp(client, { migrations });

  assert.equal(firstRun.applied.length, migrations.length);
  assert.equal(firstRun.alreadyApplied.length, 0);
  assert.ok(await relationExists(client, "users"));
  assert.ok(await relationExists(client, "schema_migrations"));
  assert.ok(await relationExists(client, "professional_profiles"));

  const history = await client.query<{ version: string; name: string; checksum: string }>(
    "SELECT version, name, checksum FROM schema_migrations ORDER BY version",
  );
  assert.deepEqual(
    history.rows.map((row) => row.version),
    migrations.map((migration) => migration.version),
  );

  const secondRun = await migrateUp(client, { migrations });
  assert.equal(secondRun.applied.length, 0);

  const status = await getMigrationStatus(client, { migrations });
  assert.equal(status.pending.length, 0);
  assert.equal(status.missing.length, 0);

  const rolledBack = await migrateDown(client, { migrations, steps: migrations.length });

  assert.equal(rolledBack.length, migrations.length);
  assert.equal(await relationExists(client, "users"), false);
  assert.equal(await relationExists(client, "professional_profiles"), false);

  const afterRollback = await getMigrationStatus(client, { migrations });
  assert.equal(afterRollback.applied.length, 0);
  assert.equal(afterRollback.pending.length, migrations.length);
});

async function relationExists(client: Client, name: string): Promise<boolean> {
  const result = await client.query<{ name: string | null }>(
    "SELECT to_regclass($1) AS name",
    [name],
  );

  return result.rows[0]?.name !== null && result.rows[0]?.name !== undefined;
}
