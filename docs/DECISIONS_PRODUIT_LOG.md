# Paye ta graille — Journal de décisions produit (ADR léger)

**Objectif** : tracer **pourquoi** on a dit oui / non / plus tard, sans perdre le fil quand l’équipe grossit.  
**Règle** : une entrée = **une** décision ; format court.

---

## Modèle d’entrée

```
## [YYYY-MM-DD] Titre court
- **Contexte** : …
- **Décision** : …
- **Alternatives écartées** : …
- **Conséquences** : …
- **Liens** : fichiers / tickets
```

---

## Entrées

### [2026-04-12] Règle provisoire `completed` (blueprint MVP)

- **Contexte** : sans état `completed` clair, pas de Mes tables fiable ni métriques North Star propres.  
- **Décision** (proposition initiale blueprint) : **les deux** participants confirment **« Repas fait »** **ou** bascule auto **24h** après l’horaire du repas **si** aucun signalement bloquant.  
- **Alternatives** : un seul côté suffit ; modération manuelle uniquement.  
- **Conséquences** : implémentation `PATCH meals → completed` + analytics.  
- **Liens** : `BLUEPRINT_PRODUIT_FINAL_MVP.md` §4, `METRICS_PRODUCT.md`, `MATRICE_REPAS_ETATS_PERMISSIONS.md`.  
- **Mise à jour** : voir **[2026-04-30]** — implémentation réelle du MVP code.

### [2026-04-30] `completed` en production code : un clic + auto après créneau

- **Contexte** : éviter les repas bloqués indéfiniment en `confirmed` ; livrer vite sans module « double signature ».  
- **Décision** : **l’hôte ou l’invité** peut passer en `completed` (un clic « Repas fait ») ; **clôture automatique** via cron `GET /api/cron/meal-reminders` après **fin de fenêtre** (`window_end` si ≥ `window_start`, sinon `window_start`) + **`PTG_MEAL_AUTO_COMPLETE_GRACE_HOURS`** (défaut 24). Exécution : RPC SQL `auto_complete_confirmed_meals` ; si RPC **introuvable** seulement, fallback Node (même règle) ; autre erreur RPC → erreur exposée, pas de fallback. **Double validation des deux parties** = reportée (voir entrée 2026-04-12 si le produit l’exige plus tard).  
- **Alternatives** : uniquement manuel (repas oubliés) ; uniquement auto sans clic (moins de contrôle utilisateur).  
- **Conséquences** : migrations `20260430200000_auto_complete_meals_rpc.sql`, `src/lib/meals/meal-auto-complete.ts`, doc API + déploiement.  
- **Liens** : `MATRICE_REPAS_ETATS_PERMISSIONS.md`, `meal-transitions.ts`, `MealDetailClient.tsx`.

### [2026-04-13] Gate profil après première connexion (ville + pseudo)

- **Contexte** : `discover_profiles` et l’expérience « Autour de toi » exigent une **ville** ; le trigger crée un profil avec pseudo par défaut mais **sans ville** → liste vide et abandon en bêta.  
- **Décision** : après échange de code auth, si la cible est **`/accueil`** et que le profil n’a **pas de ville** ou un **display_name** de moins de 2 caractères → redirection **`/profil?setup=1`** + bannière sur **Accueil** si connecté·e sans ville.  
- **Alternatives** : laisser l’utilisateur découvrir seul (rejeté pour tests réels) ; forcer onboarding serveur pour tout `next` (reporté : cas liens profonds).  
- **Conséquences** : `src/app/auth/callback/route.ts`, `profil/page.tsx`, `ProfilClient`, `AccueilClient`.  
- **Liens** : `AUDIT_MVP_VALIDATION_2026-04-13.md`.

### [2026-04-13] Brainstorm « Pay Tagrail » → V1 codable

- **Contexte** : idées additionnelles (flags, son, restos, points, Connect, slogans). Risque de diluer le MVP.  
- **Décision** : **V1** = parcours repas réel solide (profil, intentions d’addition visibles, découverte, proposition, acceptation, repas, post-repas / Mes compagnons). **Hors V1 court** : son adaptatif, ledger points, paiement routé resto (Connect), questionnaire long. **Flags** : option micro-V1 (3–5 items, red = fin de match neutre, pas de score public) ou report V2.  
- **Alternatives** : tout coder d’un coup (rejeté) ; nouveau nom produit « Pay Tagrail » (rejeté comme codebase ; possible en campagne seulement).  
- **Conséquences** : référence unique `V1_CONCEPT_BRAINSTORM_TO_CODE.md` ; prompts Cursor listés dans ce doc §6.  
- **Liens** : `V1_CONCEPT_BRAINSTORM_TO_CODE.md`, `companions-copy.ts`, `MATRICE_REPAS_ETATS_PERMISSIONS.md`.

### [2026-04-14] Intention-first, demandes entrantes, coin graille (phasé)

- **Contexte** : idées « j’invite / on partage / je me laisse inviter » avec intérêts entrants + choix de l’hôte ; fil social repas groupe ; expériences atypiques ; bio avec slogans — sans transformer l’app en réseau social + dating générique.  
- **Décision** : **rester sur 3 intentions** (`invite`, `partage`, `etre_invite`). Formaliser en UX **contact conditionné à l’intention** et, en tranche suivante, **file d’intérêts + notifs + choix** si le 1:1 est déjà fluide. **Coin graille**, **repas à N**, **CTA depuis un lieu**, **tags expériences** = **Phase 2+** (spec dans `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §2.1–2.2, §6.3 #17–18). **« Qui ramène quoi »** (plat, entrée, dessert, boissons…) = **Phase 2+**, rattaché aux repas **groupe** / **hors resto classique**, pas prioritaire sur le 1:1 resto. **Bio** : suggestions copy V1, pas nouveau module.  
- **Alternatives** : tout lancer en V1 (rejeté) ; messagerie libre type réseau social (rejeté).  
- **Conséquences** : prompts et bloc 6.1 enrichis ; implémentation ultérieure sous tickets dédiés.  
- **Liens** : `V1_CONCEPT_BRAINSTORM_TO_CODE.md`, `intent-labels.ts`.

### [2026-04-15] Profil inscription : tags social-graille + spécialité (spec)

- **Contexte** : onboarding type « apps de rencontres » (cases perso, hobbies) mais **sans** angle amour ; bloc **graille** fort ; idées **spécialité** / *Ramène ta spécialité* / saveurs exotiques.  
- **Décision** : **conserver** le modèle sections + chips (`tag-options.ts`). **Enrichir** les libellés et tags (ex. burger, saveurs du monde, épicurien, lien amical, goûter d’autres saveurs). **Champ « spécialité »** : **V1 léger** (texte court optionnel) ou **V1.5** — spec et copy dans `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §2.3 + prompt §6.3 #19 ; pas de questionnaire « critères couple ».  
- **Alternatives** : profil 100 % texte libre (rejeté pour modération / friction) ; 50 tags d’un coup (rejeté, enrichissement par vagues).  
- **Conséquences** : première vague de nouveaux `tag_key` en prod possible sans migration (clé texte).  
- **Liens** : `tag-options.ts`, `OnboardingWizard.tsx`, `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §2.3.

### [2026-04-16] Événements gustatifs curés par l’app (Phase 2–3)

- **Contexte** : l’app **propose** des expériences (dîner dans le noir, pique-nique, food tour, ateliers, etc.) ; les gens **s’inscrivent** ; question **qui paie** (app, partenaire, billet %).  
- **Décision** : **oui au concept**, **Phase 2–3** après duo + fil social stables. Distinct du **coin graille** user-generated. **Économie** : mix possible — **paiement sur place**, **billet in-app** (Stripe/Connect), **sponsor lieu/marque** (transparence), **bonus marketing** app (budget limité, pas promesse permanente). **Pilote** : peu d’événements, **ops manuelle**, liste d’attente avant full produit. Catalogue et risques : **§2.4** `V1_CONCEPT_BRAINSTORM_TO_CODE.md`, prompt **#20**.  
- **Alternatives** : marketplace événements générique (rejeté) ; subvention systématique par l’app sans modèle (rejeté).  
- **Conséquences** : CGU, partenariats, alcool/allergies, annulations — **LEGAL** avant com’ large.  
- **Liens** : `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §2.4, `PRODUCT_SPEC.md` vague V2, `SYSTEME_COMPLET_PAYE_TA_GRAILLE.md`.

### [2026-04-17] Compagnons, chat entre amis, repas croisé — pas de mur public

- **Contexte** : après repas agréable, **ajouter des amis de table**, discuter entre amis, s’organiser (dont **qui ramène quoi**) ; **amis des amis** sans accès direct aux listes mais **chemins qui se croisent** (même personne invite deux compagnons qui ne se connaissent pas). Idée **gems / commentaires** incertaine.  
- **Décision** : **aligné** vision existante **`/reseau-graille`** (rencontre → lien → **repas croisé**). **Implémentation** demande compagnon + **chat groupe** durable = **Phase 2+** avec opt-in et CGU. **Confidentialité** : **pas** d’annuaire « amis de X » ; le **médiateur** crée l’invitation **repas à N**. **Commentaires / avis publics sur les profils** : **non** en V1/V2 court (modération + réputation) ; feedback **privé** optionnel seulement si un jour. Détail : **§2.5** `V1_CONCEPT_BRAINSTORM_TO_CODE.md`, prompt **#21**.  
- **Alternatives** : réseau social ouvert type Facebook (rejeté) ; gems publics jour1 (rejeté).  
- **Conséquences** : produit priorise **tables réelles** et **graphe restreint**.  
- **Liens** : `SECTION_MES_COMPAGNONS.md`, `src/app/reseau-graille/page.tsx`, `companions-copy.ts`.

### [2026-04-18] Jauge lien de table & rappels non intrusifs

- **Contexte** : jauge **privée** entre deux personnes selon le **nombre de repas** réussis ensemble ; barre qui **verdit** ; titres *Compagnon·ne de graille*, *Meilleur·e compagnon·ne* ; rappels du type *ça fait longtemps*, proposer invite / 50-50, **sans spam**.  
- **Décision** : **oui** — **jamais public**, pas trophée global. Paliers et copy dans **`companions-copy.ts`** (`COMPANIONS_GAUGE_LEVELS`, whispers) ; rappels dans **`micro-moments-copy.ts`** avec ton **opt-in** ; fréquence plafonnée + **`nudge_level`** utilisateur. **Implémentation** compteur + UI barre = **V1.5–V2**. Spec **§2.6** `V1_CONCEPT_BRAINSTORM_TO_CODE.md`.  
- **Alternatives** : leaderboard des « meilleurs compagnons » (rejeté) ; notifications illimitées (rejeté).  
- **Conséquences** : seuls repas **completed** (règle produit) incrémentent la jauge.  
- **Liens** : `companions-copy.ts`, `micro-moments-copy.ts`, `ProfilClient.tsx` (rappels).

### [2026-04-19] Healthy, végé inclusif, micro-messages & prévention « marque »

- **Contexte** : accueillir **sportifs / healthy**, **végétarien·nes** (entre eux, faire découvrir, expérience végé) ; messages **positifs** pour gros utilisateurs et **doux** pour les autres ; **prévention** eau / chaleur / 5 fruits en **humour** sans brochure santé ni jugement.  
- **Décision** : **tags** `graille_sportif`, libellé `graille_healthy` assoupli ; **ici_veg_entre_veg**, **ici_veg_partager**, **ici_veg_experience**. **Copy** : `MICRO_MOMENTS_CELEBRATION_ENGAGED`, `MICRO_MOMENTS_GENTLE_QUIET`, `WELLNESS_PREVENTION_PLAYFUL` dans `micro-moments-copy.ts`. **Interdits** : culpabiliser le corps ou le volume mangé ; promesses santé ; forcer la fréquence des repas. **Suite** : sous-ensemble messages **canicule** optionnel (météo). Spec **§2.7** `V1_CONCEPT_BRAINSTORM_TO_CODE.md`.  
- **Alternatives** : coach nutrition strict in-app (rejeté) ; silo végé uniquement (rejeté).  
- **Conséquences** : discovery / événements pourront filtrer sur ces tags.  
- **Liens** : `tag-options.ts`, `micro-moments-copy.ts`.

### [2026-04-20] Marketing « assumable » / anti-honte (corpus §2.8)

- **Contexte** : slogans du type *appli pour se rencontrer sans honte*, *appli de rencontre pour les gourmands*, *seule app qu’on assumerait*, *faciliter le lien*, *manger à deux* — besoin de **rigueur** + **garde-fous** (comparatif absolu, prix).  
- **Décision** : intégrer un **cluster officiel** dans `MARKETING_OFFICIEL.md` **§2.8** (lignes safe, variantes créatives, interdits, règle 3 s **table/repas/graille**) + **prompt Cursor #22** dans `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §6.3.  
- **Alternatives** : slogans comparatifs forts sans relecture juridique (rejeté).  
- **Conséquences** : campagnes « honte → fierté » sortent du même référentiel.  
- **Liens** : `MARKETING_OFFICIEL.md` §2.8.

### [2026-04-21] « Offrir un repas », remerciement, points discrets, solidarité, lieux

- **Contexte** : CTA **offrir un repas** (paiement in-app), attribution à un·e bénéficiaire, **merci** après repas ; idée **points** pour le donateur **sans** marketing lourd ; plus tard **solidarité** (précarité) ; **lieux** avec rayon **élargi** et **catégories** (tops, nouveautés, fine bouche, terroir, avis grailleurs). Question « qui reçoit » sans langage **mérite / démérite**.  
- **Décision** : **Phase 2–3** pour le **don pair à pair** tracé (Stripe, ledger, CGU, modération remerciements). **Attribution** : privilégier **file / tirage transparent / opt-in** ou **partenaire** — **interdit** stigmatiser (« tu manges le moins »). **Points donateur** : possible en mode **discret** ou **absence** de points + gratitude symbolique. **Solidarité SDF / précarité** : **Phase 3+** avec **associations**, pas sélection par l’app seule. **Lieux** : §2.8.E `V1_CONCEPT_BRAINSTORM_TO_CODE.md` ; prompt **#23** + enrichir **#12**.  
- **Alternatives** : « méritocratie graille » algorithmique (rejeté) ; humanitaire annoncé sans partenaire (rejeté).  
- **Conséquences** : fiscalité don, preuve d’usage repas, transparence **piste solidaire** vs **pair à pair**.  
- **Liens** : `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §2.8.

### [2026-04-22] Slogan « seconde graille » & mode **Graille à l’aveugle**

- **Contexte** : accroche *tout le monde a le droit à une seconde graille* (détournement « seconde chance ») ; mode **manger à l’aveugle** — match auto entre personnes ayant la même option, **inconnus**, **faim** + concept plaisant ; **ciblage** géo (plafond km, zone), restos **shortlist** ou tirage **borné** dans le coin. Copy *on mange puis on fait connaissance* / *mêmes goûts → bons à table*.  
- **Décision** : **marketing** dans `MARKETING_OFFICIEL.md` **§2.9** ; **produit** détaillé `V1_CONCEPT_BRAINSTORM_TO_CODE.md` **§2.9**. **Implémentation** **V1.5–V2** après parcours duo + sécurité stables. **Obligatoire** : opt-in, **lieu public**, **intentions d’addition** confirmées, **pas** domicile en 1er aveugle, signalement. Slogan **inclusif** (nouvelle table), **pas** culpabilisant. Prompts **#22** (incl. §2.9 marketing), **#24** (spec technique). Distinct **dîner dans le noir** partenaire (§2.4).  
- **Alternatives** : match aveugle sans plafond km (rejeté jour1) ; promesse « amis » forcée par le copy (rejeté).  
- **Conséquences** : file d’attente + modération au pilote.  
- **Liens** : `MARKETING_OFFICIEL.md` §2.9, `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §2.9.

### [2026-04-23] Brief design multimetiers & illustration gustative

- **Contexte** : expérience visuelle **premium**, illustration **fluide** (silhouettes, nourriture **suggérée** sans photo stock), **toutes générations**, **contre-pied** au nom argot pour **seniors** ; demande de « rechercher partout » sans bullshit.  
- **Décision** : document **`DA_BRIEF_RECHERCHE_MULTIMETIERS_ILLUSTRATION.md`** — **clusters** métiers utiles, **ressources vérifiables** (WCAG, NN/g, ouvrages classiques, communautés avec prudence), **brief illustrateur** §3, **contre-pied** §4, check-list agence §5. **Pas** de liste fictive de milliers de métiers. DA canon inchangée : **`DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md`**. Prompt Cursor **#25** dans `V1_CONCEPT_BRAINSTORM_TO_CODE.md`. Index : `DOSSIER_OFFICIEL_INDEX.md`.  
- **Alternatives** : revendiquer une veille « exhaustive » sans sources (rejeté).  
- **Conséquences** : commandes freelance et sessions design sortent du même brief.  
- **Liens** : `DA_BRIEF_RECHERCHE_MULTIMETIERS_ILLUSTRATION.md`.

### [2026-04-24] North Star engagement : **repas réels**, pas « addiction écran »

- **Contexte** : ambition forte de **rétention**, de **viralité**, de **franchise** ou de **valorisation** — parfois formulée en langage « dopamine / addictif ». Risque de confondre **puissance commerciale** et **patterns prédateurs** (dark patterns, coercition), **mal vues** en due diligence et **nocif** pour la marque premium.  
- **Décision** : le **cadre officiel** engagement + neuro-vulgarisation = **`PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md`** + **`SYSTEME_ENGAGEMENT_NATUREL.md`** ; les prompts Cursor utilisent **`V1_CONCEPT_BRAINSTORM_TO_CODE.md` §6.3 prompt #26**. **North Star** : maximiser **repas `completed`**, **confiance**, **effet réseau local** — pas **temps d’écran** ou **dépendance** comme objectif explicite. Viralité visée = **invitations qui mènent à une table réelle** (lien contextuel, plus tard QR partenaire), **playbook** franchise (DA, legal, modération).  
- **Alternatives** : document interne « hack dopamine » sans garde-fous (rejeté) ; promesse de viralité garantie (rejeté).  
- **Conséquences** : toute spec **growth / notif / gamification** est recoupée avec **`RETENTION_ETHICAL.md`** et §5 du prompt neuro.  
- **Liens** : `PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md`, `SYSTEME_ENGAGEMENT_NATUREL.md`, `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §6.3 #26.

### [2026-04-25] Hub compagnons : nom de zone **La Friend zone** (taquin vs dating)

- **Contexte** : renforcer la **différenciation** vs apps de rencontre avec un jeu de mots assumé sur la zone des personnes avec qui on a **vraiment mangé** (favoris, récurrence, compagnons de graille).  
- **Décision** : afficher **La Friend zone** comme **étiquette de zone** au-dessus du titre **Mes compagnons** sur `/reseau-graille`, + phrase explicative dans `COMPANIONS_ZONE_PLAYFUL_EXPLAIN` ; navigation et accessibilité restent sur **Mes compagnons**. **Risques** (connotation négative du terme ailleurs) inchangés : tests quali, voir `ZONE_AMIS_FRIENDZONE_STRATEGIE.md`.  
- **Alternatives** : Friendzone un seul mot partout (rejeté pour lisibilité FR) ; remplacer le H1 par Friend zone seul (rejeté).  
- **Conséquences** : copy centralisée `companions-copy.ts` ; doc stratégie + marketing §6 alignés.  
- **Liens** : `src/lib/companions-copy.ts`, `src/app/reseau-graille/page.tsx`, `ZONE_AMIS_FRIENDZONE_STRATEGIE.md`, `MARKETING_OFFICIEL.md` §6.

### [2026-04-26] Synthèse d’intégration produit + UX discover / navigation

- **Contexte** : consolidation des prompts, idées validées ou en attente, sans diluer le MVP ni empiler des features hors scope.  
- **Décision** : document **`INTEGRATION_PRODUIT_SYNTHESE.md`** comme **trace unique** (phases analyse → intégration → optimisation) ; lien depuis **`DOSSIER_OFFICIEL_INDEX.md`** et pyramide **`PROJET_PTGR_VERSION_OPTIMISEE.md`** §3. Côté app : **rappel intention d’addition** sur discover (`UX_DISCOVER.proposeContextHint`), **accessibilité** avatars, entrée nav **Compagnons** vers `/reseau-graille`.  
- **Alternatives** : refonte discover complète (rejeté hors ticket) ; 5e lien nav vers chaque module vision (rejeté).  
- **Conséquences** : backlog P0/P1 explicite dans la synthèse ; pas de nouveau module sensible en V1.  
- **Liens** : `INTEGRATION_PRODUIT_SYNTHESE.md`, `DiscoverClient.tsx`, `AppNav.tsx`, `ux-copy.ts`.

### [2026-04-27] Durcissement sécurité API + audit technique code

- **Contexte** : revue exigeante (redirect OAuth, validation IDs, surface avatar).  
- **Décision** : **`safeAuthRedirectPath`** sur `/auth/callback` ; **`requireUuidParam`** sur routes `meals/[id]` (détail, messages, lieu) ; **`photo_url`** profil limité à URL **https** (http **localhost** en dev) ; chaîne vide → `null`. Document **`AUDIT_TECHNIQUE_CODEBASE.md`** comme référence continue (sécurité, perfs, dette).  
- **Alternatives** : CSP stricte jour1 (reporté — risque régression UI) ; rate limit maison (rejeté — préférer service dédié P1).  
- **Conséquences** : anciennes photos en `http` non-localhost refusées au PATCH jusqu’à migration HTTPS.  
- **Liens** : `src/lib/http/safe-redirect-path.ts`, `src/lib/api/params.ts`, `auth/callback/route.ts`, `api/profile/route.ts`, `AUDIT_TECHNIQUE_CODEBASE.md`, `DOSSIER_OFFICIEL_INDEX.md`.

### [2026-04-28] Transitions repas côté serveur + catégories `profile_tags`

- **Contexte** : PATCH `/api/meals/[id]` acceptait tout saut d’état si le client forgeait la requête ; tags profil tous en `personality` au lieu des sections (perso / graille / ici / hobbies).  
- **Décision** : module **`src/lib/meal-transitions.ts`** — matrice **proposed → matched** (invité·e seule), **venue_proposed → venue_confirmed** (invité·e), confirmations / completed / cancelled selon rôles documentés dans `MATRICE_REPAS_ETATS_PERMISSIONS.md` ; états **terminaux** non modifiables. **`completed`** en MVP : depuis **`confirmed`**, hôte ou invité·e (aligné UI « Repas fait »). Tags : **`tagKeyToProfileCategory`** dans `tag-options.ts`, utilisé par `api/profile` PATCH.  
- **Alternatives** : double confirmation `confirmed` (champs séparés) — reporté ; auto `completed` 24h — reporté.  
- **Conséquences** : clients malveillants ne peuvent plus sauter la machine d’états ; analytics / filtres par catégorie de tags possibles.  
- **Liens** : `meal-transitions.ts`, `meals/[id]/route.ts`, `tag-options.ts`, `profile/route.ts`.

### [2026-04-29] SEO / a11y : `metadataBase` + landmarks

- **Contexte** : URLs Open Graph relatives sans base ; liste discover et `main` peuvent gagner en accessibilité.  
- **Décision** : **`getSiteUrl()`** (`src/lib/site-url.ts`) — `NEXT_PUBLIC_SITE_URL` puis `VERCEL_URL` puis localhost ; **`metadataBase`** dans `layout.tsx`. **`aria-label`** sur `main` et sur la liste des profils discover. **`NEXT_PUBLIC_SITE_URL`** documenté `.env.example` + `DEPLOIEMENT_VERCEL.md`.  
- **Alternatives** : hardcoder domaine (rejeté).  
- **Conséquences** : en prod Vercel sans `NEXT_PUBLIC_SITE_URL`, le build utilise quand même `VERCEL_URL` pour la base.  
- **Liens** : `site-url.ts`, `layout.tsx`, `DiscoverClient.tsx`, `README.md`.

---

*v0 journal — alimenté au fil des arbitrages.*
