import { Pool } from "pg";

/** Creates the API connection pool. DATABASE_URL is the only required setting. */
export function createPool(databaseUrl: string): Pool {
  const pool = new Pool({
    connectionString: databaseUrl,
    application_name: "zelora-api",
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on("error", (error) => {
    // An idle client can fail without an active request; surfacing the message
    // keeps the process alive without logging connection strings or rows.
    process.stderr.write(`PostgreSQL pool error: ${error.message}\n`);
  });

  return pool;
}
