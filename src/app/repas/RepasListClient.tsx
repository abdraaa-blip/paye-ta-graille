"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { AppNav } from "@/components/AppNav";
import { InviteFriendCard } from "@/components/InviteFriendCard";
import { NextActionCard } from "@/components/NextActionCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { trackGrowthEvent } from "@/lib/growth-events";
import { mealStatusLabel } from "@/lib/meal-status-labels";
import { UX_REPAS } from "@/lib/ux-copy";
import { getUxVariant } from "@/lib/ux-variant";

type Venue = {
  id: string;
  name: string;
  address: string | null;
};

type MealRow = {
  id: string;
  status: string;
  host_user_id: string;
  guest_user_id: string | null;
  format?: string | null;
  window_start: string | null;
  budget_band: string | null;
  updated_at: string;
  venues: Venue[] | null;
};

export function RepasListClient() {
  const [meals, setMeals] = useState<MealRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [busy, setBusy] = useState(true);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    setErrorStatus(null);
    const res = await fetch("/api/meals");
    if (!res.ok) {
      setMeals(null);
      setErrorStatus(res.status);
      setError((await readApiError(res)).message);
      setBusy(false);
      return;
    }
    const json = (await res.json()) as { meals?: MealRow[] };
    setMeals(json.meals ?? []);
    setBusy(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const hour = new Date().getHours();
  const eveningWindow = hour >= 17 && hour <= 22;
  const uxVariant = getUxVariant();

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
        <AppNav />
        <div className="ptg-page-head">
          <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
            Mes repas
          </h1>
          <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
          <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
            Demandes, confirmations et rendez-vous.
          </p>
        </div>
        <NextActionCard
          title={UX_REPAS.nextActionTitle}
          body={UX_REPAS.nextActionBody}
          ctaHref="/decouvrir"
          ctaLabel="Retourner sur Decouvrir"
          ctaClassName="ptg-btn-secondary"
          eventContext="repas_next_action"
          eventMetadata={{ variant: uxVariant }}
        />

        {busy && (
          <p className="ptg-type-body" style={{ margin: "0 0 1rem" }} aria-live="polite">
            On récupère tes tables…
          </p>
        )}

        {!busy && (
          <button
            type="button"
            className="ptg-btn-ghost"
            style={{ marginBottom: "1rem" }}
            onClick={() => {
              void trackGrowthEvent({ event: "repas_refresh_click", context: "repas_list" });
              void load();
            }}
          >
            {meals !== null && !error ? UX_REPAS.refresh : UX_REPAS.retry}
          </button>
        )}

        {error && (
          <p className="ptg-banner ptg-banner-warn" role="alert">
            {error}
          </p>
        )}
        {errorStatus === 401 && (
          <p className="ptg-type-body" style={{ marginTop: "0.5rem", fontSize: "var(--ptg-text-ui-sm)" }}>
            <Link href="/auth" style={{ fontWeight: 600 }}>
              {UX_REPAS.connect}
            </Link>
          </p>
        )}

        {meals && meals.length === 0 && !error && (
          <div className="ptg-surface ptg-surface--static ptg-card--xl">
            <p style={{ margin: 0, color: "var(--ptg-text-muted)" }}>{UX_REPAS.empty}</p>
            {eveningWindow && (
              <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
                {UX_REPAS.eveningHint}
              </p>
            )}
            <p style={{ margin: "0.75rem 0 0" }}>
              <Link href="/decouvrir">{UX_REPAS.emptyCta}</Link>
            </p>
          </div>
        )}

        {meals && meals.length > 0 && (
          <ul className="ptg-list-plain ptg-list-plain--snug">
            <li className="ptg-banner ptg-reward-banner" aria-live="polite">
              <strong>{UX_REPAS.emotionWinTitle}</strong> {UX_REPAS.emotionWinBody}
            </li>
            {meals.map((m) => {
              const v = m.venues?.[0];
              return (
                <li key={m.id}>
                  <Link
                    href={`/repas/${m.id}`}
                    className="ptg-surface ptg-card"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{mealStatusLabel(m.status)}</span>
                    {m.format === "group" && (
                      <span
                        style={{
                          display: "inline-block",
                          marginLeft: "0.35rem",
                          fontSize: "var(--ptg-text-2xs)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          color: "var(--ptg-accent)",
                        }}
                      >
                        {UX_REPAS.groupBadge}
                      </span>
                    )}
                    {v?.name && (
                      <span style={{ display: "block", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
                        {v.name}
                      </span>
                    )}
                    <span style={{ display: "block", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)", marginTop: "0.35rem" }}>
                      {UX_REPAS.updated} {new Date(m.updated_at).toLocaleString("fr-FR")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {meals && <InviteFriendCard source="repas" />}

        <p style={{ marginTop: "1.25rem" }}>
          <Link href="/accueil" className="ptg-link-back" style={{ marginBottom: 0 }}>
            ← {UX_REPAS.backAccueil}
          </Link>
        </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
