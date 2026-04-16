"use client";

import { useMemo, useState } from "react";
import { trackGrowthEvent } from "@/lib/growth-events";
import { GROWTH_INVITE_CARD, GROWTH_INVITE_SHARE_TEXT } from "@/lib/growth-copy";

type Props = {
  source: "accueil" | "decouvrir" | "repas";
  title?: string;
  body?: string;
};

export function InviteFriendCard({
  source,
  title = GROWTH_INVITE_CARD.title,
  body = GROWTH_INVITE_CARD.body,
}: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://paye-ta-graille.app/commencer";
    return `${window.location.origin}/commencer?ref=friend_${source}`;
  }, [source]);
  const shareText = GROWTH_INVITE_SHARE_TEXT;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Lien copié.");
      await trackGrowthEvent({ event: "invite_link_copied", context: source });
    } catch {
      setStatus("Impossible de copier pour l\u2019instant.");
    }
  }

  async function nativeShare() {
    await trackGrowthEvent({ event: "invite_share_opened", context: source });
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Paye ta graille", text: shareText, url: shareUrl });
        setStatus("Invitation envoyée.");
        await trackGrowthEvent({ event: "invite_native_shared", context: source });
        return;
      } catch {
        // fallback copy below
      }
    }
    await copyLink();
  }

  return (
    <aside className="ptg-surface ptg-surface--static ptg-scene-card ptg-card" style={{ margin: "0.75rem 0 1rem" }}>
      <p className="ptg-card-title">{title}</p>
      <p className="ptg-type-body" style={{ margin: "0.4rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
        {body}
      </p>
      <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginTop: "0.7rem" }}>
        <button type="button" className="ptg-btn-primary ptg-btn-primary--compact" onClick={() => void nativeShare()}>
          Inviter
        </button>
        <button type="button" className="ptg-btn-secondary ptg-btn-secondary--compact" onClick={() => void copyLink()}>
          Copier le lien
        </button>
      </div>
      {status && (
        <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-sm)" }} role="status">
          {status}
        </p>
      )}
    </aside>
  );
}
