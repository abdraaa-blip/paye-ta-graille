const base = process.env.PTG_BASE_URL?.trim() || "http://localhost:3000";

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
