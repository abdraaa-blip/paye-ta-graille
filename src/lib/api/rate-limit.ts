import { jsonRateLimited } from "@/lib/api/errors";
import type { NextResponse } from "next/server";

/**
 * Fenêtre glissante en mémoire par clé (ex. `${userId}:discover`).
 * Suffisant comme première ligne de défense sur une instance ; en serverless multi-instance,
 * prévoir Redis / Upstash pour un plafond global fiable.
 */
const buckets = new Map<string, number[]>();

function prune(ts: number[], windowMs: number, now: number): number[] {
  return ts.filter((t) => now - t < windowMs);
}

/**
 * @returns `null` si la requête est autorisée, sinon une réponse 429.
 */
export function consumeRateLimit(
  key: string,
  max: number,
  windowMs: number,
  message = "Trop de requêtes. Réessaie dans un instant.",
): NextResponse | null {
  const now = Date.now();
  const prev = buckets.get(key) ?? [];
  const pruned = prune(prev, windowMs, now);
  if (pruned.length >= max) {
    const retryAfterSec = Math.max(1, Math.ceil(windowMs / 1000));
    return jsonRateLimited(message, retryAfterSec);
  }
  pruned.push(now);
  buckets.set(key, pruned);
  return null;
}

export function rateLimitForUser(
  userId: string,
  routeKey: string,
  max: number,
  windowMs: number,
  message?: string,
): NextResponse | null {
  return consumeRateLimit(`${userId}:${routeKey}`, max, windowMs, message);
}
