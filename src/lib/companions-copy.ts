/**
 * Section « après repas » : liens réels, pas un fil de rencontre.
 * Règle : nom UX propre partout (nav, titres). Clin d’œil « friendzone » uniquement en second plan, positif, jamais moqueur.
 */

/** Navigation, titre de page, lien principal */
export const COMPANIONS_NAV_LABEL = "Mes compagnons";

/**
 * Nom taquin de la **zone** (hub compagnons) : différenciation assumée vs apps de rencontre.
 * Reste un clin d’œil : le H1 officiel reste {@link COMPANIONS_NAV_LABEL}.
 */
export const COMPANIONS_ZONE_PLAYFUL_NAME = "La Friend zone";

/**
 * Une phrase qui retourne le stéréotype dating : ici, l’amitié autour d’un repas est le cœur du jeu.
 */
export const COMPANIONS_ZONE_PLAYFUL_EXPLAIN =
  "Le coin des gens avec qui t’as mangé pour de vrai : favoris, habitués, compagnons de graille. Ici, « friend zone », c’est qu’on assume : le lien, c’est d’abord l’assiette partagée, pas le swipe.";

/**
 * Sous-ligne optionnelle (kicker, hero secondaire). Ne pas mettre dans le H1.
 * Retourne l’idée « friendzone » comme promesse agréable, pas comme rejet.
 */
export const COMPANIONS_FUN_KICKER = "La seule friend zone où tu reviens avec plaisir.";

/** Variante encore plus douce si le kicker principal fait trop */
export const COMPANIONS_FUN_KICKER_ALT = "Bienvenue en Friend zone… version graille.";

export const COMPANIONS_MICRO = {
  noSwipe: "Ici, pas de swipe. Que des gens avec qui t’as partagé un repas.",
  realPeople: "Les gens avec qui t’as vraiment mangé.",
  /** Phrase « qui tue » réservée au marketing ponctuel, pas à l’UI dense */
  killerLine: COMPANIONS_FUN_KICKER,
} as const;

/**
 * Niveaux de la jauge (repas **completed** ensemble, **privée** entre vous deux).
 * UX visée : barre qui remonte (0 → max), teinte qui **verdit** avec le lien, pas un leaderboard.
 * « Meilleur·e compagnon·ne » = haut de cette relation, pas « #1 de l’app ».
 */
export const COMPANIONS_GAUGE_LEVELS: readonly { range: string; label: string; note?: string }[] = [
  { range: "0", label: "Prochaine table", note: "la jauge démarre après un 1er repas terminé ensemble" },
  { range: "1", label: "Belle rencontre" },
  { range: "2–3", label: "Habitué·e à table", note: "vous reconnaissez un peu vos envies" },
  { range: "4–6", label: "Table fidèle" },
  { range: "7–10", label: "Compagnon·ne de graille", note: "chaleur, pas trophée public" },
  { range: "11+", label: "Meilleur·e compagnon·ne de graille", note: "entre vous deux : intime, pas classement" },
];

/** Courtes phrases pour jauge / rappels doux (affichage in-app) */
export const COMPANIONS_JAUGE_WHISPERS: readonly string[] = [
  "Plusieurs tables ensemble : une vraie habitude se crée.",
  "Vous vous connaissez déjà un peu autour de l’assiette.",
  "Compagnon·ne de graille : le lien se voit à l’assiette.",
  "Meilleur·e compagnon·ne : pas une médaille, un vrai fil à la table.",
];

/** Lien depuis l’écran repas terminé */
export const COMPANIONS_MEAL_COMPLETED_LINK_LABEL = "Mes compagnons & lien de table";
