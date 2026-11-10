import { Pool } from "pg";
import { loadApiConfig } from "./config.js";

export function createDatabasePool(env: NodeJS.ProcessEnv = process.env): Pool {
  const config = loadApiConfig(env);
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required before opening a PostgreSQL connection");
  }

  return new Pool({
    connectionString: config.databaseUrl,
    max: config.databasePoolMax,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    application_name: "zelora-api",
  });
}
