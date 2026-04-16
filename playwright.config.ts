import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PTG_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";

const webServerOff = process.env.PTG_PLAYWRIGHT_NO_WEBSERVER === "1";

/** Hors job CI « beta-seo » : évite d’exiger un build NEXT_PUBLIC_PTG_PUBLIC_BETA. Voir `npm run test:e2e:beta-seo`. */
const runBetaE2E = process.env.PTG_RUN_BETA_E2E === "1";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: runBetaE2E ? undefined : ["**/beta-seo.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "line" : "list",
  ...(webServerOff
    ? {}
    : {
        webServer: {
          command: "npm run start",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
  /* Smoke HTTP : beaucoup de routes ; le navigateur reste sur smoke.spec uniquement. */
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
});
