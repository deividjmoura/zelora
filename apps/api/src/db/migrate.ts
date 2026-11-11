import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Pool } from "pg";

const MIGRATION_FILE_PATTERN = /^(\d{3,})_([a-z0-9]+(?:_[a-z0-9]+)*)\.sql$/;
const DOWN_MIGRATION_SUFFIX = ".down.sql";
const MIGRATION_LOCK_KEY = "724512008";

/**
 * Resolves to apps/api/migrations both from src/db (tsx) and dist/db (compiled),
 * because both are two levels below the package root.
 */
export const MIGRATIONS_DIRECTORY = fileURLToPath(new URL("../../migrations/", import.meta.url));

const CREATE_HISTORY_TABLE_SQL = `CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  name text NOT NULL,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now(),
  execution_ms integer NOT NULL
)`;

const SELECT_HISTORY_SQL = "SELECT version, name, checksum FROM schema_migrations ORDER BY version::bigint";

export interface MigrationClient {
  query(text: string, values?: unknown[]): Promise<{ rows: Array<Record<string, unknown>> }>;
}

export type Migration = {
  readonly version: string;
  readonly name: string;
  readonly sql: string;
  readonly checksum: string;
  readonly downSql: string | null;
};

export type MigrationHistoryRow = {
  readonly version: string;
  readonly name: string;
  readonly checksum: string;
};

export type AppliedMigration = MigrationHistoryRow & {
  readonly executionMs: number;
};

export type MigrationReport = {
  readonly applied: AppliedMigration[];
  readonly alreadyApplied: string[];
};

export type MigrationStatus = {
  readonly applied: MigrationHistoryRow[];
  readonly pending: readonly Migration[];
  readonly missing: MigrationHistoryRow[];
};

type MigrationSourceOptions = {
  readonly directory?: string;
  readonly migrations?: readonly Migration[];
  readonly log?: (message: string) => void;
};

type MigrateDownOptions = MigrationSourceOptions & {
  readonly steps?: number;
};

/**
 * Reads every `<version>_<name>.sql` migration, in numeric order, with an
 * optional `<version>_<name>.down.sql` companion for rollback.
 */
export async function loadMigrations(
  directory: string = MIGRATIONS_DIRECTORY,
): Promise<Migration[]> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`Migrations directory not found: ${directory}`);
    }

    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && MIGRATION_FILE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const migrations: Migration[] = [];

  for (const fileName of files) {
    const match = MIGRATION_FILE_PATTERN.exec(fileName);

    if (!match) {
      continue;
    }

    const [, version, name] = match;

    if (!version || !name) {
      continue;
    }

    const sql = await readFile(join(directory, fileName), "utf8");

    if (!sql.trim()) {
      throw new Error(`Migration ${fileName} is empty`);
    }

    const downSql = await readOptionalFile(
      join(directory, `${version}_${name}${DOWN_MIGRATION_SUFFIX}`),
    );

    if (downSql !== null && !downSql.trim()) {
      throw new Error(`Down migration ${version}_${name} is empty`);
    }

    migrations.push({
      version,
      name,
      sql,
      checksum: checksumOf(sql, downSql),
      downSql,
    });
  }

  migrations.sort((left, right) => compareVersions(left.version, right.version));

  for (let index = 1; index < migrations.length; index += 1) {
    const previousVersion = migrations[index - 1]?.version;
    const currentVersion = migrations[index]?.version;

    if (previousVersion && currentVersion && compareVersions(previousVersion, currentVersion) === 0) {
      throw new Error(`Duplicate numeric migration version ${currentVersion}`);
    }
  }

  return migrations;
}

/**
 * Applies pending migrations inside individual transactions and records each
 * one in schema_migrations. A PostgreSQL advisory lock prevents two API
 * processes (or CLI runs) from migrating concurrently.
 */
export async function migrateUp(
  client: MigrationClient,
  options: MigrationSourceOptions = {},
): Promise<MigrationReport> {
  const migrations = await resolveMigrations(options);

  await client.query("SELECT pg_advisory_lock($1::bigint)", [MIGRATION_LOCK_KEY]);

  try {
    await client.query(CREATE_HISTORY_TABLE_SQL);

    const history = await readHistory(client);
    assertHistoryMatchesFiles(history, migrations);
    const appliedVersions = new Set(history.map((row) => row.version));
    const pending = migrations.filter((migration) => !appliedVersions.has(migration.version));

    if (pending.length === 0) {
      return { applied: [], alreadyApplied: history.map((row) => row.version) };
    }

    const applied: AppliedMigration[] = [];

    for (const migration of pending) {
      options.log?.(`Applying migration ${migration.version}_${migration.name}`);

      const executionMs = await applyMigration(client, migration);

      applied.push({
        version: migration.version,
        name: migration.name,
        checksum: migration.checksum,
        executionMs,
      });
    }

    return { applied, alreadyApplied: history.map((row) => row.version) };
  } finally {
    await releaseMigrationLock(client);
  }
}

/** Rolls back the most recently applied migrations that have a down file. */
export async function migrateDown(
  client: MigrationClient,
  options: MigrateDownOptions = {},
): Promise<AppliedMigration[]> {
  const steps = options.steps ?? 1;

  if (!Number.isInteger(steps) || steps < 1) {
    throw new Error("steps must be a positive integer");
  }

  const migrations = await resolveMigrations(options);
  const byVersion = new Map(migrations.map((migration) => [migration.version, migration]));

  await client.query("SELECT pg_advisory_lock($1::bigint)", [MIGRATION_LOCK_KEY]);

  try {
    await client.query(CREATE_HISTORY_TABLE_SQL);

    const history = await readHistory(client);
    const targets = [...history]
      .sort((left, right) => compareVersions(right.version, left.version))
      .slice(0, steps)
      .map((record) => {
        const migration = byVersion.get(record.version);

        if (!migration) {
          throw new Error(
            `Applied migration ${record.version} (${record.name}) is missing from the migrations directory`,
          );
        }

        assertMigrationUnchanged(record, migration);

        if (!migration.downSql) {
          throw new Error(
            `Migration ${migration.version}_${migration.name} has no down migration; rollback is not supported`,
          );
        }

        return { record, migration };
      });
    const rolledBack: AppliedMigration[] = [];

    for (const { migration } of targets) {
      options.log?.(`Rolling back migration ${migration.version}_${migration.name}`);

      const executionMs = await rollbackMigration(client, migration);

      rolledBack.push({
        version: migration.version,
        name: migration.name,
        checksum: migration.checksum,
        executionMs,
      });
    }

    return rolledBack;
  } finally {
    await releaseMigrationLock(client);
  }
}

/** Reports applied, pending and locally missing migrations without mutating. */
export async function getMigrationStatus(
  client: MigrationClient,
  options: MigrationSourceOptions = {},
): Promise<MigrationStatus> {
  const migrations = await resolveMigrations(options);
  const history = await readHistoryIfPresent(client);
  const migrationsByVersion = new Map(migrations.map((migration) => [migration.version, migration]));
  const appliedVersions = new Set(history.map((row) => row.version));
  const localVersions = new Set(migrations.map((migration) => migration.version));

  for (const record of history) {
    const migration = migrationsByVersion.get(record.version);

    if (migration) {
      assertMigrationUnchanged(record, migration);
    }
  }

  return {
    applied: history,
    pending: migrations.filter((migration) => !appliedVersions.has(migration.version)),
    missing: history.filter((record) => !localVersions.has(record.version)),
  };
}

/** Convenience wrapper that borrows a single pool client for the whole run. */
export async function runMigrations(
  pool: Pool,
  options: MigrationSourceOptions = {},
): Promise<MigrationReport> {
  const client = await pool.connect();

  try {
    return await migrateUp(client, options);
  } finally {
    client.release();
  }
}

/** Convenience wrapper that borrows a single pool client for the whole run. */
export async function rollbackMigrations(
  pool: Pool,
  options: MigrateDownOptions = {},
): Promise<AppliedMigration[]> {
  const client = await pool.connect();

  try {
    return await migrateDown(client, options);
  } finally {
    client.release();
  }
}

async function applyMigration(
  client: MigrationClient,
  migration: Migration,
): Promise<number> {
  const startedAt = performance.now();

  await client.query("BEGIN");

  try {
    await client.query(migration.sql);

    const executionMs = Math.max(0, Math.round(performance.now() - startedAt));

    await client.query(
      "INSERT INTO schema_migrations (version, name, checksum, execution_ms) VALUES ($1, $2, $3, $4)",
      [migration.version, migration.name, migration.checksum, executionMs],
    );
    await client.query("COMMIT");

    return executionMs;
  } catch (error) {
    await rollbackQuietly(client);
    throw new Error(`Migration ${migration.version}_${migration.name} failed`, { cause: error });
  }
}

async function rollbackMigration(
  client: MigrationClient,
  migration: Migration,
): Promise<number> {
  const startedAt = performance.now();

  await client.query("BEGIN");

  try {
    await client.query(migration.downSql ?? "");
    await client.query("DELETE FROM schema_migrations WHERE version = $1", [migration.version]);
    await client.query("COMMIT");

    return Math.max(0, Math.round(performance.now() - startedAt));
  } catch (error) {
    await rollbackQuietly(client);
    throw new Error(`Rollback of migration ${migration.version}_${migration.name} failed`, {
      cause: error,
    });
  }
}

async function rollbackQuietly(client: MigrationClient): Promise<void> {
  try {
    await client.query("ROLLBACK");
  } catch {
    // The connection may already be broken; the original error is more useful.
  }
}

async function releaseMigrationLock(client: MigrationClient): Promise<void> {
  try {
    await client.query("SELECT pg_advisory_unlock($1::bigint)", [MIGRATION_LOCK_KEY]);
  } catch {
    // A broken connection releases its session lock when it is discarded.
  }
}

async function readHistory(client: MigrationClient): Promise<MigrationHistoryRow[]> {
  const result = await client.query(SELECT_HISTORY_SQL);
  return result.rows.map(toHistoryRow);
}

async function readHistoryIfPresent(client: MigrationClient): Promise<MigrationHistoryRow[]> {
  const result = await client.query("SELECT to_regclass('schema_migrations') AS name");

  if (!result.rows[0]?.name) {
    return [];
  }

  return readHistory(client);
}

function toHistoryRow(row: Record<string, unknown>): MigrationHistoryRow {
  const { version, name, checksum } = row;

  if (typeof version !== "string" || typeof name !== "string" || typeof checksum !== "string") {
    throw new Error("schema_migrations contains an invalid row");
  }

  return { version, name, checksum };
}

function assertHistoryMatchesFiles(
  history: readonly MigrationHistoryRow[],
  migrations: readonly Migration[],
): void {
  const byVersion = new Map(migrations.map((migration) => [migration.version, migration]));

  for (const record of history) {
    const migration = byVersion.get(record.version);

    if (!migration) {
      throw new Error(
        `Applied migration ${record.version} (${record.name}) is missing from the migrations directory`,
      );
    }

    assertMigrationUnchanged(record, migration);
  }
}

function assertMigrationUnchanged(record: MigrationHistoryRow, migration: Migration): void {
  if (record.name !== migration.name) {
    throw new Error(
      `Migration ${record.version} was renamed after being applied; create a new migration instead`,
    );
  }

  if (record.checksum !== migration.checksum) {
    throw new Error(
      `Migration ${record.version}_${record.name} was modified after being applied; create a new migration instead`,
    );
  }
}

async function resolveMigrations(options: MigrationSourceOptions): Promise<readonly Migration[]> {
  return options.migrations ?? (await loadMigrations(options.directory));
}

function checksumOf(sql: string, downSql: string | null): string {
  return createHash("sha256")
    .update("up\\0", "utf8")
    .update(sql, "utf8")
    .update("\\0down\\0", "utf8")
    .update(downSql ?? "<no-down-migration>", "utf8")
    .digest("hex");
}

function compareVersions(left: string, right: string): number {
  const leftVersion = BigInt(left);
  const rightVersion = BigInt(right);

  if (leftVersion < rightVersion) return -1;
  if (leftVersion > rightVersion) return 1;
  return 0;
}

async function readOptionalFile(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
}

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}
