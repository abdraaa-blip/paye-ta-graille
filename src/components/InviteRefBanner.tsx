"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GROWTH_INVITE_JOURNEY, GROWTH_INVITE_LANDING_BANNER } from "@/lib/growth-copy";
import {
  clearStoredInviteToken,
  hydrateInviteAttributionFromCookies,
  persistInviteRefFromUrl,
  persistInviteTokenFromUrl,
  syncInviteAttributionCookiesFromStorage,
} from "@/lib/invite-attribution";

/** Carte de parcours si l’URL contient `invite_ref=friend_*` (lien d’invitation). */
export function InviteRefBanner() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("invite_ref")?.trim() ?? "";
  const invRaw = searchParams.get("inv")?.trim() ?? "";

  useEffect(() => {
    hydrateInviteAttributionFromCookies();
    persistInviteRefFromUrl(raw || null);
    if (invRaw) persistInviteTokenFromUrl(invRaw);
    else if (raw.startsWith("friend_")) clearStoredInviteToken();
    syncInviteAttributionCookiesFromStorage();
  }, [raw, invRaw]);

  if (!raw.startsWith("friend_")) return null;
  return (
    <aside className="ptg-invite-ref-card ptg-surface ptg-surface--static" role="note" style={{ marginBottom: "1.15rem" }}>
      <p className="ptg-invite-ref-card__headline">{GROWTH_INVITE_JOURNEY.headline}</p>
      <p className="ptg-type-body" style={{ margin: "0.35rem 0 0.65rem", fontSize: "var(--ptg-text-ui-sm)" }}>
        {GROWTH_INVITE_LANDING_BANNER}
      </p>
      <ol className="ptg-invite-ref-card__steps">
        {GROWTH_INVITE_JOURNEY.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p className="ptg-type-body" style={{ margin: "0.65rem 0 0", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
        {GROWTH_INVITE_JOURNEY.foot}
      </p>
    </aside>
  );
}
