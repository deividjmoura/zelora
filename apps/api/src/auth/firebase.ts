import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { AuthContext, TokenVerifier } from "./types.js";

export type FirebaseAdminConfig =
  | {
      readonly mode: "emulator";
      readonly projectId: string;
    }
  | {
      readonly mode: "service-account";
      readonly projectId: string;
      readonly clientEmail: string;
      readonly privateKey: string;
    };

/**
 * Creates a verifier backed by the Firebase Admin SDK. Initialization is lazy
 * with respect to network access: no Firebase request happens until a token is
 * verified.
 */
export function createFirebaseTokenVerifier(config: FirebaseAdminConfig): TokenVerifier {
  if (getApps().length === 0) {
    initializeApp(
      config.mode === "emulator"
        ? { projectId: config.projectId }
        : {
            credential: cert({
              projectId: config.projectId,
              clientEmail: config.clientEmail,
              privateKey: config.privateKey,
            }),
          },
    );
  }

  const firebaseAuth = getAuth();

  return {
    async verifyIdToken(idToken: string): Promise<AuthContext> {
      const decoded = await firebaseAuth.verifyIdToken(idToken);

      return {
        firebaseUid: decoded.uid,
        email: typeof decoded.email === "string" ? decoded.email : null,
        emailVerified: decoded.email_verified === true,
      };
    },
  };
}
