/**
 * Attribution des liens d’invitation (`/commencer?ref=friend_*` → `invite_ref` sur auth/onboarding).
 * Stockage session : survit à la redirection, un seul événement `invite_attribution` après login fiable.
 */

export const PTG_INVITE_REF_STORAGE_KEY = "ptg_invite_ref";
export const PTG_INVITE_ATTR_SENT_KEY = "ptg_invite_attr_sent";

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

export function clearInviteAttributionState(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PTG_INVITE_ATTR_SENT_KEY, "1");
    sessionStorage.removeItem(PTG_INVITE_REF_STORAGE_KEY);
  } catch {
    /* */
  }
}
