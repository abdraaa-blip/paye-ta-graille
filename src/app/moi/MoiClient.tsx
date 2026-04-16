"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { trackGrowthEvent } from "@/lib/growth-events";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { UX_LOADING, UX_MOI } from "@/lib/ux-copy";

type Session = "unknown" | "out" | "in";
type NudgeLevel = "calme" | "normal" | "off";

export function MoiClient() {
  const router = useRouter();
  const [session, setSession] = useState<Session>("unknown");
  const [signingOut, setSigningOut] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [profileCheckFailed, setProfileCheckFailed] = useState(false);
  const [nudgeLevel, setNudgeLevel] = useState<NudgeLevel>("normal");
  const [savingNudge, setSavingNudge] = useState(false);
  const [nudgeStatus, setNudgeStatus] = useState<string | null>(null);

  const hour = new Date().getHours();
  const isEveningWindow = hour >= 17 && hour <= 22;
  const ritualLine =
    nudgeLevel === "calme" ? UX_MOI.ritualCalme : nudgeLevel === "off" ? UX_MOI.ritualOff : UX_MOI.ritualNormal;

  const refresh = useCallback(async () => {
    setProfileCheckFailed(false);
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      setSession("out");
      setProfileReady(true);
      return;
    }
    if (!res.ok) {
      setSession("unknown");
      setProfileCheckFailed(true);
      setProfileReady(true);
      return;
    }
    const json = (await res.json()) as { settings?: { nudge_level?: string } | null };
    const level = json.settings?.nudge_level;
    if (level === "calme" || level === "normal" || level === "off") {
      setNudgeLevel(level);
    }
    setSession("in");
    setProfileReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.push("/accueil");
    router.refresh();
  }

  async function updateNudge(next: NudgeLevel) {
    if (savingNudge || next === nudgeLevel) return;
    setSavingNudge(true);
    setNudgeStatus(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nudge_level: next }),
    });
    setSavingNudge(false);
    if (!res.ok) {
      setNudgeStatus("Impossible de mettre à jour les rappels.");
      return;
    }
    setNudgeLevel(next);
    setNudgeStatus(UX_MOI.nudgeSaved);
    void trackGrowthEvent({ event: "nudge_level_updated", context: "moi", metadata: { level: next } });
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
        <AppNav current="moi" />
        <div className="ptg-page-head">
          <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
            {UX_MOI.title}
          </h1>
          <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
          <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
            {UX_MOI.intro}
          </p>
        </div>

        {!profileReady && (
          <p className="ptg-type-body" style={{ margin: "0 0 1rem" }} aria-live="polite">
            {UX_LOADING}
          </p>
        )}

        {profileCheckFailed && (
          <div className="ptg-banner ptg-banner-warn" role="alert" style={{ marginBottom: "1rem" }}>
            <p style={{ margin: 0 }}>{UX_MOI.profileCheckErr}</p>
            <button type="button" className="ptg-btn-ghost" style={{ marginTop: "0.5rem" }} onClick={() => void refresh()}>
              {UX_MOI.retryProfileCheck}
            </button>
          </div>
        )}

        <ul className="ptg-list-plain ptg-list-plain--snug" hidden={!profileReady} aria-busy={!profileReady}>
          <li>
            <Link href="/repas" className="ptg-moi-link-row">
              {UX_MOI.navRepas}
            </Link>
          </li>
          <li>
            <Link href="/reseau-graille" className="ptg-moi-link-row">
              {UX_MOI.navReseau}
            </Link>
          </li>
          <li>
            <Link href="/profil" className="ptg-moi-link-row">
              {UX_MOI.navProfil}
            </Link>
          </li>
          <li>
            <Link href="/onboarding" className="ptg-moi-link-row">
              {UX_MOI.navOnboarding}
            </Link>
          </li>
          <li>
            <div className="ptg-surface ptg-surface--static ptg-card">
              <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--ptg-text-md-sm)" }}>{UX_MOI.notifTitle}</p>
              <p className="ptg-type-body" style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
                {UX_MOI.notifBody.includes("profil en ligne") ? (
                  <>
                    {UX_MOI.notifBody.split("profil en ligne")[0]}
                    <Link href="/profil" style={{ fontWeight: 600 }}>
                      profil en ligne
                    </Link>
                    {UX_MOI.notifBody.split("profil en ligne")[1]}
                  </>
                ) : (
                  UX_MOI.notifBody
                )}
              </p>
              <div className="ptg-chip-row" style={{ marginTop: "0.65rem" }}>
                {(
                  [
                    { v: "calme" as const, l: "Calme" },
                    { v: "normal" as const, l: "Normal" },
                    { v: "off" as const, l: "Off" },
                  ] satisfies { v: NudgeLevel; l: string }[]
                ).map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    className="ptg-chip"
                    aria-pressed={nudgeLevel === v}
                    disabled={savingNudge}
                    onClick={() => void updateNudge(v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {nudgeStatus && (
                <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-sm)" }} role="status">
                  {nudgeStatus}
                </p>
              )}
            </div>
          </li>
          <li>
            <div className="ptg-surface ptg-surface--static ptg-ritual-card ptg-card">
              <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--ptg-text-md-sm)" }}>{UX_MOI.ritualTitle}</p>
              <p className="ptg-type-body" style={{ margin: "0.4rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
                {ritualLine}
              </p>
              {isEveningWindow && (
                <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-sm)" }}>
                  Petite fenêtre du soir : un tour rapide sur{" "}
                  <Link href="/decouvrir" style={{ fontWeight: 600 }}>
                    Découvrir
                  </Link>
                  .
                </p>
              )}
            </div>
          </li>
          <li>
            <div className="ptg-surface ptg-surface--static ptg-card">
              <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--ptg-text-md-sm)" }}>{UX_MOI.helpTitle}</p>
              <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
                <Link href="/signaler">Signaler un problème</Link>
                <span style={{ color: "var(--ptg-line)" }}> · </span>
                <Link href="/legal/cgu">Conditions</Link>
                <span style={{ color: "var(--ptg-line)" }}> · </span>
                <Link href="/legal/confidentialite">Confidentialité</Link>
              </p>
            </div>
          </li>
        </ul>

        {session === "in" && (
          <p style={{ marginTop: "1.5rem" }}>
            <button type="button" className="ptg-btn-ghost" disabled={signingOut} onClick={() => void signOut()}>
              {signingOut ? UX_MOI.signOutBusy : UX_MOI.signOut}
            </button>
          </p>
        )}

        {session === "out" && (
          <p className="ptg-banner" style={{ marginTop: "1.25rem" }}>
            {UX_MOI.notConnected} <Link href="/auth">{UX_MOI.connect}</Link>
          </p>
        )}

        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/accueil" className="ptg-link-back" style={{ marginBottom: 0 }}>
            {UX_MOI.backAccueil}
          </Link>
        </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
