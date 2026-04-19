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

/** Même liste que `config/public-hero-image-url-env-keys.json`. */
function loadPublicHeroImageUrlEnvKeys() {
  const keysPath = resolve(root, "config/public-hero-image-url-env-keys.json");
  if (!existsSync(keysPath)) {
    console.error("Missing", keysPath);
    process.exit(1);
  }
  try {
    const parsed = JSON.parse(readFileSync(keysPath, "utf8"));
    if (!Array.isArray(parsed.keys) || !parsed.keys.every((k) => typeof k === "string" && k.length > 0)) {
      throw new Error("invalid « keys » array");
    }
    return parsed.keys;
  } catch (e) {
    console.error("Invalid config/public-hero-image-url-env-keys.json:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

const PUBLIC_HERO_IMAGE_HTTP_ENV_KEYS = loadPublicHeroImageUrlEnvKeys();

const envPath = resolve(root, ".env.local");
const fileVars = existsSync(envPath) ? parseDotEnv(readFileSync(envPath, "utf8")) : {};
const env = { ...process.env };
for (const [k, v] of Object.entries(fileVars)) {
  if (!String(env[k] ?? "").trim()) {
    env[k] = v;
  }
}

const placesKeys = ["GOOGLE_PLACES_API_KEY", "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"];
const allowMissingPlaces = truthy(env.PTG_PREFLIGHT_ALLOW_MISSING_PLACES);

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  ...(!allowMissingPlaces ? placesKeys : []),
];

const modulePayments = truthy(env.NEXT_PUBLIC_PTG_MODULE_PAYMENTS);
if (modulePayments) {
  required.push("STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET");
}

const missing = required.filter((k) => !String(env[k] ?? "").trim());
const warnings = [];

if (allowMissingPlaces) {
  warnings.push(
    "PTG_PREFLIGHT_ALLOW_MISSING_PLACES actif : clés Google Places / Maps non exigées. Les flux Lieux resteront limités tant que tu ne les ajoutes pas (prod / preview).",
  );
}

const resendKey = String(env.RESEND_API_KEY ?? "").trim();
if (!resendKey) {
  warnings.push("RESEND_API_KEY absent: notifications email non actives.");
} else if (!String(env.RESEND_FROM_EMAIL ?? "").trim()) {
  warnings.push(
    "RESEND_FROM_EMAIL absent : en prod, prévoir un expéditeur domaine vérifié (sinon valeur par défaut limitée onboarding@resend.dev).",
  );
}
if (!String(env.UPSTASH_REDIS_REST_URL ?? "").trim() || !String(env.UPSTASH_REDIS_REST_TOKEN ?? "").trim()) {
  warnings.push(
    "UPSTASH_REDIS_REST_URL/TOKEN absents: le rate-limit restera local (moins fiable en multi-instance).",
  );
}
if (truthy(env.PTG_CSP_REPORT_ONLY ?? "1")) {
  warnings.push("PTG_CSP_REPORT_ONLY actif: la CSP est en mode rapport uniquement (durcissement progressif).");
}

const growthAdmin = String(env.PTG_GROWTH_ADMIN_USER_IDS ?? "").trim();
const growthSecret = String(env.PTG_GROWTH_KPI_SECRET ?? "").trim();
const serviceRole = String(env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
if (resendKey && !serviceRole) {
  warnings.push(
    "RESEND_API_KEY présent mais SUPABASE_SERVICE_ROLE_KEY absent : e-mails « repas proposé » (quota RPC, lecture profil) ne partiront pas côté serveur.",
  );
}
if (resendKey && serviceRole && !String(env.CRON_SECRET ?? "").trim()) {
  warnings.push(
    "CRON_SECRET absent : les rappels repas automatiques (cron Vercel /api/cron/meal-reminders) resteront désactivés.",
  );
}
if (String(env.CRON_SECRET ?? "").trim() && serviceRole) {
  warnings.push(
    "Cron repas actif côté env : appliquer sur Supabase `20260430100000_meals_reminder_columns.sql` + `20260430200000_auto_complete_meals_rpc.sql` (sinon fallback Node pour la clôture auto, plus lent).",
  );
}
if ((growthAdmin || growthSecret) && !serviceRole) {
  warnings.push(
    "KPI croissance configuré (PTG_GROWTH_ADMIN_USER_IDS ou PTG_GROWTH_KPI_SECRET) mais SUPABASE_SERVICE_ROLE_KEY absent : /api/growth/kpi et /interne/croissance ne pourront pas lire les agrégats.",
  );
}
if (growthSecret && growthSecret.length < 24) {
  warnings.push("PTG_GROWTH_KPI_SECRET très court : préfère un secret aléatoire d’au moins 32 caractères.");
}

const DEFAULT_HERO_WEBP = "/hero/landing-watercolor.webp";

function warnLocalImageMissing(raw, label) {
  const v = String(raw ?? "").trim();
  if (!v || v.startsWith("http")) return;
  const rel = v.replace(/^\//, "");
  const abs = resolve(root, "public", rel);
  if (!existsSync(abs)) {
    warnings.push(`${label} : fichier absent (public/${rel}). Corrige la variable ou génère l’asset.`);
  }
}

const heroIllusOff = isNegativePublicFlag(env.NEXT_PUBLIC_PTG_HERO_ILLUSTRATION);
const heroSrc = String(env.NEXT_PUBLIC_PTG_HERO_ART ?? "").trim() || DEFAULT_HERO_WEBP;
if (!heroIllusOff && !heroSrc.startsWith("http")) {
  const rel = heroSrc.replace(/^\//, "");
  const abs = resolve(root, "public", rel);
  if (!existsSync(abs)) {
    warnings.push(
      `Illustration landing absente (public/${rel}). Lance npm run optimize:hero ou mets NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0.`,
    );
  }
}

if (!heroIllusOff) {
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HERO_ART_NIGHT, "NEXT_PUBLIC_PTG_HERO_ART_NIGHT");
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HERO_ART_MOBILE, "NEXT_PUBLIC_PTG_HERO_ART_MOBILE");
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HERO_ART_PORTRAIT_RAIL, "NEXT_PUBLIC_PTG_HERO_ART_PORTRAIT_RAIL");
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HOME_FEAST_ART, "NEXT_PUBLIC_PTG_HOME_FEAST_ART");
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HERO_ART_NIGHT_MOBILE, "NEXT_PUBLIC_PTG_HERO_ART_NIGHT_MOBILE");
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HERO_ART_BRAND, "NEXT_PUBLIC_PTG_HERO_ART_BRAND");
  warnLocalImageMissing(env.NEXT_PUBLIC_PTG_HERO_ART_BRAND_MOBILE, "NEXT_PUBLIC_PTG_HERO_ART_BRAND_MOBILE");
}

const ogSrc = String(env.NEXT_PUBLIC_PTG_OG_IMAGE ?? "").trim();
if (ogSrc && !ogSrc.startsWith("http")) {
  const rel = ogSrc.replace(/^\//, "");
  const abs = resolve(root, "public", rel);
  if (!existsSync(abs)) {
    warnings.push(
      `Image Open Graph absente (public/${rel}). Corrige NEXT_PUBLIC_PTG_OG_IMAGE ou retire la variable.`,
    );
  }
}

if (truthy(env.PTG_VERBOSE_PREFLIGHT)) {
  for (const key of PUBLIC_HERO_IMAGE_HTTP_ENV_KEYS) {
    const v = String(env[key] ?? "").trim();
    if (v.startsWith("http")) {
      warnings.push(
        `${key} est une URL : hostname doit être autorisé au build (next.config remotePatterns). Rebuild Vercel si le CDN change.`,
      );
    }
  }
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
console.log(
  "0) Appliquer sur Supabase toutes les migrations (db push ou SQL Editor) : KPI funnel, growth_events, user_settings (notifs + compteur e-mail + RPC reserve_meal_email_nudge_slot), meals (reminder_24h / reminder_2h + RPC auto_complete_confirmed_meals), etc.",
);
console.log("1) Configure same env vars in Vercel (Preview + Production).");
console.log(
  "2) Déployer une preview, puis : PTG_BASE_URL=<preview_url> npm run test:e2e (smoke HTTP + navigateur) ou npm run smoke:public si serveur déjà lancé.",
);
console.log("3) Promote to production et répéter le même contrôle sur l’URL prod.");
console.log(
  "4) Si fond hero local : placer `public/hero/landing-watercolor.png`, `npm run optimize:hero` (WebP, largeur max 1920px), commit le `.webp` (ou `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION=0`).",
);
if (!heroIllusOff && PUBLIC_HERO_IMAGE_HTTP_ENV_KEYS.some((k) => String(env[k] ?? "").trim().startsWith("http"))) {
  console.log(
    "5) Image(s) hero / OG / variantes en URL : aligner les vars au build et sur Vercel ; rebuild si un hostname CDN change (remotePatterns). CI : PTG_VERBOSE_PREFLIGHT=1 pour le détail.",
  );
}
console.log("\nPreflight: PASSED");
