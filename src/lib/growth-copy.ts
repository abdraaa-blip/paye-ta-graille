/**
 * Micro-textes engagement / viralité douce, sans dark patterns.
 * Utiliser avec parcimonie : une accroche forte vaut trois phrases fades.
 */

export const GROWTH_DISCOVER_KICKER = "Et si ce soir, tu ne mangeais pas seul ?";

export const GROWTH_SURPRISE = {
  title: "Envie de tenter le hasard ?",
  subtitle: "On te propose quelqu’un dans ta zone, avec des intentions repas qui peuvent bien s’aligner. Zéro obligation.",
  ctaRoll: "\u{1F3B2} Lancer la graille",
  rolling: "On mélange les cartes…",
  foundTitle: "On t’a trouvé quelqu’un",
  foundHint: "Bonne vibe détectée \u{1F440}",
  compatibleNote: "Même ville. Intentions repas compatibles.",
  softNote: "Même ville. À toi de voir si l’addition colle.",
  refuse: "Pas pour moi",
  propose: "Proposer un repas",
  again: "Relancer",
  empty: "Personne en vue pour l’instant. Reviens un peu plus tard ou élargis ton profil.",
  error: "Petit couac. Réessaie dans un instant.",
  loginHint: "Connecte-toi pour lancer la graille.",
} as const;

export const GROWTH_ACCUEIL_HOOKS = [
  "Tu manges seul ? Dommage.",
  "Quelqu’un pourrait partager ce moment avec toi.",
  "Quelqu’un t’attend peut-être ce soir.",
  "Ça fait un moment que t’as pas partagé un repas ?",
] as const;

export const GROWTH_CTA_INVITE_EAT = "Invite quelqu’un à manger";
export const GROWTH_CTA_PROPOSE_NOW = "Proposer un repas maintenant";

/** Carte « inviter un ami » : défauts alignés ton viral doux. */
export const GROWTH_INVITE_CARD = {
  title: GROWTH_CTA_INVITE_EAT,
  body: "Un lien simple, sans pression. Pour quelqu’un qui aimerait une vraie table.",
} as const;

/** Après match : preuve sociale immédiate, sans culpabiliser. */
export const GROWTH_INVITE_CARD_MATCHED = {
  title: "Tu connais quelqu’un qui aimerait ça ?",
  body: "Vous venez de vous dire oui pour une table : c’est le bon moment pour glisser un lien à un proche, zéro obligation de leur côté.",
} as const;

/** Avant le jour J : partage « à tête reposée ». */
export const GROWTH_INVITE_CARD_CONFIRMED = {
  title: "Invite quelqu’un à ta prochaine table",
  body: "Le repas est confirmé. Si un ami se sent seul à table en ce moment, un lien peut lui faire du bien.",
} as const;

/** Après repas fait : pic de gratitude / récit. */
export const GROWTH_INVITE_CARD_COMPLETED = {
  title: "Ramène quelqu’un à la prochaine table ?",
  body: "Un bon moment IRL se raconte. Un lien suffit pour proposer Paye ta graille à quelqu’un qui aimerait moins manger seul·e.",
} as const;

/** Texte natif (partage OS), apostrophe typographique. */
export const GROWTH_INVITE_SHARE_TEXT =
  "On mange ensemble ? J\u2019utilise Paye ta graille pour proposer une table.";

/** Arrivée depuis `/commencer?ref=friend_*` (propagé en `invite_ref` sur auth / onboarding). */
export const GROWTH_INVITE_LANDING_BANNER =
  "Quelqu’un t’a invité à découvrir Paye ta graille. Tu peux créer ton compte ou suivre le parcours : zéro obligation.";

export const GROWTH_GRAILLE_PLUS_LEAD =
  "Trois bonus. Un clic chacun. Rien d’obligatoire.";

export const GROWTH_MODULE_SHARE = {
  title: "Partage de graille",
  oneLiner: "Un plat maison, des infos claires, une réservation simple.",
  /** Accroche page module (pulses, cartes), affichée en plus du one-liner sur la page Partage. */
  slogan: "Offrir un repas, c’est offrir un moment.",
  cta: "Proposer ou parcourir",
  modeGift: "\u{1F381} Don",
  modeChipIn: "\u{1F91D} Participation",
} as const;

export const GROWTH_MODULE_RESCUE = {
  title: "Seconde graille",
  /** Phrase d’accroche publique (page module, landing, pulses) : à garder visible sur la page Seconde graille. */
  slogan: "On a tous droit à une seconde graille.",
  oneLiner: "Un repas sauvé, un sourire en plus.",
  cta: "Voir le concept",
} as const;

/** Slogan affiché sur la page « Repas ouverts » (également présent dans les pulses app). */
export const GROWTH_REPAS_OUVERTS_SLOGAN = "Faim ? Tu peux partager la table.";

/** Slogan affiché sur la page « Expériences » (aligné promesse metadata / pilier produit). */
export const GROWTH_EXPERIENCES_SLOGAN =
  "Rejoindre plutôt que chercher seul : repas organisé, sans marketplace de résas.";

/** Slogan affiché sur la page « Lieux » (lieu = sert le repas, pas le catalogue). */
export const GROWTH_LIEUX_SLOGAN = "Un lieu pour le repas que tu organises, pas un catalogue infini.";

export const GROWTH_MODULE_PAY = {
  title: "Addition tranquille",
  oneLiner: "Trois façons de voir l’argent : tu choisis en un regard.",
  chipInvite: "\u{1F37D}\uFE0F J’invite",
  chipSplit: "\u{1F91D} 50/50",
  chipGuest: "\u{1F381} Je me fais inviter",
  cta: "Comment ça sera sécurisé",
} as const;

export const GROWTH_MICRO_WIN = "+1 moment partagé (bientôt compté avec tendresse)";
