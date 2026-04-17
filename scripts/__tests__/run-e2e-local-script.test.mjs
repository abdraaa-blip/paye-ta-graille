import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const scriptPath = new URL("../run-e2e-local.mjs", import.meta.url);
const content = readFileSync(scriptPath, "utf8");

test("run-e2e-local forces local webServer mode", () => {
  assert.match(content, /withLocalE2EEnv/);
  assert.match(content, /playwright", "test/);
});
