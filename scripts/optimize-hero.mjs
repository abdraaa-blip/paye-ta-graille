/**
 * Génère `public/hero/landing-watercolor.webp` à partir de `public/hero/landing-watercolor.png`.
 * Redimensionne si largeur > max (LCP / poids) sans agrandir les petits exports.
 * Usage : `npm run optimize:hero`
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public/hero/landing-watercolor.png");
const webpPath = path.join(root, "public/hero/landing-watercolor.webp");

/** Largeur max côté client raisonnable (évite PNG 4K+ lourds pour le LCP). */
const HERO_MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

if (!existsSync(pngPath)) {
  console.error("Fichier source absent :", path.relative(root, pngPath));
  process.exit(1);
}

try {
  const meta = await sharp(pngPath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  const pipeline = sharp(pngPath)
    .rotate()
    .resize({
      width: HERO_MAX_WIDTH,
      withoutEnlargement: true,
    });

  await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(webpPath);

  const out = statSync(webpPath);
  const kb = (out.size / 1024).toFixed(1);
  const dimNote = w && h ? `${w}×${h}` : "?";
  console.log(
    "OK:",
    path.relative(root, webpPath),
    `(${kb} KB) source ${dimNote} → max ${HERO_MAX_WIDTH}px largeur, WebP q=${WEBP_QUALITY}`,
  );
} catch (e) {
  console.error("Échec conversion WebP :", e instanceof Error ? e.message : e);
  process.exit(1);
}
