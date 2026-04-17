import { spawnSync } from "node:child_process";

/** Aligné sur scripts/ship.mjs — chemins versionnés interdits. */
const BLOCKED_TRACKED = [
  /^\.env\.local$/i,
  /^\.env\.[^/]+\.local$/i,
  /\.pem$/i,
  /id_rsa/i,
  /\.ppk$/i,
];

function main() {
  const res = spawnSync("git", ["ls-files", "-z"], { encoding: "utf8" });
  if (res.status !== 0) {
    console.error("assert-tracked-files-safe: git ls-files a échoué (dépôt git requis).");
    process.exit(1);
  }
  const raw = String(res.stdout ?? "");
  const paths = raw.split("\0").filter(Boolean);
  const bad = [];
  for (const file of paths) {
    const base = file.split(/[/\\]/).pop() ?? file;
    for (const re of BLOCKED_TRACKED) {
      if (re.test(file) || re.test(base)) {
        bad.push(file);
        break;
      }
    }
  }
  if (bad.length > 0) {
    console.error(
      "assert-tracked-files-safe: fichiers sensibles suivis par git (retirer du dépôt) :\n  " +
        bad.join("\n  "),
    );
    process.exit(1);
  }
}

main();
