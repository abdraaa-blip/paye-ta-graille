/**
 * Génère `public/hero/landing-watercolor.webp` à partir du PNG source (meilleur LCP / poids).
 * Usage : `npm run optimize:hero`
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public/hero/landing-watercolor.png");
const webpPath = path.join(root, "public/hero/landing-watercolor.webp");

if (!existsSync(pngPath)) {
  console.error("Fichier source absent :", path.relative(root, pngPath));
  process.exit(1);
}

try {
  await sharp(pngPath).webp({ quality: 82, effort: 4 }).toFile(webpPath);
} catch (e) {
  console.error("Échec conversion WebP :", e instanceof Error ? e.message : e);
  process.exit(1);
}
console.log("OK:", path.relative(root, webpPath));
