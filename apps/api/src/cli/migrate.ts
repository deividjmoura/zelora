import { createPool } from "../db/pool.js";
import {
  getMigrationStatus,
  rollbackMigrations,
  runMigrations,
  type MigrationStatus,
} from "../db/migrate.js";

const USAGE = `Usage: npm run db:<command> --workspace @zelora/api -- [options]

Commands:
  up                    Apply all pending migrations (default)
  down                  Roll back the latest migration
  status                Show applied, pending and missing migrations

Options:
  --steps=<n>           Number of migrations to roll back (down only)

Environment:
  DATABASE_URL          PostgreSQL connection string (required)`;

async function main(): Promise<void> {
  const command = process.argv[2] ?? "up";

  if (command === "--help" || command === "help") {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run database migrations");
  }

  const pool = createPool(databaseUrl);

  try {
    switch (command) {
      case "up": {
        const report = await runMigrations(pool, {
          log: (message) => process.stdout.write(`${message}\n`),
        });

        process.stdout.write(
          report.applied.length === 0
            ? "Database is up to date; no migrations applied.\n"
            : `${report.applied.length} migration(s) applied.\n`,
        );
        break;
      }

      case "down": {
        const steps = parseSteps(process.argv);
        const rolledBack = await rollbackMigrations(pool, {
          steps,
          log: (message) => process.stdout.write(`${message}\n`),
        });

        process.stdout.write(
          rolledBack.length === 0
            ? "No applied migrations to roll back.\n"
            : `${rolledBack.length} migration(s) rolled back.\n`,
        );
        break;
      }

      case "status": {
        const status = await getMigrationStatus(pool);
        printStatus(status);
        break;
      }

      default:
        process.stderr.write(`Unknown command: ${command}\n\n${USAGE}\n`);
        process.exitCode = 1;
    }
  } finally {
    await pool.end();
  }
}

function parseSteps(argv: readonly string[]): number {
  const raw = argv.find((argument) => argument.startsWith("--steps="))?.slice("--steps=".length) ?? "1";
  const steps = Number.parseInt(raw, 10);

  if (!/^\d+$/.test(raw) || !Number.isInteger(steps) || steps < 1) {
    throw new Error("--steps must be a positive integer");
  }

  return steps;
}

function printStatus(status: MigrationStatus): void {
  process.stdout.write(`Applied migrations: ${status.applied.length}\n`);

  for (const migration of status.applied) {
    process.stdout.write(`  applied  ${migration.version}_${migration.name}\n`);
  }

  for (const migration of status.pending) {
    process.stdout.write(`  pending  ${migration.version}_${migration.name}\n`);
  }

  for (const migration of status.missing) {
    process.stdout.write(`  missing  ${migration.version}_${migration.name} (applied but absent locally)\n`);
  }

  if (status.pending.length === 0 && status.missing.length === 0) {
    process.stdout.write("Database schema is up to date.\n");
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Migration command failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
