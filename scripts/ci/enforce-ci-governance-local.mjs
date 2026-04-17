import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

function run(command) {
  return execSync(command, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function runLines(command) {
  try {
    const output = run(command);
    return output ? output.split(/\r?\n/).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function parseArgs(argv) {
  let baseRef = "";
  let useDefaultRemoteBase = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base") {
      baseRef = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (arg === "--base-default") {
      useDefaultRemoteBase = true;
    }
  }
  return { baseRef, useDefaultRemoteBase };
}

function resolveDefaultRemoteBase() {
  try {
    const raw = run("git symbolic-ref refs/remotes/origin/HEAD");
    const match = raw.match(/^refs\/remotes\/origin\/(.+)$/);
    return match?.[1] ?? "";
  } catch {
    return "";
  }
}

function getChangedFiles(baseRef = "") {
  const prLikeDiff = baseRef
    ? (() => {
        try {
          run(`git fetch --no-tags --depth=1 origin ${baseRef}`);
          return runLines(`git diff --name-only origin/${baseRef}...HEAD`);
        } catch {
          return [];
        }
      })()
    : runLines("git diff --name-only HEAD~1...HEAD");

  const merged = new Set([
    ...prLikeDiff,
    ...runLines("git diff --name-only"),
    ...runLines("git diff --name-only --cached"),
    ...runLines("git ls-files --others --exclude-standard"),
  ]);
  return [...merged];
}

function main() {
  const { baseRef, useDefaultRemoteBase } = parseArgs(process.argv.slice(2));
  const effectiveBaseRef = baseRef || (useDefaultRemoteBase ? resolveDefaultRemoteBase() : "");
  const changedFiles = getChangedFiles(effectiveBaseRef);
  const changedWorkflows = changedFiles.filter((file) => /^\.github\/workflows\/.*\.yml$/.test(file));

  if (changedWorkflows.length === 0) {
    console.log("No workflow changes detected.");
    return;
  }

  console.log("Changed workflows:");
  for (const workflow of changedWorkflows) console.log(workflow);

  const docsTouched = changedFiles.some((file) =>
    /^(docs\/CI_RUNBOOK\.md|docs\/CI_WORKFLOW_COOKBOOK\.md|README\.md|\.github\/pull_request_template\.md)$/.test(file),
  );

  if (!docsTouched) {
    throw new Error("Workflow changes require governance docs alignment (CI runbook/cookbook/README/PR template).");
  }

  for (const workflow of changedWorkflows) {
    if (workflow === ".github/workflows/ci-governance.yml" || workflow === ".github/workflows/workflow-lint.yml") {
      continue;
    }
    const content = readFileSync(workflow, "utf8");
    if (!/scripts\/ci\/write-gate-summary\.sh/.test(content)) {
      throw new Error(`Workflow ${workflow} must include standardized gate summary via scripts/ci/write-gate-summary.sh`);
    }
  }

  console.log("CI governance checks passed.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
