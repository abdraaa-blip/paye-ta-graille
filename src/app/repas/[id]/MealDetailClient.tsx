"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { readApiError } from "@/lib/api/read-api-error";
import { AppNav } from "@/components/AppNav";
import { PtgMenuCard } from "@/components/PtgMenuCard";
import { PtgAppFlow } from "@/components/PtgAppFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { MealPotluckPanel } from "@/components/MealPotluckPanel";
import { RestaurantsNearbyMap } from "@/components/RestaurantsNearbyMap";
import { COMPANIONS_MEAL_COMPLETED_LINK_LABEL, COMPANIONS_NAV_LABEL } from "@/lib/companions-copy";
import { mealStatusLabel } from "@/lib/meal-status-labels";

type Venue = {
  id: string;
  name: string;
  address: string | null;
  place_id: string | null;
};

function mapsHref(venue: Venue): string {
  if (venue.place_id) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}&query_place_id=${encodeURIComponent(venue.place_id)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venue.name, venue.address].filter(Boolean).join(" "))}`;
}

type Meal = {
  id: string;
  status: string;
  host_user_id: string;
  guest_user_id: string | null;
  window_start: string | null;
  window_end: string | null;
  budget_band: string | null;
  format?: string;
  potluck?: unknown;
  updated_at: string;
  venues: Venue[] | null;
};

type Msg = { id: string; sender_id: string; body: string; created_at: string };

export function MealDetailClient({ mealId, userId }: { mealId: string; userId: string }) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venuePlaceId, setVenuePlaceId] = useState<string | null>(null);
  const [venueLat, setVenueLat] = useState<number | null>(null);
  const [venueLng, setVenueLng] = useState<number | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placePredictions, setPlacePredictions] = useState<{ description: string; place_id: string }[]>([]);
  const [placeResults, setPlaceResults] = useState<
    { place_id: string; name: string; address: string | null; lat: number | null; lng: number | null }[]
  >([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [nearbyBusy, setNearbyBusy] = useState(false);
  const [placesNote, setPlacesNote] = useState<string | null>(null);
  const [chatBody, setChatBody] = useState("");
  const [busy, setBusy] = useState(false);

  const loadMeal = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/meals/${mealId}`);
    if (!res.ok) {
      setError((await readApiError(res)).message);
      setMeal(null);
      return;
    }
    const json = (await res.json()) as { meal: Meal };
    setMeal(json.meal);
  }, [mealId]);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/meals/${mealId}/messages`);
    if (!res.ok) return;
    const json = (await res.json()) as { messages: Msg[] };
    setMessages(json.messages ?? []);
  }, [mealId]);

  useEffect(() => {
    void loadMeal();
  }, [loadMeal]);

  const applyPlaceResult = useCallback(
    (r: {
      place_id: string;
      name: string;
      address: string | null;
      lat: number | null;
      lng: number | null;
    }) => {
      setVenueName(r.name);
      setVenueAddress(r.address ?? "");
      setVenuePlaceId(r.place_id);
      setVenueLat(r.lat);
      setVenueLng(r.lng);
      setPlaceResults([]);
      setPlacePredictions([]);
      setPlacesNote(null);
    },
    [],
  );

  const pickPlaceById = useCallback(
    async (placeId: string) => {
      setPlacesLoading(true);
      setPlacesNote(null);
      const res = await fetch(`/api/places/details?place_id=${encodeURIComponent(placeId)}`);
      const json = (await res.json()) as {
        name?: string;
        address?: string | null;
        place_id?: string;
        lat?: number | null;
        lng?: number | null;
        error?: { message?: string };
      };
      setPlacesLoading(false);
      if (!res.ok) {
        setPlacesNote(json.error?.message ?? "Détail du lieu indisponible.");
        return;
      }
      applyPlaceResult({
        place_id: json.place_id ?? placeId,
        name: json.name ?? "",
        address: json.address ?? null,
        lat: typeof json.lat === "number" ? json.lat : null,
        lng: typeof json.lng === "number" ? json.lng : null,
      });
      setPlaceQuery("");
    },
    [applyPlaceResult],
  );

  useEffect(() => {
    if (!meal) return;
    if (["venue_confirmed", "confirmed", "completed"].includes(meal.status)) {
      void loadMessages();
    } else {
      setMessages([]);
    }
  }, [meal, loadMessages]);

  const hostCanSearchPlaces =
    meal != null &&
    (meal.status === "matched" || meal.status === "venue_proposed") &&
    meal.host_user_id === userId;

  useEffect(() => {
    if (!hostCanSearchPlaces) {
      setPlaceResults([]);
      setPlacePredictions([]);
      setPlacesNote(null);
      setPlacesLoading(false);
      return;
    }
    const q = placeQuery.trim();
    if (q.length < 2) {
      setPlaceResults([]);
      setPlacePredictions([]);
      setPlacesNote(null);
      setPlacesLoading(false);
      return;
    }
    const t = setTimeout(() => {
      void (async () => {
        setPlacesLoading(true);
        setPlacesNote(null);
        setPlacePredictions([]);
        setPlaceResults([]);

        const acRes = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(q)}`);
        const acJson = (await acRes.json()) as {
          predictions?: { description: string; place_id: string }[];
          error?: { code?: string; message?: string };
        };
        if (acRes.ok && (acJson.predictions?.length ?? 0) > 0) {
          setPlacePredictions(acJson.predictions ?? []);
          setPlacesLoading(false);
          return;
        }
        if (!acRes.ok && acJson.error?.code === "places_not_configured") {
          setPlacesNote(
            "La recherche de lieux n’est pas disponible pour l’instant. Tu peux indiquer le restaurant à la main ci-dessous.",
          );
          setPlacesLoading(false);
          return;
        }

        if (q.length >= 3) {
          const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
          const json = (await res.json()) as {
            results?: typeof placeResults;
            error?: { code?: string; message?: string };
          };
          if (!res.ok) {
            if (json.error?.code === "places_not_configured") {
              setPlacesNote(
                "La recherche de lieux n’est pas disponible pour l’instant. Tu peux indiquer le restaurant à la main ci-dessous.",
              );
            } else {
              setPlacesNote(json.error?.message ?? "Recherche indisponible pour l’instant.");
            }
            setPlacesLoading(false);
            return;
          }
          const list = json.results ?? [];
          setPlaceResults(list);
          if (list.length === 0) {
            setPlacesNote("Aucun résultat : essaie un autre mot-clé ou remplis le nom à la main.");
          }
        } else {
          setPlacesNote(
            "Continue à taper ou choisis une suggestion ; au moins trois lettres ouvrent une recherche plus large.",
          );
        }
        setPlacesLoading(false);
      })();
    }, 400);
    return () => clearTimeout(t);
  }, [placeQuery, hostCanSearchPlaces]);

  async function patchStatus(status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/meals/${mealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await readApiError(res)).message);
      return;
    }
    await loadMeal();
    await loadMessages();
  }

  async function submitVenue(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/meals/${mealId}/venue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: venueName.trim(),
        address: venueAddress.trim() || null,
        place_id: venuePlaceId,
        lat: venueLat,
        lng: venueLng,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await readApiError(res)).message);
      return;
    }
    setVenueName("");
    setVenueAddress("");
    setVenuePlaceId(null);
    setVenueLat(null);
    setVenueLng(null);
    setPlaceQuery("");
    setPlaceResults([]);
    setPlacePredictions([]);
    setPlacesNote(null);
    await loadMeal();
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatBody.trim()) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/meals/${mealId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: chatBody.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await readApiError(res)).message);
      return;
    }
    setChatBody("");
    await loadMessages();
  }

  if (!meal && !error) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav />
            <p className="ptg-type-body" aria-live="polite">
              Chargement de ton repas…
            </p>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="ptg-page">
        <PtgAppFlow>
          <div className="ptg-page-inner">
            <AppNav />
            <p className="ptg-banner ptg-banner-warn">{error}</p>
            <Link href="/repas" className="ptg-link-back" style={{ marginBottom: 0 }}>
              ← Mes repas
            </Link>
          </div>
        </PtgAppFlow>
        <SiteFooter />
      </div>
    );
  }

  const isHost = userId === meal.host_user_id;
  const isGuest = userId === meal.guest_user_id;
  const venue = meal.venues?.[0] ?? null;
  const showMessages = ["venue_confirmed", "confirmed", "completed"].includes(meal.status);
  const canSendMessages = meal.status === "venue_confirmed" || meal.status === "confirmed";

  return (
    <div className="ptg-page">
      <PtgAppFlow>
        <div className="ptg-page-inner">
          <AppNav />
          <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-ui-sm)" }}>
            <Link href="/repas" className="ptg-link-back" style={{ marginBottom: 0 }}>
              ← Mes repas
            </Link>
          </p>
          <PtgMenuCard variant="kin" stamp="Ce repas">
            <div className="ptg-page-head">
              <h1 className="ptg-type-display" style={{ margin: "0 0 0.5rem" }}>
                Repas
              </h1>
              <div className="ptg-accent-rule" style={{ margin: "0 0 0.85rem" }} />
              <p style={{ margin: "0 0 0", fontSize: "var(--ptg-text-ui-sm)", color: "var(--ptg-text-muted)" }}>
                État : <strong>{mealStatusLabel(meal.status)}</strong>
                {meal.budget_band ? ` · ${meal.budget_band}` : ""}
              </p>
            </div>
          </PtgMenuCard>

          {error && (
            <p className="ptg-banner ptg-banner-warn" role="alert">
              {error}
            </p>
          )}

        {meal.format === "group" &&
          meal.guest_user_id &&
          ["matched", "venue_proposed", "venue_confirmed", "confirmed", "completed"].includes(meal.status) && (
            <MealPotluckPanel
              mealId={mealId}
              potluckRaw={meal.potluck ?? null}
              hostId={meal.host_user_id}
              guestId={meal.guest_user_id}
              currentUserId={userId}
              revision={meal.updated_at}
              onSaved={() => void loadMeal()}
            />
          )}

        {venue && (
          <div className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{venue.name}</p>
            {venue.address && (
              <p className="ptg-type-body" style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
                {venue.address}
              </p>
            )}
            <p style={{ margin: "0.65rem 0 0" }}>
              <a href={mapsHref(venue)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "var(--ptg-text-ui-sm)", fontWeight: 600 }}>
                Voir sur Maps
              </a>
            </p>
          </div>
        )}

        {meal.status === "proposed" && isGuest && (
          <>
            <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-md-sm)" }}>
              Quelqu’un te propose une table. Oui ou non : les deux sont ok, sans jugement.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <button type="button" className="ptg-btn-primary" disabled={busy} onClick={() => void patchStatus("matched")}>
              Accepter
            </button>
            <button type="button" className="ptg-btn-ghost" disabled={busy} onClick={() => void patchStatus("cancelled")}>
              Refuser
            </button>
          </div>
          </>
        )}

        {meal.status === "proposed" && isHost && (
          <>
            <p className="ptg-type-body" style={{ margin: "0 0 1rem", fontSize: "var(--ptg-text-md-sm)" }}>
              Ta proposition est en attente. Si la personne décline, ce n’est pas un échec, juste un mauvais timing.
            </p>
            <button type="button" className="ptg-btn-ghost" disabled={busy} onClick={() => void patchStatus("cancelled")}>
              Annuler la proposition
            </button>
          </>
        )}

        {meal.status === "matched" && isGuest && (
          <p className="ptg-banner" style={{ marginBottom: "1rem" }}>
            Vous vous êtes dit oui pour manger ensemble. Patiente : ton hôte choisit un lieu public. Rien à faire de ton
            côté pour l’instant.
          </p>
        )}

        {isHost && (meal.status === "matched" || meal.status === "venue_proposed") && (
          <form onSubmit={submitVenue} className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>
              {meal.status === "venue_proposed" ? "Modifier le lieu proposé" : "Proposer un lieu"}
            </p>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
              Lieu public, respect mutuel. Saisis quelques lettres pour des suggestions, lance « restos autour de moi » si tu
              acceptes la position, ou remplis le nom à la main.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <button
                type="button"
                className="ptg-btn-ghost"
                disabled={nearbyBusy || placesLoading}
                onClick={() => {
                  if (!navigator.geolocation) {
                    setPlacesNote("Géolocalisation non disponible sur cet appareil.");
                    return;
                  }
                  setNearbyBusy(true);
                  setPlacesNote(null);
                  navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                      const res = await fetch(
                        `/api/places/nearby?lat=${encodeURIComponent(String(pos.coords.latitude))}&lng=${encodeURIComponent(String(pos.coords.longitude))}&radius=1200`,
                      );
                      const json = (await res.json()) as {
                        results?: typeof placeResults;
                        error?: { code?: string; message?: string };
                      };
                      setNearbyBusy(false);
                      if (!res.ok) {
                        setPlacesNote(json.error?.message ?? "Lieux à proximité indisponibles pour l’instant.");
                        setPlaceResults([]);
                        return;
                      }
                      const list = json.results ?? [];
                      setPlacePredictions([]);
                      setPlaceResults(list);
                      if (list.length === 0) {
                        setPlacesNote("Aucun resto tout près : cherche par nom ci-dessus.");
                      }
                    },
                    () => {
                      setNearbyBusy(false);
                      setPlacesNote("Autorise la position du navigateur pour « restos autour de moi ».");
                    },
                    { enableHighAccuracy: false, timeout: 12_000, maximumAge: 60_000 },
                  );
                }}
              >
                {nearbyBusy ? "Lieux à proximité…" : "Restos autour de moi"}
              </button>
            </div>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="placeq">
                Chercher un lieu
              </label>
              <input
                id="placeq"
                className="ptg-input"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                placeholder="ex. pizza Belleville, café République…"
                autoComplete="off"
              />
            </div>
            {placesLoading && (
              <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)" }} aria-live="polite">
                Recherche…
              </p>
            )}
            {placesNote && (
              <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-sm)" }}>
                {placesNote}
              </p>
            )}
            {placePredictions.length > 0 && (
              <ul className="ptg-list-plain ptg-list-plain--tight" style={{ margin: "0 0 1rem" }}>
                {placePredictions.map((p) => (
                  <li key={p.place_id}>
                    <button
                      type="button"
                      className="ptg-choice"
                      style={{ width: "100%", textAlign: "left", padding: "0.65rem 0.85rem" }}
                      onClick={() => void pickPlaceById(p.place_id)}
                    >
                      <span className="ptg-choice-title" style={{ fontSize: "var(--ptg-text-md-sm)" }}>
                        {p.description}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {placePredictions.length === 0 && placeResults.length > 0 && (
              <ul className="ptg-list-plain ptg-list-plain--tight" style={{ margin: "0 0 1rem" }}>
                {placeResults.map((r) => (
                  <li key={r.place_id}>
                    <button
                      type="button"
                      className="ptg-choice"
                      style={{ width: "100%", textAlign: "left", padding: "0.65rem 0.85rem" }}
                      onClick={() => applyPlaceResult(r)}
                    >
                      <span className="ptg-choice-title" style={{ fontSize: "var(--ptg-text-md-sm)" }}>
                        {r.name}
                      </span>
                      {r.address && (
                        <span className="ptg-choice-desc" style={{ display: "block", marginTop: "0.2rem" }}>
                          {r.address}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {placePredictions.length === 0 && placeResults.length > 0 && (
              <RestaurantsNearbyMap places={placeResults} onPick={applyPlaceResult} />
            )}
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="vn">
                Nom du lieu
              </label>
              <input
                id="vn"
                className="ptg-input"
                required
                value={venueName}
                onChange={(e) => {
                  setVenueName(e.target.value);
                  setVenuePlaceId(null);
                  setVenueLat(null);
                  setVenueLng(null);
                }}
              />
            </div>
            <div className="ptg-field">
              <label className="ptg-label" htmlFor="va">
                Adresse (optionnel)
              </label>
              <input id="va" className="ptg-input" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} />
            </div>
            <button type="submit" className="ptg-btn-primary" disabled={busy}>
              Envoyer le lieu
            </button>
          </form>
        )}

        {meal.status === "venue_proposed" && isGuest && (
          <div style={{ marginBottom: "1rem" }}>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-md-sm)" }}>
              Regarde le lieu ci-dessus. Si ça ne te convient pas, tu peux annuler le repas : mieux vaut être clair avant
              le jour J.
            </p>
            <button type="button" className="ptg-btn-primary" disabled={busy} onClick={() => void patchStatus("venue_confirmed")}>
              Confirmer le lieu
            </button>
          </div>
        )}

        {meal.status === "venue_confirmed" && (isHost || isGuest) && (
          <div style={{ marginBottom: "1rem" }}>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-md-sm)" }}>
              Le chat est ouvert pour se dire un mot. Confirme seulement si tu viens vraiment ; tu peux annuler si un
              imprévu majeur arrive, en prévenant l’autre personne.
            </p>
            <button type="button" className="ptg-btn-primary" disabled={busy} onClick={() => void patchStatus("confirmed")}>
              J’y vais
            </button>
          </div>
        )}

        {meal.status === "confirmed" && (isHost || isGuest) && (
          <div style={{ marginBottom: "1rem" }}>
            <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-md-sm)" }}>
              Jour J : profite de la table. Quand c’est fini, un clic suffit pour clôturer côté app.
            </p>
            <button type="button" className="ptg-btn-primary" disabled={busy} onClick={() => void patchStatus("completed")}>
              Repas fait
            </button>
          </div>
        )}

        {["matched", "venue_proposed", "venue_confirmed", "confirmed"].includes(meal.status) && (isHost || isGuest) && (
          <p style={{ marginBottom: "1rem" }}>
            <button type="button" className="ptg-btn-ghost" disabled={busy} onClick={() => void patchStatus("cancelled")}>
              Annuler le repas
            </button>
          </p>
        )}

        {meal.status === "completed" && (
          <div
            className="ptg-surface ptg-surface--static ptg-card--lg"
            style={{ marginBottom: "1rem", background: "var(--ptg-bg-elevated)" }}
          >
            <p style={{ margin: 0, fontWeight: 700, fontSize: "var(--ptg-text-base)" }}>C’était comment ?</p>
            <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
              Un bon moment se garde… ou se répète. Le plus important s’est passé en vrai ; ici, zéro obligation.
            </p>
            <p className="ptg-type-body" style={{ margin: "0.5rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
              Tu le/la revois à table ? Quand tu veux : une prochaine graille, un message, ou rien du tout.
            </p>
            <p className="ptg-type-body" style={{ margin: "0.65rem 0 0", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
              Bientôt : chaque repas partagé pourra nourrir un <strong>lien de table</strong> (privé, sans score public),
              visible dans <strong>{COMPANIONS_NAV_LABEL}</strong> : revoir la personne, repas croisé, tout doux.{" "}
              <Link href="/reseau-graille" style={{ fontWeight: 600 }}>
                {COMPANIONS_MEAL_COMPLETED_LINK_LABEL}
              </Link>
              .
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.85rem" }}>
              <Link href="/decouvrir" className="ptg-btn-primary" style={{ display: "inline-flex", fontSize: "var(--ptg-text-md-sm)" }}>
                Explorer à nouveau
              </Link>
              <Link href="/accueil" className="ptg-btn-ghost" style={{ display: "inline-flex", fontSize: "var(--ptg-text-ui-sm)", textDecoration: "none" }}>
                Accueil
              </Link>
            </div>
          </div>
        )}

        {showMessages && (
          <section className="ptg-surface ptg-surface--static ptg-card" style={{ marginTop: "1rem" }}>
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-base)" }}>Messages</h2>
            <ul className="ptg-list-plain ptg-list-plain--scroll-md" style={{ margin: "0 0 1rem" }}>
              {messages.map((m) => (
                <li key={m.id} style={{ fontSize: "var(--ptg-text-ui-sm)" }}>
                  <span style={{ color: "var(--ptg-text-muted)" }}>
                    {m.sender_id === userId ? "Toi" : "Autre"} · {new Date(m.created_at).toLocaleString("fr-FR")}
                  </span>
                  <br />
                  {m.body}
                </li>
              ))}
              {messages.length === 0 && <li style={{ color: "var(--ptg-text-muted)" }}>Pas encore de message.</li>}
            </ul>
            {canSendMessages && (
              <form onSubmit={sendChat} className="ptg-stack ptg-stack--compact">
                <textarea
                  className="ptg-input"
                  rows={3}
                  value={chatBody}
                  onChange={(e) => setChatBody(e.target.value)}
                  placeholder="Ton message"
                  aria-label="Message pour ce repas"
                />
                <button type="submit" className="ptg-btn-primary" disabled={busy}>
                  Envoyer
                </button>
              </form>
            )}
          </section>
        )}

        <p style={{ marginTop: "1.25rem" }}>
          <Link href={`/signaler?meal=${mealId}`} className="ptg-link-back" style={{ marginBottom: 0 }}>
            Signaler un problème lié à ce repas
          </Link>
        </p>
        </div>
      </PtgAppFlow>
      <SiteFooter />
    </div>
  );
}
