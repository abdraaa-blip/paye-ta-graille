/**
 * Règles « surprise graille » : intentions addition qui se répondent.
 * invite ↔ etre_invite · partage ↔ partage
 */

export function mealIntentsSurpriseCompatible(mine: string, theirs: string): boolean {
  if (mine === "invite" && theirs === "etre_invite") return true;
  if (mine === "etre_invite" && theirs === "invite") return true;
  if (mine === "partage" && theirs === "partage") return true;
  return false;
}

export type SurpriseRollResult<T> = {
  profiles: T[];
  compatibleStrict: boolean;
};

function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Filtre une liste d’UUID (query / session) — borne pour éviter URLs géantes. */
export function sanitizeSurpriseExcludeIds(raw: string[] | undefined, max = 24): string[] {
  if (!raw?.length) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of raw) {
    const id = typeof s === "string" ? s.trim() : "";
    if (!UUID_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Tirage mélangé : jusqu’à `maxCount` profils **distincts** (défaut 3, plafonné par la taille du pool).
 * `excludeIds` retire des candidats tant qu’il en reste au moins un ; sinon on retombe sur le pool complet
 * (une seule personne compatible, ou petite zone).
 */
export function pickSurpriseProfiles<T extends { id: string; meal_intent: string }>(
  candidates: T[],
  myMealIntent: string | null | undefined,
  options?: { excludeIds?: string[]; maxCount?: number },
): SurpriseRollResult<T> | null {
  if (!candidates.length) return null;
  const maxCount = Math.min(3, Math.max(1, options?.maxCount ?? 3));
  const mine = (myMealIntent ?? "").trim();
  const strict = mine
    ? candidates.filter((p) => mealIntentsSurpriseCompatible(mine, p.meal_intent))
    : [];
  const basePool = strict.length > 0 ? strict : candidates;
  const excludeSet = new Set(sanitizeSurpriseExcludeIds(options?.excludeIds));
  let pool = basePool.filter((p) => !excludeSet.has(p.id));
  if (pool.length === 0) pool = [...basePool];

  const arr = [...pool];
  shuffleInPlace(arr);
  const profiles = arr.slice(0, Math.min(maxCount, arr.length));
  return { profiles, compatibleStrict: strict.length > 0 };
}
