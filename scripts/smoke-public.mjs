import {
  EXPECTED_STATUS,
  NIGHT_STAGE_MARKETING_ROUTES,
  SMOKE_ROUTES,
  validateHealthJson,
  validateHomeHtml,
  validateManifestText,
  validateNightStageMarketingHtml,
  validateRobotsText,
} from "./smoke-public-shared.mjs";

const base = process.env.PTG_BASE_URL?.trim() || "http://127.0.0.1:3000";

const timeoutMs = 12000;
let failed = 0;
/** Échecs probablement dus à l’absence de serveur (connexion refusée, etc.). */
let likelyNetwork = 0;

function isLikelyNetworkFailure(message) {
  const m = message.toLowerCase();
  return (
    m.includes("fetch failed") ||
    m.includes("econnrefused") ||
    m.includes("network error") ||
    m.includes("aborted")
  );
}

async function checkRoute(route) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}${route}`, {
      method: "GET",
      redirect: "manual",
      signal: ctrl.signal,
      headers: { "User-Agent": "ptg-smoke-public" },
    });
    let ok = res.status < 500;
    let detail = "";
    const expectedStatus = EXPECTED_STATUS.get(route);
    if (expectedStatus !== undefined && res.status !== expectedStatus) {
      ok = false;
      detail = ` :: expected status ${expectedStatus}, got ${res.status}`;
    }
    if (route === "/api/health" && ok && res.status === 200) {
      try {
        const json = await res.json();
        const err = validateHealthJson(json);
        if (err) {
          ok = false;
          detail = ` :: ${err}`;
        }
      } catch {
        ok = false;
        detail = " :: health response not valid JSON";
      }
    }
    if (route === "/" && ok && res.status === 200) {
      const html = await res.text();
      const err = validateHomeHtml(html);
      if (err) {
        ok = false;
        detail = ` :: ${err}`;
      }
    }
    if (route === "/manifest.webmanifest" && ok && res.status === 200) {
      const text = await res.text();
      const err = validateManifestText(text);
      if (err) {
        ok = false;
        detail = ` :: ${err}`;
      }
    }
    if (route === "/robots.txt" && ok && res.status === 200) {
      const text = await res.text();
      const err = validateRobotsText(text);
      if (err) {
        ok = false;
        detail = ` :: ${err}`;
      }
    }
    if (NIGHT_STAGE_MARKETING_ROUTES.includes(route) && ok && res.status === 200) {
      const html = await res.text();
      const err = validateNightStageMarketingHtml(html);
      if (err) {
        ok = false;
        detail = ` :: ${err}`;
      }
    }
    if (!ok) failed += 1;
    console.log(`${ok ? "OK " : "ERR"} ${String(res.status).padStart(3, " ")} ${route}${detail}`);
  } catch (e) {
    failed += 1;
    const msg = e instanceof Error ? e.message : String(e);
    if (isLikelyNetworkFailure(msg)) likelyNetwork += 1;
    console.log(`ERR --- ${route} :: ${msg}`);
  } finally {
    clearTimeout(timer);
  }
}

for (const route of SMOKE_ROUTES) {
  // eslint-disable-next-line no-await-in-loop
  await checkRoute(route);
}

if (failed > 0) {
  console.error(`\nSmoke test failed on ${failed} route(s).`);
  if (likelyNetwork === failed) {
    console.error(
      `\nAstuce : aucune réponse HTTP sur « ${base} ». Lance d'abord l'app (npm run dev, ou npm run build puis npm run start), ou définis PTG_BASE_URL vers une URL joignable. Pour un smoke intégré : npm run checks:prod-local (voir README).`,
    );
  }
  process.exit(1);
}

console.log("\nSmoke test passed.");
