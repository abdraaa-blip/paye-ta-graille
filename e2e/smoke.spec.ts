import { expect, test } from "@playwright/test";

test.describe("Smoke navigateur", () => {
  test("accueil rendu client", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
});
