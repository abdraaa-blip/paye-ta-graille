import type { NextResponse } from "next/server";

/** Aligné sur `invite-attribution.ts` (cookies de secours, 14 j). */
export const PTG_INVITE_COOKIE_MAX_AGE_SEC = 14 * 24 * 60 * 60;
export const PTG_INVITE_INV_COOKIE_MAX_LEN = 4090;
const INVITE_REF_MAX_LEN = 160;

type InviteCookieOpts = {
  path: string;
  maxAge: number;
  sameSite: "lax";
  secure: boolean;
  httpOnly: false;
};

function inviteCookieOpts(secure: boolean): InviteCookieOpts {
  return {
    path: "/",
    maxAge: PTG_INVITE_COOKIE_MAX_AGE_SEC,
    sameSite: "lax",
    secure,
    httpOnly: false,
  };
}

/**
 * Pose / retire les cookies d’attribution si l’URL du callback les contient (magic link cross-appareil).
 * Clé présente avec valeur invalide → suppression (même logique que le client).
 */
export function applyInviteAttributionCookiesFromCallbackUrl(
  response: NextResponse,
  url: URL,
  secure: boolean,
): void {
  const opts = inviteCookieOpts(secure);
  if (url.searchParams.has("invite_ref")) {
    const refRaw = url.searchParams.get("invite_ref")?.trim() ?? "";
    if (refRaw.startsWith("friend_") && refRaw.length <= INVITE_REF_MAX_LEN) {
      response.cookies.set("ptg_invite_ref", refRaw, opts);
    } else {
      response.cookies.delete("ptg_invite_ref");
    }
  }
  if (url.searchParams.has("inv")) {
    const invRaw = url.searchParams.get("inv")?.trim() ?? "";
    if (invRaw.length >= 24 && invRaw.length <= PTG_INVITE_INV_COOKIE_MAX_LEN) {
      response.cookies.set("ptg_invite_inv", invRaw, opts);
    } else {
      response.cookies.delete("ptg_invite_inv");
    }
  }
}
