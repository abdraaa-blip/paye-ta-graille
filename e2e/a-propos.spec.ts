import { expect, test } from "@playwright/test";

test.describe("À propos", () => {
  test("kicker « Notre façon… » ouvre le livret", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: "Le livret", level: 2 })).toHaveCount(0);
    await page.getByRole("link", { name: /Notre façon de voir les choses/i }).click();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("livret se déploie et se replie", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: "Le livret", level: 2 })).toHaveCount(0);
    await page.getByRole("button", { name: /Ouvrir le livret/i }).click();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Le livret", level: 2 })).toBeVisible();
    await page.getByRole("button", { name: /Replier le livret/i }).click();
    await expect(page.getByRole("heading", { name: "Le livret", level: 2 })).toHaveCount(0);
  });

  test("ancre #livret-payetagraille ouvre le livret", async ({ page }) => {
    await page.goto("/a-propos#livret-payetagraille");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("ancre courte #livret ouvre le livret", async ({ page }) => {
    await page.goto("/a-propos#livret");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("section index des pages visible", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: /Ce qu.*propose/i })).toBeVisible();
    await expect(page.locator('a.ptg-about-service-link[href="/auth"]')).toBeVisible();
  });

  test("ancre #apropos-services laisse le livret fermé et affiche l’index", async ({ page }) => {
    await page.goto("/a-propos#apropos-services");
    await expect(page.getByRole("region", { name: "Le livret" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Ce qu.*propose/i })).toBeInViewport();
  });
});
