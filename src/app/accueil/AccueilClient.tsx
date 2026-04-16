"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { AppNav } from "@/components/AppNav";
import { HealthyRitualCard } from "@/components/HealthyRitualCard";
import { InviteFriendCard } from "@/components/InviteFriendCard";
import { MarketingPulseLine } from "@/components/MarketingPulseLine";
import { NextActionCard } from "@/components/NextActionCard";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { mealIntentLabel, socialIntentLabel } from "@/lib/intent-labels";
import { tagDisplayLabel } from "@/lib/tag-options";
import {
  MARKETING_APP_PULSE_LINES,
  MARKETING_CORE_PROMISE,
  MARKETING_KEY_CHOICE_OR_SURPRISE,
  MARKETING_TAGLINE_GOLDEN,
} from "@/lib/marketing-copy";
import { UX_ACCUEIL, UX_FOOTER, UX_LOADING } from "@/lib/ux-copy";
import { clearProfileDraft, loadProfileDraft, type ProfileDraft } from "@/lib/profile-draft";
import { extensionsNavVisible } from "@/lib/feature-modules";
import { GROWTH_ACCUEIL_HOOKS, GROWTH_CTA_INVITE_EAT } from "@/lib/growth-copy";
import { trackGrowthEvent } from "@/lib/growth-events";
import { getUxVariant } from "@/lib/ux-variant";

type ServerProfile = {
  display_name: string;
  city: string | null;
  radius_km: number;
  social_intent: string;
  meal_intent: string;
  meal_with_preference?: string;
};

export function AccueilClient() {
  const [draft, setDraft] = useState<ProfileDraft | null | undefined>(undefined);
  const [session, setSession] = useState<"unknown" | "out" | "in">("unknown");
  const [serverProfile, setServerProfile] = useState<ServerProfile | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [syncBusy, setSyncBusy] = useState(false);

  const accueilHook = useMemo(() => {
    const d = new Date();
    const i = (d.getDate() + d.getMonth() * 31) % GROWTH_ACCUEIL_HOOKS.length;
    return GROWTH_ACCUEIL_HOOKS[i];
  }, []);
  const uxVariant = useMemo(() => getUxVariant(), []);

  const refreshServer = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      setSession("out");
      setServerProfile(null);
      return;
    }
    if (!res.ok) {
      setSession("unknown");
      return;
    }
    setSession("in");
    const json = (await res.json()) as { profile: ServerProfile };
    setServerProfile(json.profile);
  }, []);

  useEffect(() => {
    setDraft(loadProfileDraft());
    void refreshServer();
    void trackGrowthEvent({ event: "accueil_viewed", context: "accueil", metadata: { variant: uxVariant } });
  }, [refreshServer, uxVariant]);

  async function syncDraftToServer() {
    const d = loadProfileDraft();
    if (!d) return;
    setSyncBusy(true);
    setSyncMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: d.displayName,
        city: d.city,
        radius_km: d.radiusKm,
        social_intent: d.socialIntent,
        meal_intent: d.mealIntent,
        meal_with_preference: d.mealWithPreference,
        tags: d.tags,
      }),
    });
    setSyncBusy(false);
    if (!res.ok) {
      setSyncMsg((await readApiError(res)).message);
      return;
    }
    const json = (await res.json()) as { profile?: ServerProfile };
    setSyncMsg(UX_ACCUEIL.draftSyncOk);
    setServerProfile(json.profile ?? null);
  }

  if (draft === undefined) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav current="accueil" />
            <p className="ptg-type-body" aria-live="polite">
              {UX_LOADING}
            </p>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner ptg-scene ptg-scene--accueil">
          <AppNav current="accueil" />
          <PtgMenuCard variant="ember" stamp="Aujourd’hui">
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                {UX_ACCUEIL.title}
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 0.85rem" }} />
              <MarketingPulseLine lines={MARKETING_APP_PULSE_LINES} intervalMs={7000} className="ptg-accueil-pulse" />
              {draft && (
                <p style={{ margin: "0 0 0.35rem", fontSize: "var(--ptg-text-md-sm)", color: "var(--ptg-text-muted)" }}>
                  Salut {draft.displayName}
                </p>
              )}
              <p className="ptg-type-body" style={{ margin: "0 0 0.35rem" }}>
                {UX_ACCUEIL.leadFaim}
              </p>
              <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
                {session === "in" ? UX_ACCUEIL.sessionIn : draft ? UX_ACCUEIL.sessionDraft : UX_ACCUEIL.sessionNoDraft}
              </p>
              <p
                className="ptg-type-body"
                style={{
                  margin: "0.75rem 0 0",
                  fontSize: "var(--ptg-text-sm)",
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: "var(--ptg-accent-deep)",
                }}
              >
                {MARKETING_TAGLINE_GOLDEN}
              </p>
              <p
                className="ptg-type-body"
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "var(--ptg-text-sm)",
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: "var(--ptg-text-muted)",
                }}
              >
                {MARKETING_CORE_PROMISE}
              </p>
            </div>
          </PtgMenuCard>
        <NextActionCard
          title={UX_ACCUEIL.nextActionTitle}
          body={session === "in" ? UX_ACCUEIL.nextActionIn : UX_ACCUEIL.nextActionOut}
          ctaHref={session === "in" ? "/decouvrir" : "/auth"}
          ctaLabel={session === "in" ? "Voir qui mange ce soir" : "Me connecter"}
          ctaClassName="ptg-btn-primary"
          eventContext="accueil_next_action"
          eventMetadata={{ variant: uxVariant, session }}
        />
        <HealthyRitualCard title={UX_ACCUEIL.ritualTitle} body={UX_ACCUEIL.ritualBody} ctaHref="/decouvrir" ctaLabel="Voir qui mange ce soir" />
        {session === "in" && <InviteFriendCard source="accueil" />}

        {session === "in" && (
          <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.55 }}>
            <span style={{ color: "var(--ptg-text-muted)" }}>{accueilHook}</span>{" "}
            <Link href="/decouvrir" style={{ fontWeight: 600 }}>
              {GROWTH_CTA_INVITE_EAT}
            </Link>
          </p>
        )}

        {session === "in" && serverProfile && !serverProfile.city?.trim() && (
          <p className="ptg-banner ptg-banner-warn" style={{ marginBottom: "1rem" }} role="alert">
            <strong>{UX_ACCUEIL.profileNeedsCityTitle}</strong>. {UX_ACCUEIL.profileNeedsCityBody}{" "}
            <Link href="/profil" style={{ fontWeight: 600 }}>
              {UX_ACCUEIL.profileNeedsCityCta}
            </Link>
          </p>
        )}

        <p
          className="ptg-type-body"
          style={{
            margin: "0 0 1rem",
            fontSize: "var(--ptg-text-md-sm)",
            fontStyle: "italic",
            color: "var(--ptg-text-muted)",
          }}
        >
          {MARKETING_KEY_CHOICE_OR_SURPRISE}
        </p>

        <section aria-labelledby="mood-title" className="ptg-scene-block" style={{ marginBottom: "1.25rem" }}>
          <h2 id="mood-title" className="ptg-section-heading ptg-section-heading--signature">
            {UX_ACCUEIL.moodTitle}
          </h2>
          <div
            className="ptg-scene-grid"
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(10.5rem, 1fr))",
            }}
          >
            <div className="ptg-surface ptg-scene-card ptg-card ptg-stack ptg-stack--dense">
              <p style={{ margin: 0, fontWeight: 700 }}>{UX_ACCUEIL.moodPrivateTitle}</p>
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
                {UX_ACCUEIL.moodPrivateBody}
              </p>
              <Link href="/decouvrir" className="ptg-btn-primary" style={{ textAlign: "center", marginTop: "auto" }}>
                {UX_ACCUEIL.moodPrivateCta}
              </Link>
            </div>
            <div className="ptg-surface ptg-scene-card ptg-card ptg-stack ptg-stack--dense">
              <p style={{ margin: 0, fontWeight: 700 }}>Repas ouvert</p>
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
                Spontané, table ouverte, « qui est chaud ? » : le fil arrive pour ça.
              </p>
              <Link
                href="/repas-ouverts"
                className="ptg-btn-ghost"
                style={{ textAlign: "center", textDecoration: "none", marginTop: "auto" }}
              >
                Voir les repas ouverts
              </Link>
            </div>
            <div className="ptg-surface ptg-scene-card ptg-card ptg-stack ptg-stack--dense">
              <p style={{ margin: 0, fontWeight: 700 }}>Expériences</p>
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
                Expériences food organisées : tu <strong>rejoins</strong> plutôt que tout planifier seul·e.
              </p>
              <Link
                href="/experiences"
                className="ptg-btn-ghost"
                style={{ textAlign: "center", textDecoration: "none", marginTop: "auto" }}
              >
                Découvrir le module
              </Link>
            </div>
          </div>
          <p className="ptg-type-body" style={{ margin: "0.75rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
            <Link href="/lieux" style={{ fontWeight: 600 }}>
              Lieux & repères
            </Link>
            <span style={{ color: "var(--ptg-text-muted)" }}> · </span>
            <Link href="/partenaires" style={{ fontWeight: 600 }}>
              {UX_FOOTER.partners}
            </Link>
            <span style={{ color: "var(--ptg-text-muted)" }}> · </span>
            <Link href="/repas" style={{ fontWeight: 600 }}>
              Mes repas
            </Link>
            <span style={{ color: "var(--ptg-text-muted)" }}> · </span>
            <Link href="/reseau-graille" style={{ fontWeight: 600 }}>
              Réseau graille
            </Link>
          </p>
        </section>

        {extensionsNavVisible() && (
          <section aria-labelledby="graille-plus-title" className="ptg-scene-block" style={{ marginBottom: "1.25rem" }}>
            <h2 id="graille-plus-title" className="ptg-section-heading">
              Graille+
            </h2>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.55 }}>
              Extensions optionnelles : partage maison encadré, surplus du soir, paiement du repas. Une entrée, sans changer
              le cœur de l’app.
            </p>
            <Link href="/graille-plus" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
              Voir Graille+
            </Link>
          </section>
        )}

        {session === "in" && serverProfile && (
          <div className="ptg-surface ptg-card" style={{ marginBottom: "1.25rem" }}>
            <p style={{ margin: 0, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>Profil en ligne</p>
            <p style={{ margin: "0.35rem 0 0", fontWeight: 600 }}>{serverProfile.display_name}</p>
            <p className="ptg-type-body" style={{ margin: "0.25rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
              {serverProfile.city ?? "Ville non renseignée"} · {serverProfile.radius_km} km
            </p>
            <p style={{ margin: "0.65rem 0 0" }}>
              <Link href="/profil" style={{ fontSize: "var(--ptg-text-ui-sm)", fontWeight: 600 }}>
                Modifier mon profil
              </Link>
            </p>
          </div>
        )}

        {session === "out" && (
          <p className="ptg-banner" style={{ marginBottom: "1rem" }}>
            <Link href="/auth">{UX_ACCUEIL.connect}</Link> {UX_ACCUEIL.connectAfterLink}
          </p>
        )}

        {session === "in" && draft && (
          <div className="ptg-banner" style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.5rem" }}>{UX_ACCUEIL.draftSyncIntro}</p>
            <button type="button" className="ptg-btn-primary" disabled={syncBusy} onClick={() => void syncDraftToServer()}>
              {syncBusy ? UX_ACCUEIL.draftSyncBusy : UX_ACCUEIL.draftSyncBtn}
            </button>
            {syncMsg && (
              <p style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }} role="status">
                {syncMsg}
              </p>
            )}
          </div>
        )}

        {!draft && (
          <div className="ptg-banner" style={{ marginBottom: "1.25rem" }}>
            {UX_ACCUEIL.draftMissing}{" "}
            <Link href="/onboarding">{UX_ACCUEIL.draftOnboardingLink}</Link>
          </div>
        )}

        {draft && (
          <div className="ptg-surface ptg-card--lg" style={{ marginBottom: "1.25rem" }}>
            <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
              {UX_ACCUEIL.draftSummaryLabel}
            </p>
            <ul className="ptg-type-body ptg-prose-list" style={{ margin: 0 }}>
              <li>
                {draft.city} · {draft.radiusKm} km
              </li>
              <li>Table : {socialIntentLabel(draft.socialIntent)}</li>
              <li>Addition : {mealIntentLabel(draft.mealIntent)}</li>
              {draft.tags.length > 0 && (
                <li>Tags : {draft.tags.map((t) => tagDisplayLabel(t)).join(", ")}</li>
              )}
            </ul>
            <button
              type="button"
              className="ptg-btn-ghost"
              style={{ marginTop: "1rem", paddingLeft: 0 }}
              onClick={() => {
                clearProfileDraft();
                setDraft(null);
              }}
            >
              {UX_ACCUEIL.draftClear}
            </button>
          </div>
        )}

        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
