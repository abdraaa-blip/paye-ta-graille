/**
 * Tags profil / onboarding : alignés `docs/SYSTEME_COMPLET_PAYE_TA_GRAILLE.md` (prompt 3).
 * Sections « Ta graille » et « Ce que tu viens faire ici » sont obligatoires à l’onboarding (≥1 chacune).
 */

export const PROFILE_TAG_MAX = 10;

export const TAG_LABELS: Record<string, string> = {
  drole: "Drôle",
  calme: "Calme",
  extraverti: "Extraverti",
  curieux: "Curieux",
  spontane: "Spontané",
  discret: "Discret",
  bavard: "Bavard",
  ponctuel: "Ponctuel",
  flexible: "Flexible",
  nocturne: "Nocturne",
  matinal: "Matinal",
  epicurien: "Épicurien·ne : profiter de la vie",
  graille_gourmand: "Gros gourmand",
  graille_explorateur: "Explorateur culinaire",
  graille_street: "Street food lover",
  graille_healthy: "Healthy / fit : attention à la ligne, sans rabâcher",
  graille_sportif: "Table équilibrée / sportif·ve",
  graille_resto_chic: "Amateur de resto chic",
  graille_maison: "Cuisine maison",
  graille_curieux_saveurs: "Curieux des saveurs",
  graille_vegetal: "Végétarien·ne / végétalien·ne",
  graille_chill: "Plaisir sans prise de tête",
  graille_nouveautes: "Curieux·se : tester du nouveau",
  graille_burger: "Team burger",
  graille_saveurs_monde: "Saveurs du monde / envie d’exotique",
  ici_rencontrer: "Rencontrer du monde",
  ici_partager: "Partager un repas",
  ici_restos: "Découvrir de nouveaux restos",
  ici_spontaneite: "Spontanéité sociale",
  ici_moins_seul: "Ne plus être seul·e à table",
  ici_lien_amical: "Lien & amitié autour d’un repas",
  ici_autres_saveurs: "Goûter d’autres saveurs / restos",
  ici_veg_entre_veg: "Manger entre végétarien·nes / véganes",
  ici_veg_partager: "Faire découvrir ma cuisine végé",
  ici_veg_experience: "Expérience 100 % végétale (resto, marché…)",
  hobby_sorties: "Sorties",
  hobby_cuisine: "Cuisine",
  hobby_series: "Séries",
  hobby_sport: "Sport",
  hobby_lecture: "Lecture",
  hobby_voyage: "Voyage",
  hobby_local: "Local / terroir",
  hobby_vegan: "Végan",
  gourmand: "Gourmand",
  healthy: "Healthy",
  voyage: "Voyage",
  local: "Local",
  végan: "Végan",
};

export type ProfileTagSection = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
};

export const PROFILE_TAG_SECTIONS: readonly ProfileTagSection[] = [
  {
    id: "perso",
    title: "Ton style social",
    description: "À table, tu es plutôt…",
    tags: [
      "drole",
      "calme",
      "extraverti",
      "curieux",
      "spontane",
      "discret",
      "bavard",
      "ponctuel",
      "flexible",
      "nocturne",
      "matinal",
      "epicurien",
    ],
  },
  {
    id: "graille",
    title: "Ton style de graille",
    description:
      "Gros plats, healthy, végé : toutes les tables sont les bienvenues. Au moins une case.",
    tags: [
      "graille_gourmand",
      "graille_explorateur",
      "graille_street",
      "graille_burger",
      "graille_healthy",
      "graille_sportif",
      "graille_vegetal",
      "graille_maison",
      "graille_resto_chic",
      "graille_chill",
      "graille_nouveautes",
      "graille_saveurs_monde",
    ],
  },
  {
    id: "ici",
    title: "Ce que tu viens faire ici",
    description: "Lien, table, bouffe, pas « ce que je cherche en amour ». Au moins une case.",
    tags: [
      "ici_rencontrer",
      "ici_partager",
      "ici_restos",
      "ici_spontaneite",
      "ici_moins_seul",
      "ici_lien_amical",
      "ici_autres_saveurs",
      "ici_veg_entre_veg",
      "ici_veg_partager",
      "ici_veg_experience",
    ],
  },
  {
    id: "hobbies",
    title: "Ça te parle ?",
    description: "Optionnel. Ça aide à briser la glace.",
    tags: [
      "hobby_sorties",
      "hobby_cuisine",
      "hobby_series",
      "hobby_sport",
      "hobby_lecture",
      "hobby_voyage",
      "hobby_local",
      "hobby_vegan",
    ],
  },
] as const;

/** Tous les tags sélectionnables par section (pour vérif « orphelin »). */
export const PROFILE_TAG_OPTIONS: readonly string[] = PROFILE_TAG_SECTIONS.flatMap((s) => [...s.tags]);

export function tagDisplayLabel(key: string): string {
  return TAG_LABELS[key] ?? key.replace(/_/g, " ");
}

export function hasGrailleTag(tags: string[]): boolean {
  return tags.some((t) => t.startsWith("graille_"));
}

export function hasIciTag(tags: string[]): boolean {
  return tags.some((t) => t.startsWith("ici_"));
}

/** Catégorie persistée en `profile_tags.category` : alignée sur les sections onboarding. */
export function tagKeyToProfileCategory(tagKey: string): string {
  if (tagKey.startsWith("graille_")) return "graille";
  if (tagKey.startsWith("ici_")) return "ici";
  if (tagKey.startsWith("hobby_")) return "hobbies";
  for (const section of PROFILE_TAG_SECTIONS) {
    if ((section.tags as readonly string[]).includes(tagKey)) return section.id;
  }
  return "perso";
}
