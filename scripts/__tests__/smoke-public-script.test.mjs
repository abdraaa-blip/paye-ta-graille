import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const scriptPath = new URL("../smoke-public.mjs", import.meta.url);
const content = readFileSync(scriptPath, "utf8");

test("smoke-public detects likely network failures and hints when all routes fail", () => {
  assert.match(content, /isLikelyNetworkFailure/);
  assert.match(content, /likelyNetwork === failed/);
  assert.match(content, /checks:prod-local/);
});
