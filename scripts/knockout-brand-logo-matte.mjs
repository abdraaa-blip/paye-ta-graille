/**
 * Retire le fond clair opaque sur `public/hero/brand-logo-signature.png` seul.
 * Usage : node scripts/knockout-brand-logo-matte.mjs
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { knockoutLightMattePng } from "./lib/knockout-light-matte.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const png = path.join(root, "public/hero/brand-logo-signature.png");

if (!existsSync(png)) {
  console.error("Absent :", path.relative(root, png));
  process.exit(1);
}

await knockoutLightMattePng(png);
const m = await sharp(png).metadata();
console.log("OK:", path.relative(root, png), `${m.width}×${m.height}`, "hasAlpha=", Boolean(m.hasAlpha));
