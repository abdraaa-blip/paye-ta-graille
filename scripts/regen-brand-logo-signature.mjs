/**
 * 1) Si `public/hero/IMG_4562.png` existe : upscale → `brand-logo-signature.png`.
 * 2) Sinon, si `brand-logo-signature.png` existe déjà : ne fait que l’étape matte.
 * 3) Toujours : retire le « mat » clair opaque (fond papier) pour laisser le décor transparaître.
 *
 * Puis : `npm run optimize:hero` (WebP + brand-stage-logo).
 * Usage : node scripts/regen-brand-logo-signature.mjs
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { knockoutLightMattePng } from "./lib/knockout-light-matte.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const heroDir = path.join(root, "public/hero");
const src = path.join(heroDir, "IMG_4562.png");
const outPng = path.join(heroDir, "brand-logo-signature.png");

let wroteFromMaster = false;

if (existsSync(src)) {
  const TARGET_W = 800;
  const meta = await sharp(src).metadata();
  const sw = meta.width ?? 1;
  const sh = meta.height ?? 1;
  const targetH = Math.round((TARGET_W * sh) / sw);

  await sharp(src)
    .rotate()
    .resize({
      width: TARGET_W,
      height: targetH,
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPng);
  wroteFromMaster = true;
  console.log("OK: upscale depuis", path.relative(root, src), "→", path.relative(root, outPng));
} else if (existsSync(outPng)) {
  console.log("Pas d’IMG_4562.png : matte knockout sur", path.relative(root, outPng), "seulement.");
} else {
  console.log(
    "Skip : place soit",
    path.relative(root, src),
    "soit un PNG existant sous",
    path.relative(root, outPng),
    "puis relance.",
  );
  process.exit(0);
}

await knockoutLightMattePng(outPng);

const outMeta = await sharp(outPng).metadata();
console.log(
  "OK matte:",
  path.relative(root, outPng),
  `${outMeta.width}×${outMeta.height}`,
  "hasAlpha=",
  Boolean(outMeta.hasAlpha),
  wroteFromMaster ? "(+ upscale master)" : "",
);
