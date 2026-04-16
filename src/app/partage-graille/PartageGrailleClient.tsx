"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { displayInitials } from "@/lib/display-initials";
import { trackGrowthEvent } from "@/lib/growth-events";
import { GROWTH_MICRO_WIN, GROWTH_MODULE_SHARE } from "@/lib/growth-copy";
import { UX_BACK } from "@/lib/ux-copy";

type Offer = {
  id: string;
  host_display_name: string;
  host_photo_url: string | null;
  city: string;
  title: string;
  dish_type: string | null;
  allergens: string | null;
  quantity_parts: number;
  mode: string;
  chip_in_amount_cents: number | null;
  status: string;
  created_at: string;
};

export function PartageGrailleClient() {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [title, setTitle] = useState("");
  const [dishType, setDishType] = useState("");
  const [allergens, setAllergens] = useState("");
  const [quantity, setQuantity] = useState(2);
  const [mode, setMode] = useState<"gift" | "chip_in">("gift");
  const [chipEur, setChipEur] = useState("3");
  const [submitBusy, setSubmitBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [reserveBusy, setReserveBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/share-offers");
    if (!res.ok) {
      const { message } = await readApiError(res);
      setOffers(null);
      setErr(message);
      setBusy(false);
      return;
    }
    const j = (await res.json()) as { offers?: Offer[] };
    setOffers(j.offers ?? []);
    setBusy(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setSubmitBusy(true);
    setToast(null);
    const chip_in_amount_cents =
      mode === "chip_in" ? Math.round(parseFloat(chipEur.replace(",", ".")) * 100) : undefined;
    const res = await fetch("/api/share-offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        dish_type: dishType.trim() || undefined,
        allergens: allergens.trim() || undefined,
        quantity_parts: quantity,
        mode,
        chip_in_amount_cents,
      }),
    });
    setSubmitBusy(false);
    if (!res.ok) {
      setToast((await readApiError(res)).message);
      return;
    }
    void trackGrowthEvent({ event: "module_share_publish", context: "partage-graille" });
    setTitle("");
    setDishType("");
    setAllergens("");
    setToast("C’est en ligne. Merci pour la clarté sur les ingrédients.");
    void load();
  }

  async function reserve(offerId: string) {
    setReserveBusy(offerId);
    setToast(null);
    const res = await fetch(`/api/share-offers/${offerId}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parts: 1 }),
    });
    setReserveBusy(null);
    if (!res.ok) {
      setToast((await readApiError(res)).message);
      return;
    }
    void trackGrowthEvent({ event: "module_share_reserve", context: "partage-graille", metadata: { offerId } });
    setToast("Part réservée. Écris à ton hôte pour le lieu / l’heure.");
    void load();
  }

  return (
    <>
      <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.5rem", fontWeight: 700 }}>{GROWTH_MODULE_SHARE.cta}</p>
        <form onSubmit={(e) => void publish(e)} className="ptg-stack ptg-stack--dense">
          <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Nom du plat
            <input
              className="ptg-choice"
              style={{ width: "100%", marginTop: "0.25rem" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              placeholder="Ex. Tajine légumes"
            />
          </label>
          <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Type (optionnel)
            <input
              className="ptg-choice"
              style={{ width: "100%", marginTop: "0.25rem" }}
              value={dishType}
              onChange={(e) => setDishType(e.target.value)}
              maxLength={80}
            />
          </label>
          <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Allergènes / précisions
            <textarea
              className="ptg-choice"
              style={{ width: "100%", marginTop: "0.25rem", minHeight: "4rem" }}
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              maxLength={2000}
            />
          </label>
          <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
            Parts dispo
            <input
              type="number"
              min={1}
              max={99}
              className="ptg-choice"
              style={{ width: "100%", marginTop: "0.25rem" }}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </label>
          <div role="radiogroup" aria-label="Comment tu partages ce plat">
            <p style={{ margin: "0 0 0.35rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)", fontWeight: 600 }}>
              C’est comment pour toi ?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              <button
                type="button"
                role="radio"
                aria-checked={mode === "gift"}
                className={mode === "gift" ? "ptg-filter-chip ptg-filter-chip--active" : "ptg-filter-chip"}
                onClick={() => setMode("gift")}
              >
                {GROWTH_MODULE_SHARE.modeGift}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === "chip_in"}
                className={mode === "chip_in" ? "ptg-filter-chip ptg-filter-chip--active" : "ptg-filter-chip"}
                onClick={() => setMode("chip_in")}
              >
                {GROWTH_MODULE_SHARE.modeChipIn}
              </button>
            </div>
          </div>
          {mode === "chip_in" && (
            <label className="ptg-type-body" style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
              Participation (€)
              <input
                className="ptg-choice"
                style={{ width: "100%", marginTop: "0.25rem" }}
                inputMode="decimal"
                value={chipEur}
                onChange={(e) => setChipEur(e.target.value)}
                required
              />
            </label>
          )}
          <button type="submit" className="ptg-btn-primary" disabled={submitBusy}>
            {submitBusy ? "Publication…" : "Publier l’offre"}
          </button>
        </form>
      </div>

      {toast && (
        <p className="ptg-banner" style={{ marginBottom: "1rem", fontSize: "var(--ptg-text-ui-sm)" }} role="status">
          {toast}
        </p>
      )}

      {busy && <p className="ptg-type-body">Chargement des offres…</p>}
      {err && (
        <p className="ptg-banner ptg-banner-warn" role="alert">
          {err}
        </p>
      )}

      {!busy && !err && offers && offers.length === 0 && (
        <p className="ptg-type-body" style={{ marginBottom: "1rem" }}>
          Rien dans ta ville pour l’instant. Sois le premier à proposer un plat.
        </p>
      )}

      {offers && offers.length > 0 && (
        <ul className="ptg-list-plain" style={{ margin: "1rem 0 0" }}>
          {offers.map((o) => (
            <li key={o.id} className="ptg-surface ptg-surface--static ptg-card">
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                {o.host_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.host_photo_url}
                    alt=""
                    width={44}
                    height={44}
                    className="ptg-avatar"
                    style={{ objectFit: "cover", padding: 0 }}
                  />
                ) : (
                  <span className="ptg-avatar" aria-hidden>
                    {displayInitials(o.host_display_name)}
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 0.2rem", fontWeight: 700 }}>{o.title}</p>
                  <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
                    {o.host_display_name} · {o.city}
                    {o.dish_type ? ` · ${o.dish_type}` : ""}
                  </p>
                  {o.allergens && (
                    <p className="ptg-type-body" style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-sm)" }}>
                      <strong>Infos :</strong> {o.allergens}
                    </p>
                  )}
                  <p className="ptg-type-body" style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-sm)" }}>
                    {o.mode === "gift"
                      ? `${o.quantity_parts} part(s) · don`
                      : `${o.quantity_parts} part(s) · participation ${o.chip_in_amount_cents != null ? (o.chip_in_amount_cents / 100).toFixed(2) : "?"} €`}
                  </p>
                  <button
                    type="button"
                    className="ptg-btn-primary"
                    style={{ marginTop: "0.65rem", fontSize: "var(--ptg-text-ui-sm)" }}
                    disabled={reserveBusy === o.id}
                    onClick={() => void reserve(o.id)}
                  >
                    {reserveBusy === o.id ? "…" : "Réserver 1 part"}
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
          {UX_BACK.appAccueil}
        </Link>
      </div>
    </>
  );
}
