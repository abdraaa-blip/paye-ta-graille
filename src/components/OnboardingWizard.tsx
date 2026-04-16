"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MEAL_INTENT_DESCRIPTIONS, MEAL_INTENT_LABELS } from "@/lib/intent-labels";
import {
  defaultProfileDraft,
  saveProfileDraft,
  type MealIntent,
  type MealWithPreference,
  type NudgeLevel,
  type SocialIntent,
} from "@/lib/profile-draft";
import {
  PROFILE_TAG_MAX,
  PROFILE_TAG_SECTIONS,
  hasGrailleTag,
  hasIciTag,
  tagDisplayLabel,
} from "@/lib/tag-options";
import { MarketingPulseLine } from "@/components/MarketingPulseLine";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { emitInviteAttributionOnce } from "@/lib/growth-invite-attribution";
import { trackGrowthEvent } from "@/lib/growth-events";
import { MARKETING_ENTRY_PULSE_LINES } from "@/lib/marketing-copy";
import { UX_ONBOARDING } from "@/lib/ux-copy";

const stepCount = 6;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(defaultProfileDraft);

  useEffect(() => {
    void trackGrowthEvent({ event: "onboarding_started", context: "onboarding" });
  }, []);

  const canContinue = useMemo(() => {
    if (step === 1) return draft.displayName.trim().length >= 2 && draft.city.trim().length >= 2;
    if (step === 4) {
      return (
        draft.tags.length <= PROFILE_TAG_MAX &&
        hasGrailleTag(draft.tags) &&
        hasIciTag(draft.tags)
      );
    }
    return true;
  }, [draft.city, draft.displayName, draft.tags, step]);

  function toggleTag(tag: string) {
    setDraft((d) => {
      const has = d.tags.includes(tag);
      if (has) return { ...d, tags: d.tags.filter((t) => t !== tag) };
      if (d.tags.length >= PROFILE_TAG_MAX) return d;
      return { ...d, tags: [...d.tags, tag] };
    });
  }

  function nextStep() {
    void trackGrowthEvent({
      event: "onboarding_step_completed",
      context: "onboarding",
      metadata: { step },
    });
    setStep((s) => s + 1);
  }

  async function finish() {
    void trackGrowthEvent({
      event: "onboarding_completed",
      context: "onboarding",
      metadata: { stepCount },
    });
    saveProfileDraft({
      ...draft,
      completedAt: new Date().toISOString(),
    });
    await emitInviteAttributionOnce("onboarding_completed");
    router.push("/accueil");
  }

  async function fastFinish() {
    // Fast path to first value: save essentials now, enrich profile later from /profil.
    saveProfileDraft({
      ...draft,
      completedAt: new Date().toISOString(),
    });
    void trackGrowthEvent({
      event: "onboarding_completed",
      context: "onboarding_fast_path",
      metadata: { completedAtStep: step },
    });
    await emitInviteAttributionOnce("onboarding_fast_path");
    router.push("/accueil");
  }

  return (
    <div className="ptg-page-inner">
      {step === 1 ? (
        <MarketingPulseLine lines={MARKETING_ENTRY_PULSE_LINES} intervalMs={7100} className="ptg-accueil-pulse" />
      ) : null}
      <PtgMenuCard variant="sage">
        <p className="ptg-wizard-meta">{UX_ONBOARDING.step(step, stepCount)}</p>
        {step === 1 && (
          <>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_ONBOARDING.step1Title}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
              {UX_ONBOARDING.step1Body}
            </p>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="displayName">
                {UX_ONBOARDING.pseudo}
              </label>
              <input
                id="displayName"
                className="ptg-input"
                autoComplete="nickname"
                value={draft.displayName}
                onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
              />
            </div>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="city">
                {UX_ONBOARDING.city}
              </label>
              <input
                id="city"
                className="ptg-input"
                autoComplete="address-level2"
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              />
            </div>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="radius">
                {UX_ONBOARDING.radius(draft.radiusKm)}
              </label>
              <input
                id="radius"
                type="range"
                min={5}
                max={50}
                step={5}
                value={draft.radiusKm}
                onChange={(e) => setDraft({ ...draft, radiusKm: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_ONBOARDING.step2Title}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
              {UX_ONBOARDING.step2Body}
            </p>
            <div className="ptg-choice-grid" role="group" aria-label="Intention sociale">
              {(
                [
                  {
                    v: "ami" as const,
                    t: UX_ONBOARDING.socialAmi,
                    d: UX_ONBOARDING.socialAmiDesc,
                  },
                  {
                    v: "ouvert" as const,
                    t: UX_ONBOARDING.socialOuvert,
                    d: UX_ONBOARDING.socialOuvertDesc,
                  },
                  {
                    v: "dating_leger" as const,
                    t: UX_ONBOARDING.socialDating,
                    d: UX_ONBOARDING.socialDatingDesc,
                  },
                ] satisfies { v: SocialIntent; t: string; d: string }[]
              ).map(({ v, t, d }) => (
                <button
                  key={v}
                  type="button"
                  className="ptg-choice"
                  aria-pressed={draft.socialIntent === v}
                  onClick={() => setDraft({ ...draft, socialIntent: v })}
                >
                  <span className="ptg-choice-title">{t}</span>
                  <span className="ptg-choice-desc">{d}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_ONBOARDING.step3Title}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
              {UX_ONBOARDING.step3Body}
            </p>
            <div className="ptg-choice-grid" role="group" aria-label="Intention repas">
              {(
                [
                  {
                    v: "invite" as const,
                    t: MEAL_INTENT_LABELS.invite,
                    d: MEAL_INTENT_DESCRIPTIONS.invite,
                  },
                  {
                    v: "partage" as const,
                    t: MEAL_INTENT_LABELS.partage,
                    d: MEAL_INTENT_DESCRIPTIONS.partage,
                  },
                  {
                    v: "etre_invite" as const,
                    t: MEAL_INTENT_LABELS.etre_invite,
                    d: MEAL_INTENT_DESCRIPTIONS.etre_invite,
                  },
                ] satisfies { v: MealIntent; t: string; d: string }[]
              ).map(({ v, t, d }) => (
                <button
                  key={v}
                  type="button"
                  className="ptg-choice"
                  aria-pressed={draft.mealIntent === v}
                  onClick={() => setDraft({ ...draft, mealIntent: v })}
                >
                  <span className="ptg-choice-title">{t}</span>
                  <span className="ptg-choice-desc">{d}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_ONBOARDING.step4Title}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1rem" }}>
              {UX_ONBOARDING.step4Body}
            </p>
            <p style={{ margin: "0 0 0.35rem", fontWeight: 700, fontSize: "var(--ptg-text-ui-sm)" }}>{UX_ONBOARDING.prefWithTitle}</p>
            <div className="ptg-choice-grid" role="group" aria-label="Préférence de table" style={{ marginBottom: "1.25rem" }}>
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
                  aria-pressed={draft.mealWithPreference === v}
                  onClick={() => setDraft({ ...draft, mealWithPreference: v })}
                >
                  <span className="ptg-choice-title">{t}</span>
                  <span className="ptg-choice-desc">{d}</span>
                </button>
              ))}
            </div>
            <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-ui-sm)" }}>
              {UX_ONBOARDING.selectionCount(draft.tags.length, PROFILE_TAG_MAX)}
            </p>
            {PROFILE_TAG_SECTIONS.map((section) => (
              <div key={section.id} style={{ marginBottom: "1.25rem" }}>
                <p style={{ margin: "0 0 0.25rem", fontWeight: 700 }}>{section.title}</p>
                <p
                  className="ptg-type-body"
                  style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}
                >
                  {section.description}
                </p>
                <div className="ptg-chip-row" role="group" aria-label={section.title}>
                  {section.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="ptg-chip"
                      aria-pressed={draft.tags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    >
                      {tagDisplayLabel(tag)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {step === 5 && (
          <>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_ONBOARDING.step5Title}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
              {UX_ONBOARDING.step5Body}
            </p>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="diet">
                {UX_ONBOARDING.dietLabel}
              </label>
              <textarea
                id="diet"
                className="ptg-input"
                rows={4}
                value={draft.dietaryNote}
                onChange={(e) => setDraft({ ...draft, dietaryNote: e.target.value })}
              />
            </div>
          </>
        )}
        {step === 6 && (
          <>
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_ONBOARDING.step6Title}
            </h1>
            <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
              {UX_ONBOARDING.step6Body}
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
                  aria-pressed={draft.nudgeLevel === v}
                  onClick={() => setDraft({ ...draft, nudgeLevel: v })}
                >
                  <span className="ptg-choice-title">{t}</span>
                  <span className="ptg-choice-desc">{d}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </PtgMenuCard>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
          {step > 1 ? (
            <button type="button" className="ptg-btn-ghost" onClick={() => setStep((s) => s - 1)}>
              {UX_ONBOARDING.back}
            </button>
          ) : (
            <span style={{ minWidth: "4rem" }} />
          )}
          {step < stepCount ? (
            <button
              type="button"
              className="ptg-btn-primary"
              style={{ flex: 1 }}
              disabled={!canContinue}
              onClick={nextStep}
            >
              {UX_ONBOARDING.continue}
            </button>
          ) : (
            <button type="button" className="ptg-btn-primary" style={{ flex: 1 }} onClick={finish}>
              {UX_ONBOARDING.finish}
            </button>
          )}
          {step >= 2 && step < stepCount && (
            <button type="button" className="ptg-btn-ghost" onClick={fastFinish}>
              Finir vite (je completerai plus tard)
            </button>
          )}
        </div>
    </div>
  );
}
