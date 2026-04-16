/**
 * « Vibes » douces : identité sociale légère, dérivée des tags (pas de score, pas de classement).
 * Une seule vibe affichée : la première règle qui matche, dans l’ordre.
 */

const RULES: readonly { label: string; test: (t: Set<string>) => boolean }[] = [
  {
    label: "Clean eater",
    test: (t) => t.has("graille_vegetal") || t.has("graille_healthy"),
  },
  {
    label: "Explorateur",
    test: (t) =>
      t.has("graille_explorateur") || t.has("graille_nouveautes") || t.has("graille_street"),
  },
  {
    label: "Bon vivant",
    test: (t) => t.has("graille_gourmand") || t.has("graille_chill"),
  },
  {
    label: "Social de table",
    test: (t) =>
      t.has("extraverti") ||
      t.has("bavard") ||
      t.has("ici_moins_seul") ||
      [t.has("ici_rencontrer"), t.has("ici_partager"), t.has("ici_restos"), t.has("ici_spontaneite")].filter(
        Boolean,
      ).length >= 2,
  },
  {
    label: "Amateur de moments",
    test: (t) => t.has("graille_maison") || t.has("discret") || t.has("calme"),
  },
];

/** Retourne une courte étiquette humaine, ou null si aucun profil clair. */
export function deriveGrailleVibe(tagKeys: string[]): string | null {
  const t = new Set(tagKeys);
  for (const r of RULES) {
    if (r.test(t)) return r.label;
  }
  return null;
}
