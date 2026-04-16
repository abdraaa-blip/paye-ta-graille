"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GROWTH_INVITE_LANDING_BANNER } from "@/lib/growth-copy";
import { persistInviteRefFromUrl } from "@/lib/invite-attribution";

/** Bandeau discret si l’URL contient `invite_ref=friend_*` (lien d’invitation). */
export function InviteRefBanner() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("invite_ref")?.trim() ?? "";

  useEffect(() => {
    persistInviteRefFromUrl(raw || null);
  }, [raw]);

  if (!raw.startsWith("friend_")) return null;
  return (
    <p className="ptg-banner" role="note" style={{ marginBottom: "1rem" }}>
      {GROWTH_INVITE_LANDING_BANNER}
    </p>
  );
}
