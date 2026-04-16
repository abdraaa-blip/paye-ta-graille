/**
 * Supprime `.next` (cache de build Next). Utile si build incohérent / ENOENT sur des routes existantes.
 * Usage : `npm run clean:next` ou `npm run build:clean`
 */
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(process.cwd(), ".next");
rmSync(dir, { recursive: true, force: true });
console.log("Removed .next");
