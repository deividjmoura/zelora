import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { Client, Pool } from "pg";
import { PostgresUserRepository } from "../auth/postgres-users.js";
import { loadMigrations, migrateUp } from "./migrate.js";

const connectionString = process.env.TEST_DATABASE_URL;
const skip = connectionString
  ? false
  : "Set TEST_DATABASE_URL to run the PostgreSQL authorization integration test";

test("PostgresUserRepository loads roles and status from PostgreSQL", { skip }, async (t) => {
  if (!connectionString) {
    return;
  }

  const schema = `zelora_repo_test_${randomUUID().replaceAll("-", "")}`;
  const client = new Client({ connectionString });
  const pool = new Pool({
    connectionString,
    options: `-c search_path=${schema}`,
    max: 2,
  });

  await client.connect();

  t.after(async () => {
    await pool.end().catch(() => undefined);

    try {
      await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
    } finally {
      await client.end();
    }
  });

  await client.query(`CREATE SCHEMA ${schema}`);
  await client.query(`SET search_path TO ${schema}`);
  await migrateUp(client, { migrations: await loadMigrations() });

  const dualRoleId = "11111111-1111-4111-8111-111111111111";
  const suspendedId = "22222222-2222-4222-8222-222222222222";

  await client.query(
    `INSERT INTO users (id, firebase_uid, email, status)
     VALUES ($1, 'firebase-dual', 'dual@example.com', 'active'),
            ($2, 'firebase-suspended', 'suspended@example.com', 'suspended')`,
    [dualRoleId, suspendedId],
  );
  await client.query(
    `INSERT INTO user_roles (user_id, role_code)
     VALUES ($1, 'contractor'), ($1, 'professional'), ($2, 'contractor')`,
    [dualRoleId, suspendedId],
  );

  const repository = new PostgresUserRepository(pool);

  const dualRole = await repository.findByFirebaseUid("firebase-dual");

  assert.ok(dualRole);
  assert.equal(dualRole.id, dualRoleId);
  assert.equal(dualRole.email, "dual@example.com");
  assert.equal(dualRole.status, "active");
  assert.deepEqual(dualRole.roles, ["contractor", "professional"]);

  const suspended = await repository.findByFirebaseUid("firebase-suspended");

  assert.ok(suspended);
  assert.equal(suspended.status, "suspended");
  assert.deepEqual(suspended.roles, ["contractor"]);

  assert.equal(await repository.findByFirebaseUid("firebase-missing"), null);
});
