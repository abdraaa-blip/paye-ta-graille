# Du brainstorm « Pay Tagrail » au concept V1 codable

**Contexte** : intégrer les idées (50/50, « je paye », invitation, flags, son, restos, points, monétisation) dans **Paye ta graille** sans exploser le périmètre.  
**Référence dossier** : `DOSSIER_OFFICIEL_INDEX.md`, `BLUEPRINT_PRODUIT_FINAL_MVP.md`, `PRODUCT_SPEC.md`.

---

## 1. Synthèse exécutive

| Idée | Verdict V1 | Note |
|------|------------|------|
| Chacun paye sa part / je paye / tu m’invites | **Déjà dans le produit** (`invite`, `partage`, `etre_invite`) | Renforcer l’UX « la contrepartie accepte l’intention » avant le repas |
| L’autre dit oui / non sur la proposition | **À formaliser** | État repas + notification claire, pas de wallet |
| Questions + green / red flag (privé ou semi-privé) | **Hors V1** ou **micro-V1** | Si micro : 3–5 prompts après match, red flag = fin de match **expliquée**, pas de score opaque |
| Son adaptatif au ton | **Hors V1** | Coût produit + consentement + accessibilité ; phase 3 |
| « Pay Tagrail » / slogans gourmands | **Marketing** | Aligner sur `MARKETING_OFFICIEL.md` ; une variante de nom peut vivre en **sous-marque campagne**, pas en double produit |
| Géoloc restos + « meilleurs du coin » | **Phase 2** | Déjà une piste `lieux` + API places ; pas bloquant pour « manger à deux » |
| Paiement qui va au magasin (Connect) | **Phase 2–3** | Stripe **Connect** + `application fees` (marketplace) ; titres-restaurant FR = flux spécifiques (voir [Stripe Connect — app fees](https://docs.stripe.com/connect/marketplace/tasks/app-fees), [meal vouchers FR](https://docs.stripe.com/payments/meal-vouchers/fr-meal-vouchers/accept-with-connect)) |
| 1 € / repas + points → repas « offert » | **Phase 2** | Nécessite **ledger** (comptes points), CGU, anti-fraude |
| Abonnement | **Phase 2+** | Après preuve de rétention |
| **Intention d’abord** : *j’invite* / *on partage (50-50)* / *je me laisse inviter* + **demandes entrantes** (signaler son intérêt, notif, la personne « annonce » choisit avec qui manger) | **V1 = affiner le flux actuel** ; **V1.5** si besoin : file d’intérêts + notif sans surcouche « dating » | Aligné clés `invite`, `partage`, `etre_invite` (`intent-labels.ts`). Pas de catalogue infini de modes : **trois** intentions, bien expliquées |
| **Messagerie / contact** uniquement **dans le cadre** d’une intention compatible (ex. « j’invite » ↔ « je me laisse inviter » ; « on partage » ↔ « on partage ») | **Règle produit** à formaliser en copy + règles UX | Évite le ressenti « app de rencontre » : on parle **parce qu’il y a une table / une règle d’addition** |
| **Coin graille** : mini-fil « qui est chaud pour… » (raclette samedi, spontané « là maintenant », repas à plusieurs) | **Phase 2** | Risque modération + complexité ; commencer par **repas 1:1** solide |
| **Depuis un lieu / resto** : « Qui est chaud pour ce spot ? » | **Phase 2** | S’appuie sur lieux + confiance ; pas bloquant V1 |
| **Expériences atypiques** (pique-nique, vélo + graille, resto dans le noir, sensoriel…) | **Phase 2–3** | Tags + **événements curés par l’app** (§2.4) — pas le MVP duo |
| **Événements créés / curés par l’app** (inscription, places, rôle organisateur Paye ta graille) | **Phase 2–3** | Distinct du **coin graille** user-generated ; **modération**, **partenaires**, **paiement** à cadrer |
| **Bio profil** : accroches *Paye ta graille*, *mange ta graille*, *app des gourmands*, *tu ne mangeras pas seul* | **V1 copy** (placeholders, longueur, modération légère) | Phrases **suggestions** + garde-fous (pas de promesse prix non prouvée) |
| **« Qui ramène quoi ? »** (contributions : plat, entrée, dessert, boissons, etc.) | **Phase 2+** (avec repas **groupe** / chez quelqu’un / pique-nique) | Très cohérent avec **coin graille** et repas **à N** ; peu utile en **resto 1:1** tout payé sur place — ne pas alourdir la V1 |
| **Profil inscription** : cases **personnalité / hobbies** (style apps de rencontre **sans** angle amour) + bloc **graille** dédié + **ce que tu viens chercher ici** (social, table, amitié, lieux) | **V1 = déjà amorcé** (`tag-options.ts`, `OnboardingWizard`) ; **enrichir** ton + volume de chips + option **« spécialité »** | Jamais « ce que je cherche en couple » : uniquement **lien**, **graille**, **partage**, **découverte** (voir §2.3) |
| **« Ma spécialité »** / *Ramène ta spécialité* / *La spécialité de chez toi* | **V1 léger** (champ texte court optionnel) ou **V1.5** ; lien fort avec **potluck** (§2.2) en Phase 2 | Micro-copy **fun** ; modération légère ; pas un deuxième roman bio |
| **Groupe d’amis / compagnons** après repas **réussi** ; **chat entre amis** ; **repas croisé** (pont par ami·e commun·e) | **Lien & repas croisé** déjà en **vision** (`/reseau-graille`, `SECTION_MES_COMPAGNONS.md`) ; **chat groupe + orga** = **Phase 2+** | Pas d’accès **direct** au graphe « amis des amis » ; **points communs** / invitations **médiateur** uniquement (§2.5) |
| **Jauge privée** entre deux compagnons (barre selon **nombre de repas** `completed` ensemble, teinte → **vert**, titres *Belle rencontre* → *Compagnon·ne de graille* → *Meilleur·e compagnon·ne*) | **Niveaux & copy** dans `companions-copy.ts` ; **UI barre + couleur** + compteur persisté = **V1.5–V2** | **Jamais public** ; pas trophée global ; §2.6 |
| **Rappels « ça fait longtemps »** (inviter, être invité·e, 50-50) | **Copy** `NUDGES_PAIR_SOFT` ; logique **anti-spam** + réglage **calme / normal / off** (`user_settings.nudge_level`) | Fréquence plafonnée, ton **doux**, zéro culpabilité ; §2.6 |
| **Commentaires publics, « gems », avis sur les gens** | **Hors scope court** ou **très restreint** | Risque **toxicité**, **réputation**, dette modération ; préférer **jauge privée** / **silence** / signalement existant |
| **Healthy / sportifs / « attention à la ligne »** | **Tags + copy** (`graille_healthy`, `graille_sportif`) ; filtres découverte plus tard | Même app : **gourmand** et **équilibré** coexistent ; pas moraliser |
| **Inclusion végé** : manger entre végé, faire découvrir, expérience 100 % végétale | **Tags `ici_veg_*`** + **événements** Phase 2 | Pas cantonner les végé à un « ghetto » — **choix explicite** dans le profil |
| **Micro-messages** : célébration usage, encouragement discret, **prévention** eau / chaleur / 5 fruits (humour marque) | **Copy** `micro-moments-copy.ts` ; **logique** contextuelle = V1.5+ | **Jamais** jugement corps ou « mange plus » ; pas brochure santé ; §2.7 |
| **« Offrir un repas »** (don payé in-app, crédit repas attribué, **remerciement** tracé après consommation) | **Phase 2–3** | Ledger + Stripe + **éthique attribution** ; points donateur **discrets** — §2.8 |
| **Solidarité étendue** (redistribution type besoin alimentaire, partenaires associatifs) | **Phase 3+** | **Jamais** improvisation sans cadre légal / terrain ; §2.8 |
| **Lieux / restos** : rayon **élargi**, **catégories** (tops, nouveautés, fine bouche, spécialités France, « ce que nos grailleurs aiment ») | **Phase 2** | Complément géoloc ; pas bloquer V1 duo ; §2.8 |
| **Slogan *seconde graille*** (détournement « seconde chance ») | **Marketing** | `MARKETING_OFFICIEL.md` **§2.9** — inclusif, pas culpabilisant |
| **« Graille à l’aveugle »** : match **opt-in** entre inconnus, **même mode**, **géoloc** plafonnée (km), lieu **public** (piscine restos du coin ou tirage guidé) | **V1.5–V2** | **Sécurité** + **intention d’addition** avant verrou ; §2.9 ; pas confondre avec **dîner dans le noir** partenaire §2.4 |

**Principe startup senior** : la V1 qui « en jette » = **parcours IRL impeccable** (profil, intention d’addition, découverte, proposition, repas, post-repas), pas 12 features à moitié.

---

## 2. Boucle produit V1 (béton, alignée code actuel)

1. **Profil** + intention repas (déjà là).  
2. **Découverte** filtrée par ville / intentions (déjà là).  
3. **Proposition** de repas (déjà là).  
4. **Acceptation** explicite des **deux** côtés sur : lieu (ou créneau), **et** rappel de l’intention d’addition (à renforcer en copy + écran).  
5. **Repas** → passage à `completed` → bloc « après repas » (déjà là) + lien **Mes compagnons** (`companions-copy.ts`, `/reseau-graille`).

**À ajouter en priorité si une seule grosse feature** : écran ou étape **« Tu confirmes cette intention d’addition ? »** côté invité avant verrouillage du créneau (réduit les mauvaises surprises, limite les « red flags » sans jeu de score).

### 2.1 Modèle « intention d’abord » (anti–app de rencontre classique)

**Cartographie langage ↔ produit** (ne pas multiplier les statuts en base) :

| Ce que dit l’utilisateur | Clé technique | Idée comportementale |
|--------------------------|---------------|----------------------|
| **J’invite** (je régale / je paye la table) | `invite` | Celui·celle qui invite peut recevoir des **signaux d’intérêt** ; il·elle **choisit** avec qui passer à une proposition de repas. Pas d’« open chat » générique avant ça. |
| **On partage** (50-50, note à deux) | `partage` | Même logique : les personnes en **partage** peuvent se découvrir et exprimer l’envie de partager **ce cadre** ; verrouillage par **acceptation mutuelle** + rappel de l’intention. |
| **Je me laisse inviter** | `etre_invite` | Contrepartie des profils en `invite` : l’**invitant** peut **chercher / proposer** ; la personne ouverte à être invitée **accepte ou refuse** le cadre (addition comprise). |

**Règle de contact** : la conversation « utile » démarre **à partir d’une intention affichée** (invitation, partage, ouverture à être invité·e) — pas un fil type « je scroll et je DM ». En V1, ça peut rester **proposition de repas + messagerie liée au repas** ; en phase suivante : **file d’intérêts** (« je suis chaud·e pour ton annonce invite/partage ») + notifications + écran « choisir un·e dining partner ».

**Garde-fou** : ne pas empiler trois UX différentes (swipe + forum + groupes) avant que le **1:1** soit fluide ; le « fort » du produit = **clarté addition + repas réel**.

### 2.2 Repas conviviaux à plusieurs & « coin graille » (vision)

- Fil léger ou **pubs** type : *« Qui est chaud pour une raclette le [date] ? »*, *« Quelqu’un pour [lieu] dans l’heure ? »*, *« Pique-nique après la sortie vélo »*, *« Resto dans le noir —3 places »*.  
- **Phase 2** : modération, signalement, plafond de participants, lien vers lieux.  
- **Expériences atypiques** : plutôt **tags** (« extérieur », « vélo », « sensoriel », « dans le noir ») + **contenus éditoriaux** / événements qu’un moteur de recommandation lourd en V1.
- **« Qui ramène quoi ? »** : une fois le **repas groupe** (ou repas **à domicile** / **balade + graille**) posé, chaque participant peut indiquer une **contribution** — ex. *je ramène le plat*, *l’entrée*, *le dessert*, *à boire*, *le pain / fromage*, *les couverts jetables*, etc.  
  - **Valeur** : évite le doublon (trois desserts, pas de boisson), renforce le côté **convivial / potluck**, colle aux scénarios **raclette, apéro partagé, pique-nique**.  
  - **Quand l’ajouter** : avec le module **groupe** (§1) ; **pas** en priorité sur le parcours **deux personnes au resto** où l’addition est déjà cadrée par `invite` / `partage`.  
  - **Données (esquisse)** : liste de rôles prédéfinis + champ libre court + qui a pris quoi ; pas besoin d’un inventaire cuisine au MVP de cette brique.

### 2.3 Profil à l’inscription : « comme une app de rencontre » mais **pas pour l’amour**

**Constat code** : l’onboarding impose déjà **style social**, **style de graille**, **ce que tu viens faire ici**, **hobbies** (`src/lib/tag-options.ts`, `OnboardingWizard.tsx`). C’est exactement le bon **squelette** pour ton idée.

**Règle rédactionnelle** : toute case ou titre doit sonner **table / graille / lien / découverte** — pas « relation sérieuse », « couple », « critères de mon crush ». Les hobbies type **séries**, **lecture**, **sorties** restent des **glaces** (« ça te parle ? »), pas un questionnaire psychologique.

**Bloc graille (ton « ça claque »)** :

- Chips **courtes**, **humaines**, un peu **assumées** : gros gourmand, team burger, saveurs du monde, bonne bouffe sans chichi, etc.  
- Section identifiable visuellement (déjà *Ton style de graille*) : renforcer la **légende** du type *« Ici on parle bouffe, pas régime »* (déjà partiellement en description).  
- Enrichissement **itéré** : ajouter des `tag_key` + libellés dans `TAG_LABELS` plutôt que multiplier les écrans.

**« Ce que tu viens faire ici » = ce que tu cherches** — mais **social** :

- Rencontrer du monde, partager un repas, découvrir des restos, spontanéité, ne plus être seul·e à table — déjà en `ici_*`.  
- Pistes d’extension : *créer du lien / amitié autour d’une table*, *goûter d’autres saveurs* — toujours en tags, pas en champ « recherche amoureuse ».

**Spécialité (différenciant)** :

- Champ optionnel **une ligne** ou **deux** : *« C’est quoi ta spécialité ? »* / *« Ce que je ramène souvent quand on mange ensemble… »* / *« Une spécialité de chez moi »*.  
- Pont marketing : *« Ramène ta spécialité »* pour les repas **groupe** (Phase 2) ; en V1, ça sert déjà à **personnaliser** le profil et à **casser la glace** à table.  
- Variante curiosité : *« Envie de découvrir des restos un peu exotiques / ailleurs »* → plutôt **tag** `graille_*` + texte court que promesse sur chaque cuisine.

**Garde-fous** : plafond de tags (ex.10) déjà en `PROFILE_TAG_MAX` ; éviter 80 cases d’un coup (fatigue onboarding) — **prioriser le fun** et **compléter par vagues**.

### 2.4 Événements **curés par l’app** (vision Phase 2–3)

**Proposition** : Paye ta graille **organise ou co-organise** des expériences gustatives **IRL** — fiche événement dans l’app, **places limitées**, **inscription / RSVP**, rappels, règles d’addition ou **prix tout compris** affichés **avant** de valider. Les utilisateurs **ne cherchent pas** l’événement sur Google puis reviennent : l’app **propose** le catalogue (local, saisonnier) et **porte** la confiance (annulation, signalement, CGU).

**Différence avec le « coin graille » (§2.2)** : le fil utilisateur = spontané, informel ; les **événements curés** = **officiels**, **qualité**, souvent **partenaire** (resto, lieu, animateur). Les deux peuvent coexister plus tard ; **ne pas fusionner** les deux logiques dans un seul écran au début.

**Parcours cible** : liste / carte **Expériences** → détail (date, lieu, durée, tenue, accessibilité, **ce qui est inclus**) → **Je participe** (ou liste d’attente) → **paiement** si billet → rappel J-1 / H-2 → **check-in** sur place (QR ou code) → option **qui ramène quoi** si potluck (§2.2).

**Modèles économiques** (à trancher par événement, pas une seule règle globale) :

| Modèle | Description | Quand |
|--------|-------------|--------|
| **Paiement sur place** | L’app agrège ; chacun règle au lieu (resto, marché). Commission ou frais service **plus tard** si légal/contractuel OK. | Partenariat resto simple, faible friction tech. |
| **Billet via l’app** | Prix tout compris ou acompte ; Stripe (Connect si tiers payé). | Atelier, dîner dans le noir, food tour avec réservation groupe. |
| **Subvention partenaire** | Le lieu / marque sponsorise une partie (1ère boisson, dessert) — **transparence** obligatoire (« offert par X »). | Acquisition, lancement ville. |
| **Subvention app (bonus / promo)** | Crédit fidélité ou **-X €** sur **première** expérience — **budget marketing**, pas promesse permanente. | Cold start, preuve sociale. |
| **Hybride** | Acompte app + solde sur place ; ou billet + options. | Gros volume, réduction no-show. |

**Risques** : no-show, annulation météo (pique-nique), **alcool** / mineurs, **allergies** (rappel « confirmer avec le lieu »), **facturation** B2B2C, assurance événementielle selon format — tout doit passer par **LEGAL** + **partenaires** avant « grosse » com’.

**Catalogue d’idées** (inspiration — à valider localement, saison, partenaires) :

| Type | Exemples |
|------|----------|
| **Sensoriel / surprise** | Dîner ou déjeuner **dans le noir** ; dégustation **les yeux bandés** ; parcours **odeurs / textures**. |
| **Extérieur convivial** | **Pique-nique** parc / quai ; **vélo + pause** boulangerie-fromagerie ; **randonnée** courte + casse-croûte. |
| **Marché & rue** | **Food tour** quartier ; marché + **on cuisine ce qu’on achète** ; street food **à plusieurs stands**. |
| **Dégustation** | **Vins**, **bières** artisanales, **fromages**, **chocolat**, **cafés** (avec modération alcool). |
| **Atelier court** | Pâtes fraîches, **sushi** débutant, **tacos** maison — souvent lieu partenaire. |
| **Lieu atypique** | **Rooftop** / terrasse groupe ; **ferme** ou **vignoble** visite + repas ; **croisière** apéro courte (si offre locale). |
| **Communautaire** | **Brunch** grande table ; **raclette** ou **fondue** à N ; **supper club** / table d’hôte **curée** (pas annuaire ouvert jour1). |

**Phasage recommandé** : **V2** = 1ère série **manuelle** (peu d’événements, ops humaine, liste d’attente) ; automatisation + **hub `/experiences`** dense = après preuve sur **une** ville. Voir aussi `PRODUCT_SPEC.md` (vague V2, événements + billets), `SYSTEME_COMPLET_PAYE_TA_GRAILLE.md` § événements.

### 2.5 Compagnons, **amis de table** & **repas croisé** (rencontres sur rencontres)

**Alignement produit existant** : la vision en **trois couches** (rencontre → lien → **repas croisé**) est déjà posée sur **`/reseau-graille`** et dans `docs/SECTION_MES_COMPAGNONS.md` : *« une même personne peut inviter deux compagnons qui ne se connaissent pas, toujours dans le cadre d’un vrai repas, sans exposer tout un graphe social »*.

**Comportement cible** :

1. **Après un repas** `completed` et **vécu comme agréable**, les deux peuvent **s’ajouter en compagnon** (ou équivalent « ajouter à mes amis de table ») — **opt-in des deux côtés** ou au moins **acceptation** de la demande, pour éviter le harcèlement.  
2. **Liste « Mes compagnons »** : mémoire des **tables réelles**, pas un réseau social ouvert.  
3. **Discussion entre amis** : messagerie **restreinte** aux personnes déjà liées comme compagnons (ou à un **groupe** créé pour un repas à venir) — **Phase 2+** pour **vrai groupe** (plusieurs personnes, fil durable) vs fil **lié à un repas** déjà possible en V1.  
4. **Repas croisé / pont** : **Alice** est compagne de **Bob** et de **Chloé** ; Bob et Chloé **ne se connaissent pas** et **ne voient pas** la liste de l’autre. **Alice** peut **proposer un repas à trois** (ou inviter Bob + Chloé vers une même table) : c’est le **médiateur** qui crée le lien — *rencontre sur rencontre*, **groupes d’amis** qui grandissent par la table.  
5. **Amis des amis** : **pas** d’accès direct au graphe (« voir les amis de Bob »). En revanche, l’app peut plus tard afficher des **indices légers** du type *« vous avez un repas en commun via une même personne »* **seulement** dans le flux **organiser un repas** / **invitation médiateur**, jamais comme annuaire public.  
6. **Qui ramène quoi** (§2.2) : naturel pour un **repas chez l’un·e des compagnons** ou **apéro à N** une fois le groupe formé.

**Commentaires, « gems », avis publics** : **ne pas** ouvrir un mur de notes sur les profils en V1/V2 court — risque **réputation**, **délation**, charge **modération**. Si un jour **feedback** : **privé**, **optionnel**, après repas, **pas** indexé comme score LinkedIn. Les **micro-moments** / **jauge privée** entre deux personnes restent la voie privilégiée (`companions-copy.ts`, page réseau graille).

**Phasage** : **V1** = fin de repas + lien vers **Mes compagnons** + copy **repas croisé** (déjà là) ; **implémentation** graphe + demandes + **chat groupe compagnons** = **V2** par tickets, avec **CGU** claires (qui peut inviter qui, retrait, signalement).

### 2.6 Jauge « lien de table » & rappels **doux** (expérience désirable, pas spam)

**Principe** : deux personnes qui ont **terminé plusieurs repas ensemble** voient une **jauge privée** (visible **seulement** entre elles) : une **barre** qui part d’un état neutre / vide après la première validation, **remonte** au fil des repas **réussis** (`completed`), la **couleur** glisse vers un **vert chaleureux** (pas fluo agressif) — récompense **émotionnelle**, pas score compétitif.

**Paliers (exemple — alignés `COMPANIONS_GAUGE_LEVELS`)** :

| Repas terminés ensemble (pair) | Nom indicatif |
|--------------------------------|---------------|
| 0 (aucun encore) | Prochaine table — la jauge « compte » après le 1er |
| 1 | Belle rencontre |
| 2–3 | Habitué·e à table |
| 4–6 | Table fidèle |
| 7–10 | Compagnon·ne de graille |
| 11+ | Meilleur·e compagnon·ne de graille — **entre vous deux**, pas « #1 de l’app » |

**Rappels temporels** : si **X jours** sans repas commun (seuil à calibrer), **une** suggestion légère du type *« Ça fait un moment… »* avec **options** implicites (inviter, proposer **50-50**, demander à être invité·e) — **jamais** push agressif, **jamais** rouge d’alerte.

**Anti-intrusion (neurologiquement « agréable »)** :

- Réglage utilisateur **Rappels** : **calme** / **normal** / **off** (déjà côté profil / onboarding).  
- **Plafond** de notifications par compagnon et par semaine.  
- Copy **oral**, **chaleureux**, **opt-in mental** (*« si ça te dit »*, *« zéro obligation »*) — voir `NUDGES_PAIR_SOFT`, `micro-moments-copy.ts`.  
- Design : micro-animation douce sur la jauge, **pas** de badges publics sur le profil global.

**Lien avec repas réussis** : seuls les repas **complétés** (ou double validation selon règle produit) **incrémentent** la jauge ; annulation / no-show ne « casse » pas le passé mais **ne monte** pas.

### 2.7 Tables **healthy**, **végé** & micro-copy **bienveillante** (prévention douce)

**Healthy / sportifs** : l’app accueille **assiettes équilibrées** et **gros plaisirs** sans opposer les deux. Tags dédiés (`graille_healthy`, `graille_sportif`) + libellés **sans moraline** (« attention à la ligne » possible en ton **léger**, pas coach toxique). Découverte : à terme filtres « envie healthy » / préférences alimentaires — **après** duo stable.

**Végétarien·nes / véganes** — **trois intentions sociales** possibles (tags `ici_veg_*`) :

- manger **entre** personnes végé ;  
- **faire découvrir** sa cuisine végé à d’autres ;  
- viser une **expérience** 100 % végétale (resto, marché, événement curé §2.4).  

Objectif : **inclusion** et **clarté** avant le repas (déjà aligné contraintes alimentaires en spec produit), pas segment isolé.

**Micro-messages** (pas un système de **récompenses** ni de points) :

- **Profils engagés** : phrases du type *tu prends goût à la table avec du monde*, *tes rencontres ont l’air de bien se passer* — **privé** ou contexte écran d’accueil, **jamais** leaderboard.  
- **Profils plus discrets** : *pas de cadence imposée*, *une table quand tu veux*, **pas** de culpabilité pour « pas assez » de repas.  
- **Prévention** : eau (surtout **forte chaleur**), hydratation, **5 fruits & légumes** avec **jeu de mots** ou lien **social** (*« une table à plusieurs, c’est déjà un bon plat social »*) — ton **humour Paye ta graille**, pas affiche ministérielle. Éviter toute **promesse santé** ou remplacement d’un avis médical.

**Fichiers** : `src/lib/tag-options.ts`, `src/lib/micro-moments-copy.ts` (`MICRO_MOMENTS_CELEBRATION_ENGAGED`, `MICRO_MOMENTS_GENTLE_QUIET`, `WELLNESS_PREVENTION_PLAYFUL`). **Suite** : brancher sous-ensemble **canicule** sur météo ou saison (optionnel).

### 2.8 **Offrir un repas** (don), remerciement, points discrets & **exploration restos**

*(Numérotation locale — ne pas confondre avec **`MARKETING_OFFICIEL.md` §2.8**, qui traite des **slogans assumables**.)*

#### A. Parcours « offrir un repas »

- **Entrée** : CTA dédié (ex. *« Offrir un repas »*) pour utilisateurs **à l’aise** avec l’app — **paiement in-app** (montant ou panier partenaire), **traçabilité** comptable.  
- **Attribution du crédit** : le repas « revient » à un·e bénéficiaire selon des règles **publiques dans les CGU** — pas de boîte noire.  
- **Après le repas** : le bénéficiaire peut envoyer un **remerciement** contrôlé (*« Merci pour ton repas »*) — **pas** d’obligation ; **pas** de DM ouvert si non souhaité ; modération anti-harcèlement.

#### B. Qui reçoit — **sans** rhétorique « tu mérites / tu ne mérites pas »

Objectif psychologique : **dignité** et **clarté**. À éviter : labels qui **classent** les personnes (« plus méritant », « les moins grailleurs ») — ça crée de la **honte** et de la **rivalité**.

**Pistes compatibles** (à trancher légalement et produit) :

| Mécanisme | Effet ressenti |
|-----------|----------------|
| **File d’attente** « j’aimerais une table offerte cette semaine » + tirage **transparent** | Hasard **expliqué**, pas jugement personnel. |
| **Critères objectifs** (ex. première inscription, coupure longue sans repas **si** l’utilisateur **opt-in**) | Cadre **consenti**, pas surprise infantilisante. |
| **Partenaire associatif** qui **désigne** les bénéficiaires (hors algo « mentaliste ») | **Sérieux** pour publics en grande précarité plus tard. |
| **Souscription** « offrir à quelqu’un du réseau Paye ta graille » vs « pot commun » | Distinction **don pair à pair** vs **fonds solidaire**. |

**À proscrire** : message du type *« tu es celui qui mange le moins, tiens un repas »* — même avec bonne intention, c’est **stigmatisant**.

#### C. Points / fidélité pour le donateur

- **Crédit discret** possible (ledger) : le donateur peut **accumuler** un avantage **sans** headline « +100 points si tu donnes » — plutôt **reconnaissance tardive** (*« ta générosité compte pour la communauté »*) ou **avantage** débloqué sans lien publicitaire lourd.  
- **Alternative** : pas de points, seulement **badge privé** ou **remerciements** agrégés — moins « marketing transactionnel ».

#### D. Piste **solidarité élargie** (SDF, précarité alimentaire)

- **Phase 3+** : partenariat **associations / restos du cœur / maraudes** — flux **tracés**, conformité **don en nature / bons**, **pas** de sélection « par l’app » sans acteur terrain.  
- Narratif **sincère** : *les repas offerts peuvent aussi nourrir un programme partenaire* — **transparence** sur la part **pair à pair** vs **solidarité**.

#### E. **Lieux** : rayon, catégories, fins gourmets, terroir

- **Carte / liste** : au-delà du **rayon habituel**, permettre **dézoom**, **autre ville**, **favoris lointains** — l’utilisateur **choisit** d’élargir, pas seulement l’algo.  
- **Catégories éditoriales** (exemples) : *Les tops du moment* · *Nouveautés* · *Fine bouche / expériences* · *Spécialités de France / terroir* · *Ce que nos grailleurs aiment* · *Bonne graille sans chichi* · *À deux c’est encore mieux* (cross-promo douce).  
- Cohérent **événements curés** §2.4 et **tags** profil (végé, healthy, saveurs du monde).

**Phasage** : **V1** inchangé (duo) ; **§2.8** = **Phase 2–3** selon briques (paiement, ledger, lieux).

### 2.9 **Graille à l’aveugle** & slogan **« seconde graille »**

**Slogan** (voir aussi **`MARKETING_OFFICIEL.md` §2.9**) : *« **Tout le monde a le droit à une seconde graille.** »* — entendu comme **nouvelle table**, **nouveau fil social autour du repas**, **sans** sous-entendu « tu as raté ta vie amoureuse » (éviter la culpabilité). Variante : *« Une seconde chance, ça se mange aussi »* — **à A/B** sur **accroche** vs **clarté**.

**Concept produit « Graille à l’aveugle »** :

1. **Opt-in explicite** : l’utilisateur active un mode du type *« Graille à l’aveugle »* (ou *« Manger sans avoir scrollé les profils »*) — **consentement** clair sur le **hasard contrôlé** et les **règles**.  
2. **Appariement** : l’app associe **deux personnes** qui ont **le même mode actif** et des **contraintes compatibles** (intention d’addition, contraintes alimentaires si renseignées, **ville / rayon**).  
3. **Géolocalisation** : **plafond de km** (réglable produit, ex. 2–10 km selon densité) ; option **zone nommée** (*« aveugle dans ce quartier »*) pour éviter trajets absurdes.  
4. **Lieu / resto** : soit **liste curée** dans le rayon (sécurité + qualité), soit **tirage** parmi une **shortlist** (pas n’importe quel POI isolé) — jamais **domicile** en **premier** rendez-vous aveugle.  
5. **« On mange, on se découvre après »** : **identité minimale** avant le repas (prénom / intention / règles) — **pas** jeu de dating complet avant la table ; **après** `completed`, dévoilage progressif ou lien **Mes compagnons** selon choix produit.  
6. **Alignement intentions** : même logique **`invite` / `partage` / `etre_invite`** — les deux valident **qui paie comment** avant de verrouiller (éviter mauvaise surprise post-match).  
7. **Sécurité** : lieu **public**, **signalement**, **annulation** sans punition, rappels **SECURITE_CHECKLIST_CODE.md** ; pas de promesse « zéro risque ».

**Copy** (exemples) : *Graille à l’aveugle — même faim, même coin.* · *Même envie de table, le reste après le plat.* · *On aime les mêmes trucs ? On peut qu’être bons compagnons de table.* (éviter « on ne peut qu’être amis » comme **promesse** de relation — préférer **table / compagnons de graille**).

**Phasage** : **V1.5–V2** après **confirmation d’intention** et **signalement** fiable sur le parcours classique ; file d’attente + modération légère au lancement.

---

## 3. Red flag / green flag (si tu veux une première version)

**Objectif** : éviter le malaise (ex. « je paye » vs attente 50/50) **sans** gamifier la personne.

**Règles recommandées** :

- Les flags sont **privés** par défaut ; option « partager un ressenti » = phase ultérieure.  
- **Red flag** = **arrêt du match en cours** + message neutre : *« Ce n’est pas un bon alignement pour ce repas. »* Pas de détail sur qui a mis quoi.  
- Pas de **score public** ni classement.  
- Limite **3 à 5** items (ex. addition, ambiance, horaire, lieu) — pas un questionnaire de dating de 40 questions.

**Implémentation minimale** : table `match_signals` ou champs sur `meal` + raison d’annulation enum ; pas d’algo de « compatibilité » en V1.

---

## 4. Monétisation (échelle)

| Étape | Modèle | Complexité |
|-------|--------|------------|
| Maintenant | **Gratuit** + volume limité / early access | Faible |
| + | **Frais de service fixe** par repas **confirmé** (ex. 0,99–1,99 €) via Stripe | Moyenne |
| ++ | **Connect** : commission + versement resto / utilisateurs | Élevée (juridique + ops) |
| +++ | **Abonnement** « plus de propositions / filtres » | Moyenne (après traction) |
| +++ | **Points** → crédit repas | Élevée (ledger + fiscalité) |
| +++ | **« Offrir un repas »** (don in-app, attribution, remerciement) | Élevée (Stripe, fiscalité don, modération, **éthique**) |

---

## 5. Recherche « profonde » : ce qu’on utilise vraiment

Sans jouer aux experts omniscients, les leviers utiles pour **ce** produit sont :

- **Job-to-be-done** (Christensen) : « Ne pas manger seul » / « Rencontrer sans pression date ».  
- **Friction & habit** (Fogg) : chaque écran enlève une friction vers **un repas réel**.  
- **Confiance** (marketplaces : réputation, clarté des règles, lieu public, signalement) : voir `SECURITE_CHECKLIST_CODE.md`, flux signalement existant.  
- **Biais de réduction d’incertitude** : intentions d’addition **visibles tôt** (déjà ton différenciateur vs apps floues).

Pour aller plus loin **sans dépendre d’une IA** : 5–8 **interviews** utilisateurs (solo au resto, nouveaux en ville, « pas dating ») valent plus que 20 prompts théoriques.

**Don « offrir un repas »** (§2.8) : leviers **dignité** et **réciprocité symbolique** (remerciement **optionnel**) plutôt que **mérite** affiché ; validation terrain avec personnes **précaires** uniquement via **partenaires** — pas de posture « mentaliste » marketing.

---

## 6. Pack de prompts Cursor (consignes strictes + marque)

**Problème à corriger** : un prompt du type « tu es un expert X » sans **livrable**, sans **périmètre** et sans **ADN produit** fait perdre du temps. Chaque session ci-dessous impose : contexte fixe, tâche, sorties obligatoires, critères de réussite, fichiers à ouvrir, interdits.

### 6.1 Bloc à coller en tête de **chaque** chat Cursor (ne pas résumer)

Coller tel quel ; c’est la **vérité marketing et produit** issue du brainstorm (complété par le dossier officiel).

```
CONTEXTE FIXE — PAYE TA GRAILLE (produit) / « PAY TAGRAIL » (hook marketing optionnel)

Nom produit : Paye ta graille (ne pas renommer le repo ni l’app store sans décision explicite).
« Pay Tagrail » : jeu de mots / campagne / social — pas un second produit technique.

Promesse et ton :
- Gourmands + sociabilité : manger ensemble, le réel avant l’écran.
- Angle marketing **assumable** : *pas honte de dire que tu l’utilises*, *rencontre = prétexte repas* — **`MARKETING_OFFICIEL.md` §2.8–2.9** (dont **seconde graille**, **Graille à l’aveugle** — copy) ; prompt **#22** ; pas comparatif « la seule app » sans juriste.
- Job : ne plus manger seul ; lien sans pression « app de rencontre classique ».
- Accroches brainstorm (à utiliser en copy selon canal ; valider promesses prix avec le juriste) :
  · « L’app pour les gourmands » / « L’association des gourmands » (ton communauté, pas statut juridique sans validation).
  · « Vous ne mangerez plus jamais seul. »
  · « Payer moins cher, manger heureux » — uniquement si on peut le prouver (partenaires, offres) ; sinon variante prudente.
  · « Manger heureux », « le lien autour de la table ».
- Intentions d’addition (cœur métier), **trois modes seulement** en base : **J’invite** (`invite`) · **On partage / 50-50** (`partage`) · **Je me laisse inviter** (`etre_invite`).
  Comportement visé : celui·celle qui **invite** ou **partage** peut recevoir des **demandes / intérêts** ; il·elle **choisit** avec qui passer à l’étape repas. L’autre partie **accepte ou refuse** le cadre (lieu, créneau, règle d’addition).
  On ne vend pas « chercher l’amour » : on vend **manger ensemble** ; le contact a un **prétexte table** (intention visible).
- Anti–dating classique : pas de messagerie « gratuite » hors contexte repas / intention ; découverte **par intention compatible** (voir §2.1).
- Profil inscription : cases **personnalité + hobbies** (drôle, bavard, séries, lecture, etc.) + section **graille** dédiée + **ce que tu viens faire ici** = **recherche sociale** (ami·e de table, lien, bouffe), **jamais** « ce que je cherche en amour ». Réf. §2.3 et `src/lib/tag-options.ts`.
- Option **« Ma spécialité »** (court texte ou tag) : *Ramène ta spécialité*, *spécialité de chez moi*, curiosité **saveurs / restos** — ton fun, pas CV culinaire.
- Bio / profil : proposer en **suggestions** des accroches du type « Paye ta graille — j’aime manger avec des humains », « App des gourmands », « Tu ne mangeras pas seul », « Mange ta graille, rencontre du monde » (adapter longueur store ; pas de promesse prix sans preuve).
- Jauge **privée** entre deux compagnons : barre + **verdissement** au fil des repas **completed** ; titres du type **Belle rencontre** → **Compagnon·ne de graille** → **Meilleur·e compagnon·ne** ; **pas** de classement public. Rappels « ça fait longtemps » : **doux**, réglage **calme / normal / off**, anti-spam — §2.6, `companions-copy.ts`, `micro-moments-copy.ts`.
- **Healthy / végé** : tags profil inclusifs ; **micro-messages** célébration / discret / **prévention** eau-chaleur-5 fruits en **humour léger** — §2.7, `tag-options.ts`, `micro-moments-copy.ts` (pas de jugement, pas de promo santé trompeuse).
- Flags (culture produit) : après alignement partiel, une personne peut signaler en privé green / red flag sur quelques critères ;
  red flag = fin de parcours, message neutre, pas de score public ni humiliation.
- Hors V1 sauf spec : **Graille à l’aveugle** (match géolocalisé, opt-in) — §2.9 ; **coin graille** / repas **groupe** ; **graphe compagnons** — §2.5 ; **événements curés** §2.4 ; **« Offrir un repas »** — §2.8 produit ; **lieux** §2.8.E ; **« qui ramène quoi »** ; **« qui est chaud pour ce resto »** ; fonds sonores ;
 géoloc ; paiement magasin ; points fidélité ; abonnement. Ne pas les implémenter sans ticket dédié.

Fichiers de vérité : docs/BLUEPRINT_PRODUIT_FINAL_MVP.md, PRODUCT_SPEC.md,
docs/MARKETING_OFFICIEL.md, docs/MATRICE_REPAS_ETATS_PERMISSIONS.md,
docs/DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md, docs/DA_BRIEF_RECHERCHE_MULTIMETIERS_ILLUSTRATION.md,
docs/SYSTEME_ENGAGEMENT_NATUREL.md, docs/PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md,
docs/INTEGRATION_PRODUIT_SYNTHESE.md, docs/LIVRABLE_MVP_REFERENCE_LANCEMENT.md, docs/VERSION_PROJET_RECONSTRUITE.md, docs/AUDIT_TECHNIQUE_CODEBASE.md,
src/lib/intent-labels.ts, src/lib/tag-options.ts, src/lib/ux-copy.ts, src/lib/companions-copy.ts.
```

### 6.2 Règles pour **tous** les prompts numérotés

Pour chaque numéro ci-dessous, en fin de message utilisateur, ajouter **toujours** :

1. **Livrables** : format attendu (liste, tableau, patch, PR description, etc.).  
2. **Périmètre** : fichiers autorisés ; tout le reste = hors scope sauf mention « bloquant ».  
3. **Critères de succès** : 3–5 bullets vérifiables.  
4. **Interdits** : ex. « ne pas ajouter Stripe », « ne pas renommer l’app ».  
5. **Références** : citer les chemins lus (`…`) dans la réponse.

### 6.3 Prompts par domaine (copier le bloc **TÂCHE** + le bloc fixe 6.1)

| # | Domaine | TÂCHE (consigne stricte) |
|---|---------|---------------------------|
| 1 | **Produit** | À partir de `BLUEPRINT_PRODUIT_FINAL_MVP.md` et `PRODUCT_SPEC.md`, produis **(a)** tableau V1 IN / V1 OUT / Phase 2 avec **une phrase valeur** par vague alignée sur le bloc marque 6.1 ; **(b)** 5 risques utilisateur et mitigation ; **(c)** 3 métriques North Star + définition. **Interdits** : nouvelles features non listées dans le brainstorm. **Succès** : tableau exploitable en réunion ; aucune contradiction avec `DECISIONS_PRODUIT_LOG.md`. |
| 2 | **Parcours** | Cartographie **parcours heureux** + **5 échecs** (no-show, refus addition, annulation, mismatch intention, signalement) en t’appuyant sur `MATRICE_REPAS_ETATS_PERMISSIONS.md`. Sortie : diagramme texte (Mermaid OK) + **liste des états repas** existants à chaque étape. **Interdits** : inventer des états sans vérifier le code. **Succès** : chaque échec a un état ou une transition documentée. |
| 3 | **Copy & marque** | Harmonise **tous** les textes utilisateur autour des **intentions d’addition** et des slogans du bloc 6.1 ; inclure **onboarding / tags** (`tag-options.ts`, `UX_ONBOARDING` si besoin). Sources : `ux-copy.ts`, `companions-copy.ts`, `intent-labels.ts`, `MARKETING_OFFICIEL.md`. Sortie : **(a)** tableau « clé → texte actuel → texte proposé → canal » ; **(b)** 2 variantes **hero + sous-hero** ; **(c)** 5 micro-phrases **graille** / **spécialité** (ton « ça claque », pas dating). **Interdits** : promesse « moins cher » sans disclaimer ; formulation « recherche relation ». **Succès** : §2.3 respecté ; « je paye » = invitation à payer. |
| 4 | **Découverte** | Ouvre `DiscoverClient.tsx` et fichiers liés. Propose **changements concrets** (patch ou liste numérotée) pour : empty state aligné marque 6.1 ; **rappel d’intention** avant premier contact si absent ; accessibilité (labels, focus). **Interdits** : refonte graphique totale sans `DA_COHERENCE_…`. **Succès** : chaque changement a un critère testable manuellement. |
| 5 | **Repas (détail)** | Audite `MealDetailClient` (et API associée) vs `MATRICE_REPAS_ETATS_PERMISSIONS.md`. Sortie : **trous** (état, permission, copy) + **une** recommandation prioritaire pour **confirmation d’intention côté invité·e**. **Interdits** : Stripe. **Succès** : liste priorisée P0/P1/P2. |
| 6 | **Flags** | Spécifie **micro-V1** : modèle minimal (enum, qui voit quoi), copy **neutre** à l’arrêt, pas de score public. Fichier livré : section markdown prête pour `PRODUCT_SPEC.md` ou issue GitHub. **Interdits** : questionnaire de 20 questions. **Succès** : implémentable en moins de 2 jours dev. |
| 7 | **Paiement** | Documente **V1** (PaymentIntent simple / hors app) vs **V2** (Connect, versement resto) : flux, risques chargeback, docs Stripe à lire. Sortie : tableau comparatif + **recommandation** une phrase. **Interdits** : code sans ticket. **Succès** : aligné docs Stripe officielles (liens en §1 du présent fichier). |
| 8 | **Legal** | Checklist CGU / données / paiement à partir de `LEGAL_STRUCTURE_OFFICIEL.md` + mentions **intentions d’addition** et **flags**. Sortie : liste à cocher + points **à valider juriste**. **Interdits** : texte légal définitif inventé. **Succès** : aucune promesse marketing non couverte. |
| 9 | **Design** | Applique `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` au composant **[à nommer]**. Sortie : avant/après (description) + tokens couleurs/espacements. **Interdits** : changer la DA globale. **Succès** : cohérent avec l’écran voisin. |
| 10 | **Perf** | Audit Next.js ciblé : Discover, images, bundle. Sortie : **3 quick wins** + **1** changement reporté. **Interdits** : migration framework. **Succès** : chaque quick win a commande de vérif (`npm run build`, Lighthouse, etc.). |
| 11 | **Growth** | Propose boucle **partage** (repas / profil) + métrique activation J1. Sortie : schéma + copy courte alignée 6.1. **Interdits** : paid ads budget. **Succès** : une action utilisateur mesurable. |
| 12 | **Resto / lieux** | Spec **Phase 2** : Google Places vs partenaires ; **interdiction** de promettre « paiement direct au resto » en V1 dans l’UI. Inclure **§2.8.E** : rayon **élargi** choisi par l’utilisateur, **catégories** (tops, nouveautés, fine bouche, terroir France, « ce que nos grailleurs aiment »). Sortie : user stories + risques. **Succès** : compatible roadmap §1. |
| 13 | **Fidélité** | Modèle **ledger** points + anti-abus — **hors MVP**, 1 page max. **Succès** : règles d’attribution + cas d’échec. |
| 14 | **Tests** | Plan manuel E2E : inscription → repas `completed`. Sortie : checklist **Given / When / Then**. **Succès** : couvre intentions d’addition et annulation. |
| 15 | **Analytics** | Liste **événements** min : proposé, accepté, completed, annulé, flag (si existe). Sortie : tableau nom événement + propriétés. **Interdits** : PII excessive. **Succès** : mappe 1:1 aux états repas. |
| 16 | **Son (vision)** | **Spec seulement** : fonds sonores adaptatifs — consentement, accessibilité, opt-in, hors V1. Sortie : user stories + risques. **Interdits** : implémenter l’audio. **Succès** : ne contredit pas la promesse « simplicité » V1. |
| 17 | **Social / groupe** | Spec **Phase 2** : « coin graille » (posts courts + réponses), repas **à N**, modération, lien lieu ; option **« qui ramène quoi »** (contributions typées + libellé court). Inclure **tags expérience**. **Événements curés app** : renvoi §2.4 + prompt **#20** pour le détail. Sortie : user stories + risques + **ce qui reste volontairement hors MVP**. **Interdits** : implémenter en V1 sans décision explicite. **Succès** : compatible §2.1–2.2. |
| 18 | **Intent-first UX** | Prototype texte ou wire : **demandes entrantes** + choix de l’hôte pour `invite` / `partage` / réponse des `etre_invite`. Sortie : 3 écrans décrits + règles de notif + états repas impactés. **Interdits** : nouveau modèle data sans valider avec `MATRICE_REPAS_ETATS_PERMISSIONS.md`. **Succès** : un dev peut estimer en jours. |
| 19 | **Profil / tags / spécialité** | Audite `tag-options.ts` + `OnboardingWizard.tsx` + API `profile`. Propose **(a)** liste de **nouveaux tags** (perso, graille, ici) avec libellés fun, alignés §2.3 ; **(b)** spec **champ optionnel** `specialty` ou équivalent (longueur max, modération) ; **(c)** copy titres / descriptions qui **interdisent** l’angle « recherche amoureuse ». **Interdits** : plus de 15 nouveaux tags d’un coup sans priorisation. **Succès** : onboarding reste **moins de 3 min** ressenti ; `hasGrailleTag` / `hasIciTag` inchangés ou migrés proprement. |
| 20 | **Événements curés (app)** | À partir de §2.4 : **(a)** modèle data minimal (`experience` / `rsvp` / états) ; **(b)** 5 user stories (liste, détail, inscription, annulation, check-in) ; **(c)** tableau **modèle éco** par scénario (sur place / billet / sponsor / bonus app) + **risques légaux** à flagger. **Interdits** : promettre subvention app sans budget validé ; Eventbrite générique. **Succès** : ops **manuel** possible pour 3–5 événements pilote sans full auto. |
| 21 | **Compagnons & repas croisé** | À partir de §2.5 + `reseau-graille/page.tsx` + `SECTION_MES_COMPAGNONS.md` : **(a)** spec **demande / acceptation** compagnon post-repas ; **(b)** règles **privacy** (pas de liste « amis de X ») ; **(c)** flux **Alice invite Bob + Chloé** (médiateur) vers objet `meal` groupe ; **(d)** pourquoi **pas** de commentaires publics en V2 court. **Interdits** : graphe Facebook ouvert ; gems publics. **Succès** : schéma tables + 5 états utilisateur. |
| 22 | **Marketing « assumable / pas la honte »** | Ouvre **`docs/MARKETING_OFFICIEL.md` §1, §2.1–2.9**. **(a)** 3 paires **hero + sous-hero** pour angle *pas une app de rencontre comme les autres* / *tu peux assumer* ; **(b)** 5 **hooks** ≤8 mots (Reels, story) ; **(c)** tableau **phrase → canal (store / pub / pitch)** → **risque juridique** (oui / non / juriste) ; **(d)** intégrer *gourmands*, *faciliter le lien*, et **au moins une variante** *seconde graille* (§2.9) sans promesse **prix** ; **(e)** test **3 s** : **table / repas / graille** ? **Interdits** : « la seule app » sans validation juridique ; « moins cher » sans preuve. **Succès** : chaque ligne cite un **§** du doc officiel. |
| 23 | **« Offrir un repas » + solidarité + lieux** | À partir de **§2.8** : **(a)** parcours utilisateur donateur → paiement → attribution → repas consommé → **remerciement** (états + anti-harcèlement) ; **(b)** tableau **mécanismes d’attribution** (file, tirage, opt-in, partenaire) avec **risque stigmatisation** ; **(c)** **points donateur discrets** : 2 options (ledger silencieux vs pas de points) + **copy** sans « +X si tu donnes » agressif ; **(d)** **Phase 3** solidarité : partenaires, conformité, **pas** de sélection SDF par l’app seule ; **(e)** **§2.8.E** : 5 **catégories** lieux + règle **carte élargie**. **Interdits** : algo « les moins méritants » ; promesse humanitaire sans ONG. **Succès** : juriste peut répondre à partir du livrable. |
| 24 | **Graille à l’aveugle** | À partir de **§2.9** : **(a)** user stories **opt-in → match → lieu → repas → après** ; **(b)** règles **km max**, **zone**, **shortlist restos** vs aléatoire borné ; **(c)** quelles données **masquées** avant le repas vs après ; **(d)** alignement **`meal_intent`** + confirmation addition ; **(e)** risques **sécurité** + mitigations (checklist). **Interdits** : premier RDV à domicile ; profil zéro avant le repas (minimum légal/UX). **Succès** : schéma d’états + estimation dev. |
| 25 | **DA / illustration / multimetiers** | Ouvre **`DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md`** + **`DA_BRIEF_RECHERCHE_MULTIMETIERS_ILLUSTRATION.md`**. **(a)** Tableau **3 directions** moodboard (mots-clés + 5 refs visuelles **types** — pas URLs inventées) alignées **§3 brief** du brief ; **(b)** liste **10 critères** livraison illustrateur (SVG, silhouettes, pas food stock) ; **(c)** paragraphe **contre-pied** nom argot / design premium **seniors** ; **(d)** 5 ressources **nommées** déjà listées dans le brief à approfondir ; **(e)** audit **contraste** sur **1** écran existant (chemins code). **Interdits** : promettre un style « jamais vu » sans critères mesurables ; négliger WCAG. **Succès** : une direction réaliste pour **1** sprint design. |
| 26 | **Engagement neuro & viralité éthique** | Lis **`docs/PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md`** (§1–§8) + **`docs/SYSTEME_ENGAGEMENT_NATUREL.md`** + **`docs/RETENTION_ETHICAL.md`** si présent. **(a)** Propose **5 boucles** produit qui maximisent **repas IRL `completed`** et **confiance** (pas temps d’écran) ; **(b)** pour chaque boucle : hypothèse, métrique, risque éthique, mitigation ; **(c)** **3** idées de **partage / invitation** mesurables (K-factor **réel**) **sans** dark pattern ; **(d)** paragraphe **franchise / M&A** : ce qui rend le modèle **reproductible et défendable** (playbook, conformité). **Interdits** : recommander loot boxes, fausses notifications, FOMO mensonger, exploitation honte/corps ; promettre « addiction ×100k » comme objectif de design. **Succès** : aligné §0–§5 du prompt neuro ; North Star = **tables réussies**, pas DAU toxique. |

**Nombre de sessions** : viser **12–28** ; au-delà, risque de dispersion. Réutiliser le **bloc 6.1** plutôt que réécrire le pitch.

---

## 7. Nom, « Pay Tagrail », slogans (banque pour les prompts)

**Produit (code, stores, dossier)** : **Paye ta graille**.

**Hook / campagne (social, pubs, éditions limitées UI)** : **Pay Tagrail** — à utiliser dans les prompts copy comme *variante mémorable*, jamais comme nom de package ou de route sans décision.

**Formulations issues du brainstorm** (à intégrer dans les prompts **Copy & marque** et **Growth** ; tronquer ou adapter si limite caractères store) :

| Usage | Formulation |
|-------|-------------|
| Communauté gourmande | « L’app pour les gourmands », « L’association des gourmands » (vérifier ne pas induire un statut associatif réel sans cadre juridique). |
| Solitude / lien | « Vous ne mangerez plus jamais seul. », « Ne mange plus seul. » |
| Bénéfice prix (prudence) | « Payer moins cher, manger heureux » — seulement avec preuves / offres partenaires ; sinon « Manger heureux » seul ou voir `MARKETING_OFFICIEL.md` axe4. |
| Sociabilité | « Jouer sur la sociabilité », « Le lien autour de la table ». |
| Addition | Trois codes clairs : **chacun sa part** · **je paye** (invitation à payer / prise en charge) · **tu m’invites** / être invité·e ; les prompts **doivent** refléter ces trois logiques dans les écrans concernés. |
| Intent-first (copy) | « Tu parles parce qu’il y a une table / une règle d’addition », « Pas là pour swiper — là pour graille », « J’invite / on partage / je me laisse inviter » comme **titres** lisibles. |
| Bio (suggestions courtes) | « Paye ta graille — rencontre du monde autour d’un plat », « Mange ta graille », « L’app des gourmands », « Tu ne mangeras pas seul » (variantes tutoiement/vouvoiement selon canal). |
| Groupe / atypique (plus tard) | Raclette à plusieurs, spontané « maintenant », pique-nique, vélo, dans le noir — **tags + Phase 2** (§6.3 #17). |
| Potluck / contributions | « Qui ramène quoi » (plat, entrée, dessert, boissons…) — **Phase 2+**, aligné repas **groupe** ou **hors resto** ; pas le cœur du 1:1 resto. |
| Spécialité / ramène ta graille | « C’est quoi ta spécialité ? », « Spécialité de chez moi », « Ramène ta spécialité » — **V1 léger** (texte court) ou **V1.5** ; lien **potluck** plus tard. |
| Profil « recherche » | Formuler comme **ici_*** : lien, amitié de table, bouffe, lieux — **pas** « critères amoureux » (§2.3). |
| Futur sensoriel | Fonds sonores selon le ton de l’échange — **spec uniquement** (§6.3 #16), pas V1 par défaut. |
| Expériences curées | « Tables Paye ta graille », dîner dans le noir, pique-nique, food tour — **inscription dans l’app** ; éco : billet, sur place, sponsor, bonus — **§2.4**, prompt **#20**. |
| Amis de table | « Ajouter à mes compagnons », repas croisé, **pont** par ami mutuel — **§2.5**, `Mes compagnons`, prompt **#21**. |
| Pas de mur social | Pas de **commentaires / gems publics** sur les profils au début — **jauge privée**, signalement, §2.5. |
| Jauge & rappels | Barre duo, vert progressif, **Meilleur·e compagnon·ne** ; nudges invite / 50-50 — **§2.6**. |
| Healthy & végé | Tags `graille_healthy`, `graille_sportif`, `ici_veg_*` — **§2.7**. |
| Prévention fun | Eau, chaleur, fruits & légumes, lien social — `WELLNESS_PREVENTION_PLAYFUL`. |
| Offrir un repas | Don in-app, crédit, **merci pour ton repas**, points discrets — **§2.8**, prompt **#23**. |
| Solidarité (précarité) | Partenaires terrain, **Phase 3+**, transparence — **§2.8.D**. |
| Lieux | Rayon **élargi**, tops, nouveautés, **fine bouche**, **terroir France** — **§2.8.E**, prompt **#12** / **#23**. |
| Seconde graille | *Tout le monde a le droit à une seconde graille.* — `MARKETING_OFFICIEL.md` **§2.9**. |
| Graille à l’aveugle | Match opt-in, km max, lieu public, connaissance après le plat — **§2.9**, prompt **#24**. |

**Corpus élargi** (A/B, sous-hero, posts) : tout le §2 de `MARKETING_OFFICIEL.md` reste la référence — **§2.8** (*assumable*), **§2.9** (*seconde graille*, *Graille à l’aveugle* — copy + garde-fous). Les prompts **ne doivent pas** inventer des slogans contradictoires avec ce fichier sans le mentionner ; **#22** (campagnes), **#24** (spec mode aveugle).

---

## 8. Prochaine action concrète (Cursor)

1. Tenir **V1** à jour dans `DECISIONS_PRODUIT_LOG.md` (in / out ; entrée 2026-04-13 déjà posée).  
2. Implémenter **une** amélioration haute valeur : confirmation d’intention d’addition côté invité **ou** spec minimal **red flag** (choix unique).  
3. Lancer **5 interviews** ciblées avant d’ajouter son, points, Connect resto.

---

*Document vivant : à relier aux décisions dans `DECISIONS_PRODUIT_LOG.md`.*
