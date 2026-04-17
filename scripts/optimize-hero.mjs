/**
 * Génère des WebP sous `public/hero/` à partir de PNG sources (même recette : largeur max, sans agrandir).
 * - Obligatoire : `landing-watercolor.png` → `landing-watercolor.webp`
 * - Optionnels si le PNG existe : nuit / mobile / affiche marque `brand-poster` / legacy `brand-marketplace`
 * - Si `brand-poster.png` existe : `public/og/paye-ta-graille-share.webp` (1200×630, cover haut) pour Open Graph
 * Usage : `npm run optimize:hero`
 */
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const heroDir = path.join(root, "public/hero");
const ogDir = path.join(root, "public/og");
const brandStageConfigPath = path.join(root, "config/brand-stage-focal-points.json");
const DRY_RUN = process.argv.includes("--dry-run");

/** Largeur max côté client raisonnable (évite PNG 4K+ lourds pour le LCP). */
const HERO_MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const BRAND_STAGE_WIDTH = 1500;
const BRAND_STAGE_HEIGHT = 1000;

/** Paires [fichier PNG sans chemin, WebP de sortie]. La première est exigée. */
const VARIANTS = [
  { png: "landing-watercolor.png", webp: "landing-watercolor.webp", required: true },
  { png: "landing-watercolor-night.png", webp: "landing-watercolor-night.webp", required: false },
  { png: "landing-watercolor-mobile.png", webp: "landing-watercolor-mobile.webp", required: false },
  { png: "landing-watercolor-night-mobile.png", webp: "landing-watercolor-night-mobile.webp", required: false },
  { png: "brand-poster.png", webp: "brand-poster.webp", required: false },
  { png: "brand-marketplace.png", webp: "brand-marketplace.webp", required: false },
];

const ALLOWED_POSITIONS = new Set([
  "center",
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
  "top",
  "right top",
  "right",
  "right bottom",
  "bottom",
  "left bottom",
  "left",
  "left top",
  "attention",
]);

async function convertVariant(pngName, webpName) {
  const pngPath = path.join(heroDir, pngName);
  const webpPath = path.join(heroDir, webpName);

  const meta = await sharp(pngPath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const dimNote = w && h ? `${w}×${h}` : "?";

  if (DRY_RUN) {
    console.log(
      "DRY:",
      `${path.relative(root, pngPath)} -> ${path.relative(root, webpPath)}`,
      `source ${dimNote} → max ${HERO_MAX_WIDTH}px, WebP q=${WEBP_QUALITY}`,
    );
    return;
  }

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
  console.log(
    "OK:",
    path.relative(root, webpPath),
    `(${kb} KB) source ${dimNote} → max ${HERO_MAX_WIDTH}px largeur, WebP q=${WEBP_QUALITY}`,
  );
}

function clamp01(v) {
  if (!Number.isFinite(v)) return 0.5;
  return Math.max(0, Math.min(1, v));
}

function isPlainObject(v) {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function loadBrandStageVariants() {
  if (!existsSync(brandStageConfigPath)) {
    console.error("Config absente :", path.relative(root, brandStageConfigPath));
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(readFileSync(brandStageConfigPath, "utf-8"));
  } catch (e) {
    console.error("Config invalide (JSON) :", path.relative(root, brandStageConfigPath));
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.error("Config vide :", path.relative(root, brandStageConfigPath));
    process.exit(1);
  }

  const out = [];
  const seen = new Set();
  for (const [i, item] of data.entries()) {
    if (!isPlainObject(item)) {
      console.error(`Entrée config invalide #${i + 1}: objet attendu`);
      process.exit(1);
    }
    const input = typeof item.input === "string" ? item.input.trim() : "";
    const output = typeof item.output === "string" ? item.output.trim() : "";
    const positionRaw = typeof item.position === "string" ? item.position.trim().toLowerCase() : "attention";
    const focalRaw = isPlainObject(item.focal) ? item.focal : {};
    const focal = { x: clamp01(Number(focalRaw.x ?? 0.5)), y: clamp01(Number(focalRaw.y ?? 0.5)) };

    if (!input || !output) {
      console.error(`Entrée config invalide #${i + 1}: input/output requis`);
      process.exit(1);
    }
    if (!ALLOWED_POSITIONS.has(positionRaw)) {
      console.error(`Position invalide pour "${output}" : "${positionRaw}"`);
      process.exit(1);
    }
    const key = `${input}::${output}`;
    if (seen.has(key)) {
      console.error(`Doublon config détecté : ${key}`);
      process.exit(1);
    }
    seen.add(key);
    out.push({ input, output, position: positionRaw, focal });
  }
  return out;
}

function cropRectForFocal(width, height, targetWidth, targetHeight, focal) {
  const sourceRatio = width / height;
  const targetRatio = targetWidth / targetHeight;
  const fx = clamp01(focal?.x ?? 0.5);
  const fy = clamp01(focal?.y ?? 0.5);

  if (sourceRatio > targetRatio) {
    const cropWidth = Math.max(1, Math.round(height * targetRatio));
    const cropHeight = height;
    const maxLeft = Math.max(0, width - cropWidth);
    const left = Math.max(0, Math.min(maxLeft, Math.round(fx * width - cropWidth / 2)));
    return { left, top: 0, width: cropWidth, height: cropHeight };
  }

  const cropWidth = width;
  const cropHeight = Math.max(1, Math.round(width / targetRatio));
  const maxTop = Math.max(0, height - cropHeight);
  const top = Math.max(0, Math.min(maxTop, Math.round(fy * height - cropHeight / 2)));
  return { left: 0, top, width: cropWidth, height: cropHeight };
}

async function buildBrandStageVariant(inputName, outputName, position = "attention", focal) {
  const inputPath = path.join(heroDir, inputName);
  const outputPath = path.join(heroDir, outputName);
  const meta = await sharp(inputPath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const useFocal = w > 0 && h > 0 && focal && typeof focal === "object";
  const dimNote = w && h ? `${w}×${h}` : "?";
  const pipeline = sharp(inputPath).rotate();
  let rect = null;

  if (useFocal) {
    rect = cropRectForFocal(w, h, BRAND_STAGE_WIDTH, BRAND_STAGE_HEIGHT, focal);
    pipeline.extract(rect);
  }

  if (DRY_RUN) {
    const cropInfo = rect
      ? `crop left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`
      : `crop auto position=${position}`;
    console.log(
      "DRY:",
      `${path.relative(root, inputPath)} -> ${path.relative(root, outputPath)}`,
      `source ${dimNote} | ${cropInfo} | out ${BRAND_STAGE_WIDTH}×${BRAND_STAGE_HEIGHT}`,
    );
    return;
  }

  await pipeline
    .resize(BRAND_STAGE_WIDTH, BRAND_STAGE_HEIGHT, {
      fit: useFocal ? "fill" : "cover",
      position,
      withoutEnlargement: false,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(outputPath);

  const out = statSync(outputPath);
  const kb = (out.size / 1024).toFixed(1);
  console.log(
    "OK:",
    path.relative(root, outputPath),
    `(${kb} KB) stage ${BRAND_STAGE_WIDTH}×${BRAND_STAGE_HEIGHT}, source ${dimNote}`,
  );
}

let failed = false;
const brandStageVariants = loadBrandStageVariants();

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

for (const { input, output, position, focal } of brandStageVariants) {
  const src = path.join(heroDir, input);
  if (!existsSync(src)) {
    console.log("Skip stage (source absente) :", path.relative(root, src));
    continue;
  }
  try {
    await buildBrandStageVariant(input, output, position, focal);
  } catch (e) {
    console.error("Échec stage", output, ":", e instanceof Error ? e.message : e);
    failed = true;
  }
}

if (failed) process.exit(1);

const brandPosterPng = path.join(heroDir, "brand-poster.png");
const ogOut = path.join(ogDir, "paye-ta-graille-share.webp");
if (existsSync(brandPosterPng)) {
  try {
    if (DRY_RUN) {
      console.log(
        "DRY:",
        `${path.relative(root, brandPosterPng)} -> ${path.relative(root, ogOut)}`,
        `Open Graph ${OG_WIDTH}×${OG_HEIGHT}, cover top, WebP q=${WEBP_QUALITY}`,
      );
      process.exit(0);
    }
    mkdirSync(ogDir, { recursive: true });
    await sharp(brandPosterPng)
      .rotate()
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "top" })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(ogOut);
    const out = statSync(ogOut);
    const kb = (out.size / 1024).toFixed(1);
    console.log(
      "OK:",
      path.relative(root, ogOut),
      `(${kb} KB) Open Graph ${OG_WIDTH}×${OG_HEIGHT}, cover top depuis brand-poster.png`,
    );
  } catch (e) {
    console.error("Échec OG share :", e instanceof Error ? e.message : e);
    process.exit(1);
  }
} else {
  console.log("Skip OG :", path.relative(root, brandPosterPng), "(PNG absent)");
}
