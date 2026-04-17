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

  test("livret : page affiche avec poster et légende", async ({ page }) => {
    await page.goto("/a-propos");
    await page.getByRole("button", { name: /Ouvrir le livret/i }).click();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "L’univers en une image", level: 3 })).toBeVisible();
    await expect(page.getByText("1 sur 8")).toBeVisible();
    await expect(page.getByRole("img", { name: /Affiche Paye ta graille/i })).toBeVisible();
    await expect(page.getByText(/affiche officielle du projet/i)).toBeVisible();
  });

  test("livret : bouton Agrandir ouvre la lightbox puis Échap la ferme", async ({ page }) => {
    await page.goto("/a-propos#livret-univers");
    await page.getByRole("button", { name: /Agrandir l’affiche depuis le livret/i }).click();
    await expect(page.getByRole("dialog", { name: /Affiche Paye ta graille en grand format/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /Affiche Paye ta graille en grand format/i })).toHaveCount(0);
  });

  test("ancre #livret-payetagraille ouvre le livret", async ({ page }) => {
    await page.goto("/a-propos#livret-payetagraille");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("ancre courte #livret ouvre le livret", async ({ page }) => {
    await page.goto("/a-propos#livret");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
  });

  test("ancre #livret-univers ouvre le livret sur la page affiche", async ({ page }) => {
    await page.goto("/a-propos#livret-univers");
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "L’univers en une image", level: 3 })).toBeVisible();
    await expect(page.getByText("1 sur 8")).toBeVisible();
  });

  test("section index des pages visible", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: /Ce qu.*propose/i })).toBeVisible();
    await expect(page.locator('a.ptg-about-service-link[href="/auth"]')).toBeVisible();
  });

  test("sur desktop, pas de bouton repli pour l’index (liens toujours visibles)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/a-propos");
    await expect(page.locator(".ptg-about-services-fold-btn")).toBeHidden();
    await expect(page.locator('a.ptg-about-service-link[href="/auth"]')).toBeVisible();
  });

  test("ancre #apropos-services laisse le livret fermé et affiche l’index", async ({ page }) => {
    await page.goto("/a-propos#apropos-services");
    await expect(page.getByRole("region", { name: "Le livret" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Ce qu.*propose/i })).toBeInViewport();
  });

  test("sur mobile, index « Ce qu’on propose » replié puis dépliable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/a-propos");
    const foldBtn = page.locator(".ptg-about-services-fold-btn");
    await expect(foldBtn).toBeVisible();
    await expect(foldBtn).toHaveAttribute("aria-expanded", "false");
    const authInIndex = page.locator("#apropos-services a.ptg-about-service-link[href=\"/auth\"]");
    await expect(authInIndex).toBeHidden();
    await foldBtn.click();
    await expect(foldBtn).toHaveAttribute("aria-expanded", "true");
    await expect(authInIndex).toBeVisible();
  });

  test("sur mobile, #apropos-services ouvre l’index déjà déplié", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/a-propos#apropos-services");
    await expect(page.locator('a.ptg-about-service-link[href="/auth"]')).toBeVisible();
  });

  test("depuis l’index, la vignette affiche ouvre le livret sur la bonne page", async ({ page }) => {
    await page.goto("/a-propos#apropos-services");
    await expect(page.getByRole("region", { name: "Le livret" })).toHaveCount(0);
    await page.getByRole("button", { name: /Ouvrir le livret à la page affiche/i }).click();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "L’univers en une image", level: 3 })).toBeVisible();
    await expect(page.getByText("1 sur 8")).toBeVisible();
  });

  test("bouton hero « Voir l’affiche du projet » ouvre la page affiche", async ({ page }) => {
    await page.goto("/a-propos");
    await page.getByRole("button", { name: /Voir l’affiche du projet/i }).click();
    await expect(page.getByRole("region", { name: "Le livret" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "L’univers en une image", level: 3 })).toBeVisible();
  });
});
