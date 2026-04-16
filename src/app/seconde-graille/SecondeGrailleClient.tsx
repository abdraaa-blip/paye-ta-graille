"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { displayInitials } from "@/lib/display-initials";
import { trackGrowthEvent } from "@/lib/growth-events";
import { GROWTH_MICRO_WIN, GROWTH_MODULE_RESCUE } from "@/lib/growth-copy";

type Listing = {
  id: string;
  publisher_display_name: string;
  publisher_photo_url: string | null;
  city: string;
  description: string;
  price_cents: number;
  max_claims: number;
  window_start: string | null;
  window_end: string | null;
  status: string;
  created_at: string;
};

export function SecondeGrailleClient() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [description, setDescription] = useState("");
  const [priceEur, setPriceEur] = useState("0");
  const [submitBusy, setSubmitBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [claimBusy, setClaimBusy] = useState<string | null>(null);
  const [windowStartLocal, setWindowStartLocal] = useState("");
  const [windowEndLocal, setWindowEndLocal] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/food-rescue");
    if (!res.ok) {
      setListings(null);
      setErr((await readApiError(res)).message);
      setBusy(false);
      return;
    }
    const j = (await res.json()) as { listings?: Listing[] };
    setListings(j.listings ?? []);
    setBusy(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setSubmitBusy(true);
    setToast(null);
    const hasStart = Boolean(windowStartLocal.trim());
    const hasEnd = Boolean(windowEndLocal.trim());
    if (hasStart !== hasEnd) {
      setSubmitBusy(false);
      setToast("Créneau : renseigne le début et la fin, ou laisse les deux vides.");
      return;
    }
    const price_cents = Math.round(parseFloat(priceEur.replace(",", ".")) * 100);
    const body: Record<string, unknown> = {
      description: description.trim(),
      price_cents: Number.isFinite(price_cents) ? price_cents : 0,
    };
    if (hasStart && hasEnd) {
      body.window_start = new Date(windowStartLocal).toISOString();
      body.window_end = new Date(windowEndLocal).toISOString();
    }
    const res = await fetch("/api/food-rescue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSubmitBusy(false);
    if (!res.ok) {
      setToast((await readApiError(res)).message);
      return;
    }
    void trackGrowthEvent({ event: "module_rescue_publish", context: "seconde-graille" });
    setDescription("");
    setPriceEur("0");
    setWindowStartLocal("");
    setWindowEndLocal("");
    setToast("Annonce publiée. Quelqu’un peut en profiter ce soir.");
    void load();
  }

  async function claim(id: string) {
    setClaimBusy(id);
    setToast(null);
    const res = await fetch(`/api/food-rescue/${id}/claim`, { method: "POST" });
    setClaimBusy(null);
    if (!res.ok) {
      setToast((await readApiError(res)).message);
      return;
    }
    void trackGrowthEvent({ event: "module_rescue_claim", context: "seconde-graille", metadata: { listingId: id } });
    setToast("C’est noté. Contacte la personne pour le retrait.");
    void load();
  }

  return (
    <>
      <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>Publier un surplus</p>
        <form onSubmit={(e) => void publish(e)} className="ptg-stack ptg-stack--dense">
          <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Description honnête
            <textarea
              className="ptg-choice"
              style={{ width: "100%", marginTop: "0.25rem", minHeight: "4.5rem" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={2000}
              placeholder="Quoi, quantité approximative, jusqu’à quand…"
            />
          </label>
          <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Prix (€), 0 = gratuit
            <input
              className="ptg-choice"
              style={{ width: "100%", marginTop: "0.25rem" }}
              inputMode="decimal"
              value={priceEur}
              onChange={(e) => setPriceEur(e.target.value)}
            />
          </label>
          <fieldset className="ptg-field" style={{ margin: 0, padding: 0, border: "none" }}>
            <legend className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)", marginBottom: "0.35rem" }}>
              Créneau de retrait (optionnel)
            </legend>
            <div className="ptg-stack ptg-stack--compact">
              <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)" }}>
                Début
                <input
                  type="datetime-local"
                  className="ptg-input"
                  style={{ marginTop: "0.25rem" }}
                  value={windowStartLocal}
                  onChange={(e) => setWindowStartLocal(e.target.value)}
                />
              </label>
              <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)" }}>
                Fin
                <input
                  type="datetime-local"
                  className="ptg-input"
                  style={{ marginTop: "0.25rem" }}
                  value={windowEndLocal}
                  onChange={(e) => setWindowEndLocal(e.target.value)}
                />
              </label>
            </div>
          </fieldset>
          <button type="submit" className="ptg-btn-primary" disabled={submitBusy}>
            {submitBusy ? "Envoi…" : "Mettre en ligne"}
          </button>
        </form>
      </div>

      {toast && (
        <p className="ptg-banner" style={{ marginBottom: "1rem", fontSize: "var(--ptg-text-ui-sm)" }} role="status">
          {toast}
        </p>
      )}

      <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>{GROWTH_MODULE_RESCUE.cta} près de toi</p>
      {busy && <p className="ptg-type-body">Chargement…</p>}
      {err && (
        <p className="ptg-banner ptg-banner-warn" role="alert">
          {err}
        </p>
      )}

      {!busy && !err && listings && listings.length === 0 && (
        <p className="ptg-type-body">Rien à afficher pour l’instant dans ta ville.</p>
      )}

      {listings && listings.length > 0 && (
        <ul className="ptg-list-plain" style={{ margin: "0.75rem 0 0" }}>
          {listings.map((l) => (
            <li key={l.id} className="ptg-surface ptg-surface--static ptg-card">
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                {l.publisher_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.publisher_photo_url}
                    alt=""
                    width={44}
                    height={44}
                    className="ptg-avatar"
                    style={{ objectFit: "cover", padding: 0 }}
                  />
                ) : (
                  <span className="ptg-avatar" aria-hidden>
                    {displayInitials(l.publisher_display_name)}
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="ptg-type-body" style={{ margin: "0 0 0.35rem", fontSize: "var(--ptg-text-ui-sm)", whiteSpace: "pre-wrap" }}>
                    {l.description}
                  </p>
                  <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
                    {l.publisher_display_name} · {l.price_cents === 0 ? "Gratuit" : `${(l.price_cents / 100).toFixed(2)} €`}
                  </p>
                  {l.window_start && l.window_end && (
                    <p className="ptg-type-body" style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-xs)" }}>
                      Créneau :{" "}
                      {new Date(l.window_start).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })} →{" "}
                      {new Date(l.window_end).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  )}
                  <button
                    type="button"
                    className="ptg-btn-primary"
                    style={{ marginTop: "0.65rem", fontSize: "var(--ptg-text-ui-sm)" }}
                    disabled={claimBusy === l.id}
                    onClick={() => void claim(l.id)}
                  >
                    {claimBusy === l.id ? "…" : "Je récupère"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="ptg-type-body" style={{ margin: "1rem 0", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-olive)" }}>
        {GROWTH_MICRO_WIN}
      </p>

      <div className="ptg-stack ptg-stack--compact">
        <Link href="/graille-plus" className="ptg-btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
          Graille+
        </Link>
        <Link href="/accueil" style={{ textAlign: "center", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
          ← Accueil
        </Link>
      </div>
    </>
  );
}
