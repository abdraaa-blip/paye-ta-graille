"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { AuthPromptLink } from "@/components/AuthPromptLink";
import { displayInitials } from "@/lib/display-initials";
import { GROWTH_SURPRISE } from "@/lib/growth-copy";
import { mealIntentLabel, socialIntentLabel } from "@/lib/intent-labels";
import {
  appendSurpriseRecentIds,
  readSurpriseRecentIds,
  surpriseRecentIdsQuery,
} from "@/lib/surprise-recent-ids";
import { trackGrowthEvent } from "@/lib/growth-events";
import { UX_ACCUEIL } from "@/lib/ux-copy";

type Profile = {
  id: string;
  display_name: string;
  photo_url: string | null;
  city: string | null;
  social_intent: string;
  meal_intent: string;
  radius_km: number;
};

type Phase = "idle" | "rolling" | "result" | "empty" | "error" | "unauth";

export function SurpriseGrailleCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [compatibleStrict, setCompatibleStrict] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const roll = useCallback(async () => {
    setPhase("rolling");
    setMsg(null);
    setProfiles([]);
    const exclude = readSurpriseRecentIds();
    const res = await fetch(`/api/discover/surprise${surpriseRecentIdsQuery(exclude)}`);
    if (res.status === 401) {
      setPhase("unauth");
      setMsg(GROWTH_SURPRISE.loginHint);
      return;
    }
    if (!res.ok) {
      const { code } = await readApiError(res);
      setPhase("error");
      setMsg(code === "rate_limited" ? "Doucement. Réessaie dans une minute." : GROWTH_SURPRISE.error);
      return;
    }
    const json = (await res.json()) as {
      profiles?: Profile[] | null;
      profile?: Profile | null;
      compatible_strict?: boolean;
    };
    const list =
      Array.isArray(json.profiles) && json.profiles.length > 0
        ? json.profiles
        : json.profile
          ? [json.profile]
          : [];
    if (!list.length) {
      setPhase("empty");
      setMsg(GROWTH_SURPRISE.empty);
      return;
    }
    appendSurpriseRecentIds(list.map((p) => p.id));
    setProfiles(list);
    setCompatibleStrict(json.compatible_strict !== false);
    setPhase("result");
    void trackGrowthEvent({
      event: "surprise_graille_rolled",
      context: "discover_surprise",
      metadata: { count: list.length, compatible_strict: json.compatible_strict !== false },
    });
  }, []);

  const dismiss = useCallback(() => {
    setPhase("idle");
    setProfiles([]);
    setMsg(null);
  }, []);

  return (
    <section
      className="ptg-surface ptg-surface--static ptg-surprise-card ptg-scene-card ptg-card"
      aria-labelledby="surprise-graille-title"
      style={{ marginBottom: "1.15rem" }}
    >
      <h2 id="surprise-graille-title" className="ptg-section-heading" style={{ margin: "0 0 0.35rem" }}>
        {GROWTH_SURPRISE.title}
      </h2>
      <p className="ptg-type-body" style={{ margin: "0 0 0.9rem", fontSize: "var(--ptg-text-ui-sm)", lineHeight: 1.55 }}>
        {GROWTH_SURPRISE.subtitle}
      </p>

      {phase === "idle" && (
        <button type="button" className="ptg-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => void roll()}>
          {GROWTH_SURPRISE.ctaRoll}
        </button>
      )}

      {phase === "rolling" && (
        <p className="ptg-surprise-dice" aria-live="polite" style={{ margin: 0, textAlign: "center", fontWeight: 600 }}>
          {GROWTH_SURPRISE.rolling}
        </p>
      )}

      {(phase === "empty" || phase === "error" || phase === "unauth") && msg && (
        <div>
          <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
            {msg}
          </p>
          {phase === "unauth" && (
            <AuthPromptLink className="ptg-btn-primary" style={{ display: "inline-flex", marginBottom: "0.5rem" }} />
          )}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" className="ptg-btn-ghost" onClick={() => void roll()}>
              {GROWTH_SURPRISE.again}
            </button>
            <button type="button" className="ptg-btn-ghost" onClick={dismiss}>
              {GROWTH_SURPRISE.refuse}
            </button>
          </div>
        </div>
      )}

      {phase === "result" && profiles.length > 0 && (
        <div className="ptg-surprise-reveal">
          <p style={{ margin: "0 0 0.25rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
            {profiles.length > 1 ? GROWTH_SURPRISE.multiNote : GROWTH_SURPRISE.foundHint}
          </p>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "var(--ptg-text-md)" }}>
            {profiles.length > 1 ? GROWTH_SURPRISE.foundTitleMulti : GROWTH_SURPRISE.foundTitle}
          </p>
          <div className="ptg-stack ptg-stack--compact" style={{ marginBottom: "0.75rem" }}>
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="ptg-surface ptg-surface--static"
                style={{
                  padding: "0.65rem 0.75rem",
                  borderRadius: "var(--ptg-radius-md, 8px)",
                  border: "1px solid var(--ptg-border-subtle, rgba(255,255,255,0.08))",
                }}
              >
                <div className="ptg-profile-row" style={{ marginBottom: "0.65rem" }}>
                  {profile.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.photo_url}
                      alt=""
                      width={52}
                      height={52}
                      className="ptg-avatar"
                      style={{ objectFit: "cover", padding: 0, background: "transparent" }}
                    />
                  ) : (
                    <span className="ptg-avatar" aria-hidden>
                      {displayInitials(profile.display_name)}
                    </span>
                  )}
                  <div className="ptg-profile-row__main">
                    <p style={{ margin: "0 0 0.2rem", fontWeight: 700 }}>{profile.display_name}</p>
                    <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
                      {profile.city ?? UX_ACCUEIL.cityMissing} · {socialIntentLabel(profile.social_intent)} ·{" "}
                      {mealIntentLabel(profile.meal_intent)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/repas/nouveau?guest=${encodeURIComponent(profile.id)}`}
                  className="ptg-btn-primary"
                  style={{
                    textAlign: "center",
                    textDecoration: "none",
                    justifyContent: "center",
                    width: "100%",
                    fontSize: "var(--ptg-text-ui-sm)",
                  }}
                >
                  {GROWTH_SURPRISE.propose}
                </Link>
              </div>
            ))}
          </div>
          <p className="ptg-type-body" style={{ margin: "0 0 0.85rem", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
            {compatibleStrict ? GROWTH_SURPRISE.compatibleNote : GROWTH_SURPRISE.softNote}
          </p>
          <div className="ptg-stack ptg-stack--compact">
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" className="ptg-btn-ghost" onClick={() => void roll()}>
                {GROWTH_SURPRISE.again}
              </button>
              <button type="button" className="ptg-btn-ghost" onClick={dismiss}>
                {GROWTH_SURPRISE.refuse}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
