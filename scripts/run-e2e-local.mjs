import { spawnSync } from "node:child_process";
import { withLocalE2EEnv } from "./lib/e2e-env.mjs";

const args = process.argv.slice(2);
const env = withLocalE2EEnv(process.env);

const res = spawnSync("npx", ["playwright", "test", ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});

process.exit(res.status ?? 1);
