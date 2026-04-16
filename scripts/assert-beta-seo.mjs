const base = process.env.PTG_BASE_URL?.trim() || "http://127.0.0.1:3000";

let failed = 0;

function fail(msg) {
  failed += 1;
  console.error(`ERR ${msg}`);
}

async function readText(path) {
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    headers: { "User-Agent": "ptg-assert-beta-seo" },
  });
  const text = await res.text();
  return { status: res.status, text };
}

const healthRes = await fetch(new URL("/api/health", base).toString(), {
  method: "GET",
  headers: { "User-Agent": "ptg-assert-beta-seo" },
});
if (healthRes.status !== 200) {
  fail(`/api/health expected 200, got ${healthRes.status}`);
} else {
  try {
    const health = await healthRes.json();
    if (health?.publicBeta !== true) {
      fail("/api/health publicBeta doit être true (build beta + bon serveur sur PTG_BASE_URL)");
    }
  } catch {
    fail("/api/health corps JSON invalide");
  }
}

const robots = await readText("/robots.txt");
if (robots.status !== 200) {
  fail(`/robots.txt expected 200, got ${robots.status}`);
}
if (!robots.text.includes("Disallow: /")) {
  fail("/robots.txt must contain 'Disallow: /' in beta");
}

const sitemap = await readText("/sitemap.xml");
if (sitemap.status !== 200) {
  fail(`/sitemap.xml expected 200, got ${sitemap.status}`);
}
if (sitemap.text.includes("<url>")) {
  fail("/sitemap.xml must not contain <url> entries in beta");
}

if (failed > 0) {
  process.exit(1);
}

console.log("Beta SEO assertions passed.");
