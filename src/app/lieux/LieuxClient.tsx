"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RestaurantsNearbyMap, type MapPlaceRow } from "@/components/RestaurantsNearbyMap";

type PlacesResponse = {
  results?: MapPlaceRow[];
  error?: { code?: string; message?: string };
};
type PlaceMemory = {
  id?: string;
  place_key?: string;
  place_id?: string | null;
  name?: string;
  address?: string | null;
  personal_score: number | null;
  would_return: boolean | null;
  private_note: string | null;
  recommend_public: boolean;
};
type PlaceSignal = {
  public_reco_count: number;
  avg_public_score: number | null;
};

type RadiusOption = 800 | 1200 | 2000;
const NEARBY_CACHE_KEY = "ptg_lieux_nearby_cache_v1";

function trackGrowthEvent(
  event:
    | "lieux_search"
    | "lieux_nearby_click"
    | "lieux_place_picked"
    | "lieux_maps_open"
    | "lieux_copy_place"
    | "lieux_memory_save"
    | "lieux_memory_optin_public",
  metadata?: Record<string, unknown>,
) {
  void fetch("/api/growth/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, context: "lieux_page", metadata: metadata ?? {} }),
  }).catch(() => {
    // Analytics must not block UX.
  });
}

function mapsHref(place: MapPlaceRow): string {
  if (typeof place.lat === "number" && typeof place.lng === "number") {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${place.lat},${place.lng}`)}`;
  }
  const q = place.address?.trim() || place.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function makeClientPlaceKey(place: { place_id?: string | null; name: string; address?: string | null }): string {
  const pid = place.place_id?.trim();
  if (pid) return `pid:${pid}`;
  const name = place.name.trim().toLowerCase();
  const addr = (place.address ?? "").trim().toLowerCase();
  return `na:${name}::${addr}`.slice(0, 320);
}

export function LieuxClient() {
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState<RadiusOption>(1200);
  const [loading, setLoading] = useState(false);
  const [nearbyBusy, setNearbyBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [results, setResults] = useState<MapPlaceRow[]>([]);
  const [picked, setPicked] = useState<MapPlaceRow | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingMemory, setSavingMemory] = useState(false);
  const [memorySaved, setMemorySaved] = useState(false);
  const [personalScore, setPersonalScore] = useState("");
  const [wouldReturn, setWouldReturn] = useState("unknown");
  const [privateNote, setPrivateNote] = useState("");
  const [recommendPublic, setRecommendPublic] = useState(false);
  const [memories, setMemories] = useState<PlaceMemory[]>([]);
  const [pickedSignal, setPickedSignal] = useState<PlaceSignal | null>(null);
  const memoryByPlaceKey = new Map(
    memories
      .map((m) => {
        const key =
          m.place_key ??
          makeClientPlaceKey({
            place_id: m.place_id ?? null,
            name: m.name ?? "unknown",
            address: m.address ?? null,
          });
        return [key, m] as const;
      })
      .filter(Boolean),
  );
  const naturalTopNearby = results
    .map((r) => {
      const k = makeClientPlaceKey({ place_id: r.place_id, name: r.name, address: r.address });
      const m = memoryByPlaceKey.get(k);
      const score = (m?.personal_score ?? 0) * 10 + (m?.would_return ? 4 : 0) + (r.address ? 1 : 0);
      return { place: r, memory: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/places/memory?limit=6");
      const json = (await res.json()) as { memories?: PlaceMemory[] };
      if (!res.ok) return;
      setMemories(json.memories ?? []);
    })();
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NEARBY_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        at?: number;
        radius?: number;
        results?: MapPlaceRow[];
      };
      if (!parsed.at || !Array.isArray(parsed.results)) return;
      // Cache courte pour limiter les appels successifs en mobilité.
      if (Date.now() - parsed.at > 8 * 60 * 1000) return;
      setResults(parsed.results);
      if (parsed.radius === 800 || parsed.radius === 1200 || parsed.radius === 2000) {
        setRadius(parsed.radius);
      }
      setNote("Derniers lieux proches chargés depuis ta session récente.");
    } catch {
      // Ignore cache parsing issues.
    }
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setNote(null);
      return;
    }
    const timer = setTimeout(() => {
      void (async () => {
        setLoading(true);
        setNote(null);
        trackGrowthEvent("lieux_search", { q_len: q.length });
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
        const json = (await res.json()) as PlacesResponse;
        setLoading(false);
        if (!res.ok) {
          setResults([]);
          if (res.status === 401) {
            setNote("Connecte-toi pour utiliser la recherche de lieux.");
            return;
          }
          setNote(json.error?.message ?? "Recherche indisponible pour l’instant.");
          return;
        }
        const list = json.results ?? [];
        setResults(list);
        if (list.length === 0) {
          setNote("Aucun résultat. Essaie un autre mot-clé ou utilise « Restos autour de moi ».");
        }
      })();
    }, 360);

    return () => clearTimeout(timer);
  }, [query]);

  function applyPick(place: MapPlaceRow) {
    setPicked(place);
    setQuery(place.name);
    setCopied(false);
    setMemorySaved(false);
    setPickedSignal(null);
    trackGrowthEvent("lieux_place_picked", { has_address: Boolean(place.address) });
    void (async () => {
      const u = new URL("/api/places/memory", window.location.origin);
      if (place.place_id) u.searchParams.set("place_id", place.place_id);
      u.searchParams.set("name", place.name);
      if (place.address) u.searchParams.set("address", place.address);
      u.searchParams.set("include_signals", "1");
      const res = await fetch(u.toString());
      const json = (await res.json()) as { memory?: PlaceMemory | null; signal?: PlaceSignal | null; error?: { message?: string } };
      if (!res.ok) {
        return;
      }
      const m = json.memory;
      const s = json.signal ?? null;
      setPersonalScore(m?.personal_score ? String(m.personal_score) : "");
      setWouldReturn(m?.would_return === true ? "yes" : m?.would_return === false ? "no" : "unknown");
      setPrivateNote(m?.private_note ?? "");
      setRecommendPublic(Boolean(m?.recommend_public));
      setPickedSignal(s);
    })();
  }

  async function copyPickedPlace() {
    if (!picked) return;
    const text = picked.address ? `${picked.name} — ${picked.address}` : picked.name;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackGrowthEvent("lieux_copy_place", { has_address: Boolean(picked.address) });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNote("Impossible de copier automatiquement. Tu peux copier le nom à la main.");
    }
  }

  async function saveMemory() {
    if (!picked) return;
    setSavingMemory(true);
    setMemorySaved(false);
    const body = {
      place_id: picked.place_id || null,
      name: picked.name,
      address: picked.address || null,
      lat: picked.lat,
      lng: picked.lng,
      personal_score: personalScore ? Number(personalScore) : null,
      would_return: wouldReturn === "unknown" ? null : wouldReturn === "yes",
      private_note: privateNote.trim() || null,
      recommend_public: recommendPublic,
    };
    const res = await fetch("/api/places/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSavingMemory(false);
    if (!res.ok) {
      setNote("Impossible d’enregistrer ta note perso pour l’instant.");
      return;
    }
    trackGrowthEvent("lieux_memory_save", {
      has_score: Boolean(personalScore),
      would_return: wouldReturn,
      recommend_public: recommendPublic,
    });
    if (recommendPublic) {
      trackGrowthEvent("lieux_memory_optin_public", {});
    }
    setMemorySaved(true);
    const refreshed = await fetch("/api/places/memory?limit=6");
    const refreshedJson = (await refreshed.json()) as { memories?: PlaceMemory[] };
    if (refreshed.ok) setMemories(refreshedJson.memories ?? []);
    window.setTimeout(() => setMemorySaved(false), 2000);
  }

  function loadNearby() {
    if (!navigator.geolocation) {
      setNote("Géolocalisation non disponible sur cet appareil.");
      return;
    }
    setNearbyBusy(true);
    setNote(null);
    trackGrowthEvent("lieux_nearby_click", { radius });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await fetch(
          `/api/places/nearby?lat=${encodeURIComponent(String(pos.coords.latitude))}&lng=${encodeURIComponent(
            String(pos.coords.longitude),
          )}&radius=${radius}`,
        );
        const json = (await res.json()) as PlacesResponse;
        setNearbyBusy(false);
        if (!res.ok) {
          setResults([]);
          if (res.status === 401) {
            setNote("Connecte-toi pour voir les restos autour de toi.");
            return;
          }
          setNote(json.error?.message ?? "Lieux à proximité indisponibles pour l’instant.");
          return;
        }
        const list = json.results ?? [];
        setResults(list);
        try {
          window.localStorage.setItem(
            NEARBY_CACHE_KEY,
            JSON.stringify({
              at: Date.now(),
              radius,
              results: list,
            }),
          );
        } catch {
          // Ignore storage quota / private mode failures.
        }
        if (list.length === 0) {
          setNote("Aucun resto tout près. Essaie avec un rayon différent via la recherche par nom.");
        }
      },
      () => {
        setNearbyBusy(false);
        setNote("Autorise la position du navigateur pour voir les restos autour de toi.");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 60_000 },
    );
  }

  return (
    <section className="ptg-surface ptg-surface--static ptg-card" style={{ marginBottom: "1rem" }}>
      <p style={{ margin: "0 0 0.75rem", fontWeight: 700 }}>Trouver un resto maintenant</p>
      <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-ui-sm)" }}>
        Cherche par nom ou lance la géoloc. Clique un résultat pour garder un lieu de référence avant de le proposer dans
        ton repas.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <select
          className="ptg-input"
          value={String(radius)}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (next === 800 || next === 1200 || next === 2000) {
              setRadius(next);
            }
          }}
          aria-label="Rayon de recherche autour de moi"
          style={{ width: "auto", minWidth: "9rem" }}
        >
          <option value="800">Rayon 800 m</option>
          <option value="1200">Rayon 1,2 km</option>
          <option value="2000">Rayon 2 km</option>
        </select>
        <button type="button" className="ptg-btn-ghost" disabled={nearbyBusy || loading} onClick={loadNearby}>
          {nearbyBusy ? "Lieux à proximité…" : "Restos autour de moi"}
        </button>
      </div>
      <div className="ptg-field">
        <label className="ptg-label" htmlFor="lieux-search">
          Chercher un lieu
        </label>
        <input
          id="lieux-search"
          className="ptg-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ex. pizza Belleville, café République…"
          autoComplete="off"
        />
      </div>
      {loading && (
        <p className="ptg-type-body" style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)" }} aria-live="polite">
          Recherche…
        </p>
      )}
      {note && (
        <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-sm)" }}>
          {note}
        </p>
      )}
      {memories.length > 0 && (
        <div className="ptg-surface ptg-surface--static ptg-card--compact" style={{ marginBottom: "0.85rem" }}>
          <p className="ptg-type-body" style={{ margin: "0 0 0.45rem", fontSize: "var(--ptg-text-ui-sm)", fontWeight: 700 }}>
            Tes spots bien notés (privé)
          </p>
          <ul className="ptg-list-plain ptg-list-plain--tight" style={{ margin: 0 }}>
            {memories
              .filter((m) => typeof m.personal_score === "number" && m.personal_score >= 4)
              .slice(0, 4)
              .map((m, idx) => (
                <li key={m.id ?? `${m.name ?? "spot"}-${idx}`}>
                  <span className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)" }}>
                    {(m.name ?? "Lieu")} {m.personal_score ? `· ${m.personal_score}/5` : ""}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <>
          {naturalTopNearby.length > 0 && (
            <div className="ptg-surface ptg-surface--static ptg-card--compact" style={{ marginBottom: "0.85rem" }}>
              <p className="ptg-type-body" style={{ margin: "0 0 0.45rem", fontSize: "var(--ptg-text-ui-sm)", fontWeight: 700 }}>
                Sélection naturelle près de toi
              </p>
              <ul className="ptg-list-plain ptg-list-plain--tight" style={{ margin: 0 }}>
                {naturalTopNearby.map((row) => (
                  <li key={`top-${row.place.place_id}`}>
                    <button
                      type="button"
                      className="ptg-choice"
                      style={{ width: "100%", textAlign: "left", padding: "0.55rem 0.75rem" }}
                      onClick={() => applyPick(row.place)}
                    >
                      <span className="ptg-choice-title" style={{ fontSize: "var(--ptg-text-sm)" }}>
                        {row.place.name}
                      </span>
                      <span className="ptg-choice-desc" style={{ display: "block", marginTop: "0.2rem" }}>
                        {row.memory?.personal_score ? `Ta note: ${row.memory.personal_score}/5` : "Nouveau spot"}
                        {row.memory?.would_return ? " · Tu veux y revenir" : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ul className="ptg-list-plain ptg-list-plain--tight" style={{ margin: "0 0 1rem" }}>
            {results.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  className="ptg-choice"
                  style={{ width: "100%", textAlign: "left", padding: "0.65rem 0.85rem" }}
                  onClick={() => applyPick(r)}
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
          <RestaurantsNearbyMap places={results} onPick={applyPick} />
        </>
      )}

      {picked && (
        <div className="ptg-surface ptg-surface--static ptg-card--compact">
          <p style={{ margin: "0", fontWeight: 700 }}>{picked.name}</p>
          {picked.address && (
            <p className="ptg-type-body" style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-ui-sm)" }}>
              {picked.address}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
            <a
              href={mapsHref(picked)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "var(--ptg-text-ui-sm)", fontWeight: 600 }}
              onClick={() => trackGrowthEvent("lieux_maps_open", { has_coords: Boolean(picked.lat && picked.lng) })}
            >
              Ouvrir sur Maps
            </a>
            <Link href="/repas" style={{ fontSize: "var(--ptg-text-ui-sm)", fontWeight: 600 }}>
              Proposer ce lieu dans un repas
            </Link>
            <button
              type="button"
              className="ptg-btn-ghost"
              onClick={() => void copyPickedPlace()}
              style={{ padding: "0.35rem 0.7rem", fontSize: "var(--ptg-text-ui-sm)" }}
            >
              {copied ? "Copié" : "Copier le lieu"}
            </button>
          </div>
          <div style={{ marginTop: "0.9rem", display: "grid", gap: "0.6rem" }}>
            {pickedSignal && pickedSignal.public_reco_count >= 3 && (
              <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)", color: "var(--ptg-info)" }}>
                Signal naturel: recommandé par {pickedSignal.public_reco_count} membre(s)
                {typeof pickedSignal.avg_public_score === "number" ? ` · score moyen ${pickedSignal.avg_public_score.toFixed(1)}/5` : ""}
                .
              </p>
            )}
            <p className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-ui-sm)", fontWeight: 700 }}>
              Mémoire perso (privée)
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <select
                className="ptg-input"
                value={personalScore}
                onChange={(e) => setPersonalScore(e.target.value)}
                aria-label="Note personnelle"
                style={{ width: "auto", minWidth: "9rem" }}
              >
                <option value="">Note perso</option>
                <option value="1">1 / 5</option>
                <option value="2">2 / 5</option>
                <option value="3">3 / 5</option>
                <option value="4">4 / 5</option>
                <option value="5">5 / 5</option>
              </select>
              <select
                className="ptg-input"
                value={wouldReturn}
                onChange={(e) => setWouldReturn(e.target.value)}
                aria-label="Envie de revenir"
                style={{ width: "auto", minWidth: "10rem" }}
              >
                <option value="unknown">Revenir ?</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>
            <textarea
              className="ptg-input"
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              placeholder="Note privée (ambiance, prix, service, etc.)"
              maxLength={500}
              rows={3}
              style={{ resize: "vertical" }}
            />
            <label className="ptg-type-body" style={{ margin: 0, fontSize: "var(--ptg-text-sm)" }}>
              <input
                type="checkbox"
                checked={recommendPublic}
                onChange={(e) => setRecommendPublic(e.target.checked)}
                style={{ marginRight: "0.45rem" }}
              />
              J’accepte que ce lieu compte dans le signal collectif anonymisé.
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <button type="button" className="ptg-btn-secondary" disabled={savingMemory} onClick={() => void saveMemory()}>
                {savingMemory ? "Enregistrement…" : "Enregistrer ma mémoire"}
              </button>
              {memorySaved && (
                <span className="ptg-type-body" style={{ fontSize: "var(--ptg-text-sm)", color: "var(--ptg-success)" }}>
                  Enregistré
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
