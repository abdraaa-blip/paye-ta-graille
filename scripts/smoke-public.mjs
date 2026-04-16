const base = process.env.PTG_BASE_URL?.trim() || "http://localhost:3000";

const routes = [
  "/",
  "/a-propos",
  "/hero/landing-watercolor.webp",
  "/accueil",
  "/commencer",
  "/auth",
  "/onboarding",
  "/decouvrir",
  "/repas",
  "/repas-ouverts",
  "/experiences",
  "/lieux",
  "/reseau-graille",
  "/moi",
  "/profil",
  "/signaler",
  "/graille-plus",
  "/partage-graille",
  "/seconde-graille",
  "/paiement-repas",
  "/legal/cgu",
  "/legal/confidentialite",
  "/route-inexistante-test-404",
  "/robots.txt",
  "/sitemap.xml",
  "/api/health",
];

const timeoutMs = 12000;
let failed = 0;

/** Kicker hero : lien vers À propos + classe pill (évite un faux positif si seul le footer pointe vers /a-propos). */
const HOME_EXPECT_KICKER_MARKERS = ['href="/a-propos"', "ptg-kicker-pill--link"];
const EXPECTED_STATUS = new Map([
  ["/api/health", 200],
  ["/route-inexistante-test-404", 404],
]);

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
    if (route === "/" && ok && res.status === 200) {
      const html = await res.text();
      const missing = HOME_EXPECT_KICKER_MARKERS.filter((m) => !html.includes(m));
      if (missing.length > 0) {
        ok = false;
        detail = ` :: home HTML missing hero kicker markers: ${missing.join(", ")}`;
      }
    }
    if (!ok) failed += 1;
    console.log(`${ok ? "OK " : "ERR"} ${String(res.status).padStart(3, " ")} ${route}${detail}`);
  } catch (e) {
    failed += 1;
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`ERR --- ${route} :: ${msg}`);
  } finally {
    clearTimeout(timer);
  }
}

for (const route of routes) {
  // eslint-disable-next-line no-await-in-loop
  await checkRoute(route);
}

if (failed > 0) {
  console.error(`\nSmoke test failed on ${failed} route(s).`);
  process.exit(1);
}

console.log("\nSmoke test passed.");
