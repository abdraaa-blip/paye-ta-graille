import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflowPath = new URL("../../.github/workflows/meal-reminders-cron.yml", import.meta.url);
const yml = readFileSync(workflowPath, "utf8");

test("meal-reminders-cron : conventions repo (résumé CI, curl, permissions, secrets)", () => {
  assert.match(yml, /write-gate-summary\.sh/);
  assert.match(yml, /--fail-with-body/);
  assert.match(yml, /actions:\s*write/);
  assert.match(yml, /contents:\s*read/);
  assert.match(yml, /CRON_MEAL_REMINDERS_BASE_URL/);
  assert.match(yml, /CRON_SECRET/);
  assert.match(yml, /set -euo pipefail/);
  assert.match(yml, /upload-artifact@v4/);
  assert.match(yml, /meal-reminders-cron-response/);
});
