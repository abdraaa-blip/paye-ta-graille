import assert from "node:assert/strict";
import test from "node:test";
import { SENSITIVE_PATH_REGEXES } from "../lib/sensitive-path-patterns.mjs";

function matchesSensitive(file) {
  const base = file.split(/[/\\]/).pop() ?? file;
  return SENSITIVE_PATH_REGEXES.some((re) => re.test(file) || re.test(base));
}

test("SENSITIVE_PATH_REGEXES flags env local and keys", () => {
  assert.ok(matchesSensitive(".env.local"));
  assert.ok(matchesSensitive("packages/app/.env.local"));
  assert.ok(matchesSensitive("certs/prod.pem"));
  assert.ok(matchesSensitive("ssh/id_rsa"));
  assert.ok(matchesSensitive("key.ppk"));
});

test("SENSITIVE_PATH_REGEXES allows normal project files", () => {
  assert.ok(!matchesSensitive(".env.example"));
  assert.ok(!matchesSensitive("README.md"));
  assert.ok(!matchesSensitive("src/lib/env.ts"));
});
