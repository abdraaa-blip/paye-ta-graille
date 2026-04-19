/**
 * Rend transparents les pixels « mat » clairs (fond type papier / gris bleuté opaque),
 * sans toucher aux couleurs saturées (orange, vert, vapeur).
 * Heuristique : somme RGB élevée + faible écart entre canaux = fond neutre.
 */
import sharp from "sharp";

/**
 * @param {string} pngPath chemin absolu du PNG
 * @param {{ sumMin?: number; spreadMax?: number }} [opts]
 */
export async function knockoutLightMattePng(pngPath, opts = {}) {
  const sumMin = opts.sumMin ?? 615;
  const spreadMax = opts.spreadMax ?? 22;

  const { data, info } = await sharp(pngPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  if (ch < 4) {
    throw new Error(`Canal alpha attendu (4 canaux), obtenu ${ch}`);
  }

  const out = Buffer.from(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch;
      const r = out[i];
      const g = out[i + 1];
      const b = out[i + 2];
      const sum = r + g + b;
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      const spread = mx - mn;
      if (sum >= sumMin && spread <= spreadMax) {
        out[i] = 0;
        out[i + 1] = 0;
        out[i + 2] = 0;
        out[i + 3] = 0;
      }
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(pngPath);
}
