import { spawnSync } from "node:child_process";

const BLOCKED_STAGED = [
  /^\.env\.local$/i,
  /^\.env\.[^/]+\.local$/i,
  /\.pem$/i,
  /id_rsa/i,
  /\.ppk$/i,
];

function run(cmd, opts = {}) {
  const res = spawnSync(cmd, {
    shell: true,
    stdio: "inherit",
    encoding: "utf8",
    ...opts,
  });
  return res.status ?? 1;
}

function runCapture(cmd) {
  const res = spawnSync(cmd, { shell: true, encoding: "utf8" });
  return { code: res.status ?? 1, stdout: String(res.stdout ?? "").trim() };
}

function parseArgs(argv) {
  const flags = new Set();
  const positional = [];
  for (const a of argv) {
    if (a.startsWith("--")) flags.add(a);
    else positional.push(a);
  }
  return {
    dryRun: flags.has("--dry-run"),
    noVerify: flags.has("--no-verify"),
    noGovernance: flags.has("--no-governance"),
    message: positional.join(" ").trim(),
  };
}

function hasWorkflowChanges(statusShort) {
  return /\.github\/workflows\//m.test(statusShort);
}

function assertStagedSafe(stagedFiles) {
  for (const file of stagedFiles) {
    for (const re of BLOCKED_STAGED) {
      if (re.test(file)) {
        throw new Error(`Refus ship: fichier sensible ou interdit en commit (${file}). Retire-le du staging.`);
      }
    }
  }
}

function main() {
  const raw = process.argv.slice(2);
  const { dryRun, noVerify, noGovernance, message: msgFromArgs } = parseArgs(raw);
  const message = (process.env.PTG_SHIP_MESSAGE ?? "").trim() || msgFromArgs;

  if (!noVerify && run("npm run verify") !== 0) {
    process.exit(1);
  }

  const { code: stCode, stdout: statusShort } = runCapture("git status --short");
  if (stCode !== 0) {
    console.error("git status a échoué.");
    process.exit(1);
  }

  if (!noGovernance && hasWorkflowChanges(statusShort)) {
    if (run("node scripts/ci/enforce-ci-governance-local.mjs --base-default") !== 0) {
      process.exit(1);
    }
  }

  if (dryRun) {
    console.log("[ship] dry-run: pas de git add / commit / push.");
    process.exit(0);
  }

  if (run("git add -A") !== 0) {
    process.exit(1);
  }

  const { stdout: stagedRaw } = runCapture("git diff --cached --name-only");
  const stagedFiles = stagedRaw ? stagedRaw.split(/\r?\n/).filter(Boolean) : [];

  try {
    assertStagedSafe(stagedFiles);
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }

  if (stagedFiles.length > 0 && !message) {
    console.error(
      "Message requis pour commit: npm run ship -- \"<message>\"\n   ou: PTG_SHIP_MESSAGE=\"...\" npm run ship\nOptions: --dry-run --no-verify --no-governance",
    );
    process.exit(1);
  }

  if (stagedFiles.length > 0) {
    if (run(`git commit -m ${JSON.stringify(message)}`) !== 0) {
      process.exit(1);
    }
  } else {
    console.log("Aucun changement à committer — push seulement si la branche est en avance.");
  }

  if (run("git push") !== 0) {
    process.exit(1);
  }

  console.log("ship: terminé (commit si nécessaire + push).");
}

main();
