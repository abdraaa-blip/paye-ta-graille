/** Évite de retomber tout de suite sur les mêmes profils « surprise » (session navigateur). */
const STORAGE_KEY = "ptg_surprise_recent_ids";
const MAX_IDS = 18;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function readSurpriseRecentIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    const out: string[] = [];
    const seen = new Set<string>();
    for (const x of arr) {
      if (typeof x !== "string" || !UUID_RE.test(x) || seen.has(x)) continue;
      seen.add(x);
      out.push(x);
    }
    return out.slice(-MAX_IDS);
  } catch {
    return [];
  }
}

/** Enregistre les profils montrés pour les exclure aux prochains tirages (tant qu’il reste d’autres choix côté API). */
export function clearSurpriseRecentIds(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* */
  }
}

export function appendSurpriseRecentIds(ids: string[]): void {
  if (typeof window === "undefined" || !ids.length) return;
  const prev = readSurpriseRecentIds();
  const merged: string[] = [...prev];
  const seen = new Set(merged);
  for (const id of ids) {
    if (!UUID_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    merged.push(id);
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged.slice(-MAX_IDS)));
  } catch {
    /* quota / private */
  }
}

export function surpriseRecentIdsQuery(exclude: string[]): string {
  if (!exclude.length) return "";
  return `?exclude=${exclude.map(encodeURIComponent).join(",")}`;
}
