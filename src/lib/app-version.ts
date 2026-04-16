import { readFileSync } from "node:fs";
import { join } from "node:path";

let cached: string | null = null;

/** Version `package.json` (lecture disque une fois par instance Node). */
export function getAppVersion(): string {
  if (cached !== null) return cached;
  try {
    const raw = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const pkg = JSON.parse(raw) as { version?: string };
    cached = typeof pkg.version === "string" ? pkg.version : "0.0.0";
  } catch {
    cached = "unknown";
  }
  return cached;
}
