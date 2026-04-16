import { jsonRateLimited } from "@/lib/api/errors";
import type { NextResponse } from "next/server";

/**
 * Fenêtre glissante en mémoire par clé (ex. `${userId}:discover`).
 * Suffisant comme première ligne de défense sur une instance ; en serverless multi-instance,
 * prévoir Redis / Upstash pour un plafond global fiable.
 */
const buckets = new Map<string, number[]>();

const upstashUrl = String(process.env.UPSTASH_REDIS_REST_URL ?? "").trim().replace(/\/$/, "");
const upstashToken = String(process.env.UPSTASH_REDIS_REST_TOKEN ?? "").trim();
const hasUpstash = upstashUrl.length > 0 && upstashToken.length > 0;

function prune(ts: number[], windowMs: number, now: number): number[] {
  return ts.filter((t) => now - t < windowMs);
}

async function consumeDistributedRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<{ limited: boolean; retryAfterSec: number } | null> {
  if (!hasUpstash) return null;

  const resetSec = Math.max(1, Math.ceil(windowMs / 1000));
  const script = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local maxReq = tonumber(ARGV[3])
local member = tostring(now) .. "-" .. tostring(math.random(100000, 999999))

redis.call("ZREMRANGEBYSCORE", key, 0, now - window)
local count = redis.call("ZCARD", key)
if count >= maxReq then
  return {1, math.ceil(window / 1000)}
end
redis.call("ZADD", key, now, member)
redis.call("EXPIRE", key, math.ceil(window / 1000))
return {0, math.ceil(window / 1000)}
`;

  const requestBody = {
    script,
    keys: [`ptg:rl:${key}`],
    args: [Date.now(), windowMs, max],
  };

  try {
    const res = await fetch(`${upstashUrl}/eval`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = (await res.json()) as { result?: unknown };
    const result = Array.isArray(json.result) ? json.result : [];
    const limited = Number(result[0]) === 1;
    const retryAfterSec = Math.max(1, Number(result[1]) || resetSec);
    return { limited, retryAfterSec };
  } catch {
    return null;
  }
}

/**
 * @returns `null` si la requête est autorisée, sinon une réponse 429.
 */
export async function consumeRateLimit(
  key: string,
  max: number,
  windowMs: number,
  message = "Trop de requêtes. Réessaie dans un instant.",
): Promise<NextResponse | null> {
  const distributed = await consumeDistributedRateLimit(key, max, windowMs);
  if (distributed?.limited) {
    return jsonRateLimited(message, distributed.retryAfterSec);
  }
  if (distributed) {
    return null;
  }

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

export async function rateLimitForUser(
  userId: string,
  routeKey: string,
  max: number,
  windowMs: number,
  message?: string,
): Promise<NextResponse | null> {
  return consumeRateLimit(`${userId}:${routeKey}`, max, windowMs, message);
}
