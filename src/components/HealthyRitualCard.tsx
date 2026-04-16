"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackGrowthEvent } from "@/lib/growth-events";

type Props = {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function HealthyRitualCard({ title, body, ctaHref = "/decouvrir", ctaLabel = "Voir autour de moi" }: Props) {
  const hour = new Date().getHours();
  const inEveningWindow = hour >= 17 && hour <= 22;

  useEffect(() => {
    if (!inEveningWindow) return;
    void trackGrowthEvent({ event: "ritual_card_seen", context: ctaHref });
  }, [inEveningWindow, ctaHref]);

  if (!inEveningWindow) return null;

  return (
    <aside className="ptg-surface ptg-surface--static ptg-ritual-card ptg-scene-card ptg-card" style={{ margin: "0.75rem 0 1rem" }}>
      <p className="ptg-card-title">{title}</p>
      <p className="ptg-type-body" style={{ margin: "0.45rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
        {body}
      </p>
      <p style={{ margin: "0.65rem 0 0" }}>
        <Link
          href={ctaHref}
          className="ptg-btn-secondary ptg-btn-secondary--compact"
          onClick={() => void trackGrowthEvent({ event: "ritual_card_click", context: ctaHref })}
        >
          {ctaLabel}
        </Link>
      </p>
    </aside>
  );
}
