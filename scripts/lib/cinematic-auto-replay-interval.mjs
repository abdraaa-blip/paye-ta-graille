/** Aligné sur `isNegativePublicFlag` (`src/lib/env-public.ts`). */
const NEGATIVE = new Set(["0", "false", "off", "no"]);

/**
 * @param {string | undefined} raw
 * @returns {number | null} secondes entre deux rejouages, ou `null` si désactivé
 */
export function parseCinematicAutoReplayIntervalSec(raw) {
  const trimmed = typeof raw === "string" ? raw.trim() : undefined;
  if (trimmed === undefined || trimmed === "") return 60;
  if (NEGATIVE.has(trimmed.toLowerCase())) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.max(n, 30), 600);
}
