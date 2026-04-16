# Système complet — Paye ta graille

**Rôle** : cadrage unique (10 prompts) — produit, psychologie, onboarding, matching, modules, feed, UX, business, légal, MVP tech.  
**Compléments opérationnels** : `PROMPTS_EXTERNES_ALIGNEMENT.md`, `BLUEPRINT_PRODUIT_FINAL_MVP.md`, `COPY_UX_COMPLET_V1.md`.  
**Stratégie, lancement, growth, pitch, crise, personas** (prompts prêts pour Cursor) : `PROMPTS_AVANCES_STRATEGIE_COMPLETE.md`.  
**Générosité intégrée (repas suspendu)** : `MODULE_REPAS_SUSPENDU.md` · découverte lieux : `SUSPENDED_MEAL_AND_DISCOVERY.md`.  
**Table surprise & slogan « seconde graille »** : `MODULE_TABLE_SURPRISE_SPEC.md` · `TABLE_SURPRISE_SECOND_GRAILLE.md` · copy `MARKETING_SECOND_GRAILLE_*`, `TABLE_SURPRISE_MICRO_COPY` dans `src/lib/marketing-copy.ts`.  
**DA « table vivante »** (design sublime le nom) : `CREATIVE_DIRECTION_VISUAL.md` · `IDENTITE_VISUELLE_COMPLETE.md` · tokens `src/app/globals.css`.

---

## Prompt 1 — ADN produit (source de vérité)

**Une phrase**  
Paye ta graille est une **plateforme d’expériences sociales autour du repas réel** : rencontres **individuelles**, **repas de groupe** et **événements culinaires organisés** — **sans** faire de la recherche amoureuse le moteur principal, **sans** devenir un agenda d’événements ou une marketplace de résas générique.

**Trois piliers (catégorie produit)**  
| Pilier | Promesse courte |
|--------|------------------|
| **Individuel** | Je propose / j’accepte une table 1 à 1 (ou petit noyau), intentions lisibles. |
| **Groupe** | Tables ouvertes, spontanéité, effet réseau — fil et coordination. |
| **Expériences** | Je **rejoins** une expérience food organisée (lieu, thème, places) plutôt que tout inventer seul. |

**Promesse utilisateur**  
Tu manges, tu rencontres, tu partages — **ne mange plus seul**, sans te prendre la tête.

**Valeurs fondamentales**

| Valeur | Signification |
|--------|----------------|
| **Table d’abord** | Le repas réel et le lieu public comme cadre, pas l’écran |
| **Intentions lisibles** | Inviter · partager (50/50) · se laisser inviter — pas de jeu caché |
| **Simplicité** | Décision en moins de 10 secondes par écran utile |
| **Dignité** | Refus sans drame, pas de culpabilité, pas de score public |
| **IRL** | Le moment fort est hors app |

**Ce que le produit N’est PAS**

- Une app de **dating** marketing-first  
- Une app de **paiement** ou wallet social  
- Une app **restaurant / résa** générique seule  
- Un **forum** ou un **jeu** de badges toxique  

**Face aux apps de rencontre classiques**  
Les utilisateurs ne viennent pas chercher **l’amour comme objectif affiché** : ils cherchent **un repas**, une **expérience sociale**, une **rencontre humaine**. La compatibilité « romantique » n’est pas le centre du matching ; **l’intention de manger ensemble** l’est.

---

## Prompt 2 — Psychologie utilisateur

**Motivations**

- Manger **accompagné** vs solitude du repas  
- **Curiosité** sociale contrôlée (nouveauté sans engagement infini)  
- **Nourriture** comme prétexte social acceptable (moins exposant qu’un « date »)  

**Freins**

- Peur du **rejet** ou du malaise avec un inconnu  
- Surcharge **cognitive** (trop de choix, trop de règles)  
- Méfiance envers les **plateformes** « love-first »  

**Leviers de confiance**

- Intentions **explicites** (repas, addition, ambiance)  
- Lieux **publics**, signalement, transitions d’état claires  
- **Pas** de notation visible, **pas** de classement humiliant  

**Comportements attendus dans l’app**

- Compléter un profil **rapide** (traits + graille + « pourquoi ici »)  
- Choisir **privé vs ouvert** (humeur du moment)  
- Proposer / accepter un repas, **coordonner** le lieu puis le **potluck** si repas groupe  

**Déclencheurs d’inscription** (copy / moments produit)  
Faim + solitude + « ce soir j’ai pas envie d’être seul·e » — messages courts, ton direct, zéro jargon.

---

## Prompt 3 — Profil & onboarding structuré

**Objectif** : profil **riche mais en moins de 2 minutes**, ton léger, cases simples.

**Implémenté dans le code** (étape « traits » onboarding + profil) :

1. **Style social** — Drôle, calme, extraverti, curieux, spontané, discret, bavard, ponctuel, flexible, nocturne, matinal  
2. **Ton style de graille** (obligatoire ≥1) — Gros gourmand, explorateur culinaire, **street food**, healthy / fit, végétarien·ne / végétalien·ne, cuisine maison, **resto chic**, plaisir sans prise de tête, curieux·se (nouveautés) — *pas une app santé, inclusion & envie*  
3. **Ce que tu viens faire ici** (obligatoire ≥ 1) — Rencontrer, partager un repas, nouveaux restos, spontanéité, **ne plus être seul·e à table**  
4. **Je préfère manger avec** — tout le monde · profils proches · autres styles (`profiles.meal_with_preference`)  
5. **Ça te parle ?** (optionnel) — Sorties, cuisine, séries, sport, lecture, voyage, local, végan  
6. **Vibe douce** (lecture seule, dérivée des tags) — ex. Bon vivant, Explorateur — `src/lib/graille-vibe.ts` — pas de classement  
7. **Banque micro-textes** (in-app, non push) — `src/lib/micro-moments-copy.ts`  

Voir `src/lib/tag-options.ts`. Contrainte onboarding : au moins un tag `graille_*` et un tag `ici_*` (max 10 tags au total).

**Tags historiques** (`graille_curieux_saveurs`, etc.) : toujours reconnus en affichage si déjà en base (orphelins).

---

## Prompt 4 — Matching social (non toxique)

**Critères** (par ordre de transparence V1)

1. **Proximité** (ville / rayon)  
2. **Intention repas** (inviter / partager / se laisser inviter)  
3. **Intention sociale** (ami / ouvert / dating léger — explicite, pas cachée)  
4. **Affinité alimentaire / traits** (tags — enrichissement progressif)  

**Règles**

- **Pas** de score public, **pas** de « pourcentage de match » affiché en V1  
- Filtres **compréhensibles** (comme aujourd’hui sur la liste découverte)  
- **Anti-biais** : éviter les exclusions implicites (poids, âge obligatoire, etc.) — à cadrer dans les règles produit + modération  

**Évolution** : pondération soft, suggestions « pourquoi cette personne » en langage naturel — pas avant validation éthique.

---

## Prompt 5 — Module repas groupe

**Fonctions cibles**

- Créer un repas collectif (créneau + lieu / intention)  
- Rejoindre, **places restantes**, statut du groupe  
- **Qui ramène quoi ?** — entrée, plat, dessert, boissons, « je ne ramène rien »  

**État du repo**

- **MVP duo** : hôte + invité, `format = group` active le panneau **potluck** après match (`MealPotluckPanel`, migration `meals.potluck`)  
- **Suite** : vrais groupes à plusieurs personnes (table `meal_members`, fil « repas ouvert »)  

---

## Prompt 6 — Feed social (spontanéité)

**Contenu visé** : qui mange où maintenant, qui est chaud ce soir, événements food spontanés.

**État** : page **`/repas-ouverts`** (stub honnête) — pas de faux feed ; back + modération à faire avant contenu réel.

---

## Module « Expériences Paye ta graille » (changement de catégorie)

**Concept** : l’app **crée ou propose** des événements food IRL — l’utilisateur **rejoint** (« je participe ») plutôt que de tout chercher dans le vide.

**Familles d’expériences (cible)**  
1. **Restaurants immersifs** — dans le noir, sensoriel, multi-sensoriel  
2. **Nature** — pique-nique, brunch parc, BBQ collectif, rando + repas  
3. **Cuisine du monde** — thèmes pays / street food  
4. **Social food** — tables longues, speed dinner, conversation guidée  
5. **Participatif** — cuisiner ensemble, ateliers, chacun apporte un ingrédient  

**Fonctionnement cible** : créer l’événement (lieu, thème, date, places) → rejoindre avec places limitées → organisation (groupes ou libre, **potluck** si pertinent).

**Économie (hors MVP code)** : ticket + commission, **partenariat restos** (mise en avant / trafic), ou **hybride** — sans monétiser la dignité ni casser la confiance.

**Garde-fous** : ne pas devenir **plateforme d’événements générique**, **marketplace resto**, ou **usine à réservations** — une promesse claire par flux.

**État repo** : page **`/experiences`** (vision + catégories + honnêteté « pas encore réservable »). Billetterie / Stripe / partenaires = phase suivante + avocat.

**Vision** : exécution propre → événements sponsorisés, restos partenaires, expériences exclusives, **communautés locales** — « Airbnb des expériences alimentaires **sociales** » (social d’abord, pas spectacle seul).

---

## Social Food Graph — réseau graille (cercles de table)

**Vision** : une **infrastructure de liens sociaux réels via la nourriture** — pas un Facebook : des **tables** qui génèrent des **cercles** contrôlés.

**Trois couches**

1. **Rencontre** — deux inconnus mangent ensemble (flux actuel).  
2. **Lien** — si le repas est réussi : **contact graille** (optionnel), « on se reverra pour manger », ou ignorer — **pas de pression forte**.  
3. **Réseau indirect** — une personne **relie** deux contacts qui ne se connaissent pas : **repas croisé** (inviter B + C). Effet **amis d’amis par la table**, sans swipe dating.

**Noms produit possibles** : *le réseau graille*, *cercles de table*, *Social Food Graph* (interne / pitch).

**Liste « amis »** : formulation type **« Mes personnes avec qui j’ai déjà mangé »** — pas de fil d’actus ni de profil exposition maximal.

**Confidentialité (non négociable)** : B et C **ne voient pas** le graphe complet de l’autre — seulement le **contexte du repas** proposé. Éviter la **comparaison sociale** et l’**exposition totale**.

**MVP cible** : boutons post-repas (contact, inviter plus tard, repas commun léger) ; suggestion « X contacts en commun » ; **organiser un repas croisé** — sans complexifier l’écran principal.

**Risques** : trop de réseau social générique → perte du cœur « table d’abord » ; complexité → abandon.

**État repo** : page **`/reseau-graille`** + teaser après repas **completed** sur le détail repas ; **données contacts / graphe** = chantier suivant (tables dédiées + RLS).

### Lien par fréquence — mémoire de table (privée)

**Principe** : plus deux personnes **mangent ensemble** (repas réels clôturés), plus le **lien** évolue — la relation se construit par **expérience IRL**, pas par volume de messages.

**Indicateur privé** (jamais un score public agressif, jamais de classement entre utilisateurs) :

| Repas partagés (complétés) | Niveau (copy douce) |
|----------------------------|---------------------|
| 1 | Connaissance |
| 2–3 | Affinité |
| 4–6 | Régulier |
| 7–10 | Lien fort |
| (sommet) | **Compagnon de graille** — statut affectif / branding, pas un badge compétitif |

**Noms produit** : **Lien de table** (UX sobre) · **Barre de graille** (ton plus fun) · **Complicité de table** (variante) · sommet **Compagnon de graille** (très fort en branding).

**Visuel** : barre ou pastille **évolutive**, **animation douce**, lisible seulement dans **ton** espace (fiche contact / détail binôme) — pas sur le profil public des autres. Échelle indicative : inconnu → connu → régulier → proche → compagnon de graille (couleurs chaudes, pas « jeu »).

**Nudges intelligents** (pas du spam) : rappels type « Ça fait un moment que vous n’avez pas mangé avec… », « Vous aviez apprécié votre dernier repas ensemble », propositions de 50/50 ou « une table ensemble » — **réglables**, **peu fréquents**, **zéro culpabilité**, **zéro pression**.

**Après chaque repas complété** (cible) : mise à jour du **niveau de lien** côté paire, **suggestions** optionnelles (« revoyez-vous ? », « 50/50 cette semaine ? », « repas croisé avec un·e autre contact ? »).

**Risques** : **gamification toxique** des relations, **pression sociale implicite**, **guilt marketing** → à proscrire. **Règle d’or** : le lien doit **sembler naturel**, pas « noté » ; pas de compétition, pas de comparaison publique.

**Boucle** : repas → souvenir (IRL) → lien qui murmure (privé) → envie naturelle d’un nouveau repas.

**État repo** : spécifié sur **`/reseau-graille`** ; comptage de repas par paire + UI barre = **à implémenter** (données + copy + préférences de rappels).

---

## Prompt 7 — UX / design émotionnel

**Objectifs** : chaleur, zéro stress social, fluidité.

**Références repo** : `globals.css`, `IDENTITE_VISUELLE_COMPLETE.md`, `UX_COPY_SYSTEM.md`, ton **tutoiement**, micro-copy refus/acceptation repas.

**Phase 2** : sons, animations plus poussées — optionnel.

---

## Prompt 8 — Business model

**Pistes** (post traction, sans casser la confiance)

- Partenariats **restaurants** (commission / soirées thématiques)  
- **Abonnement** premium (visibilité douce, filtres, pas de punition gratuite)  
- Mise en avant **d’événements** locaux  

**Interdit** côté confiance : monétiser la **dignité** (paywall pour être vu « comme tout le monde »), crédits sociaux **publics** type enchères humaines.

---

## Prompt 9 — Sécurité & légal (Europe)

**À traiter avec juriste avant ouverture large**

- **RGPD** : base légale, registre, DPA sous-traitants (Supabase, Vercel, email…)  
- **Responsabilité** plateforme : mise en relation, modération, signalement (`/signaler`)  
- **Rencontres IRL** : rappel lieu public, pas de promesse de sécurité absolue — voir CGU brouillon  

**Docs** : `LEGAL_STRUCTURE_OFFICIEL.md`, pages `legal/cgu`, `legal/confidentialite`.

---

## Prompt 10 — MVP tech (Next / Supabase / mobile-first)

| Fonctionnalité | Statut indicatif |
|----------------|------------------|
| Auth + profil | Fait |
| Intentions repas | Fait |
| Tags structurés (graille + ici + …) | Fait (ce dépôt) |
| Préférence « manger avec » + vibe + copy micro-moments | Fait (champs + libs ; matching à brancher) |
| Matching simple (ville, intentions, filtres) | Partiel (RPC discover) |
| Repas duo + états + lieu + chat borné | Fait |
| Repas groupe (plusieurs pers.) + création / rejoindre | À faire |
| Potluck « qui ramène quoi » (format group, 2 pers.) | Fait |
| Feed social | Stub `/repas-ouverts` |
| Hub **Expériences** (vision + catégories, sans billetterie) | `/experiences` |
| **Réseau graille** (vision + post-repas teaser) | `/reseau-graille` ; contacts, repas croisé, **lien par fréquence** = **à coder** |
| Billetterie, premium, partenaires « expérience officielle » | Hors MVP code (légal + produit) |

**Stack** : Next.js App Router, Supabase, déploiement type Vercel — voir `README.md`.

---

## Alignement « prompt maître » (Cursor / cadrage externe)

Checklist rapide : le **cadre de travail** du repo reste **`SYSTEME_COMPLET`** + **`PROMPTS_EXTERNES_ALIGNEMENT.md`** (une promesse par écran, pas de faux feed, pas de dating-first). Les prompts « coalition d’experts » servent à **enrichir** sans remplacer cette source de vérité.

| Exigence prompt maître | Statut repo (indicatif) |
|------------------------|-------------------------|
| 1 Intentions repas (invite / 50-50 / se faire inviter) | Fait — profil + onboarding |
| 2 Profil : perso, hobbies, graille, objectifs | Fait — `tag-options` + contraintes onboarding |
| 3 Module repas : privé, groupe, événements | Partiel — duo + potluck groupe 2 pers. ; multi + events = suite |
| 4 Groupe « qui ramène quoi » | Fait si `format = group` (MVP 2 pers.) |
| 5 Expériences (pic-nic, immersif, food…) | Hub `/experiences` + catégories ; billetterie = hors MVP code |
| 6 Social : contact graille, croisé, amis d’amis | Vision `/reseau-graille` + teaser post-repas ; persistance = à faire |
| 7 Jauge relationnelle / compagnon de graille | Spécifié ; données + UI privée = à faire |
| 8 Feed « qui mange / dispo » | Stub honnête `/repas-ouverts` + feuille de route contenu |
| 9 Micro-textes intelligents | Lib `micro-moments-copy.ts` ; intégration surfaces = progressive |
| 10 Bien-être & inclusion (léger, pas app santé) | Style de graille + whispers ; ton cadré dans les libs |
| UX mobile-first,10 s | Direction design system + copy ; audit continu |
| Business (premium, partenaires…) | Doc Prompt 8 — pas de paywall dignité |
| Légal RGPD, IRL, modération | Pages légales + doc ; juriste avant scale |

*Toute incohérence détectée entre un prompt externe et ce tableau doit être résolue en faveur de l’ADN (table d’abord, pas dating/paiement/résa seule) ou documentée ici.*

---

*Document vivant : à synchroniser avec les évolutions code et le dossier légal.*
