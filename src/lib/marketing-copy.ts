/**
 * Copy marketing et promesses. Variante A/B via NEXT_PUBLIC_PTG_UX_VARIANT=b.
 * Ton : une personne qui parle à une personne. Pas de punchlines agressives.
 */

import type { UxVariant } from "./ux-variant";
import { COMPANIONS_FUN_KICKER } from "./companions-copy";
import {
  GROWTH_INVITE_CARD,
  GROWTH_MODULE_PAY,
  GROWTH_MODULE_RESCUE,
  GROWTH_MODULE_SHARE,
  GROWTH_REPAS_OUVERTS_SLOGAN,
} from "./growth-copy";
import { uxa } from "./ux-variant";

/** Pour tests ou affichage des deux versions côte à côte */
export const MARKETING_TAGLINE_GOLDEN_PAIR: Record<UxVariant, string> = {
  a: "Pas une app de rencontre. Une table.",
  b: "On ne te vend pas un date. On te propose de manger.",
};

export const MARKETING_HERO_PRIMARY_PAIR: Record<UxVariant, string> = {
  a: "Ne mange plus tout seul.",
  b: "À table, ça compte aussi.",
};

export const MARKETING_CORE_PROMISE_PAIR: Record<UxVariant, string> = {
  a: "Manger avec quelqu’un, sans forcer le reste.",
  b: "Un repas avec quelqu’un. Le reste, si le reste veut venir.",
};

export const MARKETING_SECONDARY_LINE_PAIR: Record<UxVariant, string> = {
  a: "Tu manges, tu croises du monde. Point.",
  b: "Tu manges. Tu rencontres. Pas besoin d’en faire plus.",
};

export const MARKETING_STRATEGIC_ONE_LINER_PAIR: Record<UxVariant, string> = {
  a: "Tu viens pour le plat. Le reste arrive tout seul, ou pas.",
  b: "Le repas d’abord. La suite, sans pression.",
};

export const MARKETING_KEY_CHOICE_OR_SURPRISE_PAIR: Record<UxVariant, string> = {
  a: "Tu choisis qui t’accompagne… ou tu laisses un peu le hasard décider.",
  b: "Mode curieux : soit tu pointes du doigt, soit tu te laisses surprendre.",
};

export const MARKETING_SECOND_GRAILLE_HERO_PAIR: Record<UxVariant, string> = {
  a: "Tout le monde mérite une seconde graille.",
  b: "Une deuxième table, parfois, ça change la journée.",
};

export const MARKETING_TAGLINE_GOLDEN = uxa(MARKETING_TAGLINE_GOLDEN_PAIR);
export const MARKETING_HERO_PRIMARY = uxa(MARKETING_HERO_PRIMARY_PAIR);
export const MARKETING_CORE_PROMISE = uxa(MARKETING_CORE_PROMISE_PAIR);
export const MARKETING_SECONDARY_LINE = uxa(MARKETING_SECONDARY_LINE_PAIR);
export const MARKETING_STRATEGIC_ONE_LINER = uxa(MARKETING_STRATEGIC_ONE_LINER_PAIR);
export const MARKETING_KEY_CHOICE_OR_SURPRISE = uxa(MARKETING_KEY_CHOICE_OR_SURPRISE_PAIR);
export const MARKETING_SECOND_GRAILLE_HERO = uxa(MARKETING_SECOND_GRAILLE_HERO_PAIR);

export const MARKETING_SECOND_GRAILLE_VARIANTS: readonly string[] = [
  MARKETING_SECOND_GRAILLE_HERO,
  "Une seconde graille, ça arrive à tout le monde.",
  "Parfois ça coince au premier repas. Le deuxième, c’est autre chose.",
  "Raté le premier ? Il en reste d’autres.",
  "À table, on peut toujours retenter.",
];

/** Accroches rotatives (landing) : panorama complet avant le scroll. */
export const MARKETING_HOME_PULSE_LINES: readonly string[] = [
  ...new Set([
    GROWTH_MODULE_RESCUE.slogan,
    "Tout le monde mérite une seconde graille.",
    "Grailleur un jour, grailleur toujours.",
    COMPANIONS_FUN_KICKER,
    ...Object.values(MARKETING_TAGLINE_GOLDEN_PAIR),
    ...Object.values(MARKETING_STRATEGIC_ONE_LINER_PAIR),
    ...Object.values(MARKETING_CORE_PROMISE_PAIR),
    ...Object.values(MARKETING_HERO_PRIMARY_PAIR),
    ...Object.values(MARKETING_SECONDARY_LINE_PAIR),
    ...Object.values(MARKETING_KEY_CHOICE_OR_SURPRISE_PAIR),
    "Tu viens pour le plat. Le reste arrive tout seul, ou pas.",
    "Manger avec quelqu’un, sans forcer le reste.",
    "Pas de swipe. Une table, des intentions claires : j’invite, on partage, je me fais inviter.",
  ]),
];

/** Connexion / onboarding : promesse marque sans répéter toute la landing. */
export const MARKETING_ENTRY_PULSE_LINES: readonly string[] = [
  ...new Set([
    GROWTH_MODULE_RESCUE.slogan,
    "Grailleur un jour, grailleur toujours.",
    COMPANIONS_FUN_KICKER,
    ...Object.values(MARKETING_TAGLINE_GOLDEN_PAIR),
    ...Object.values(MARKETING_CORE_PROMISE_PAIR),
    ...Object.values(MARKETING_HERO_PRIMARY_PAIR),
    ...Object.values(MARKETING_STRATEGIC_ONE_LINER_PAIR),
    "Pas de swipe. Une table, des intentions claires : j’invite, on partage, je me fais inviter.",
  ]),
];

/** Accueil connecté : rythme « prochain repas », partage, seconde chance. */
export const MARKETING_APP_PULSE_LINES: readonly string[] = [
  ...new Set([
    GROWTH_MODULE_RESCUE.slogan,
    "Tout le monde mérite une seconde graille.",
    "Grailleur un jour, grailleur toujours.",
    COMPANIONS_FUN_KICKER,
    ...Object.values(MARKETING_SECONDARY_LINE_PAIR),
    ...Object.values(MARKETING_CORE_PROMISE_PAIR),
    ...Object.values(MARKETING_STRATEGIC_ONE_LINER_PAIR),
    GROWTH_INVITE_CARD.body,
    "Moins de scroll. Plus de fourchette.",
    "Faim ? Tu peux partager la table.",
    "Ce soir, t’as peut-être une table quelque part",
    "Quelqu’un dans ton coin a aussi envie de commander",
    GROWTH_REPAS_OUVERTS_SLOGAN,
  ]),
];

/** Découvrir : liste et filtres, hasard, premier contact. */
export const MARKETING_DISCOVER_PULSE_LINES: readonly string[] = [
  ...new Set([
    "Tu manges. Tu découvres qui est en face.",
    "Une table, un inconnu, un moment calme.",
    ...Object.values(MARKETING_HERO_PRIMARY_PAIR),
    ...Object.values(MARKETING_TAGLINE_GOLDEN_PAIR),
    ...Object.values(MARKETING_KEY_CHOICE_OR_SURPRISE_PAIR),
    "Pas de swipe. Une table, des intentions claires : j’invite, on partage, je me fais inviter.",
    ...Object.values(MARKETING_STRATEGIC_ONE_LINER_PAIR),
    "Tu veux te faire une petite surprise ?",
  ]),
];

/** Graille+ : modules bonus, générosité, addition (sans le lead fixe affiché sous le pulse). */
export const MARKETING_GRAILLE_PLUS_PULSE_LINES: readonly string[] = [
  ...new Set([
    GROWTH_MODULE_SHARE.oneLiner,
    GROWTH_MODULE_SHARE.slogan,
    GROWTH_MODULE_RESCUE.oneLiner,
    GROWTH_MODULE_PAY.oneLiner,
    GROWTH_MODULE_RESCUE.slogan,
    "Repas suspendu : comme au café, version dîner.",
    "Offrir un repas, c’est offrir un moment.",
    ...MARKETING_SECOND_GRAILLE_VARIANTS,
  ]),
];

export const TABLE_SURPRISE_MICRO_COPY: readonly string[] = [
  MARKETING_KEY_CHOICE_OR_SURPRISE,
  "Tu veux te faire une petite surprise ?",
  "Une table, un inconnu, un moment calme.",
  "Pas besoin de roman sur ton profil. Juste un créneau et un lieu.",
  "Tu manges. Tu découvres qui est en face.",
];

export const MARKETING_TABLE_MOMENTS: readonly string[] = [
  "Manger, c’est déjà beaucoup. À deux, souvent c’est mieux.",
  "Une table, et la soirée prend une autre tournure.",
  "Offrir un repas, c’est offrir un moment.",
  "Tu partages l’assiette, tu partages un bout de vie.",
  "Le plat est le prétexte. Ce qui reste, c’est le souvenir du moment.",
];

export const MARKETING_AXES = {
  assumer: [
    "Rencontrer sans avoir l’air de « chercher »",
    "Des gens, un plat, pas de scénario imposé",
    "La rencontre, mais sans le stress du premier rendez-vous",
    MARKETING_TAGLINE_GOLDEN,
    "Quelque chose que tu peux raconter sans rougir",
  ],
  manger: [
    "Tu manges. Le reste s’ajoute, ou pas.",
    "On commence par commander",
    "Un repas, et peut-être la suite",
    "À table, les choses se disent plus simples",
    "Manger ensemble, c’est déjà un début",
  ],
  socialSimple: [
    MARKETING_SECONDARY_LINE,
    "Deux inconnus, un resto, ça suffit comme pitch",
    "Pas de swipe. Tu proposes, tu réponds.",
    "Moins de scroll. Plus de fourchette.",
  ],
  gourmand: [
    "Pour ceux qui aiment bien manger… et bien être à table",
    "Quand le plaisir du plat compte autant que la personne en face",
    "La rencontre, version bonne chère ou bon petit resto",
    "Des rencontres avec du goût, au sens propre",
  ],
  viral: [
    "Faim ? Tu peux partager la table.",
    "Viens, on s’assoit.",
    "Ce soir, t’as peut-être une table quelque part",
    "Quelqu’un dans ton coin a aussi envie de commander",
  ],
  generosite: [
    "Offrir une table à quelqu’un qui en a envie",
    "Une invitation pour quelqu’un qui attend",
    "Repas suspendu : comme au café, version dîner",
  ],
} as const;
