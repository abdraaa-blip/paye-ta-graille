"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { trackGrowthEvent } from "@/lib/growth-events";
import { GROWTH_MICRO_WIN, GROWTH_MODULE_PAY } from "@/lib/growth-copy";
import { mealStatusLabel } from "@/lib/meal-status-labels";
import { AuthPromptLink } from "@/components/AuthPromptLink";
import { type PaymentMood, paymentMoodFromSearchParam } from "@/lib/payment-mood";
import { UX_BACK, UX_REPAS } from "@/lib/ux-copy";

type Meal = {
  id: string;
  status: string;
  host_user_id: string;
  guest_user_id: string | null;
  updated_at?: string;
};

type LedgerRow = {
  id: string;
  meal_id: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
};

export function PaiementRepasClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [entries, setEntries] = useState<LedgerRow[] | null>(null);
  const [mealId, setMealId] = useState("");
  const [amountEur, setAmountEur] = useState("25");
  const [mood, setMood] = useState<PaymentMood>("split");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sessionHint, setSessionHint] = useState(false);

  const load = useCallback(async () => {
    const [mRes, lRes] = await Promise.all([fetch("/api/meals"), fetch("/api/payments/ledger")]);
    const needAuth = mRes.status === 401 || lRes.status === 401;
    setSessionHint(needAuth);
    if (mRes.ok) {
      const j = (await mRes.json()) as { meals?: Meal[] };
      const list = j.meals ?? [];
      setMeals(list);
      setMealId((prev) => prev || list[0]?.id || "");
    } else {
      setMeals([]);
    }
    if (lRes.ok) {
      const j2 = (await lRes.json()) as { entries?: LedgerRow[] };
      setEntries(j2.entries ?? []);
    } else {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const fromUrl = paymentMoodFromSearchParam(searchParams.get("mood"));
    if (fromUrl) setMood(fromUrl);
  }, [searchParams]);

  async function pay() {
    setBusy(true);
    setErr(null);
    const cents = Math.round(parseFloat(amountEur.replace(",", ".")) * 100);
    if (!Number.isFinite(cents) || cents < 100) {
      setErr("Montant minimum 1,00 €.");
      setBusy(false);
      return;
    }
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal_id: mealId, amount_cents: cents, payment_mood: mood }),
    });
    setBusy(false);
    if (!res.ok) {
      if (res.status === 401) setSessionHint(true);
      const { message } = await readApiError(res);
      setErr(message);
      return;
    }
    const j = (await res.json()) as { url?: string };
    if (j.url) {
      void trackGrowthEvent({
        event: "module_payment_checkout_start",
        context: "paiement-repas",
        metadata: { meal_id: mealId, amount_cents: cents, payment_mood: mood },
      });
      window.location.href = j.url;
      return;
    }
    setErr("Pas d’URL de paiement reçue.");
  }

  const moodHint =
    mood === "invite"
      ? "Tu paies l’addition (ou la part que vous avez dite). Indique le montant total à régler."
      : mood === "split"
        ? "Moitié-moitié : indique ta part (environ la moitié de l’addition)."
        : "Tu es invité·e : indique le geste convenu avec l’hôte (minimum 1 € ici pour passer par Stripe).";

  function pickMood(next: PaymentMood) {
    setMood(next);
    setErr(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mood", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      {sessionHint && (
        <p className="ptg-banner" style={{ marginBottom: "0.75rem" }} role="status">
          {UX_REPAS.errAuth} <AuthPromptLink />
        </p>
      )}
      <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>
        C’est quoi l’addition pour toi ?
      </p>
      <div
        role="radiogroup"
        aria-label="Mode de partage du repas"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(7.5rem, 1fr))",
          gap: "0.45rem",
          marginBottom: "0.65rem",
        }}
      >
        {(
          [
            { id: "invite" as const, label: GROWTH_MODULE_PAY.chipInvite },
            { id: "split" as const, label: GROWTH_MODULE_PAY.chipSplit },
            { id: "guest" as const, label: GROWTH_MODULE_PAY.chipGuest },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mood === id}
            className={mood === id ? "ptg-filter-chip ptg-filter-chip--active" : "ptg-filter-chip"}
            style={{ justifyContent: "center", width: "100%", font: "inherit" }}
            onClick={() => pickMood(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="ptg-type-body" style={{ margin: "0 0 1rem", lineHeight: 1.5, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
        {moodHint}
      </p>

      <p className="ptg-type-body" style={{ margin: "0 0 1rem", lineHeight: 1.55, fontSize: "var(--ptg-text-ui-sm)" }}>
        Ta carte n’est jamais stockée ici. Paiement sécurisé via Stripe.
      </p>
      <details className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Configuration technique (dev)</summary>
        <p style={{ margin: "0.5rem 0 0", lineHeight: 1.5 }}>
          En prod : <code style={{ fontSize: "0.9em" }}>STRIPE_SECRET_KEY</code>, webhook vers{" "}
          <code style={{ fontSize: "0.9em" }}>/api/stripe/webhook</code>,{" "}
          <code style={{ fontSize: "0.9em" }}>STRIPE_WEBHOOK_SECRET</code>.
        </p>
      </details>

      <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>Payer une contribution</p>
        {meals && meals.length === 0 && !sessionHint && (
          <p className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Aucun repas pour l’instant.{" "}
            <Link href="/decouvrir" style={{ fontWeight: 600 }}>
              Propose d’abord un repas
            </Link>
            .
          </p>
        )}
        {meals && meals.length > 0 && (
          <div className="ptg-stack ptg-stack--dense">
            <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
              Repas
              <select
                className="ptg-choice"
                style={{ width: "100%", marginTop: "0.25rem" }}
                value={mealId}
                onChange={(e) => setMealId(e.target.value)}
              >
                {meals.map((m) => {
                  const d = m.updated_at ? new Date(m.updated_at) : null;
                  const when =
                    d && !Number.isNaN(d.getTime())
                      ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                      : "";
                  return (
                    <option key={m.id} value={m.id}>
                      {mealStatusLabel(m.status)}
                      {when ? ` · ${when}` : ""} · {m.id.slice(0, 8)}…
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
              Montant (€)
              <input
                className="ptg-choice"
                style={{ width: "100%", marginTop: "0.25rem" }}
                inputMode="decimal"
                value={amountEur}
                onChange={(e) => setAmountEur(e.target.value)}
              />
            </label>
            <button type="button" className="ptg-btn-primary" disabled={busy} onClick={() => void pay()}>
              {busy ? "Redirection…" : "Ouvrir le paiement sécurisé"}
            </button>
          </div>
        )}
        {err && (
          <p className="ptg-banner ptg-banner-warn" style={{ marginTop: "0.75rem" }} role="alert">
            {err}
          </p>
        )}
      </div>

      {entries && entries.length > 0 && (
        <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>Dernières opérations</p>
          <ul className="ptg-prose-list ptg-prose-list--sm">
            {entries.map((e) => (
              <li key={e.id} style={{ marginBottom: "0.35rem" }}>
                {(e.amount_cents / 100).toFixed(2)} € · {e.status}
                {e.meal_id ? ` · repas ${e.meal_id.slice(0, 8)}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-olive)" }}>
        {GROWTH_MICRO_WIN}
      </p>

      <div className="ptg-stack ptg-stack--compact">
        <Link href="/graille-plus" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
          Graille+
        </Link>
        <Link href="/accueil" style={{ textAlign: "center", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
          {UX_BACK.appAccueil}
        </Link>
      </div>
    </>
  );
}
