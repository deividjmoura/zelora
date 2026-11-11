import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import {
  getMigrationStatus,
  loadMigrations,
  migrateDown,
  migrateUp,
  type MigrationClient,
  type MigrationHistoryRow,
} from "./migrate.js";

class FakeMigrationClient implements MigrationClient {
  readonly history: MigrationHistoryRow[] = [];
  readonly executed: string[] = [];
  readonly transactions: string[] = [];
  failSql: string | null = null;
  #historyTableExists = false;

  async query(text: string, values: unknown[] = []): Promise<{ rows: Array<Record<string, unknown>> }> {
    const sql = text.trim();

    if (sql === "SELECT pg_advisory_lock($1::bigint)" || sql === "SELECT pg_advisory_unlock($1::bigint)") {
      return { rows: [] };
    }

    if (sql.startsWith("CREATE TABLE IF NOT EXISTS schema_migrations")) {
      this.#historyTableExists = true;
      return { rows: [] };
    }

    if (sql === "SELECT version, name, checksum FROM schema_migrations ORDER BY version::bigint") {
      return { rows: this.history.map((row) => ({ ...row })) };
    }

    if (sql === "SELECT to_regclass('schema_migrations') AS name") {
      return { rows: [{ name: this.#historyTableExists ? "schema_migrations" : null }] };
    }

    if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") {
      this.transactions.push(sql);
      return { rows: [] };
    }

    if (sql.startsWith("INSERT INTO schema_migrations")) {
      this.history.push({
        version: String(values[0]),
        name: String(values[1]),
        checksum: String(values[2]),
      });
      return { rows: [] };
    }

    if (sql.startsWith("DELETE FROM schema_migrations WHERE version = $1")) {
      const index = this.history.findIndex((row) => row.version === values[0]);
      if (index >= 0) {
        this.history.splice(index, 1);
      }
      return { rows: [] };
    }

    this.executed.push(sql);

    if (this.failSql === sql) {
      throw new Error("simulated SQL failure");
    }

    return { rows: [] };
  }
}

async function createMigrationDirectory(
  t: TestContext,
  files: Record<string, string>,
): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "zelora-migrations-"));

  t.after(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  for (const [name, content] of Object.entries(files)) {
    await writeFile(join(directory, name), content, "utf8");
  }

  return directory;
}

const INITIAL_FILES = {
  "0002_add_widgets.sql": "ALTER TABLE users ADD COLUMN widgets integer;",
  "0002_add_widgets.down.sql": "ALTER TABLE users DROP COLUMN widgets;",
  "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
  "0001_create_users.down.sql": "DROP TABLE users;",
  "notes.md": "not a migration",
};

test("loadMigrations reads up and down files in numeric order", async (t) => {
  const directory = await createMigrationDirectory(t, INITIAL_FILES);
  const migrations = await loadMigrations(directory);

  assert.deepEqual(
    migrations.map((migration) => `${migration.version}_${migration.name}`),
    ["0001_create_users", "0002_add_widgets"],
  );
  assert.equal(migrations[0]?.downSql, "DROP TABLE users;");
  assert.equal(migrations[0]?.checksum.length, 64);
  assert.equal(migrations[1]?.downSql, "ALTER TABLE users DROP COLUMN widgets;");
});

test("the repository ships the identity migration with a rollback file", async () => {
  const migrations = await loadMigrations();

  assert.ok(migrations.length >= 1);
  assert.equal(migrations[0]?.version, "0001");
  assert.equal(migrations[0]?.name, "identity_and_profiles");
  assert.ok(migrations[0]?.downSql);
});

test("migrateUp applies pending migrations once and records history", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, INITIAL_FILES);

  const firstRun = await migrateUp(client, { directory });

  assert.deepEqual(
    firstRun.applied.map((migration) => migration.version),
    ["0001", "0002"],
  );
  assert.deepEqual(client.executed, [
    "CREATE TABLE users (id integer PRIMARY KEY);",
    "ALTER TABLE users ADD COLUMN widgets integer;",
  ]);
  assert.deepEqual(
    client.history.map((row) => row.version),
    ["0001", "0002"],
  );

  const secondRun = await migrateUp(client, { directory });

  assert.equal(secondRun.applied.length, 0);
  assert.deepEqual(secondRun.alreadyApplied, ["0001", "0002"]);
  assert.equal(client.executed.length, 2);
});

test("loadMigrations rejects numerically duplicate versions with different padding", async (t) => {
  const directory = await createMigrationDirectory(t, {
    "001_first.sql": "SELECT 1;",
    "0001_second.sql": "SELECT 2;",
  });

  await assert.rejects(loadMigrations(directory), /Duplicate numeric migration version 1/);
});

test("loadMigrations rejects an empty rollback file", async (t) => {
  const directory = await createMigrationDirectory(t, {
    "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
    "0001_create_users.down.sql": "   ",
  });

  await assert.rejects(loadMigrations(directory), /Down migration 0001_create_users is empty/);
});

test("migrateUp refuses to run when an applied migration changed on disk", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, INITIAL_FILES);

  await migrateUp(client, { directory });
  await writeFile(
    join(directory, "0001_create_users.sql"),
    "CREATE TABLE users (id bigint PRIMARY KEY);",
    "utf8",
  );

  await assert.rejects(migrateUp(client, { directory }), /was modified after being applied/);
});

test("migration status detects an applied migration changed on disk", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, INITIAL_FILES);

  await migrateUp(client, { directory });
  await writeFile(
    join(directory, "0001_create_users.sql"),
    "CREATE TABLE users (id bigint PRIMARY KEY);",
    "utf8",
  );

  await assert.rejects(
    getMigrationStatus(client, { directory }),
    /was modified after being applied/,
  );
});

test("migration checksum also protects the rollback file", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, {
    "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
    "0001_create_users.down.sql": "DROP TABLE users;",
  });

  await migrateUp(client, { directory });
  await writeFile(
    join(directory, "0001_create_users.down.sql"),
    "DROP TABLE IF EXISTS users;",
    "utf8",
  );

  await assert.rejects(
    getMigrationStatus(client, { directory }),
    /was modified after being applied/,
  );
});

test("migration status detects a migration renamed after being applied", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, {
    "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
  });

  await migrateUp(client, { directory });
  await rm(join(directory, "0001_create_users.sql"));
  await writeFile(join(directory, "0001_initialize_users.sql"), "CREATE TABLE users (id integer PRIMARY KEY);", "utf8");

  await assert.rejects(
    getMigrationStatus(client, { directory }),
    /Migration 0001 was renamed after being applied/,
  );
});

test("a failed migration rolls back and is not recorded", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, {
    "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
    "0002_broken.sql": "FAIL",
  });

  client.failSql = "FAIL";

  await assert.rejects(migrateUp(client, { directory }), /Migration 0002_broken failed/);
  assert.deepEqual(client.history.map((row) => row.version), ["0001"]);
  assert.equal(client.transactions.at(-1), "ROLLBACK");
});

test("migrateDown rolls back the latest migrations with their down files", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, INITIAL_FILES);

  await migrateUp(client, { directory });
  const rolledBack = await migrateDown(client, { directory, steps: 2 });

  assert.deepEqual(
    rolledBack.map((migration) => migration.version),
    ["0002", "0001"],
  );
  assert.deepEqual(client.executed.slice(2), [
    "ALTER TABLE users DROP COLUMN widgets;",
    "DROP TABLE users;",
  ]);
  assert.deepEqual(client.history, []);
});

test("migrateDown validates every target before rolling any migration back", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, {
    "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
    "0002_add_widgets.sql": "ALTER TABLE users ADD COLUMN widgets integer;",
    "0002_add_widgets.down.sql": "ALTER TABLE users DROP COLUMN widgets;",
  });

  await migrateUp(client, { directory });
  const executedBeforeRollback = client.executed.length;

  await assert.rejects(
    migrateDown(client, { directory, steps: 2 }),
    /has no down migration/,
  );

  assert.equal(client.executed.length, executedBeforeRollback);
  assert.deepEqual(client.history.map((row) => row.version), ["0001", "0002"]);
});

test("migrateDown refuses migrations without a down file", async (t) => {
  const client = new FakeMigrationClient();
  const directory = await createMigrationDirectory(t, {
    "0001_create_users.sql": "CREATE TABLE users (id integer PRIMARY KEY);",
  });

  await migrateUp(client, { directory });

  await assert.rejects(
    migrateDown(client, { directory }),
    /has no down migration/,
  );
});
