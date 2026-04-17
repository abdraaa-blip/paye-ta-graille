import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const scriptPath = new URL("../ci/write-gate-summary.sh", import.meta.url);
const content = readFileSync(scriptPath, "utf8");
const governanceScriptPath = new URL("../ci/enforce-ci-governance.sh", import.meta.url);
const governanceContent = readFileSync(governanceScriptPath, "utf8");
const governanceLocalScriptPath = new URL("../ci/enforce-ci-governance-local.mjs", import.meta.url);
const governanceLocalContent = readFileSync(governanceLocalScriptPath, "utf8");

test("write-gate-summary hardens shell execution", () => {
  assert.match(content, /^#!\/usr\/bin\/env bash/m);
  assert.match(content, /set -euo pipefail/);
});

test("write-gate-summary enforces required inputs", () => {
  assert.match(content, /GITHUB_STEP_SUMMARY is required\./);
  assert.match(content, /Usage: write-gate-summary\.sh <title> <command> <scope> <artifacts> \[extra\]/);
  assert.match(content, /\[\[ -z "\$\{TITLE\}" \|\| -z "\$\{COMMAND\}" \|\| -z "\$\{SCOPE\}" \|\| -z "\$\{ARTIFACTS\}" \]\]/);
});

test("enforce-ci-governance hardens shell execution and required args", () => {
  assert.match(governanceContent, /^#!\/usr\/bin\/env bash/m);
  assert.match(governanceContent, /set -euo pipefail/);
  assert.match(governanceContent, /Usage: enforce-ci-governance\.sh <event_name> \[base_ref\]/);
  assert.match(governanceContent, /For pull_request events, base_ref is required\./);
});

test("enforce-ci-governance-local contains cross-platform policy checks", () => {
  assert.match(governanceLocalContent, /--base/);
  assert.match(governanceLocalContent, /--base-default/);
  assert.match(governanceLocalContent, /git symbolic-ref refs\/remotes\/origin\/HEAD/);
  assert.match(governanceLocalContent, /effectiveBaseRef/);
  assert.match(governanceLocalContent, /git fetch --no-tags --depth=1 origin/);
  assert.match(governanceLocalContent, /git diff --name-only origin\/\$\{baseRef\}\.\.\.HEAD/);
  assert.match(governanceLocalContent, /git diff --name-only HEAD~1\.\.\.HEAD/);
  assert.match(governanceLocalContent, /git diff --name-only --cached/);
  assert.match(governanceLocalContent, /git ls-files --others --exclude-standard/);
  assert.match(governanceLocalContent, /Workflow changes require governance docs alignment/);
  assert.match(governanceLocalContent, /scripts\/ci\/write-gate-summary\.sh/);
});
