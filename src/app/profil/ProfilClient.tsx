"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { AppNav } from "@/components/AppNav";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { deriveGrailleVibe } from "@/lib/graille-vibe";
import { MEAL_INTENT_DESCRIPTIONS, MEAL_INTENT_LABELS } from "@/lib/intent-labels";
import {
  PROFILE_TAG_MAX,
  PROFILE_TAG_OPTIONS,
  PROFILE_TAG_SECTIONS,
  tagDisplayLabel,
} from "@/lib/tag-options";
import type { MealWithPreference } from "@/lib/profile-draft";
import { UX_ONBOARDING } from "@/lib/ux-copy";
import { UX_PROFIL } from "@/lib/ux-copy";

type MealIntent = "invite" | "partage" | "etre_invite";
type SocialIntent = "ami" | "ouvert" | "dating_leger";
type NudgeLevel = "calme" | "normal" | "off";

type ServerProfile = {
  display_name: string;
  photo_url: string | null;
  city: string | null;
  radius_km: number;
  social_intent: string;
  meal_intent: string;
  meal_with_preference?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export function ProfilClient({ showPostAuthSetup = false }: { showPostAuthSetup?: boolean }) {
  const [status, setStatus] = useState<"loading" | "auth" | "ready" | "error">("loading");
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState(15);
  const [socialIntent, setSocialIntent] = useState<SocialIntent>("ouvert");
  const [mealIntent, setMealIntent] = useState<MealIntent>("partage");
  const [mealWithPreference, setMealWithPreference] = useState<MealWithPreference>("tout_le_monde");
  const [tags, setTags] = useState<string[]>([]);
  const [nudgeLevel, setNudgeLevel] = useState<NudgeLevel>("normal");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoadErr(null);
    setSaveMsg(null);
    setSaveErr(null);
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      setStatus("auth");
      return;
    }
    if (!res.ok) {
      setLoadErr((await readApiError(res)).message);
      setStatus("error");
      return;
    }
    const json = (await res.json()) as {
      profile: ServerProfile;
      tags?: { tag_key: string }[];
      settings?: { nudge_level?: string } | null;
    };
    const p = json.profile;
    setDisplayName(p.display_name);
    setPhotoUrl(p.photo_url ?? "");
    setCity(p.city ?? "");
    setRadiusKm(p.radius_km);
    setSocialIntent((p.social_intent as SocialIntent) || "ouvert");
    setMealIntent((p.meal_intent as MealIntent) || "partage");
    const mwp = p.meal_with_preference as MealWithPreference | undefined;
    setMealWithPreference(
      mwp === "profils_similaires" || mwp === "decouvrir_styles" ? mwp : "tout_le_monde",
    );
    setTags((json.tags ?? []).map((t) => t.tag_key));
    const nl = json.settings?.nudge_level;
    setNudgeLevel(nl === "calme" || nl === "off" ? nl : "normal");
    setLat(typeof p.latitude === "number" && Number.isFinite(p.latitude) ? p.latitude : null);
    setLng(typeof p.longitude === "number" && Number.isFinite(p.longitude) ? p.longitude : null);
    setStatus("ready");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selectableSet = new Set(PROFILE_TAG_OPTIONS);

  function toggleTag(tag: string) {
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= PROFILE_TAG_MAX) return prev;
      return [...prev, tag];
    });
  }

  const orphanTags = tags.filter((t) => !selectableSet.has(t));
  const softVibe = useMemo(() => deriveGrailleVibe(tags), [tags]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    setSaveErr(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: displayName.trim(),
        photo_url: photoUrl.trim() || null,
        city: city.trim() || null,
        radius_km: radiusKm,
        latitude: lat,
        longitude: lng,
        social_intent: socialIntent,
        meal_intent: mealIntent,
        meal_with_preference: mealWithPreference,
        tags,
        nudge_level: nudgeLevel,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setSaveErr((await readApiError(res)).message);
      return;
    }
    const json = (await res.json()) as { profile?: ServerProfile };
    setSaveMsg(UX_PROFIL.saveOk);
    if (json.profile) {
      setRadiusKm(json.profile.radius_km);
    }
  }

  if (status === "loading") {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav current="moi" />
            <p className="ptg-type-body" aria-live="polite">
              {UX_PROFIL.loading}
            </p>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  if (status === "auth") {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav current="moi" />
            <PtgMenuCard variant="ember" stamp="Connexion">
              <div className="ptg-page-head">
                <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                  {UX_PROFIL.needAuthTitle}
                </h1>
                <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
                <p className="ptg-banner" style={{ margin: "0 0 1rem" }}>
                  {UX_PROFIL.needAuthBody}
                </p>
              </div>
            </PtgMenuCard>
            <p>
              <Link href="/auth" className="ptg-btn-primary" style={{ display: "inline-flex" }}>
                {UX_PROFIL.connect}
              </Link>
            </p>
            <p style={{ marginTop: "1rem" }}>
              <Link href="/onboarding" className="ptg-link-back" style={{ marginBottom: 0 }}>
                {UX_PROFIL.onboardingLocal}
              </Link>
            </p>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav current="moi" />
            <p className="ptg-banner ptg-banner-warn">{loadErr}</p>
            <button type="button" className="ptg-btn-ghost" onClick={() => void refresh()}>
              {UX_PROFIL.retry}
            </button>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <AppNav current="moi" />
          <PtgMenuCard variant="sage" stamp="Qui tu es">
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                {UX_PROFIL.title}
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
              <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
                {UX_PROFIL.intro}
              </p>
            </div>
          </PtgMenuCard>

          {showPostAuthSetup && (
            <p className="ptg-banner" style={{ marginBottom: "1.25rem" }} role="status">
              <strong>{UX_PROFIL.postAuthSetupTitle}</strong>. {UX_PROFIL.postAuthSetupBody}
            </p>
          )}

          <form onSubmit={save} className="ptg-surface ptg-surface--static ptg-card--lg" style={{ marginBottom: "1rem" }}>
          <div className="ptg-field">
            <label className="ptg-label" htmlFor="pn">
              {UX_ONBOARDING.pseudo}
            </label>
            <input
              id="pn"
              className="ptg-input"
              required
              minLength={2}
              maxLength={80}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="nickname"
            />
          </div>
          <div className="ptg-field">
            <label className="ptg-label" htmlFor="ph">
              {UX_PROFIL.photoLabel}
            </label>
            <input
              id="ph"
              className="ptg-input"
              type="url"
              placeholder={UX_PROFIL.photoPh}
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
          <div className="ptg-field">
            <label className="ptg-label" htmlFor="ct">
              {UX_ONBOARDING.city}
            </label>
            <input
              id="ct"
              className="ptg-input"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
          </div>
          <p
            className="ptg-type-body"
            style={{ margin: "0 0 0.65rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}
          >
            {UX_PROFIL.geoHint}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
            <button
              type="button"
              className="ptg-btn-ghost"
              disabled={geoBusy}
              onClick={() => {
                setSaveErr(null);
                if (!navigator.geolocation) {
                  setSaveErr(UX_PROFIL.geoErr);
                  return;
                }
                setGeoBusy(true);
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setLat(pos.coords.latitude);
                    setLng(pos.coords.longitude);
                    setGeoBusy(false);
                    setSaveMsg(UX_PROFIL.geoReadyToSave);
                  },
                  () => {
                    setGeoBusy(false);
                    setSaveErr(UX_PROFIL.geoErr);
                  },
                  { enableHighAccuracy: false, timeout: 12_000, maximumAge: 60_000 },
                );
              }}
            >
              {geoBusy ? UX_PROFIL.geoBusy : UX_PROFIL.geoUse}
            </button>
            {(lat != null || lng != null) && (
              <button
                type="button"
                className="ptg-btn-ghost"
                disabled={geoBusy}
                onClick={() => {
                  setLat(null);
                  setLng(null);
                  setSaveErr(null);
                  setSaveMsg(UX_PROFIL.geoReadyToSave);
                }}
              >
                {UX_PROFIL.geoClear}
              </button>
            )}
            {lat != null && lng != null && (
              <span style={{ fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            )}
          </div>
          <div className="ptg-field">
            <label className="ptg-label" htmlFor="rd">
              {UX_ONBOARDING.radius(radiusKm)}
            </label>
            <input
              id="rd"
              type="range"
              min={5}
              max={200}
              step={5}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>Intention sociale</p>
          <div className="ptg-choice-grid" role="group" aria-label="Intention sociale" style={{ marginBottom: "1rem" }}>
            {(
              [
                { v: "ami" as const, t: UX_ONBOARDING.socialAmi, d: UX_ONBOARDING.socialAmiDesc },
                { v: "ouvert" as const, t: UX_ONBOARDING.socialOuvert, d: UX_ONBOARDING.socialOuvertDesc },
                { v: "dating_leger" as const, t: UX_ONBOARDING.socialDating, d: UX_ONBOARDING.socialDatingDesc },
              ] satisfies { v: SocialIntent; t: string; d: string }[]
            ).map(({ v, t, d }) => (
              <button
                key={v}
                type="button"
                className="ptg-choice"
                aria-pressed={socialIntent === v}
                onClick={() => setSocialIntent(v)}
              >
                <span className="ptg-choice-title">{t}</span>
                <span className="ptg-choice-desc">{d}</span>
              </button>
            ))}
          </div>

          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>{UX_PROFIL.mealHeading}</p>
          <div className="ptg-choice-grid" role="group" aria-label="Intention repas" style={{ marginBottom: "1rem" }}>
            {(
              [
                { v: "invite" as const, t: MEAL_INTENT_LABELS.invite, d: MEAL_INTENT_DESCRIPTIONS.invite },
                { v: "partage" as const, t: MEAL_INTENT_LABELS.partage, d: MEAL_INTENT_DESCRIPTIONS.partage },
                { v: "etre_invite" as const, t: MEAL_INTENT_LABELS.etre_invite, d: MEAL_INTENT_DESCRIPTIONS.etre_invite },
              ] satisfies { v: MealIntent; t: string; d: string }[]
            ).map(({ v, t, d }) => (
              <button
                key={v}
                type="button"
                className="ptg-choice"
                aria-pressed={mealIntent === v}
                onClick={() => setMealIntent(v)}
              >
                <span className="ptg-choice-title">{t}</span>
                <span className="ptg-choice-desc">{d}</span>
              </button>
            ))}
          </div>

          <p style={{ margin: "1rem 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>{UX_PROFIL.prefHeading}</p>
          <p className="ptg-type-body" style={{ margin: "0 0 0.65rem", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
            {UX_PROFIL.prefHint}
          </p>
          <div className="ptg-choice-grid" role="group" aria-label="Préférence de table" style={{ marginBottom: "1rem" }}>
            {(
              [
                {
                  v: "tout_le_monde" as const,
                  t: UX_ONBOARDING.prefAllTitle,
                  d: UX_ONBOARDING.prefAllDesc,
                },
                {
                  v: "profils_similaires" as const,
                  t: UX_ONBOARDING.prefSimilarTitle,
                  d: UX_ONBOARDING.prefSimilarDesc,
                },
                {
                  v: "decouvrir_styles" as const,
                  t: UX_ONBOARDING.prefStylesTitle,
                  d: UX_ONBOARDING.prefStylesDesc,
                },
              ] satisfies { v: MealWithPreference; t: string; d: string }[]
            ).map(({ v, t, d }) => (
              <button
                key={v}
                type="button"
                className="ptg-choice"
                aria-pressed={mealWithPreference === v}
                onClick={() => setMealWithPreference(v)}
              >
                <span className="ptg-choice-title">{t}</span>
                <span className="ptg-choice-desc">{d}</span>
              </button>
            ))}
          </div>

          {softVibe && (
            <p
              className="ptg-type-body"
              style={{
                margin: "0 0 1rem",
                fontSize: "var(--ptg-text-sm)",
                color: "var(--ptg-text-muted)",
                fontStyle: "italic",
              }}
            >
              {UX_PROFIL.vibeLine(softVibe)}
            </p>
          )}

          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>{UX_PROFIL.tagsHeading(PROFILE_TAG_MAX)}</p>
          {PROFILE_TAG_SECTIONS.map((section) => (
            <div key={section.id} style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0 0 0.25rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>{section.title}</p>
              <p
                className="ptg-type-body"
                style={{ margin: "0 0 0.4rem", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}
              >
                {section.description}
              </p>
              <div className="ptg-chip-row" role="group" aria-label={section.title}>
                {section.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="ptg-chip"
                    aria-pressed={tags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    {tagDisplayLabel(tag)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {orphanTags.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0 0 0.4rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>{UX_PROFIL.orphanHeading}</p>
              <div className="ptg-chip-row" role="group" aria-label={UX_PROFIL.orphanHeading}>
                {orphanTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="ptg-chip"
                    aria-pressed={tags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    {tagDisplayLabel(tag)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p style={{ margin: "1.25rem 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>{UX_PROFIL.nudgeHeading}</p>
          <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
            {UX_PROFIL.nudgeIntro}
          </p>
          <div className="ptg-choice-grid" role="group" aria-label="Niveau de rappels">
            {(
              [
                { v: "calme" as const, t: UX_ONBOARDING.nudgeCalme, d: UX_ONBOARDING.nudgeCalmeDesc },
                { v: "normal" as const, t: UX_ONBOARDING.nudgeNormal, d: UX_ONBOARDING.nudgeNormalDesc },
                { v: "off" as const, t: UX_ONBOARDING.nudgeOff, d: UX_ONBOARDING.nudgeOffDesc },
              ] satisfies { v: NudgeLevel; t: string; d: string }[]
            ).map(({ v, t, d }) => (
              <button
                key={v}
                type="button"
                className="ptg-choice"
                aria-pressed={nudgeLevel === v}
                onClick={() => setNudgeLevel(v)}
              >
                <span className="ptg-choice-title">{t}</span>
                <span className="ptg-choice-desc">{d}</span>
              </button>
            ))}
          </div>

          <button type="submit" className="ptg-btn-primary" style={{ width: "100%", marginTop: "1.25rem" }} disabled={saving}>
            {saving ? UX_PROFIL.saveBusy : UX_PROFIL.save}
          </button>
        </form>

        {saveErr && (
          <p className="ptg-banner ptg-banner-warn" role="alert">
            {saveErr}
          </p>
        )}
        {saveMsg && (
          <p className="ptg-banner" role="status">
            {saveMsg}
          </p>
        )}

        <p style={{ marginTop: "1rem" }}>
          <Link href="/onboarding" className="ptg-link-back" style={{ marginBottom: 0 }}>
            {UX_PROFIL.redoOnboarding}
          </Link>
        </p>
        <p style={{ marginTop: "1.25rem" }}>
          <Link href="/moi" className="ptg-link-back" style={{ marginBottom: 0 }}>
            ← {UX_PROFIL.backMoi}
          </Link>
        </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
