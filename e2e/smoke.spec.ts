import { expect, test } from "@playwright/test";

test.describe("Smoke navigateur", () => {
  test("accueil rendu client", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
    const raster = await page.locator(".ptg-page").first().getAttribute("data-ptg-hero-raster");
    if (raster === "on") {
      await expect(page.locator("section.ptg-home-cinematic-band")).toBeVisible();
      await expect(page.locator("section.ptg-home-market-band")).toBeVisible();
    }
  });
});
