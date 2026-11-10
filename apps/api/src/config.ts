import type { FirebaseAdminConfig } from "./auth/firebase.js";

export type AppConfig = {
  readonly port: number;
  readonly databaseUrl: string | null;
  readonly autoMigrate: boolean;
  readonly firebase: FirebaseAdminConfig | null;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const rawPort = env.PORT ?? "3000";

  if (!/^\d+$/.test(rawPort)) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const port = Number.parseInt(rawPort, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const databaseUrl = nonEmpty(env.DATABASE_URL);
  const autoMigrate = env.AUTO_MIGRATE === "true";

  if (autoMigrate && !databaseUrl) {
    throw new Error("AUTO_MIGRATE=true requires DATABASE_URL");
  }

  return {
    port,
    databaseUrl,
    autoMigrate,
    firebase: loadFirebaseConfig(env),
  };
}

function loadFirebaseConfig(env: NodeJS.ProcessEnv): FirebaseAdminConfig | null {
  const projectId = nonEmpty(env.FIREBASE_PROJECT_ID);
  const emulatorHost = nonEmpty(env.FIREBASE_AUTH_EMULATOR_HOST);

  if (emulatorHost) {
    if (!projectId) {
      throw new Error("FIREBASE_AUTH_EMULATOR_HOST requires FIREBASE_PROJECT_ID");
    }

    return { mode: "emulator", projectId };
  }

  const clientEmail = nonEmpty(env.FIREBASE_CLIENT_EMAIL);
  const privateKey = nonEmpty(env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, "\n");

  if (!projectId && !clientEmail && !privateKey) {
    return null;
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY",
    );
  }

  return { mode: "service-account", projectId, clientEmail, privateKey };
}

function nonEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
