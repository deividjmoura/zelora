import type { Pool } from "pg";
import {
  isAccountStatus,
  isRole,
  type AccountStatus,
  type DomainActor,
  type UserRepository,
} from "./types.js";

type UserRow = {
  id: string;
  firebase_uid: string;
  email: string | null;
  status: string;
  roles: string[] | null;
};

/**
 * Loads the local domain user associated with a Firebase UID. Authorization
 * data (roles and account status) lives in PostgreSQL, never in the ID token,
 * so clients cannot grant themselves permissions.
 */
export class PostgresUserRepository implements UserRepository {
  readonly #pool: Pool;

  constructor(pool: Pool) {
    this.#pool = pool;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<DomainActor | null> {
    const result = await this.#pool.query<UserRow>(
      `SELECT u.id,
              u.firebase_uid,
              u.email,
              u.status,
              COALESCE(array_agg(ur.role_code ORDER BY ur.role_code) FILTER (WHERE ur.role_code IS NOT NULL), '{}') AS roles
         FROM users u
         LEFT JOIN user_roles ur ON ur.user_id = u.id
        WHERE u.firebase_uid = $1
        GROUP BY u.id`,
      [firebaseUid],
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      firebaseUid: row.firebase_uid,
      email: row.email,
      status: normalizeAccountStatus(row.status),
      roles: (row.roles ?? []).filter(isRole),
    };
  }
}

/**
 * Fails closed: an unexpected status stored in the database is treated as
 * suspended instead of granting access.
 */
function normalizeAccountStatus(status: string): AccountStatus {
  return isAccountStatus(status) ? status : "suspended";
}
