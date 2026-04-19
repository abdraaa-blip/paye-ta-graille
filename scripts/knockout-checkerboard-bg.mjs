/**
 * Retire un fond type « damier transparence » exporté en RGB (gris clair / gris foncé neutres).
 * Ne touche pas aux couleurs saturées (orange, vert) : critère = faible écart entre canaux + proche des tons damier.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public/hero/brand-logo-signature.png");

function distSq(a, b, c, x, y, z) {
  const d0 = a - x;
  const d1 = b - y;
  const d2 = c - z;
  return d0 * d0 + d1 * d1 + d2 * d2;
}

/** true → pixel rendu transparent */
function isCheckerNeutral(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  if (mx - mn > 16) return false;
  // Cellules typiques ~153 et ~209 (export « transparence » en RGB).
  if (distSq(r, g, b, 209, 209, 209) <= 28 * 28) return true;
  if (distSq(r, g, b, 153, 153, 153) <= 22 * 22) return true;
  // Anti-alias entre les deux : gris intermédiaire encore neutre
  const mean = (r + g + b) / 3;
  if (mx - mn <= 10 && mean >= 165 && mean <= 218 && mx >= 140) return true;
  return false;
}

const inputBuf = readFileSync(pngPath);
const { data, info } = await sharp(inputBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const ch = info.channels;
if (ch < 4) throw new Error("ensureAlpha devrait produire 4 canaux");

const out = Buffer.from(data);
let cleared = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * ch;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (isCheckerNeutral(r, g, b)) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      cleared++;
    }
  }
}

const outBuf = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();
writeFileSync(pngPath, outBuf);

console.log("OK:", path.relative(root, pngPath), `cleared ${cleared} / ${w * h} px`);
