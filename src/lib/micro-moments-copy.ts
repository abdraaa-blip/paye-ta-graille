/**
 * Micro-moments in-app : discrets, jamais culpabilisants.
 * Variante A/B possible plus tard ; pour l’instant une seule banque, ton oral.
 *
 * Règles : pas de jugement sur le corps ou le volume mangé ; pas de promesse santé ;
 * prévention = rappel doux + humour de marque, pas brochure médicale.
 */

import { COMPANIONS_JAUGE_WHISPERS } from "./companions-copy";

export const MICRO_MOMENTS_ACTIVE_USER: readonly string[] = [
  "Tu fais vivre la table. Merci pour ça.",
  "Le partage, ça te va bien.",
  "On voit que tu aimes être à table avec les autres.",
  "Ça fait du bien de voir quelqu’un qui invite vraiment.",
];

export const MICRO_MOMENTS_GENTLE_RETURN: readonly string[] = [
  "Ce soir, une table à deux ?",
  "Quelqu’un dans ton coin a peut-être faim en même temps que toi.",
  "Un repas ensemble, ça te dirait ?",
  "Et si tu testais un créneau cette semaine ?",
];

/** Repères doux pour profils très actifs : pas des « récompenses », pas de classement. */
export const MICRO_MOMENTS_CELEBRATION_ENGAGED: readonly string[] = [
  "Tu prends goût à manger avec du monde, ça se sent.",
  "On dirait que tes tables se passent bien. Pas besoin de badge pour le voir.",
  "Vrai·e sociable à table : le bon genre de surconsommation… de rencontres.",
];

/**
 * Profils plus discrets : envie de lien sans pousser à « manger plus » ni à la performance.
 */
export const MICRO_MOMENTS_GENTLE_QUIET: readonly string[] = [
  "Une table quand tu veux, ça suffit. Pas de cadence imposée.",
  "Si t’as envie de compagnie à l’assiette, y’a du monde, zéro rush.",
  "Manger seul·e va aussi. Manger à plusieurs, c’est juste une option qui claque.",
];

export const WELLNESS_WHISPERS: readonly string[] = [
  "Un verre d’eau, entre deux bouchées.",
  "Manger bien, c’est bien. Boire aussi, c’est mieux.",
  "Les légumes, oui. Et une bonne compagnie, c’est pas mal non plus.",
  "Le plat compte. La personne en face aussi.",
];

/**
 * Prévention légère + ton Paye ta graille (pas l’affiche ministère).
 * Plus tard : sous-ensemble « canicule » branché météo / calendrier.
 */
export const WELLNESS_PREVENTION_PLAYFUL: readonly string[] = [
  "Quand il fait chaud, l’eau c’est le vrai pairing : avant, pendant, après.",
  "Hydratation : le splash qui ne coûte rien et fait du bien.",
  "Cinq fruits & légumes si tu peux ; sinon, une table à plusieurs, c’est déjà un bon plat social.",
  "Ne mange pas seul si t’as envie de voir du monde, le reste, on s’adapte.",
  "Manger équilibré ou manger joyeux : les deux peuvent coexister, on te juge pas, on te rejoint.",
];

/** Rappels duo : jamais culpabilisants ; l’utilisateur règle la fréquence (calme / normal / off). */
export const NUDGES_PAIR_SOFT: readonly string[] = [
  "Ça fait un moment que vous n’avez pas partagé une table.",
  "Un repas ensemble, ça vous tenterait ?",
  "Envie de retable ? Un petit message, une invite, ou un 50-50, seulement si ça te dit.",
  "Ça fait un bout de temps : tu peux proposer un verre, un déj, ou demander qu’on t’invite, zéro obligation.",
];

export const JAUGE_RELATION_LINES: readonly string[] = COMPANIONS_JAUGE_WHISPERS;
