import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export interface FirebaseIdentity {
  uid: string;
  email?: string;
  emailVerified: boolean;
}

export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const match = /^Bearer\s+([^\s]+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

function getFirebaseAuth() {
  const app = getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
  });
  return getAuth(app);
}

/**
 * Verifies signature, expiry, issuer and revocation with Firebase Admin.
 * Application Default Credentials must be configured in the runtime environment.
 */
export async function verifyFirebaseIdToken(token: string): Promise<FirebaseIdentity> {
  if (!token.trim()) {
    throw new Error("A Firebase ID token is required");
  }

  const decoded = await getFirebaseAuth().verifyIdToken(token, true);
  return {
    uid: decoded.uid,
    ...(decoded.email ? { email: decoded.email } : {}),
    emailVerified: decoded.email_verified === true,
  };
}
