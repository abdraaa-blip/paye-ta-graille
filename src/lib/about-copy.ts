/**
 * Page À propos : ton chaleureux, aligné marque (pas juridique : voir CGU).
 */
export const ABOUT_BRAND_NAME = "Paye ta graille";

/** Pastilles orbitales hero À propos (4 positions, même composant que la landing). */
export const ABOUT_HERO_ORBIT_LABELS = [
  "à propos",
  "la marque",
  "table réelle",
  "sans promesse vide",
] as const;

export const ABOUT_KICKER = "Notre façon de voir les choses";

export const ABOUT_ROTATING_LINES = [
  "Le repas d’abord. Le reste si ça colle.",
  "J’invite, on partage, je me fais inviter. Sans ambiguïté.",
  "Des vraies tables, pas du scroll infini.",
  "Quartier, confiance, et une addition qu’on ose nommer.",
  "Manger ensemble, simplement. Humainement.",
] as const;

export const ABOUT_LEAD =
  "On croit qu’un bon moment autour d’une assiette vaut mieux qu’une promesse en l’air. Paye ta graille aide à oser proposer, oser dire comment tu vois l’addition, et retrouver du lien réel.";

export type AboutPillar = {
  title: string;
  body: string;
  /** Détail discret au survol / focus (carte tabbable, pas un second CTA coloré). */
  detail: string;
};

export const ABOUT_PILLARS: readonly AboutPillar[] = [
  {
    title: "Clarté",
    body: "Intentions repas visibles tôt : moins de gêne, plus de respect.",
    detail:
      "Invite, partage ou « je me fais inviter » : tu vois tôt comment la personne nomme l’addition, avant le jour J. Moins de sous-entendus quand les couverts touchent l’assiette.",
  },
  {
    title: "Proximité",
    body: "Autour de toi, au bon moment. Pas une scène de dating forcée.",
    detail:
      "Quartier et créneau d’abord : on vise des trajets simples et des tables réelles, pas une carte du monde où tout le monde te « matche » sans jamais manger.",
  },
  {
    title: "Chaleur",
    body: "Une interface qui donne faim, sans te presser.",
    detail:
      "Tamisé, humain, un ton qui ressemble à une conversation : on laisse la pression du profil parfait dehors — le repas reste le prétexte naturel.",
  },
];

/** Livret « carte de restaurant » : une page = un volet du concept (ordre de lecture). */
export type AboutLivretPage = {
  id: string;
  title: string;
  epigraph: string;
  paragraphs: readonly string[];
};

export const ABOUT_LIVRET_INTRO =
  "Comme une carte qu’on retourne : chaque page raconte un morceau de Paye ta graille, du pourquoi au comment, sans jargon.";

/** Persistance session (page + ouverture), clé versionnée si le format change. */
export const ABOUT_LIVRET_SESSION_KEY = "ptg.about.livret.v1";

/** Ancres reconnues : `#livret-payetagraille` (id section) ou raccourci `#livret`. */
export const ABOUT_LIVRET_HASH_ALIASES = ["livret"] as const;

/** Description courte pour métadonnées et partage social. */
export const ABOUT_PAGE_SHARE_DESCRIPTION =
  "Concept Paye ta graille : repas réel, intentions à table (j’invite, on partage, je me fais inviter), livret interactif et index des pages de l’app.";

/** Mots-clés SEO (page À propos). */
export const ABOUT_PAGE_KEYWORDS = [
  "Paye ta graille",
  "à propos",
  "repas partagé",
  "rencontre autour du repas",
  "intentions à table",
  "Graille+",
  "réseau social repas",
] as const;

export const ABOUT_LIVRET_PAGES: readonly AboutLivretPage[] = [
  {
    id: "concept",
    title: "À l’entrée : le concept",
    epigraph: "La table avant l’écran",
    paragraphs: [
      "Paye ta graille, c’est une invitation à manger avec d’autres humains, près de chez toi, avec des intentions lisibles avant même de commander.",
      "On part du repas : le plat, le lieu, le créneau. Pas d’algorithme qui te vend un « match » avant d’avoir une fourchette en main.",
      "Le but n’est pas de remplacer la vie sociale, mais de lui redonner un prétexte simple : partager une table, sans négocier dans le flou.",
    ],
  },
  {
    id: "objectif",
    title: "Ce qu’on veut pour toi",
    epigraph: "Objectif : du lien réel",
    paragraphs: [
      "Moins manger seul quand tu n’en as pas envie. Moins tourner en rond dans des apps où tout est suggestion et rien n’est dit.",
      "Oser proposer un repas, oser dire comment tu vois l’addition, oser accepter ou refuser sans drama : c’est ça, l’objectif.",
      "Tu gardes la main. L’app pose le cadre : profil, envies, quartier, intention repas. Le reste se joue à table.",
    ],
  },
  {
    id: "sociabiliser",
    title: "Sociabiliser sans scénario imposé",
    epigraph: "Rencontre spontanée, pas casting",
    paragraphs: [
      "Ici, la sociabilité passe par le repas : tu parles bouffe, horaires, quartier, puis tu vois si la conversation dérape joliment ailleurs.",
      "Pas de « performance » à la première prise de parole. Pas besoin d’être extraverti·e : il suffit d’avoir faim et d’être honnête sur ton intention.",
      "Rencontres légères, régulières, ou une seule soirée mémorable : tout est valable tant que c’est consenti et clair.",
    ],
  },
  {
    id: "intentions",
    title: "Les intentions à table",
    epigraph: "J’invite · on partage · je me fais inviter",
    paragraphs: [
      "Trois façons simples de nommer l’argent : j’invite, on partage, je me fais inviter. Ça évite la gêne au moment de l’addition.",
      "Ce ne sont pas des étiquettes sur les personnes : ce sont des cadres pour un moment précis. Tu peux changer d’intention d’un repas à l’autre.",
      "Moins de sous-entendus, plus de respect. Quand tout le monde sait où ça se situe, la soirée peut vraiment commencer.",
    ],
  },
  {
    id: "partage",
    title: "Partager, donner, prolonger",
    epigraph: "Au-delà de l’assiette",
    paragraphs: [
      "Le partage, chez nous, c’est aussi proposer un plat, une table ouverte, ou une seconde chance après un repas raté : la « seconde graille », pour celles et ceux qui veulent retenter.",
      "Des modules comme Graille+ ouvrent la porte à d’autres gestes : offrir, réserver, sécuriser une intention de paiement quand c’est activé chez toi.",
      "Rien n’est obligatoire : tu peux n’utiliser que le cœur du produit, les repas et les profils autour de toi.",
    ],
  },
  {
    id: "experiences",
    title: "Des expériences uniques",
    epigraph: "Ce qu’on n’efface pas",
    paragraphs: [
      "Une table, ce n’est pas une story éphémère : c’est un goût, un rire, un quartier, parfois une voix qu’on reconnaît la fois d’après.",
      "Les expériences fortes ne se commandent pas à la carte des likes. Elles arrivent quand le cadre est sain : intentions claires, lieu réel, présence.",
      "Paye ta graille vise ce genre de moments : petits, sincères, parfois inoubliables, presque toujours meilleurs que de scroller un dimanche soir.",
    ],
  },
  {
    id: "vision",
    title: "Notre cap",
    epigraph: "Vision",
    paragraphs: [
      "On imagine des quartiers où proposer un repas est aussi naturel que prêter une chaise : un réseau de confiance autour de la bouffe, pas un classement de profils.",
      "La vision, c’est une tech au service du tactile : moins de friction pour arriver à « on se retrouve où ? », plus de transparence sur l’addition et les attentes.",
      "Si ce livret te parle, tu sais déjà l’essentiel : à Paye ta graille, on commence par manger. Le reste, si le reste veut venir.",
    ],
  },
] as const;

/** Second volet « carte » : entrées vers les pages utiles de l’app (toujours visible sous le livret). */
export const ABOUT_SERVICES_SECTION_TITLE = "Ce qu’on propose";

export const ABOUT_SERVICES_SECTION_INTRO =
  "Un index cliquable : chaque carte mène à une partie du site. Les modules Graille+ ou repas ouverts peuvent être en « à venir » selon ton espace ; la page t’expliquera toujours où tu en es.";

export type AboutServiceLink = {
  href: string;
  label: string;
  blurb: string;
};

export const ABOUT_SERVICE_LINKS: readonly AboutServiceLink[] = [
  { href: "/commencer", label: "Commencer", blurb: "Entrer dans le parcours : invitation, intentions, premier pas." },
  { href: "/auth", label: "Connexion / inscription", blurb: "Ouvrir une session ou créer un compte." },
  { href: "/accueil", label: "Accueil", blurb: "Le hub de l’app une fois connecté·e." },
  { href: "/decouvrir", label: "Rencontres", blurb: "Voir qui mange autour de toi et proposer un repas." },
  { href: "/repas/nouveau", label: "Proposer un repas", blurb: "Créer une nouvelle invitation ou demande de table." },
  { href: "/repas", label: "Mes repas", blurb: "Suivre les demandes, confirmations et rendez-vous." },
  { href: "/lieux", label: "Lieux", blurb: "Repères, carte et idées de tables près de toi." },
  { href: "/moi", label: "Moi", blurb: "Profil, rappels et réglages qui te rassurent." },
  { href: "/profil", label: "Modifier le profil", blurb: "Pseudo, ville, intentions et tags graille." },
  { href: "/onboarding", label: "Parcours guidé", blurb: "Questionnaire local pour affiner ton profil avant connexion." },
  { href: "/reseau-graille", label: "Compagnons", blurb: "Après table : lien discret, repas croisés ; la vision s’étoffe ici." },
  { href: "/experiences", label: "Expériences", blurb: "Tables organisées et idées d’événements (réservation quand c’est prêt)." },
  { href: "/repas-ouverts", label: "Repas ouverts", blurb: "Fil spontané « qui mange quand », en préparation côté produit." },
  { href: "/graille-plus", label: "Graille+", blurb: "Partage culinaire, seconde graille, paiement : modules optionnels." },
  { href: "/partage-graille", label: "Partage de graille", blurb: "Offrir ou réserver une table maison quand le module est activé." },
  { href: "/seconde-graille", label: "Seconde graille", blurb: "Anti-gaspillage et surplus, quand le module est activé." },
  { href: "/paiement-repas", label: "Paiement du repas", blurb: "Sécuriser l’addition via Stripe quand le module est activé." },
  { href: "/partenaires", label: "Partenaires", blurb: "Restos, pros et pistes de collaboration." },
  { href: "/signaler", label: "Signaler", blurb: "Nous écrire si quelque chose cloche (compte requis pour le formulaire)." },
  { href: "/legal/cgu", label: "CGU", blurb: "Conditions d’utilisation." },
  { href: "/legal/confidentialite", label: "Confidentialité", blurb: "Données personnelles et traitements." },
] as const;
