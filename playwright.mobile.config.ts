import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PTG_E2E_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:4010";
const basePort = Number(new URL(baseURL).port || 4010);
const webServerOff = process.env.PTG_PLAYWRIGHT_NO_WEBSERVER === "1";

export default defineConfig({
  testDir: "./e2e",
  testMatch: ["**/mobile-illustration-consistency.spec.ts"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "line" : "list",
  ...(webServerOff
    ? {}
    : {
        webServer: {
          command: `npm run start -- -p ${basePort}`,
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      }),
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    ...devices["Pixel 7"],
  },
});
