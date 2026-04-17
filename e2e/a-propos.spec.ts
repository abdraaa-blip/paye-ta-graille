import { expect, test } from "@playwright/test";

test.describe("À propos", () => {
  test("le livret est visible sous le hero", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: "Le livret", level: 2 })).toBeVisible();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("En savoir plus amène le livret dans la vue", async ({ page }) => {
    await page.goto("/a-propos");
    await page.getByRole("button", { name: /En savoir plus/i }).click();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeInViewport();
  });

  test("ancre #livret-payetagraille amène le livret", async ({ page }) => {
    await page.goto("/a-propos#livret-payetagraille");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("ancre courte #livret amène le livret", async ({ page }) => {
    await page.goto("/a-propos#livret");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("section index des pages visible", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: /Ce qu.*propose/i })).toBeVisible();
    await expect(page.locator('a.ptg-about-service-link[href="/auth"]')).toBeVisible();
  });

  test("ancre #apropos-services affiche l’index dans la vue", async ({ page }) => {
    await page.goto("/a-propos#apropos-services");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeAttached();
    await expect(page.getByRole("heading", { name: /Ce qu.*propose/i })).toBeInViewport();
  });
});
