import assert from "node:assert/strict";
import { deleteApp, getApps, initializeApp } from "firebase-admin/app";
import test from "node:test";
import { createFirebaseTokenVerifier } from "./firebase.js";

test("creates the default Firebase app even when a named app already exists", async (t) => {
  await Promise.all(getApps().map((app) => deleteApp(app)));

  t.after(async () => {
    await Promise.all(getApps().map((app) => deleteApp(app)));
  });

  initializeApp({ projectId: "demo-existing" }, "named-app");

  const verifier = createFirebaseTokenVerifier({
    mode: "emulator",
    projectId: "demo-zelora",
  });

  assert.equal(typeof verifier.verifyIdToken, "function");
  assert.ok(getApps().some((app) => app.name === "[DEFAULT]"));
});
