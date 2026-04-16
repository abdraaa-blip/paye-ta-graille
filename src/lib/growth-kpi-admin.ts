import { createHash, timingSafeEqual } from "node:crypto";

/**
 * UUIDs autorisés à voir `/interne/croissance` et l’API KPI (sans secret).
 * Délimités par virgule ou espace.
 */
export function parseGrowthKpiAdminUserIds(): string[] {
  const raw = process.env.PTG_GROWTH_ADMIN_USER_IDS?.trim();
  if (!raw) return [];
  return raw.split(/[\s,]+/).filter(Boolean);
}

export function isGrowthKpiAdminUser(userId: string): boolean {
  return parseGrowthKpiAdminUserIds().includes(userId);
}

export function growthKpiSecretConfigured(): boolean {
  return Boolean(process.env.PTG_GROWTH_KPI_SECRET?.trim());
}

export function growthKpiAuthConfigured(): boolean {
  return growthKpiSecretConfigured() || parseGrowthKpiAdminUserIds().length > 0;
}

/**
 * Compare le secret en temps constant (évite timing leak sur le header).
 */
export function isValidGrowthKpiSecret(provided: string | null | undefined): boolean {
  const expected = process.env.PTG_GROWTH_KPI_SECRET?.trim();
  if (!expected || provided === null || provided === undefined) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(String(provided).trim(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Clé stable pour rate-limit API quand l’auth passe par secret (sans user id). */
export function growthKpiSecretRateLimitKey(secret: string): string {
  return createHash("sha256").update(secret, "utf8").digest("hex").slice(0, 16);
}
