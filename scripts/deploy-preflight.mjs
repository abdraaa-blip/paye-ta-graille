import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseDotEnv(content) {
  const vars = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    vars[key] = value;
  }
  return vars;
}

function truthy(v) {
  if (!v) return false;
  const normalized = String(v).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

const NEGATIVE_FLAGS = new Set(["0", "false", "off", "no"]);

function isNegativePublicFlag(v) {
  const t = String(v ?? "")
    .trim()
    .toLowerCase();
  return Boolean(t && NEGATIVE_FLAGS.has(t));
}

const root = process.cwd();
const envPath = resolve(root, ".env.local");
const fileVars = existsSync(envPath) ? parseDotEnv(readFileSync(envPath, "utf8")) : {};
const env = { ...process.env };
for (const [k, v] of Object.entries(fileVars)) {
  if (!String(env[k] ?? "").trim()) {
    env[k] = v;
  }
}

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "GOOGLE_PLACES_API_KEY",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
];

const modulePayments = truthy(env.NEXT_PUBLIC_PTG_MODULE_PAYMENTS);
if (modulePayments) {
  required.push("STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET");
}

const missing = required.filter((k) => !String(env[k] ?? "").trim());
const warnings = [];

if (!String(env.RESEND_API_KEY ?? "").trim()) {
  warnings.push("RESEND_API_KEY absent: notifications email non actives.");
}

const heroIllusOff = isNegativePublicFlag(env.NEXT_PUBLIC_PTG_HERO_ILLUSTRATION);
const heroSrc = String(env.NEXT_PUBLIC_PTG_HERO_ART ?? "").trim() || "/hero/landing-watercolor.webp";
if (!heroIllusOff && !heroSrc.startsWith("http")) {
  const rel = heroSrc.replace(/^\//, "");
  const abs = resolve(root, "public", rel);
  if (!existsSync(abs)) {
    warnings.push(
      `Illustration landing absente (public/${rel}). Lance npm run optimize:hero ou mets NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0.`,
    );
  }
}

if (
  !heroIllusOff &&
  heroSrc.startsWith("http") &&
  truthy(env.PTG_VERBOSE_PREFLIGHT)
) {
  warnings.push(
    "NEXT_PUBLIC_PTG_HERO_ART est une URL : hostname autorisé au build (remotePatterns) ; rebuild si tu changes de CDN.",
  );
}

const siteUrl = String(env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
const callbackUrl = siteUrl ? `${siteUrl}/auth/callback` : "(NEXT_PUBLIC_SITE_URL manquant)";

console.log("=== PTG Deploy Preflight ===");
console.log(`Env file loaded: ${existsSync(envPath) ? ".env.local" : "none"}`);
console.log(`Payments module: ${modulePayments ? "enabled" : "disabled"}`);

if (missing.length > 0) {
  console.error("\nMissing required variables:");
  for (const k of missing) console.error(`- ${k}`);
  console.error("\nPreflight: FAILED");
  process.exit(1);
}

console.log("\nRequired variables: OK");

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const msg of warnings) console.log(`- ${msg}`);
}

console.log("\nSupabase Auth URL configuration to verify:");
console.log("- Site URL:");
console.log(`  ${siteUrl}`);
console.log("- Redirect URLs:");
console.log("  http://localhost:3000/auth/callback");
console.log(`  ${callbackUrl}`);
console.log("  https://<preview>.vercel.app/auth/callback");

console.log("\nNext steps:");
console.log("1) Configure same env vars in Vercel (Preview + Production).");
console.log("2) Deploy preview, then run: PTG_BASE_URL=<preview_url> npm run smoke:public");
console.log("3) Promote to production and rerun smoke with production URL.");
console.log("4) Si fond hero local : npm run optimize:hero puis commit public/hero/*.webp (ou désactive l’illus).");
if (!heroIllusOff && heroSrc.startsWith("http")) {
  console.log(
    "5) Hero en URL distante : même NEXT_PUBLIC_PTG_HERO_ART au build qu’en prod ; rebuild si le hostname CDN change (remotePatterns). CI : PTG_VERBOSE_PREFLIGHT=1 pour warning explicite.",
  );
}
console.log("\nPreflight: PASSED");
