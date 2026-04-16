import { expect, test } from "@playwright/test";

test.describe("Beta public SEO", () => {
  test("health indique publicBeta", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as { publicBeta?: unknown };
    expect(json.publicBeta).toBe(true);
  });

  test("robots.txt interdit l’indexation", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("Disallow: /");
  });

  test("sitemap sans entrées URL", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).not.toContain("<url>");
  });
});
