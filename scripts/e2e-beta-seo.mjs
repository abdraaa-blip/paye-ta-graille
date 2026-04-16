import { spawnSync } from "node:child_process";

const env = { ...process.env, PTG_RUN_BETA_E2E: "1" };
const res = spawnSync("npx", ["playwright", "test", "e2e/beta-seo.spec.ts"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});
process.exit(res.status ?? 1);
