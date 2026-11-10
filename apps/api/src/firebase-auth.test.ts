import assert from "node:assert/strict";
import test from "node:test";
import { extractBearerToken } from "./firebase-auth.js";

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
