import { createHmac, timingSafeEqual } from "crypto";

/** v1 payload signé pour liens /commencer (inviteur identifiable côté serveur uniquement). */
export type InviteLinkTokenPayloadV1 = {
  v: 1;
  inv: string;
  src: string;
  exp: number;
};

const TTL_DEFAULT_MS = 90 * 24 * 60 * 60 * 1000;

function secret(): string | null {
  const s = process.env.PTG_INVITE_LINK_SECRET?.trim();
  return s && s.length >= 16 ? s : null;
}

/** Jeton `base64url(payload).base64url(hmac)` — null si secret absent ou invalide. */
export function mintInviteLinkToken(inviterUserId: string, source: string, ttlMs = TTL_DEFAULT_MS): string | null {
  const sec = secret();
  if (!sec) return null;
  const exp = Date.now() + ttlMs;
  const src = source.trim().slice(0, 48);
  const payload: InviteLinkTokenPayloadV1 = { v: 1, inv: inviterUserId, src, exp };
  const bodyB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", sec).update(bodyB64).digest("base64url");
  return `${bodyB64}.${sig}`;
}

/** Valide signature + expiration + UUID inviteur. */
export function verifyInviteLinkToken(token: string): InviteLinkTokenPayloadV1 | null {
  const sec = secret();
  if (!sec || !token || token.length > 4800) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;
  const bodyB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", sec).update(bodyB64).digest("base64url");
  let sigBuf: Buffer;
  let expBuf: Buffer;
  try {
    sigBuf = Buffer.from(sig, "base64url");
    expBuf = Buffer.from(expected, "base64url");
  } catch {
    return null;
  }
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<InviteLinkTokenPayloadV1>;
  if (p.v !== 1 || typeof p.inv !== "string" || typeof p.src !== "string" || typeof p.exp !== "number") return null;
  if (p.exp < Date.now()) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.inv)) return null;
  return p as InviteLinkTokenPayloadV1;
}

export function inviteLinkSigningConfigured(): boolean {
  return secret() !== null;
}
