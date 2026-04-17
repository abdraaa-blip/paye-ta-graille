import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { withPublicBetaEnv } from "./lib/e2e-env.mjs";

const env = withPublicBetaEnv(process.env);
const betaBuildMarkerPath = ".next/PTG_PUBLIC_BETA_BUILD";

const res = spawnSync("npm", ["run", "build:clean"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});

if ((res.status ?? 1) !== 0) {
  process.exit(res.status ?? 1);
}

mkdirSync(".next", { recursive: true });
writeFileSync(betaBuildMarkerPath, `${new Date().toISOString()}\n`, "utf8");
