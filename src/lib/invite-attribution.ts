/**
 * Attribution des liens d’invitation (`/commencer?ref=friend_*` → `invite_ref` sur auth/onboarding).
 * Stockage session : survit à la redirection, un seul événement `invite_attribution` après login fiable.
 */

export const PTG_INVITE_REF_STORAGE_KEY = "ptg_invite_ref";
export const PTG_INVITE_TOKEN_STORAGE_KEY = "ptg_invite_token";
export const PTG_INVITE_ATTR_SENT_KEY = "ptg_invite_attr_sent";

const COOKIE_REF = "ptg_invite_ref";
const COOKIE_INV = "ptg_invite_inv";
/** Cookies de secours (nouvel onglet, navigation sans query) — pas httpOnly, même menace XSS que sessionStorage. */
const COOKIE_MAX_AGE_SEC = 14 * 24 * 60 * 60;
const INV_COOKIE_MAX_LEN = 4090;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const needle = `${name}=`;
  const parts = document.cookie.split("; ");
  for (const p of parts) {
    if (p.startsWith(needle)) {
      try {
        return decodeURIComponent(p.slice(needle.length));
      } catch {
        return p.slice(needle.length);
      }
    }
  }
  return null;
}

function cookieBaseAttrs(): string {
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  return `path=/; max-age=${COOKIE_MAX_AGE_SEC}; samesite=lax${secure ? "; secure" : ""}`;
}

function cookieEraseAttrs(): string {
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  return `path=/; max-age=0${secure ? "; secure" : ""}`;
}

/** Restaure ref / jeton depuis les cookies si sessionStorage est vide (ex. autre onglet). */
export function hydrateInviteAttributionFromCookies(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(PTG_INVITE_ATTR_SENT_KEY) === "1") return;
    const cRef = readCookie(COOKIE_REF)?.trim() ?? "";
    const cInv = readCookie(COOKIE_INV)?.trim() ?? "";
    if (cRef.startsWith("friend_") && !sessionStorage.getItem(PTG_INVITE_REF_STORAGE_KEY)) {
      sessionStorage.setItem(PTG_INVITE_REF_STORAGE_KEY, cRef);
    }
    if (cInv.length >= 24 && !sessionStorage.getItem(PTG_INVITE_TOKEN_STORAGE_KEY)) {
      sessionStorage.setItem(PTG_INVITE_TOKEN_STORAGE_KEY, cInv);
    }
  } catch {
    /* */
  }
}

/** Aligne les cookies sur sessionStorage (après mise à jour depuis l’URL). */
export function syncInviteAttributionCookiesFromStorage(): void {
  if (typeof document === "undefined") return;
  try {
    if (sessionStorage.getItem(PTG_INVITE_ATTR_SENT_KEY) === "1") return;
    const ref = sessionStorage.getItem(PTG_INVITE_REF_STORAGE_KEY)?.trim() ?? "";
    const inv = sessionStorage.getItem(PTG_INVITE_TOKEN_STORAGE_KEY)?.trim() ?? "";
    if (ref.startsWith("friend_")) {
      document.cookie = `${COOKIE_REF}=${encodeURIComponent(ref)}; ${cookieBaseAttrs()}`;
    } else {
      document.cookie = `${COOKIE_REF}=; ${cookieEraseAttrs()}`;
    }
    if (inv.length >= 24 && inv.length <= INV_COOKIE_MAX_LEN) {
      document.cookie = `${COOKIE_INV}=${encodeURIComponent(inv)}; ${cookieBaseAttrs()}`;
    } else {
      document.cookie = `${COOKIE_INV}=; ${cookieEraseAttrs()}`;
    }
  } catch {
    /* */
  }
}

export function clearInviteAttributionCookies(): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${COOKIE_REF}=; ${cookieEraseAttrs()}`;
    document.cookie = `${COOKIE_INV}=; ${cookieEraseAttrs()}`;
  } catch {
    /* */
  }
}

export function persistInviteRefFromUrl(inviteRef: string | null | undefined): void {
  if (typeof window === "undefined") return;
  const v = inviteRef?.trim() ?? "";
  if (!v.startsWith("friend_")) return;
  try {
    sessionStorage.setItem(PTG_INVITE_REF_STORAGE_KEY, v);
  } catch {
    /* quota / private mode */
  }
}

/** Jeton signé `inv=` (inviteur) — conservé avec invite_ref pour attribution serveur. */
export function persistInviteTokenFromUrl(invToken: string | null | undefined): void {
  if (typeof window === "undefined") return;
  const v = invToken?.trim() ?? "";
  if (v.length < 24 || v.length > 4800) return;
  try {
    sessionStorage.setItem(PTG_INVITE_TOKEN_STORAGE_KEY, v);
  } catch {
    /* */
  }
}

/** Si l’URL n’a pas `inv=`, on retire un jeton résiduel (autre lien d’invitation). */
export function clearStoredInviteToken(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PTG_INVITE_TOKEN_STORAGE_KEY);
  } catch {
    /* */
  }
}

export function peekInviteRefForAttribution(): string | null {
  if (typeof window === "undefined") return null;
  try {
    if (sessionStorage.getItem(PTG_INVITE_ATTR_SENT_KEY) === "1") return null;
    const ref = sessionStorage.getItem(PTG_INVITE_REF_STORAGE_KEY)?.trim() ?? "";
    return ref.startsWith("friend_") ? ref : null;
  } catch {
    return null;
  }
}

export function peekInviteTokenForAttribution(): string | null {
  if (typeof window === "undefined") return null;
  try {
    if (sessionStorage.getItem(PTG_INVITE_ATTR_SENT_KEY) === "1") return null;
    const t = sessionStorage.getItem(PTG_INVITE_TOKEN_STORAGE_KEY)?.trim() ?? "";
    return t.length >= 24 ? t : null;
  } catch {
    return null;
  }
}

export function clearInviteAttributionState(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PTG_INVITE_ATTR_SENT_KEY, "1");
    sessionStorage.removeItem(PTG_INVITE_REF_STORAGE_KEY);
    sessionStorage.removeItem(PTG_INVITE_TOKEN_STORAGE_KEY);
    clearInviteAttributionCookies();
  } catch {
    /* */
  }
}

/**
 * Magic link : reprend ref / jeton (sessionStorage + cookies) et les ajoute à l’URL de callback
 * pour restauration cross-appareil après `/auth/callback` (cookies posés côté serveur).
 */
export function withInviteParamsOnAuthCallbackUrl(callbackUrl: string): string {
  if (typeof window === "undefined") return callbackUrl;
  hydrateInviteAttributionFromCookies();
  const ref = peekInviteRefForAttribution();
  const inv = peekInviteTokenForAttribution();
  if (!ref && !inv) return callbackUrl;
  try {
    const u = new URL(callbackUrl);
    if (ref) u.searchParams.set("invite_ref", ref);
    if (inv && inv.length <= INV_COOKIE_MAX_LEN) u.searchParams.set("inv", inv);
    return u.toString();
  } catch {
    return callbackUrl;
  }
}
