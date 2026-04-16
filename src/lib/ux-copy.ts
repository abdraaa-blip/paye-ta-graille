/**
 * Textes UX écran par écran. Paires A/B : uxa() choisit selon NEXT_PUBLIC_PTG_UX_VARIANT.
 */

import { COMPANIONS_NAV_LABEL } from "./companions-copy";
import { uxa } from "./ux-variant";

export const UX_LOADING = uxa({
  a: "Chargement…",
  b: "Un instant…",
});

/** Bandeau optionnel (`NEXT_PUBLIC_PTG_PUBLIC_BETA=1`) : voir `BetaBanner`. */
export const UX_BETA = {
  ribbon: uxa({
    a: "Version bêta : merci d’être parmi les premiers. Un couac ? Raconte-le via « Signaler » en bas de page.",
    b: "On est en bêta : tout bouge encore un peu. Un bug ? Le pied de page, on lit.",
  }),
} as const;

/** Pages d’erreur globales (`not-found`, `error`). */
export const UX_ERRORS = {
  notFoundTitle: "Page introuvable",
  notFoundBody: "Ce lien ne mène nulle part — ou la page a déménagé.",
  notFoundCtaHome: "Retour à l’accueil",
  errorTitle: "Un souci technique",
  errorBody: "Quelque chose s’est mal passé. Tu peux réessayer ou revenir plus tard.",
  errorRetry: "Réessayer",
  errorHome: "Accueil",
} as const;

export const UX_HOME = {
  kicker: "Paye ta graille",
  /** Le kicker sur la landing est un lien : le nom visible reste la marque. */
  kickerLinkAria: "À propos du projet Paye ta graille",
  ctaPrimary: uxa({ a: "Commencer", b: "Entrer" }),
  ctaHasAccount: uxa({ a: "J’ai déjà un compte", b: "Me connecter" }),
  blurbAfterSecondary: uxa({
    a: "Pas de swipe. Une table, des intentions claires : j’invite, on partage, ou je me fais inviter.",
    b: "Tu ne fais pas défiler des visages. Tu dis comment tu vois l’addition, et tu proposes un vrai repas.",
  }),
  blurbProduct: uxa({
    a: "On ne te promet pas un date. On te propose un repas entre humains. Pas de wallet gadget, pas d’appli resto toute seule.",
    b: "Le produit, c’est le repas réel. Le reste peut suivre, ou pas. Pas de promesse en carton.",
  }),
  closing: uxa({
    a: "Tu viens manger. On verra bien pour la suite.",
    b: "Commence par commander. Le reste viendra si ça doit venir.",
  }),
  /** Sous-texte landing : philosophie « lien réel » sans la formuler comme slogan ; aligné `MARKETING_OFFICIEL` (repas d’abord). */
  whisper: uxa({
    a: "Le repas est le prétexte honnête. Autour, c’est juste du vivant.",
    b: "Une table, des humains, pas de scène à jouer.",
  }),
} as const;

export const UX_ACCUEIL = {
  title: uxa({ a: "On mange ?", b: "Faim ?" }),
  leadFaim: uxa({
    a: "Faim, envie de voir du monde, ou les deux ?",
    b: "Tu veux manger, rencontrer quelqu’un, un peu des deux ?",
  }),
  sessionIn: uxa({
    a: "Il y a peut-être déjà une table pour toi. Tu préfères quelque chose d’intime ou d’ouvert ?",
    b: "Si tu es connecté, des profils t’attendent peut-être. Petit groupe tranquille, ou table plus large ?",
  }),
  sessionDraft: uxa({
    a: "Tu as un brouillon sur cet appareil. Connecte-toi pour le garder sur ton compte.",
    b: "Ton profil brouillon est là, sur ce téléphone ou ce PC. Passe par la connexion pour le sauvegarder.",
  }),
  sessionNoDraft: uxa({
    a: "Fais un tour dans le parcours guidé, ou connecte-toi pour rejoindre les autres.",
    b: "Tu peux commencer sans compte, ou te connecter tout de suite.",
  }),
  moodTitle: uxa({ a: "Tu es plutôt…", b: "Ton mood du moment" }),
  moodPrivateTitle: "Repas tranquille",
  moodPrivateBody: uxa({
    a: "Deux personnes, ou un petit groupe. Les intentions d’addition sont visibles tout de suite.",
    b: "1 à 1 ou petit cercle. Qui invite, qui partage : c’est affiché avant d’écrire.",
  }),
  moodPrivateCta: uxa({ a: "Voir des profils", b: "À table" }),
  moodOpenTitle: "Table ouverte",
  moodOpenBody: uxa({
    a: "Plus spontané : qui est partant, quel créneau. Le fil arrive bientôt pour ça.",
    b: "Le fil « qui mange quand » n’est pas encore là, mais c’est prévu pour les envies du moment.",
  }),
  moodOpenCta: uxa({ a: "Repas ouverts", b: "Voir le fil" }),
  moodExpTitle: "Expériences",
  moodExpBody: uxa({
    a: "Des repas organisés : tu t’inscris plutôt que tout planifier solo.",
    b: "Quand ce sera prêt : des tables montées par l’app ou des partenaires, tu n’as qu’à dire oui.",
  }),
  moodExpCta: uxa({ a: "Découvrir", b: "En savoir plus" }),
  linkLieux: "Lieux",
  linkRepas: "Mes repas",
  linkReseau: COMPANIONS_NAV_LABEL,
  profileOnline: "Profil en ligne",
  cityMissing: "Ville pas encore indiquée",
  editProfile: "Modifier le profil",
  connect: "Connexion",
  connectAfterLink: uxa({
    a: "pour voir les profils près de chez toi et suivre tes repas.",
    b: "ouvre l’accès aux profils autour de toi et à tes repas.",
  }),
  draftSyncIntro: uxa({
    a: "Tu as un brouillon ici. Tu peux le copier sur ton compte.",
    b: "Brouillon local : un clic et il part sur ton profil en ligne.",
  }),
  draftSyncBtn: uxa({ a: "Mettre le brouillon sur mon profil", b: "Copier sur mon compte" }),
  draftSyncBusy: "Patience…",
  draftSyncOk: uxa({ a: "C’est bon, c’est sur ton compte.", b: "Enregistré sur ton profil." }),
  draftSyncErrFallback: uxa({ a: "Échec de la synchro.", b: "Synchro impossible pour l’instant." }),
  draftMissing: uxa({
    a: "Pas de profil local. Lance le parcours guidé (données dans ton navigateur seulement).",
    b: "Aucun brouillon ici. Tu peux faire le parcours sans compte, tout reste sur l’appareil.",
  }),
  draftOnboardingLink: uxa({ a: "Parcours guidé", b: "Créer un brouillon" }),
  draftSummaryLabel: "Sur cet appareil",
  draftClear: uxa({ a: "Effacer le brouillon", b: "Supprimer ce brouillon" }),
  profileNeedsCityTitle: "Indique ta ville pour utiliser « Autour de toi »",
  profileNeedsCityBody:
    "Sans ville, la liste des profils reste vide. Deux minutes sur ta fiche suffisent.",
  profileNeedsCityCta: "Compléter ma fiche",
  ritualTitle: "Rituel du soir",
  ritualBody: uxa({
    a: "Un passage de 30 secondes peut suffire : voir qui mange, proposer si tu le sens, puis fermer l'app.",
    b: "Regarde rapidement ce soir, propose si l'envie est la, puis passe a autre chose.",
  }),
  nextActionTitle: "Action recommandee",
  nextActionIn: uxa({
    a: "Passe sur Découvrir et choisis une table qui te ressemble.",
    b: "Va dans Découvrir, puis propose un repas si le profil te parle.",
  }),
  nextActionOut: uxa({
    a: "Connecte-toi pour voir les profils autour de toi et lancer ta premiere proposition.",
    b: "Connexion rapide, puis Découvrir pour commencer.",
  }),
} as const;

export const UX_DISCOVER = {
  title: uxa({ a: "Autour de toi", b: "Des gens près de toi" }),
  subtitle: uxa({
    a: "Repas calme : petit groupe ou tête à tête. Les intentions d’addition sont visibles.",
    b: "Tu cherches une table privée. Les envies sur l’addition sont affichées sur chaque fiche.",
  }),
  intro: uxa({
    a: "Des personnes dans ton coin qui veulent manger pour de vrai. Tu vois vite comment elles voient l’addition et l’ambiance. Ensuite tu proposes un lieu, et vous allez au resto.",
    b: "Liste de profils autour de toi. Addition et vibe table sont lisibles d’un coup d’œil. Tu envoies une proposition de repas, vous choisissez le lieu ensemble.",
  }),
  loading: uxa({ a: "On regarde qui est dans les parages…", b: "Recherche en cours…" }),
  refresh: uxa({ a: "Actualiser", b: "Rafraîchir" }),
  retry: "Réessayer",
  errorGeneric: uxa({
    a: "Petit souci. Réessaie dans un moment.",
    b: "Ça n’a pas chargé. Nouvel essai bientôt ?",
  }),
  errorListUnavailable: uxa({
    a: "La liste ne s’affiche pas pour l’instant.",
    b: "Impossible d’afficher les profils tout de suite.",
  }),
  hintListRetry: uxa({
    a: "Réessaie dans un moment. Si ça continue, reviens plus tard.",
    b: "Actualise la page ou attends quelques minutes.",
  }),
  hintLogin: uxa({
    a: "Connecte-toi pour voir les profils dans ta zone.",
    b: "Il faut être connecté pour ouvrir la liste.",
  }),
  hintEmpty: uxa({
    a: "Pour l’instant, personne ne colle exactement à ta zone. Les tables se remplissent petit à petit. Tu peux élargir ton profil ou repasser plus tard.",
    b: "Liste vide pour ta recherche. Ça bouge au fil des jours. Ajuste ton profil ou reviens demain.",
  }),
  hintEmptyTips: uxa({
    a: "Astuce : même ville exacte ou position GPS + rayon sur ta fiche. Vérifie aussi que l’autre personne a rempli ville ou position.",
    b: "Si la liste est vide : aligne la ville (même orthographe) ou active la position + rayon dans le profil.",
  }),
  hintRateLimited: uxa({
    a: "Tu as rafraîchi souvent : attends une minute et réessaie.",
    b: "Limite de rafraîchissement : un petit break, puis actualise.",
  }),
  filtersHint: uxa({
    a: "Filtres sur cette liste. Ta zone (ville ou position + rayon) est déjà prise en compte côté serveur.",
    b: "Affine ici. La zone vient de ton profil : ville ou GPS + rayon.",
  }),
  filterMeal: "Addition",
  filterSocial: "Ambiance",
  filterAll: "Tout",
  filterNoMatch: uxa({
    a: "Aucun profil avec ces filtres. Remets « Tout » sur une ligne ou actualise.",
    b: "Rien ne correspond. Élargis les filtres ou rafraîchis la liste.",
  }),
  proposeMeal: uxa({ a: "Proposer un repas", b: "Inviter à manger" }),
  /** Rappel intention d’addition avant contact ; aligné V1 intent-first, prompt discover #4 */
  proposeContextHint: uxa({
    a: "Avant d’envoyer : ton intention d’addition est sur ton profil. Vérifie qu’elle respire avec ce que tu lis sur la fiche. C’est ça, le respect d’entrée de jeu.",
    b: "Petit rappel : comme la personne en face, tu montres une intention repas (invite, partage, invité·e). Si ça sonne juste ensemble, tu proposes.",
  }),
  report: "Signaler",
  ritualTitle: "Anticipation saine",
  ritualBody: uxa({
    a: "Tu peux revenir en fin de journee : il y a parfois une nouvelle table sans que tu aies a forcer.",
    b: "Un check du soir suffit. Si rien ne bouge, tu reviens demain.",
  }),
  nextActionTitle: "Focus du moment",
  nextActionBody: uxa({
    a: "Regarde 2-3 profils max, puis propose si une vibe colle. Decision simple, sans scroll infini.",
    b: "Choisis peu, decide vite, puis envoie ta proposition.",
  }),
} as const;

export const UX_AUTH = {
  /** Lien explicite vers la landing marketing (`/`), distinct du retour navigateur. */
  backToPresentation: "Page d’accueil du site",
  title: uxa({ a: "Connexion", b: "Se connecter" }),
  alreadyInSession: uxa({
    a: "Tu es déjà connecté·e. Tu peux aller directement dans l’app.",
    b: "Session active : passe à l’app quand tu veux.",
  }),
  goToAppAccueil: "Ouvrir l’accueil app",
  goToDiscover: "Voir les profils",
  emailRememberHint: uxa({
    a: "On a repris ton adresse pour aller plus vite la prochaine fois (sur cet appareil).",
    b: "Même adresse que la dernière fois sur cet appareil : modifie si besoin.",
  }),
  emailRememberChoice: uxa({
    a: "Mémoriser mon e-mail sur cet appareil pour les prochaines connexions.",
    b: "Garder mon e-mail sur cet appareil (connexion plus rapide).",
  }),
  emailForgetOnDevice: uxa({
    a: "Oublier l’adresse mémorisée sur cet appareil",
    b: "Effacer l’e-mail enregistré ici",
  }),
  intro: uxa({
    a: "Ton mail : on t’envoie un code (souvent 6 ou 8 chiffres, selon le mail) et parfois un lien. Le lien ne marche que dans le même navigateur ; le code marche partout.",
    b: "Mail + code à saisir ici (6 à 8 chiffres selon le message), idéal téléphone ou autre navigateur. Le lien seul, c’est le même appareil que la demande.",
  }),
  errExpired: uxa({
    a: "Ce lien ne marche plus (ou tu l’as ouvert depuis un autre appareil / navigateur). Redemande un mail et utilise le code du message (6 à 8 chiffres) sur cette page.",
    b: "Lien mort ou mauvais appareil pour le lien magique. Renvoie un mail et connecte-toi avec le code reçu.",
  }),
  errConfig: "Connexion indisponible. Réessaie plus tard ou contacte le support.",
  demoTitle: "Connexion hors ligne",
  demoBody: uxa({
    a: "La connexion en ligne n’est pas disponible ici. Tu peux quand même essayer l’app avec un profil sur cet appareil.",
    b: "Pas de compte distant sur cette version. Tu peux faire le parcours en local sur cet appareil.",
  }),
  demoCta: uxa({ a: "Continuer sans compte", b: "Essayer sans me connecter" }),
  emailLabel: "Email",
  otpLabel: "Code du mail (6 à 8 chiffres)",
  otpHint: uxa({
    a: "Le code figure dans le mail (souvent 6 ou 8 chiffres), parfois avec un lien. Pense aussi aux courriers indésirables.",
    b: "Saisis exactement le code reçu par mail. Vérifie les spams si tu ne vois rien.",
  }),
  otpSubmit: uxa({ a: "Valider le code", b: "Entrer" }),
  otpBusy: "Vérification…",
  otpErr: uxa({
    a: "Code incorrect ou expiré. Redemande un envoi ou vérifie les chiffres.",
    b: "Mauvais code ou expiré. Réessaie ou redemande un mail.",
  }),
  submit: uxa({ a: "Recevoir le code par mail", b: "M’envoyer le mail" }),
  submitBusy: "Envoi…",
  sent: uxa({
    a: "Ouvre ta boîte mail (et les spams), récupère le code (6 à 8 chiffres selon le message).",
    b: "Mail envoyé : un code numérique (souvent 6 ou 8 chiffres), parfois aussi un lien.",
  }),
  errSendTitle: "On n’a pas pu envoyer le mail. Détail :",
  errRate: uxa({
    a: "Tu as redemandé le lien trop souvent. Attends un peu, ou essaie une autre adresse.",
    b: "Limite d’envoi atteinte. Patience, ou autre email.",
  }),
  errCheck: uxa({
    a: "Vérifie ta connexion et réessaie. Si le problème continue, contacte le support.",
    b: "Réessaie dans un moment. Si ça bloque encore, écris-nous via « Signaler ».",
  }),
  skipLink: uxa({ a: "Essayer sans me connecter", b: "Parcours sans compte" }),
  suspense: UX_LOADING,
} as const;

export const UX_MOI = {
  title: "Moi",
  intro: uxa({
    a: "Tes repas, ton profil, les réglages qui te rassurent.",
    b: "Le coin perso : repas, fiche, notifications.",
  }),
  navRepas: "Mes repas",
  navReseau: uxa({
    a: `${COMPANIONS_NAV_LABEL} · repas croisés & idées`,
    b: COMPANIONS_NAV_LABEL,
  }),
  navProfil: "Modifier mon profil",
  navOnboarding: uxa({ a: "Parcours guidé (brouillon local)", b: "Refaire le questionnaire local" }),
  notifTitle: "Rappels",
  notifBody: uxa({
    a: "Calme, normal ou coupé : c’est dans ton profil en ligne. Les mails repas suivent ton compte.",
    b: "Tu règles la fréquence dans le profil. Les mails dépendent du compte.",
  }),
  helpTitle: "Aide",
  signOut: uxa({ a: "Me déconnecter", b: "Déconnexion" }),
  signOutBusy: "Déconnexion…",
  notConnected: uxa({
    a: "Tu n’es pas connecté.",
    b: "Pas de session ouverte.",
  }),
  connect: "Connexion",
  profileCheckErr: uxa({
    a: "On n’a pas pu vérifier ta session. Réessaie ou passe par la connexion.",
    b: "Vérification du compte impossible pour l’instant. Nouvel essai ?",
  }),
  retryProfileCheck: "Réessayer",
  ritualTitle: "Rituel doux",
  ritualCalme: "Un check léger en fin de journée suffit. Tu gardes le contrôle.",
  ritualNormal: "Passe ce soir voir qui mange autour de toi. Sans pression.",
  ritualOff: "Rappels coupés. Tu reviens quand tu veux, le rythme est le tien.",
  nudgeSaved: "Préférence de rappel mise à jour.",
} as const;

export const UX_ONBOARDING = {
  step: (n: number, total: number) => `Étape ${n} / ${total}`,
  step1Title: uxa({ a: "Ton coin sur l’app", b: "Parlons de toi" }),
  step1Body: uxa({
    a: "Un pseudo, ta ville. La photo pourra attendre.",
    b: "Pseudo et ville suffisent. Tu ajouteras une photo plus tard si tu veux.",
  }),
  pseudo: "Pseudo",
  city: "Ville",
  radius: (km: number) => `Rayon : ${km} km`,
  step2Title: uxa({ a: "Côté table", b: "Comment tu vois les rencontres" }),
  step2Body: uxa({
    a: "Pas un test. Juste pour qu’on sache où tu en es.",
    b: "Trois façons de te situer. Prends celle qui te ressemble.",
  }),
  socialAmi: uxa({ a: "Proches", b: "Ami" }),
  socialAmiDesc: uxa({
    a: "Plutôt des gens que tu connais ou que tu veux revoir.",
    b: "Famille, amis, retrouvailles.",
  }),
  socialOuvert: "Ouvert",
  socialOuvertDesc: uxa({
    a: "Tu es partant pour rencontrer, sans te mettre la pression.",
    b: "Nouvelles têtes, sans drama.",
  }),
  socialDating: uxa({ a: "Pas fermé", b: "Dating léger" }),
  socialDatingDesc: uxa({
    a: "Tu ne fermes pas la porte, mais le repas passe avant.",
    b: "Si ça colle, tant mieux. Sinon, au moins le plat était bon.",
  }),
  step3Title: uxa({ a: "L’addition", b: "Qui paye quoi" }),
  step3Body: uxa({
    a: "Comment tu proposes de partager la note.",
    b: "Tu dis comment tu vois l’addition avant même d’écrire.",
  }),
  step4Title: uxa({ a: "Ta graille, tes tags", b: "Tags et préférences" }),
  step4Body: uxa({
    a: `Jusqu’à dix cases. Il en faut au moins une sur ton style de graille, et une sur ce que tu viens chercher ici. Le reste est en bonus. Ce n’est pas une appli régime.`,
    b: `Choisis jusqu’à dix tags. Garde au moins un « style de graille » et un « pourquoi je suis là ». On ne compte pas les calories.`,
  }),
  prefWithTitle: "Tu préfères manger avec",
  prefAllTitle: "Tout le monde",
  prefAllDesc: uxa({ a: "Ouvert à toutes les tables.", b: "Pas de filtre particulier." }),
  prefSimilarTitle: "Profils proches des miens",
  prefSimilarDesc: uxa({
    a: "Même vibe de graille.",
    b: "Des envies qui ressemblent aux tiennes.",
  }),
  prefStylesTitle: "D’autres styles",
  prefStylesDesc: uxa({
    a: "Varier les assiettes.",
    b: "Changer d’horizon à chaque fois.",
  }),
  selectionCount: (n: number, max: number) => `${n} / ${max} choisis`,
  step5Title: "Régimes et allergies",
  step5Body: uxa({
    a: "L’app transmet ce que tu écris. Au resto, vérifie toujours sur place (règles UE sur les allergènes).",
    b: "Note ce qu’il faut savoir. On le transmet. Au moment de commander, redemande au serveur si besoin.",
  }),
  dietLabel: "Libre (optionnel)",
  step6Title: "Les rappels",
  step6Body: uxa({
    a: "On te prévient doucement. Tu peux tout couper.",
    b: "Notifications : comme tu veux. Zéro obligation.",
  }),
  nudgeCalme: "Calme",
  nudgeCalmeDesc: uxa({ a: "Peu souvent, l’essentiel seulement.", b: "Rare, et utile." }),
  nudgeNormal: "Normal",
  nudgeNormalDesc: uxa({ a: "Assez pour ne pas rater un repas.", b: "Équilibré." }),
  nudgeOff: "Off",
  nudgeOffDesc: uxa({ a: "Rien dans l’app.", b: "Aucun rappel ici." }),
  back: "Retour",
  continue: "Continuer",
  finish: uxa({ a: "C’est bon", b: "Terminer" }),
} as const;

export const UX_PROFIL = {
  loading: uxa({ a: "On charge ton profil…", b: "Chargement du profil…" }),
  needAuthTitle: "Profil",
  needAuthBody: uxa({
    a: "Connecte-toi pour modifier ta fiche en ligne.",
    b: "Fiche en ligne : il faut être connecté.",
  }),
  connect: "Me connecter",
  onboardingLocal: uxa({ a: "Parcours sans compte (brouillon ici)", b: "Questionnaire local" }),
  retry: "Réessayer",
  title: uxa({ a: "Ta fiche", b: "Ton style à table" }),
  intro: uxa({
    a: "Comment tu manges, comment tu rencontres. Tu changes quand tu veux.",
    b: "Intentions, tags, rappels. Tout est modifiable.",
  }),
  photoLabel: uxa({ a: "Photo (lien, optionnel)", b: "Image de profil (URL, optionnel)" }),
  photoPh: "https://…",
  socialHeading: "Intention sociale",
  mealHeading: "Intention repas",
  prefHeading: "Tu préfères manger avec",
  prefHint: uxa({
    a: "Inclusion et découverte. Tu restes maître de tes invitations.",
    b: "Pas un fil « date ». Tu invites qui tu veux.",
  }),
  vibeLine: (vibe: string) => `Petit indicateur culinaire (pour le fun) : ${vibe}`,
  tagsHeading: (max: number) => `Tags (max ${max})`,
  orphanHeading: "Anciens tags",
  nudgeHeading: "Rappels",
  nudgeIntro: UX_ONBOARDING.step6Body,
  save: "Enregistrer",
  saveBusy: "Enregistrement…",
  saveOk: uxa({
    a: "C’est en ligne. Les autres voient ça sur ta fiche.",
    b: "Sauvegardé. Visible sur ton profil public.",
  }),
  saveErr: uxa({ a: "Impossible d’enregistrer.", b: "Échec de l’enregistrement." }),
  redoOnboarding: uxa({ a: "Refaire le parcours guidé (local)", b: "Nouveau brouillon local" }),
  backMoi: "Moi",
  postAuthSetupTitle: "Presque prêt pour ta première table",
  postAuthSetupBody:
    "Vérifie ton pseudo, ta ville et si tu peux ta position (bouton GPS) : c’est ce qui permet de te montrer aux bonnes personnes.",
  geoUse: uxa({ a: "Utiliser ma position (GPS)", b: "Position actuelle (GPS)" }),
  geoBusy: "Localisation…",
  geoOk: uxa({
    a: "Position enregistrée sur ta fiche (tu peux l’effacer plus bas).",
    b: "GPS pris en compte pour « Autour de toi ».",
  }),
  geoReadyToSave: uxa({
    a: "Coordonnées GPS récupérées : clique sur « Enregistrer » pour les envoyer.",
    b: "GPS OK : enregistre ta fiche pour l’utiliser dans « Autour de toi ».",
  }),
  geoErr: uxa({
    a: "Impossible de lire la position. Vérifie les autorisations du navigateur.",
    b: "Géolocalisation refusée ou indisponible.",
  }),
  geoClear: uxa({ a: "Effacer ma position", b: "Retirer le GPS du profil" }),
  geoHint: uxa({
    a: "Optionnel : améliore « Autour de toi » avec un rayon en km. Sans GPS, seule la ville (texte exact) compte.",
    b: "Le GPS + rayon remplace le pire des cas « même ville mot pour mot ». Tu peux n’avoir que la ville.",
  }),
} as const;

export const UX_REPAS = {
  title: "Mes repas",
  intro: uxa({ a: "Demandes, confirmations, rendez-vous.", b: "Tout ce qui bouge autour de tes tables." }),
  loading: uxa({ a: "On récupère tes repas…", b: "Chargement des repas…" }),
  refresh: "Actualiser",
  retry: "Réessayer",
  errLoad: uxa({
    a: "Petit souci. Réessaie.",
    b: "Chargement raté. Nouvel essai ?",
  }),
  errAuth: uxa({ a: "Il faut être connecté.", b: "Connexion requise." }),
  connect: "Me connecter",
  empty: uxa({ a: "Aucun repas pour l’instant.", b: "Pas encore de repas." }),
  emptyCta: uxa({ a: "Voir des profils", b: "Explorer" }),
  groupBadge: "Groupe",
  updated: "Màj",
  emotionWinTitle: "Moment validé 🍽️",
  emotionWinBody: "Tu as des tables en cours. Prends 30 secondes pour voir où ça en est.",
  eveningHint: "Ce soir peut encore se jouer : un message, une proposition, et c'est parti.",
  nextActionTitle: "Prochaine étape",
  nextActionBody: uxa({
    a: "Si rien n’est confirmé, retourne sur Découvrir pour relancer une proposition.",
    b: "Pas de table en cours ? Un tour dans Découvrir peut débloquer la suite.",
  }),
} as const;

export const UX_SIGNALER = {
  title: "Signaler un problème",
  intro: uxa({
    a: "Raconte ce qui s’est passé. En urgence vitale, appelle les secours (15, 17, 18, 112 selon le pays).",
    b: "Décris la situation. Si c’est grave et maintenant, passe par les numéros d’urgence.",
  }),
  mealLinked: "Repas lié",
  detailLabel: "Détail (10 caractères min.)",
  contactLabel: uxa({ a: "Mail pour te répondre (optionnel)", b: "Email de réponse (optionnel)" }),
  submit: "Envoyer",
  submitBusy: "Envoi…",
  ok: uxa({ a: "Reçu. On s’en occupe dès qu’on peut.", b: "Merci, c’est enregistré." }),
  errAuth: uxa({ a: "Connecte-toi pour qu’on enregistre le signalement.", b: "Signalement lié au compte : connecte-toi." }),
  errNet: uxa({ a: "Réseau coupé. Réessaie plus tard.", b: "Pas de connexion. Plus tard ?" }),
} as const;

export const UX_NOUVEAU_REPAS = {
  title: uxa({ a: "Proposer un repas", b: "Inviter à table" }),
  needGuest: uxa({
    a: "Choisis d’abord quelqu’un dans « Autour de toi », puis le bouton sur sa fiche.",
    b: "Il manque la personne. Passe par la liste des profils et le bouton sur la fiche.",
  }),
  warnGuest: uxa({ a: "Lien incomplet ou expiré.", b: "Destinataire invalide." }),
  ctaDiscover: uxa({ a: "Aller à Autour de toi", b: "Voir les profils" }),
  checkProfil: "Mon profil",
  intro: uxa({
    a: "Tu proposes une table à quelqu’un que tu as vu dans la liste. La personne retrouvera ça dans ses repas.",
    b: "Invitation envoyée à la personne choisie. Elle la verra dans son espace repas.",
  }),
  groupLabel: uxa({
    a: "Repas groupe : après le oui, vous pourrez noter qui ramène quoi (entrée, plat, dessert, boissons). À cocher seulement si vous êtes plusieurs à coordonner.",
    b: "Case groupe : utile quand vous êtes plusieurs et que vous voulez vous répartir les plats. Pas obligatoire pour un duo simple.",
  }),
  budget: "Budget (optionnel)",
  budgetPh: "ex. ~25 €",
  slotStart: "Début de créneau (optionnel)",
  slotEnd: "Fin de créneau (optionnel)",
  submit: uxa({ a: "Envoyer la proposition", b: "Envoyer" }),
  submitBusy: "Envoi…",
  created: "Repas créé.",
} as const;

export const UX_FOOTER = {
  /** Landing marketing (`/`), utile depuis l’app connectée. */
  presentation: "Accueil site",
  about: "À propos",
  legal: uxa({ a: "Conditions", b: "CGU" }),
  privacy: "Confidentialité",
  report: uxa({ a: "Signaler", b: "Un problème ?" }),
  note: uxa({
    a: "Repas en lieu public, intentions dites clairement. Aucune promesse de zéro risque.",
    b: "On te rappelle de choisir un lieu public et de garder les choses claires. Le reste, c’est la vie réelle.",
  }),
} as const;

/** Libellés unifiés pour liens retour (`/accueil` vs landing `/`). */
export const UX_BACK = {
  /** Vers `/accueil` sans flèche (fil d’Ariane, lien inline). */
  appAccueilShort: "Accueil",
  /** Lien typique `ptg-link-back` vers `/accueil`. */
  appAccueil: "← Accueil",
  /** Landing marketing : aligné `UX_FOOTER.presentation`. */
  marketingHome: `← ${UX_FOOTER.presentation}`,
} as const;
