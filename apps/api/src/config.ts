export interface ApiConfig {
  port: number;
  databaseUrl?: string;
  databasePoolMax: number;
}

function parseInteger(
  value: string | undefined,
  fallback: number,
  name: string,
  min: number,
  max: number,
): number {
  if (value === undefined || value.trim() === "") return fallback;
  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

export function loadApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const databaseUrl = env.DATABASE_URL?.trim() || undefined;

  if (databaseUrl) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(databaseUrl);
    } catch {
      throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
    }

    if (parsedUrl.protocol !== "postgres:" && parsedUrl.protocol !== "postgresql:") {
      throw new Error("DATABASE_URL must use the postgres or postgresql protocol");
    }
  }

  return {
    port: parseInteger(env.PORT, 3000, "PORT", 1, 65_535),
    databaseUrl,
    databasePoolMax: parseInteger(env.PG_POOL_MAX, 10, "PG_POOL_MAX", 1, 50),
  };
}
