"use client";

import Link from "next/link";
import { trackGrowthEvent } from "@/lib/growth-events";

type Props = {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaClassName?: "ptg-btn-primary" | "ptg-btn-secondary";
  eventContext?: string;
  eventMetadata?: Record<string, unknown>;
  marginBottom?: string;
};

export function NextActionCard({
  title,
  body,
  ctaHref,
  ctaLabel,
  ctaClassName = "ptg-btn-secondary",
  eventContext,
  eventMetadata,
  marginBottom = "1rem",
}: Props) {
  return (
    <div
      className="ptg-surface ptg-surface--static ptg-scene-card ptg-card ptg-next-action-card"
      style={{ marginBottom }}
    >
      <p className="ptg-card-title">{title}</p>
      <p className="ptg-type-body" style={{ margin: "0.35rem 0 0.7rem", fontSize: "var(--ptg-text-ui-sm)" }}>
        {body}
      </p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className={ctaClassName}
          style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)" }}
          onClick={() =>
            void trackGrowthEvent({
              event: "next_action_click",
              context: eventContext ?? "next_action",
              metadata: eventMetadata,
            })
          }
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
