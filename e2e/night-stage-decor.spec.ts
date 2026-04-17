import { expect, test } from "@playwright/test";

/**
 * Bandeau décoratif bas de page (illustration + faisceaux) : régression visuelle / structure.
 * L’illustration peut être absente si `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0` ; le cadre reste.
 */
test.describe("Bandeau illustré (night stage)", () => {
  for (const path of ["/partenaires", "/experiences", "/repas-ouverts"] as const) {
    test(`${path} affiche le cadre ptg-night-stage`, async ({ page }) => {
      await page.goto(path);
      const stage = page.locator(".ptg-night-stage");
      await expect(stage).toBeVisible();
      await expect(stage.locator(".ptg-night-stage__beam")).toHaveCount(2);
    });
  }

  test("Partenaires : titre et CTA partenariat", async ({ page }) => {
    await page.goto("/partenaires");
    await expect(page.getByRole("heading", { name: /Partenaires restos/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Proposer un partenariat/i })).toHaveAttribute(
      "href",
      /^mailto:partenaires@/,
    );
  });
});
