"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { AppNav } from "@/components/AppNav";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { trackGrowthEvent } from "@/lib/growth-events";
import { UX_NOUVEAU_REPAS } from "@/lib/ux-copy";

export function NouveauRepasForm({ guestId }: { guestId: string }) {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  /** Repas groupe : active « qui ramène quoi » après le match (module coordination, pas les repas duo simples). */
  const [groupCoordination, setGroupCoordination] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSending(true);
    const body: Record<string, unknown> = { guest_user_id: guestId };
    if (groupCoordination) body.format = "group";
    if (budget.trim()) body.budget_band = budget.trim();
    if (windowStart) body.window_start = new Date(windowStart).toISOString();
    if (windowEnd) body.window_end = new Date(windowEnd).toISOString();

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSending(false);
    if (!res.ok) {
      const { message } = await readApiError(res);
      setErr(message);
      return;
    }
    const json = (await res.json()) as { meal?: { id: string; format?: string } };
    if (json.meal?.id) {
      void trackGrowthEvent({
        event: "meal_proposed",
        context: "nouveau_repas",
        metadata: { meal_id: json.meal.id, format: json.meal.format ?? (groupCoordination ? "group" : "duo") },
      });
      router.push(`/repas/${json.meal.id}`);
      return;
    }
    setMsg(UX_NOUVEAU_REPAS.created);
  }

  return (
    <PtgAppFlow>
      <div className="ptg-page-inner">
          <AppNav />
          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-ui-sm)" }}>
            <Link href="/decouvrir" className="ptg-link-back" style={{ marginBottom: 0 }}>
              ← Autour de toi
            </Link>
          </p>
          <PtgMenuCard variant="ember" stamp="Nouvelle table">
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                {UX_NOUVEAU_REPAS.title}
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 1rem" }} />
              <p className="ptg-type-body" style={{ margin: "0 0 0" }}>
                {UX_NOUVEAU_REPAS.intro}
              </p>
            </div>
          </PtgMenuCard>

          <label
            className="ptg-surface ptg-surface--static ptg-card--compact"
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={groupCoordination}
              onChange={(e) => setGroupCoordination(e.target.checked)}
              style={{ marginTop: "0.2rem" }}
            />
            <span className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)" }}>
              {UX_NOUVEAU_REPAS.groupLabel}
            </span>
          </label>

          {err && (
            <p className="ptg-banner ptg-banner-warn" role="alert">
              {err}
            </p>
          )}
          {msg && <p className="ptg-banner">{msg}</p>}

          <form onSubmit={submit}>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="budget">
                {UX_NOUVEAU_REPAS.budget}
              </label>
              <input
                id="budget"
                className="ptg-input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={UX_NOUVEAU_REPAS.budgetPh}
              />
            </div>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="ws">
                {UX_NOUVEAU_REPAS.slotStart}
              </label>
              <input id="ws" type="datetime-local" className="ptg-input" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} />
            </div>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="we">
                {UX_NOUVEAU_REPAS.slotEnd}
              </label>
              <input id="we" type="datetime-local" className="ptg-input" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} />
            </div>
            <button type="submit" className="ptg-btn-primary" style={{ width: "100%" }} disabled={sending}>
              {sending ? UX_NOUVEAU_REPAS.submitBusy : UX_NOUVEAU_REPAS.submit}
            </button>
          </form>
      </div>
    </PtgAppFlow>
  );
}
