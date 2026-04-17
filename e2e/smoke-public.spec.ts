import { expect, test } from "@playwright/test";
import {
  EXPECTED_STATUS,
  NIGHT_STAGE_MARKETING_ROUTES,
  SMOKE_ROUTES,
  validateHealthJson,
  validateHomeHtml,
  validateManifestText,
  validateNightStageMarketingHtml,
  validateRobotsText,
} from "../scripts/smoke-public-shared.mjs";

test.describe("Smoke public HTTP", () => {
  for (const route of SMOKE_ROUTES) {
    test(`GET ${route}`, async ({ request }) => {
      const res = await request.get(route, { maxRedirects: 0, timeout: 12_000 });
      const expected = EXPECTED_STATUS.get(route);
      if (expected !== undefined) {
        expect(res.status(), route).toBe(expected);
      } else {
        expect(res.status(), route).toBeLessThan(500);
      }

      if (route === "/api/health" && res.status() === 200) {
        const json = await res.json();
        expect(validateHealthJson(json)).toBeNull();
      }

      if (route === "/" && res.status() === 200) {
        const html = await res.text();
        expect(validateHomeHtml(html)).toBeNull();
      }

      if (route === "/manifest.webmanifest" && res.status() === 200) {
        const text = await res.text();
        expect(validateManifestText(text)).toBeNull();
      }

      if (route === "/robots.txt" && res.status() === 200) {
        const text = await res.text();
        expect(validateRobotsText(text)).toBeNull();
      }

      if (NIGHT_STAGE_MARKETING_ROUTES.includes(route) && res.status() === 200) {
        const html = await res.text();
        expect(validateNightStageMarketingHtml(html)).toBeNull();
      }
    });
  }
});
