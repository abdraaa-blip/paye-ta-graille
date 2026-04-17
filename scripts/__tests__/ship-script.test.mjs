import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const shipPath = new URL("../ship.mjs", import.meta.url);
const content = readFileSync(shipPath, "utf8");

test("ship script blocks sensitive paths", () => {
  assert.match(content, /sensitive-path-patterns\.mjs/);
  assert.match(content, /assertStagedSafe/);
});

test("ship script supports dry-run and governance", () => {
  assert.match(content, /--dry-run/);
  assert.match(content, /enforce-ci-governance-local/);
});
