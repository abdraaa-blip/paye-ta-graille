"use client";

import { useCallback, useRef, useState } from "react";
import { trackGrowthEvent } from "@/lib/growth-events";
import { GROWTH_INVITE_CARD, GROWTH_INVITE_CARD_FOLLOWUP, GROWTH_INVITE_SHARE_TEXT } from "@/lib/growth-copy";
import type { InviteFriendSource } from "@/lib/invite-friend-sources";

export type { InviteFriendSource };

type Props = {
  source: InviteFriendSource;
  title?: string;
  body?: string;
};

function originBase(): string {
  if (typeof window === "undefined") return "https://paye-ta-graille.app";
  return window.location.origin;
}

export function InviteFriendCard({
  source,
  title = GROWTH_INVITE_CARD.title,
  body = GROWTH_INVITE_CARD.body,
}: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const tokenOnce = useRef<Promise<string | null> | null>(null);
  const shareText = GROWTH_INVITE_SHARE_TEXT;

  const resolveSignedToken = useCallback((): Promise<string | null> => {
    if (!tokenOnce.current) {
      tokenOnce.current = (async () => {
        try {
          const res = await fetch(`/api/invite/link-token?source=${encodeURIComponent(source)}`, {
            cache: "no-store",
          });
          if (!res.ok) return null;
          const j = (await res.json()) as { token?: string | null };
          return typeof j.token === "string" && j.token.length >= 24 ? j.token : null;
        } catch {
          return null;
        }
      })();
    }
    return tokenOnce.current;
  }, [source]);

  const buildShareUrl = useCallback(
    async (signed: string | null) => {
      const base = `${originBase()}/commencer?ref=friend_${source}`;
      if (signed) return `${base}&inv=${encodeURIComponent(signed)}`;
      return base;
    },
    [source],
  );

  async function copyLink() {
    try {
      const signed = await resolveSignedToken();
      const shareUrl = await buildShareUrl(signed);
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Lien copié.");
      await trackGrowthEvent({ event: "invite_link_copied", context: source });
    } catch {
      setStatus("Impossible de copier pour l\u2019instant.");
    }
  }

  async function nativeShare() {
    await trackGrowthEvent({ event: "invite_share_opened", context: source });
    const signed = await resolveSignedToken();
    const shareUrl = await buildShareUrl(signed);
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
      <p className="ptg-type-body" style={{ margin: "0.65rem 0 0", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
        {GROWTH_INVITE_CARD_FOLLOWUP}
      </p>
    </aside>
  );
}
