import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const content = readFileSync(join(here, "..", "assert-tracked-files-safe.mjs"), "utf8");

test("assert-tracked-files-safe uses git ls-files and blocked patterns", () => {
  assert.ok(content.includes('["ls-files", "-z"]'));
  assert.ok(content.includes("BLOCKED_TRACKED"));
  assert.ok(content.includes(".env") && content.includes("local"));
});
