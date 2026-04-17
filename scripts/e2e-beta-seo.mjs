import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { hasValidBetaBuildArtifacts, shouldSkipBetaBuild, withBetaE2EEnv } from "./lib/e2e-env.mjs";

const env = withBetaE2EEnv(process.env);
const skipRequested = shouldSkipBetaBuild(process.env);
const skipBuild = skipRequested && process.env.CI === "true";

if (skipRequested && process.env.CI !== "true") {
  console.warn("PTG_SKIP_BETA_BUILD=1 detecte hors CI: ignore pour garantir un run local fiable.");
}

if (!skipBuild) {
  const build = spawnSync("npm", ["run", "build:beta"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env,
  });

  if ((build.status ?? 1) !== 0) {
    process.exit(build.status ?? 1);
  }
} else if (!hasValidBetaBuildArtifacts(existsSync)) {
  console.error(
    "PTG_SKIP_BETA_BUILD=1 exige un build beta valide (.next/BUILD_ID et .next/PTG_PUBLIC_BETA_BUILD).",
  );
  process.exit(1);
}

const res = spawnSync("npx", ["playwright", "test", "e2e/beta-seo.spec.ts"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});
process.exit(res.status ?? 1);
