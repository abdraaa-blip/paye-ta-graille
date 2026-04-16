const base = process.env.PTG_BASE_URL?.trim() || "http://localhost:3000";

const routes = [
  "/",
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
  "/api/health",
];

const timeoutMs = 12000;
let failed = 0;

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
    const ok = res.status < 500;
    if (!ok) failed += 1;
    console.log(`${ok ? "OK " : "ERR"} ${String(res.status).padStart(3, " ")} ${route}`);
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
