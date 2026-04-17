/**
 * Génère des WebP sous `public/hero/` à partir de PNG sources (même recette : largeur max, sans agrandir).
 * - Obligatoire : `landing-watercolor.png` → `landing-watercolor.webp`
 * - Optionnels si le PNG existe : `landing-watercolor-night`, `-mobile`, `-night-mobile`, `brand-marketplace`
 * Usage : `npm run optimize:hero`
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const heroDir = path.join(root, "public/hero");

/** Largeur max côté client raisonnable (évite PNG 4K+ lourds pour le LCP). */
const HERO_MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

/** Paires [fichier PNG sans chemin, WebP de sortie]. La première est exigée. */
const VARIANTS = [
  { png: "landing-watercolor.png", webp: "landing-watercolor.webp", required: true },
  { png: "landing-watercolor-night.png", webp: "landing-watercolor-night.webp", required: false },
  { png: "landing-watercolor-mobile.png", webp: "landing-watercolor-mobile.webp", required: false },
  { png: "landing-watercolor-night-mobile.png", webp: "landing-watercolor-night-mobile.webp", required: false },
  { png: "brand-marketplace.png", webp: "brand-marketplace.webp", required: false },
];

async function convertVariant(pngName, webpName) {
  const pngPath = path.join(heroDir, pngName);
  const webpPath = path.join(heroDir, webpName);

  const meta = await sharp(pngPath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  await sharp(pngPath)
    .rotate()
    .resize({
      width: HERO_MAX_WIDTH,
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const out = statSync(webpPath);
  const kb = (out.size / 1024).toFixed(1);
  const dimNote = w && h ? `${w}×${h}` : "?";
  console.log(
    "OK:",
    path.relative(root, webpPath),
    `(${kb} KB) source ${dimNote} → max ${HERO_MAX_WIDTH}px largeur, WebP q=${WEBP_QUALITY}`,
  );
}

let failed = false;

for (const { png, webp, required } of VARIANTS) {
  const pngPath = path.join(heroDir, png);
  if (!existsSync(pngPath)) {
    if (required) {
      console.error("Fichier source absent :", path.relative(root, pngPath));
      process.exit(1);
    }
    console.log("Skip (PNG absent) :", path.relative(root, pngPath));
    continue;
  }
  try {
    await convertVariant(png, webp);
  } catch (e) {
    console.error("Échec", webp, ":", e instanceof Error ? e.message : e);
    failed = true;
  }
}

if (failed) process.exit(1);
