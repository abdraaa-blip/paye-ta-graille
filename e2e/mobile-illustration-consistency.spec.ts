import { expect, test } from "@playwright/test";

const MOBILE = { width: 390, height: 844 };

test.describe("Mobile illustration consistency", () => {
  test("Accueil: hero illustration uses contain on mobile portrait", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const heroImage = page.locator(".ptg-hero-shell--illus-hero .ptg-hero-illustration__img").first();
    await expect(heroImage).toBeVisible();

    const objectFit = await heroImage.evaluate((el) => window.getComputedStyle(el).objectFit);
    expect(objectFit).toBe("contain");
  });

  test("Night-stage pages: background illustration uses contain on mobile portrait", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    let checkedAtLeastOneStage = false;
    for (const path of ["/partenaires", "/experiences", "/repas-ouverts"] as const) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const stage = page.locator(".ptg-night-stage").first();
      if ((await stage.count()) === 0) continue;
      checkedAtLeastOneStage = true;
      await expect(stage).toBeVisible();
      const img = page.locator(".ptg-night-stage .ptg-hero-illustration__img").first();
      if ((await img.count()) === 0) continue;
      await expect(img).toBeVisible();
      const objectFit = await img.evaluate((el) => window.getComputedStyle(el).objectFit);
      expect(objectFit, `${path} should keep full image on mobile`).toBe("contain");
    }
    expect(checkedAtLeastOneStage, "At least one night-stage page should be available in this build").toBeTruthy();
  });

  test("Signaler: footer is rendered inside page shell", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/signaler", { waitUntil: "domcontentloaded" });
    const shell = page.locator(".ptg-page").first();
    await expect(shell).toBeVisible();
    await expect(shell.locator(".ptg-footer")).toHaveCount(1);
  });

  test("Global mobile CSS keeps continuous background strategy", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bodyBackgroundAttachment = await page.evaluate(() => window.getComputedStyle(document.body).backgroundAttachment);
    const attachments = bodyBackgroundAttachment.split(",").map((value) => value.trim());
    expect(attachments.every((value) => value === "scroll")).toBeTruthy();

    const pageShellBackground = await page
      .locator(".ptg-page")
      .first()
      .evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(pageShellBackground).toBe("rgba(0, 0, 0, 0)");
  });

  test("Viewport dynamic stress: no shell collapse after scroll round-trip", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });

    const shell = page.locator(".ptg-page").first();
    await expect(shell).toBeVisible();
    const beforeHeight = await shell.evaluate((el) => Math.round(el.getBoundingClientRect().height));

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const afterHeight = await shell.evaluate((el) => Math.round(el.getBoundingClientRect().height));
    // Tolérance faible pour éviter le bruit de rendu, sans masquer un vrai saut layout.
    expect(Math.abs(afterHeight - beforeHeight)).toBeLessThanOrEqual(4);
  });

  test("Orientation stress: portrait -> landscape -> portrait keeps hero visible", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const heroShell = page.locator(".ptg-hero-shell").first();
    await expect(heroShell).toBeVisible();

    await page.setViewportSize({ width: 844, height: 390 });
    await expect(heroShell).toBeVisible();

    await page.setViewportSize(MOBILE);
    await expect(heroShell).toBeVisible();
  });
});
