export const ROLES = ["contractor", "professional", "admin"] as const;

export type Role = (typeof ROLES)[number];

export const ACCOUNT_STATUSES = ["active", "suspended", "deleted"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function isAccountStatus(value: unknown): value is AccountStatus {
  return typeof value === "string" && (ACCOUNT_STATUSES as readonly string[]).includes(value);
}

/** Identity proven by a verified Firebase ID token. */
export type AuthContext = {
  readonly firebaseUid: string;
  readonly email: string | null;
  readonly emailVerified: boolean;
};

/** Domain user loaded from PostgreSQL after token validation. */
export type DomainActor = {
  readonly id: string;
  readonly firebaseUid: string;
  readonly email: string | null;
  readonly status: AccountStatus;
  readonly roles: readonly Role[];
};

export interface TokenVerifier {
  verifyIdToken(idToken: string): Promise<AuthContext>;
}

export interface UserRepository {
  findByFirebaseUid(firebaseUid: string): Promise<DomainActor | null>;
}
