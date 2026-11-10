import assert from "node:assert/strict";
import test from "node:test";
import {
  createFirebaseIdentityVerifier,
  extractBearerToken,
} from "./firebase-auth.js";

test("extracts a bearer token case-insensitively", () => {
  assert.equal(extractBearerToken("Bearer abc.def.ghi"), "abc.def.ghi");
  assert.equal(extractBearerToken("bearer token-value"), "token-value");
});

test("rejects missing, malformed and whitespace-containing bearer values", () => {
  assert.equal(extractBearerToken(undefined), null);
  assert.equal(extractBearerToken(""), null);
  assert.equal(extractBearerToken("Basic abc"), null);
  assert.equal(extractBearerToken("Bearer token extra"), null);
});

test("verifies revocation and maps only the required Firebase identity claims", async () => {
  let receivedToken = "";
  let checkedRevocation = false;
  const verify = createFirebaseIdentityVerifier(async (token, checkRevoked) => {
    receivedToken = token;
    checkedRevocation = checkRevoked;
    return {
      uid: "firebase-user-123",
      email: "person@example.test",
      email_verified: true,
    };
  });

  assert.deepEqual(await verify("signed-token"), {
    uid: "firebase-user-123",
    email: "person@example.test",
    emailVerified: true,
  });
  assert.equal(receivedToken, "signed-token");
  assert.equal(checkedRevocation, true);
});

test("rejects an empty Firebase token before calling the SDK", async () => {
  let called = false;
  const verify = createFirebaseIdentityVerifier(async () => {
    called = true;
    return { uid: "unused" };
  });

  await assert.rejects(() => verify("  "), /Firebase ID token is required/);
  assert.equal(called, false);
});
