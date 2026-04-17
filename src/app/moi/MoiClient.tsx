"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { trackGrowthEvent } from "@/lib/growth-events";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { UX_BACK, UX_LOADING, UX_MOI } from "@/lib/ux-copy";

type Session = "unknown" | "out" | "in";
type NudgeLevel = "calme" | "normal" | "off";
type NotificationPrefs = {
  quietStartHour: number;
  quietEndHour: number;
  maxPerDay: number;
};
type InAppNotification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  cta_href: string | null;
  meta?: Record<string, unknown> | null;
  read_at: string | null;
  acknowledged_at?: string | null;
  acknowledged_by_user_id?: string | null;
  created_at: string;
};
type FeedbackKind = "first_experience" | "first_meal" | "overall_like";
type FeedbackPrompt = {
  kind: FeedbackKind;
  question: string;
  options: { score: number; label: string }[];
};

export function MoiClient() {
  const router = useRouter();
  const [session, setSession] = useState<Session>("unknown");
  const [signingOut, setSigningOut] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [profileCheckFailed, setProfileCheckFailed] = useState(false);
  const [nudgeLevel, setNudgeLevel] = useState<NudgeLevel>("normal");
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    quietStartHour: 22,
    quietEndHour: 8,
    maxPerDay: 1,
  });
  const [savingNudge, setSavingNudge] = useState(false);
  const [nudgeStatus, setNudgeStatus] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [feedbackPrompt, setFeedbackPrompt] = useState<FeedbackPrompt | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);
  const [feedbackUnavailable, setFeedbackUnavailable] = useState(false);

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
    const json = (await res.json()) as {
      settings?: {
        nudge_level?: string;
        nudge_quiet_start_hour?: number;
        nudge_quiet_end_hour?: number;
        nudge_max_per_day?: number;
      } | null;
    };
    const level = json.settings?.nudge_level;
    if (level === "calme" || level === "normal" || level === "off") {
      setNudgeLevel(level);
    }
    setNotifPrefs({
      quietStartHour: Number.isInteger(json.settings?.nudge_quiet_start_hour)
        ? (json.settings?.nudge_quiet_start_hour as number)
        : 22,
      quietEndHour: Number.isInteger(json.settings?.nudge_quiet_end_hour)
        ? (json.settings?.nudge_quiet_end_hour as number)
        : 8,
      maxPerDay: Number.isInteger(json.settings?.nudge_max_per_day)
        ? (json.settings?.nudge_max_per_day as number)
        : 1,
    });
    setSession("in");
    setProfileReady(true);
  }, []);

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    const res = await fetch("/api/notifications");
    setNotificationsLoading(false);
    if (!res.ok) return;
    const json = (await res.json()) as {
      notifications?: InAppNotification[];
      unread_count?: number;
    };
    setNotifications(json.notifications ?? []);
    setUnreadCount(Number(json.unread_count ?? 0));
  }, []);

  const loadFeedbackPrompt = useCallback(async () => {
    setFeedbackLoading(true);
    setFeedbackUnavailable(false);
    const res = await fetch("/api/feedback");
    setFeedbackLoading(false);
    if (!res.ok) {
      setFeedbackPrompt(null);
      setFeedbackUnavailable(true);
      return;
    }
    const json = (await res.json()) as { next_prompt?: FeedbackPrompt | null };
    setFeedbackPrompt(json.next_prompt ?? null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (session !== "in") return;
    void loadNotifications();
    void loadFeedbackPrompt();
  }, [loadFeedbackPrompt, loadNotifications, session]);

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

  async function saveNotifPrefs(next: NotificationPrefs) {
    if (savingNudge) return;
    setSavingNudge(true);
    setNudgeStatus(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nudge_quiet_start_hour: next.quietStartHour,
        nudge_quiet_end_hour: next.quietEndHour,
        nudge_max_per_day: next.maxPerDay,
      }),
    });
    setSavingNudge(false);
    if (!res.ok) {
      setNudgeStatus("Impossible de sauvegarder les préférences de notifications.");
      return;
    }
    setNotifPrefs(next);
    setNudgeStatus("Préférences notifications mises à jour.");
  }

  async function markNotificationsRead(ids?: string[]) {
    const body = ids && ids.length > 0 ? { ids } : { mark_all_read: true };
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return;
    const json = (await res.json()) as {
      notifications?: InAppNotification[];
      unread_count?: number;
    };
    setNotifications(json.notifications ?? []);
    setUnreadCount(Number(json.unread_count ?? 0));
  }

  async function sendFeedback(score: number) {
    if (!feedbackPrompt || feedbackSaving) return;
    setFeedbackSaving(true);
    setFeedbackStatus(null);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: feedbackPrompt.kind,
        score,
        choice: feedbackPrompt.options.find((o) => o.score === score)?.label ?? null,
      }),
    });
    setFeedbackSaving(false);
    if (!res.ok) {
      setFeedbackStatus("Impossible d’enregistrer ton avis pour le moment.");
      return;
    }
    setFeedbackStatus("Merci, ton avis est bien pris en compte.");
    await loadFeedbackPrompt();
    void trackGrowthEvent({
      event: "feedback_submitted",
      context: "moi",
      metadata: { kind: feedbackPrompt.kind, score },
    });
  }

  function isCriticalGrowthNotification(n: InAppNotification): boolean {
    if (!(n.kind === "growth_feedback_alert" || n.kind === "growth_weekly_digest")) return false;
    const metaRisk = typeof n.meta?.risk_level === "string" ? n.meta.risk_level : null;
    return metaRisk === "critical" || n.kind === "growth_feedback_alert";
  }

  function acknowledgedLabel(n: InAppNotification): string | null {
    if (!n.acknowledged_at) return null;
    const when = new Date(n.acknowledged_at).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return `Pris en charge le ${when}`;
  }

  async function acknowledgeCriticalAlert(n: InAppNotification) {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acknowledge_ids: [n.id] }),
    });
    if (!res.ok) return;
    const json = (await res.json()) as {
      notifications?: InAppNotification[];
      unread_count?: number;
    };
    setNotifications(json.notifications ?? []);
    setUnreadCount(Number(json.unread_count ?? 0));
    void trackGrowthEvent({
      event: "growth_alert_acknowledged",
      context: "moi",
      metadata: { notification_id: n.id, kind: n.kind, risk_level: n.meta?.risk_level ?? null, persisted: true },
    });
  }

  useEffect(() => {
    if (session !== "in") return;
    if (notificationsLoading) return;
    if (unreadCount <= 0) return;
    void markNotificationsRead();
    // Intention UX: ouvrir "Moi" équivaut à "vu", on retire le badge global sans supprimer l'historique.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, notificationsLoading, unreadCount]);

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
        <AppNav current="moi" />
        <PtgMenuCard variant="apricot" stamp="À ton rythme">
          <div className="ptg-page-head">
            <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
              {UX_MOI.title}
            </h1>
            <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
            <p className="ptg-type-body" style={{ margin: "0 0 1.25rem" }}>
              {UX_MOI.intro}
            </p>
          </div>
        </PtgMenuCard>

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
            <Link href="/partenaires" className="ptg-moi-link-row">
              {UX_MOI.navPartenaires}
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
              <div style={{ marginTop: "0.65rem", display: "grid", gap: "0.5rem" }}>
                <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)" }}>
                  Silence nocturne: {notifPrefs.quietStartHour}h a {notifPrefs.quietEndHour}h
                </label>
                <input
                  type="range"
                  min={20}
                  max={23}
                  step={1}
                  value={notifPrefs.quietStartHour}
                  disabled={savingNudge}
                  onChange={(e) =>
                    setNotifPrefs((p) => ({
                      ...p,
                      quietStartHour: Number(e.target.value),
                    }))
                  }
                />
                <input
                  type="range"
                  min={6}
                  max={10}
                  step={1}
                  value={notifPrefs.quietEndHour}
                  disabled={savingNudge}
                  onChange={(e) =>
                    setNotifPrefs((p) => ({
                      ...p,
                      quietEndHour: Number(e.target.value),
                    }))
                  }
                />
                <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)" }}>
                  Maximum de notifications par jour: {notifPrefs.maxPerDay}
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={notifPrefs.maxPerDay}
                  disabled={savingNudge}
                  onChange={(e) =>
                    setNotifPrefs((p) => ({
                      ...p,
                      maxPerDay: Number(e.target.value),
                    }))
                  }
                />
                <button
                  type="button"
                  className="ptg-btn-ghost"
                  disabled={savingNudge}
                  onClick={() => void saveNotifPrefs(notifPrefs)}
                >
                  Enregistrer les preferences notifications
                </button>
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
          <li>
            <div className="ptg-surface ptg-surface--static ptg-card">
              <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--ptg-text-md-sm)" }}>Ton avis rapide</p>
              <p className="ptg-type-body" style={{ margin: "0.35rem 0 0.55rem", fontSize: "var(--ptg-text-sm)" }}>
                1 clic suffit: on ajuste le produit selon ton ressenti.
              </p>
              {feedbackLoading ? (
                <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }} aria-live="polite">
                  {UX_LOADING}
                </p>
              ) : feedbackUnavailable ? (
                <>
                  <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
                    Le module d’avis est temporairement indisponible.
                  </p>
                  <div className="ptg-chip-row" style={{ marginTop: "0.5rem" }}>
                    <button type="button" className="ptg-chip" disabled={feedbackSaving} onClick={() => void loadFeedbackPrompt()}>
                      Réessayer
                    </button>
                  </div>
                </>
              ) : !feedbackPrompt ? (
                <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
                  Merci, tu as déjà répondu aux évaluations clés.
                </p>
              ) : (
                <>
                  <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)" }}>
                    {feedbackPrompt.question}
                  </p>
                  <div className="ptg-chip-row">
                    {feedbackPrompt.options.map((opt) => (
                      <button
                        key={`${feedbackPrompt.kind}-${opt.score}`}
                        type="button"
                        className="ptg-chip"
                        disabled={feedbackSaving}
                        onClick={() => void sendFeedback(opt.score)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {feedbackStatus ? (
                <p className="ptg-type-body" style={{ margin: "0.6rem 0 0", fontSize: "var(--ptg-text-sm)" }} role="status">
                  {feedbackStatus}
                </p>
              ) : null}
            </div>
          </li>
          <li>
            <div className="ptg-surface ptg-surface--static ptg-card">
              <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--ptg-text-md-sm)" }}>
                Notifications in-app {unreadCount > 0 ? `(${unreadCount} non lues)` : ""}
              </p>
              <p className="ptg-type-body" style={{ margin: "0.35rem 0 0.55rem", fontSize: "var(--ptg-text-sm)" }}>
                Rappels repas et confirmations importantes apparaissent ici.
              </p>
              <div className="ptg-chip-row" style={{ marginBottom: "0.55rem" }}>
                <button
                  type="button"
                  className="ptg-chip"
                  disabled={notificationsLoading || unreadCount <= 0}
                  onClick={() => void markNotificationsRead()}
                >
                  Tout marquer lu
                </button>
              </div>
              {notificationsLoading ? (
                <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }} aria-live="polite">
                  {UX_LOADING}
                </p>
              ) : notifications.length === 0 ? (
                <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
                  Aucune notification pour le moment.
                </p>
              ) : (
                <ul className="ptg-list-plain ptg-list-plain--tight" style={{ margin: 0 }}>
                  {notifications.map((n) => (
                    <li key={n.id}>
                      {(() => {
                        const ackText = acknowledgedLabel(n);
                        return (
                      <div className="ptg-surface ptg-surface--static ptg-card ptg-card--compact">
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--ptg-text-ui-sm)" }}>
                          {n.title} {!n.read_at ? "•" : ""}
                        </p>
                        <p className="ptg-type-body" style={{ margin: "0.25rem 0 0", fontSize: "var(--ptg-text-sm)" }}>
                          {n.body}
                        </p>
                        {ackText ? (
                          <p className="ptg-type-body" style={{ margin: "0.3rem 0 0", fontSize: "var(--ptg-text-xs)", opacity: 0.82 }}>
                            {ackText}
                          </p>
                        ) : null}
                        <div className="ptg-chip-row" style={{ marginTop: "0.4rem" }}>
                          {!n.read_at ? (
                            <button type="button" className="ptg-chip" onClick={() => void markNotificationsRead([n.id])}>
                              Marquer lu
                            </button>
                          ) : null}
                          {isCriticalGrowthNotification(n) && !n.acknowledged_at ? (
                            <button type="button" className="ptg-chip" onClick={() => void acknowledgeCriticalAlert(n)}>
                              Pris en charge
                            </button>
                          ) : null}
                          {n.cta_href ? (
                            <Link href={n.cta_href} className="ptg-chip" onClick={() => (!n.read_at ? void markNotificationsRead([n.id]) : undefined)}>
                              Ouvrir
                            </Link>
                          ) : null}
                        </div>
                      </div>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              )}
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
            {UX_BACK.appAccueil}
          </Link>
        </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
