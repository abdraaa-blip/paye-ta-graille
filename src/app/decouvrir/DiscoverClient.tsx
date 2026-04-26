"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AppNav } from "@/components/AppNav";
import { HealthyRitualCard } from "@/components/HealthyRitualCard";
import { InviteFriendCard } from "@/components/InviteFriendCard";
import { MarketingPulseLine } from "@/components/MarketingPulseLine";
import { NextActionCard } from "@/components/NextActionCard";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { trackGrowthEvent } from "@/lib/growth-events";
import { SurpriseGrailleCard } from "@/components/SurpriseGrailleCard";
import { readApiError } from "@/lib/api/read-api-error";
import { AuthPromptLink } from "@/components/AuthPromptLink";
import { displayInitials } from "@/lib/display-initials";
import { mealIntentLabel, socialIntentLabel } from "@/lib/intent-labels";
import { surpriseGrailleEnabled } from "@/lib/feature-modules";
import { GROWTH_DISCOVER_KICKER } from "@/lib/growth-copy";
import { MARKETING_TAGLINE_GOLDEN } from "@/lib/marketing-copy";
import { MARKETING_DISCOVER_PULSE_LINES } from "@/lib/marketing-copy";
import { UX_ACCUEIL, UX_BACK, UX_DISCOVER } from "@/lib/ux-copy";

type Profile = {
  id: string;
  display_name: string;
  photo_url: string | null;
  city: string | null;
  social_intent: string;
  meal_intent: string;
  radius_km: number;
};

type MealFilter = "all" | "invite" | "partage" | "etre_invite";
type SocialFilter = "all" | "ami" | "ouvert" | "dating_leger";

export function DiscoverClient() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<ReactNode>(null);
  const [busy, setBusy] = useState(true);
  const [mealFilter, setMealFilter] = useState<MealFilter>("all");
  const [socialFilter, setSocialFilter] = useState<SocialFilter>("all");

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    setHint(null);
    const res = await fetch("/api/discover?limit=24");
    if (!res.ok) {
      setProfiles(null);
      const { code, message } = await readApiError(res);
      const raw = message;
      if (code === "unauthorized" || code === "rate_limited") {
        setError(raw);
      } else if (code === "rpc_missing" || code === "service_unavailable") {
        setError(UX_DISCOVER.errorListUnavailable);
      } else {
        setError(UX_DISCOVER.errorGeneric);
      }
      if (code === "unauthorized") {
        setHint(
          <>
            {UX_DISCOVER.hintLogin}{" "}
            <AuthPromptLink>{UX_DISCOVER.linkLogin}</AuthPromptLink>
          </>,
        );
      }
      if (code === "rpc_missing" || code === "service_unavailable") {
        setHint(UX_DISCOVER.hintListRetry);
      }
      if (code === "rate_limited") {
        setHint(UX_DISCOVER.hintRateLimited);
      }
      setBusy(false);
      return;
    }
    const json = (await res.json()) as { profiles?: Profile[] };
    const list = json.profiles ?? [];
    setProfiles(list);
    void trackGrowthEvent({
      event: "discover_viewed",
      context: "decouvrir",
      metadata: { profile_count: list.length },
    });
    if (list.length === 0) {
      setHint(
        <>
          {UX_DISCOVER.hintEmpty}{" "}
          <span style={{ display: "block", marginTop: "0.5rem", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
            {UX_DISCOVER.hintEmptyTips}
          </span>
          <span style={{ display: "block", marginTop: "0.5rem" }}>
            <Link href="/profil" style={{ fontWeight: 600 }}>
              {UX_ACCUEIL.editProfile}
            </Link>
            {" · "}
            <Link href="/accueil" style={{ fontWeight: 600 }}>
              {UX_BACK.appAccueilShort}
            </Link>
          </span>
        </>,
      );
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const displayedProfiles = useMemo(() => {
    if (!profiles?.length) return [];
    return profiles.filter((p) => {
      if (mealFilter !== "all" && p.meal_intent !== mealFilter) return false;
      if (socialFilter !== "all" && p.social_intent !== socialFilter) return false;
      return true;
    });
  }, [profiles, mealFilter, socialFilter]);

  const listReady = profiles !== null && !error;
  const filtersActive = mealFilter !== "all" || socialFilter !== "all";
  const filterExcludesAll =
    listReady && profiles !== null && profiles.length > 0 && displayedProfiles.length === 0 && filtersActive;

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner ptg-scene ptg-scene--discover">
        <AppNav current="decouvrir" />
        <PtgMenuCard variant="spark" stamp="Autour de toi">
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_DISCOVER.title}
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 0.85rem" }} />
            <MarketingPulseLine lines={MARKETING_DISCOVER_PULSE_LINES} intervalMs={7200} className="ptg-accueil-pulse" />
            <p className="ptg-type-body" style={{ margin: "0 0 0.45rem", fontSize: "var(--ptg-text-sm)", maxWidth: "none" }}>
              {UX_DISCOVER.subtitle}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", maxWidth: "none" }}>
              {UX_DISCOVER.intro}
            </p>
            <p
              className="ptg-type-body"
              style={{
                margin: "0 0 0",
                fontSize: "var(--ptg-text-md-sm)",
                fontWeight: 700,
                lineHeight: 1.35,
                color: "var(--ptg-emotion-surprise)",
              }}
            >
              {GROWTH_DISCOVER_KICKER}
            </p>
            <p
              className="ptg-type-body"
              style={{
                margin: "0.5rem 0 0",
                fontSize: "var(--ptg-text-sm)",
                fontWeight: 600,
                lineHeight: 1.4,
                color: "var(--ptg-accent-deep)",
              }}
            >
              {MARKETING_TAGLINE_GOLDEN}
            </p>
          </div>
        </PtgMenuCard>
        <NextActionCard title={UX_DISCOVER.nextActionTitle} body={UX_DISCOVER.nextActionBody} marginBottom="0.9rem" />
        <HealthyRitualCard title={UX_DISCOVER.ritualTitle} body={UX_DISCOVER.ritualBody} ctaHref="/repas" ctaLabel="Voir mes repas" />
        <InviteFriendCard source="decouvrir" />

        {surpriseGrailleEnabled() && <SurpriseGrailleCard />}

        {busy && (
          <p className="ptg-type-body" style={{ margin: "0 0 1rem" }} aria-live="polite">
            {UX_DISCOVER.loading}
          </p>
        )}

        {!busy && (
          <button
            type="button"
            className="ptg-btn-ghost"
            style={{ marginBottom: "1rem" }}
            disabled={busy}
            onClick={() => void load()}
          >
            {listReady ? UX_DISCOVER.refresh : UX_DISCOVER.retry}
          </button>
        )}

        {error && (
          <p className="ptg-banner ptg-banner-warn" role="alert">
            {error}
          </p>
        )}
        {hint && (
          <p
            className={error ? "ptg-type-body" : "ptg-banner"}
            style={{
              margin: error ? "0.5rem 0 0" : undefined,
              fontSize: error ? "var(--ptg-text-ui-sm)" : undefined,
            }}
          >
            {hint}
          </p>
        )}

        {profiles && profiles.length > 0 && (
          <section className="ptg-scene-block" style={{ marginTop: "1rem" }} aria-labelledby="discover-filters-title">
            <h2 id="discover-filters-title" className="ptg-section-heading ptg-section-heading--signature">
              Filtres
            </h2>
            <p className="ptg-type-body" style={{ margin: "0 0 0.65rem", fontSize: "var(--ptg-text-sm)", maxWidth: "none" }}>
              {UX_DISCOVER.filtersHint}
            </p>
            <p style={{ margin: "0 0 0.35rem", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
              {UX_DISCOVER.filterMeal}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
              {(
                [
                  ["all", "Tout"] as const,
                  ["invite", mealIntentLabel("invite")] as const,
                  ["partage", mealIntentLabel("partage")] as const,
                  ["etre_invite", mealIntentLabel("etre_invite")] as const,
                ] satisfies [MealFilter, string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  className={mealFilter === v ? "ptg-filter-chip ptg-filter-chip--active" : "ptg-filter-chip"}
                  onClick={() => setMealFilter(v)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0 0 0.35rem", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
              {UX_DISCOVER.filterSocial}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.25rem" }}>
              {(
                [
                  ["all", UX_DISCOVER.filterAll] as const,
                  ["ami", socialIntentLabel("ami")] as const,
                  ["ouvert", socialIntentLabel("ouvert")] as const,
                  ["dating_leger", socialIntentLabel("dating_leger")] as const,
                ] satisfies [SocialFilter, string][]
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  className={socialFilter === v ? "ptg-filter-chip ptg-filter-chip--active" : "ptg-filter-chip"}
                  onClick={() => setSocialFilter(v)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
              {displayedProfiles.length} profil{displayedProfiles.length !== 1 ? "s" : ""}
              {filtersActive ? " avec ces critères" : ""}
            </p>
          </section>
        )}

        {filterExcludesAll && (
          <p className="ptg-banner" style={{ marginTop: "0.75rem" }}>
            {UX_DISCOVER.filterNoMatch}
          </p>
        )}

        {displayedProfiles.length > 0 && (
          <Fragment>
            <p
              className="ptg-type-body"
              style={{
                margin: "0.75rem 0 0",
                fontSize: "var(--ptg-text-sm)",
                lineHeight: 1.5,
                color: "var(--ptg-text-muted)",
              }}
            >
              {UX_DISCOVER.proposeContextHint}
            </p>
            <ul className="ptg-profile-list" aria-label="Profils à explorer">
              {displayedProfiles.map((p) => (
                <li key={p.id} className="ptg-surface ptg-scene-card ptg-profile-card ptg-card">
                  <div className="ptg-profile-row">
                    {p.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.photo_url}
                        alt={`Photo de profil, ${p.display_name}`}
                        width={48}
                        height={48}
                        className="ptg-avatar"
                        style={{ objectFit: "cover", padding: 0, background: "transparent" }}
                      />
                    ) : (
                      <span className="ptg-avatar" aria-hidden>
                        {displayInitials(p.display_name)}
                      </span>
                    )}
                    <div className="ptg-profile-row__main">
                      <p style={{ margin: "0 0 0.25rem", fontWeight: 700 }}>{p.display_name}</p>
                      <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
                        {p.city ?? UX_ACCUEIL.cityMissing} · {socialIntentLabel(p.social_intent)} ·{" "}
                        {mealIntentLabel(p.meal_intent)}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                        <Link
                          href={`/repas/nouveau?guest=${encodeURIComponent(p.id)}`}
                          className="ptg-btn-primary"
                          style={{ display: "inline-flex", fontSize: "var(--ptg-text-md-sm)" }}
                          onClick={() => void trackGrowthEvent({ event: "discover_propose_click", context: "discover_list" })}
                        >
                          {UX_DISCOVER.proposeMeal}
                        </Link>
                        <Link href="/signaler" style={{ fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
                          {UX_DISCOVER.report}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Fragment>
        )}

        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/accueil" className="ptg-link-back" style={{ marginBottom: 0 }}>
            {UX_BACK.appAccueil}
          </Link>
        </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
