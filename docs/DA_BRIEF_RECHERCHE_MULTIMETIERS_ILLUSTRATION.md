# Paye ta graille — Brief multimetiers, recherche & illustration « expérience gustative »

**Objectif** : outiller **créateurs** (direction artistique, illustration, typo, motion, accessibilité…) avec une **carte honnête** des disciplines, des **ressources vérifiables**, et un **brief illustratif** aligné sur `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md`.

**Ce que ce document n’est pas** : une liste fantaisiste de « 1000 métiers » ni une revendication d’avoir tout lu sur internet. C’est un **cadre de travail** + **pointeurs** pour approfondir.

---

## 1. Carte des disciplines (clusters)

Plutôt qu’une nomenclature infinie, regrouper les expertises utiles à **une** expérience app + landing **premium, chaleureuse, inclusive** :

| Cluster | Rôles typiques | Apport pour Paye ta graille |
|---------|----------------|-----------------------------|
| **Direction artistique & identité** | DA, brand designer, stratège marque | Cohérence **nom oral / ton jeune** vs **visuel intemporel** ; système reconnaissable en 3 s. |
| **Illustration & narrative visuelle** | illustrateur·rice, storyboard, BD éditoriale | **Silhouettes à table**, **nourriture suggérée** (ligne, forme) **sans** photo appétite cheap. |
| **Typographie** | type designer, font engineer (hinting) | Lisibilité **seniors** + **mobile** ; paire **display chaleureux** + **UI sans** sobre (déjà §3 DA). |
| **Colorimétrie & perception** | coloriste, spécialiste contraste | Palette **chaude contenue** ; **WCAG** ; pas d’orange promo criard. |
| **Motion & micro-interaction** | motion designer, prototypiste | **Fluide**, **respirant** ; `prefers-reduced-motion` (DA §6). |
| **UX & recherche** | UX researcher, interaction designer | Parcours **sans friction** ; tests **multi-âges** ; pas de vanity metrics sur le beau seul. |
| **Accessibilité & inclusion** | a11y engineer, ergonome | **Contraste**, **taille tactile**, **cognitif** (libellés clairs) — indispensable pour **toutes générations**. |
| **UI & design system** | product designer, design ops | Tokens `--ptg-*`, composants stables, documentation vivante. |
| **Spatial & scénographie** (option) | architecte d’intérieur, scénographe | Inspiration **lumière de salle**, **tables**, **profondeur** — transposable en **2D** (pas copier un resto photo). |
| **Street & culture visuelle** (hors UI dense) | graffeur·euse, muraliste | Énergie pour **campagnes** ou **éditions limitées** ; **ne pas** importer le style brut dans **formulaires** et **petits textes**. |

---

## 2. Ressources & techniques (pistes sérieuses)

À compléter au fil des besoins ; privilégier **sources primaires** et **guides** maintenus.

### Accessibilité & inclusion

- **WCAG 2.x** — référence W3C : [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)  
- **Inclusive design** — patterns et contre-exemples : rechercher *Inclusive Components* (Heydon Pickering) et ressources **W3C WAI** sur les personnes âgées.

### UX & clarté

- **Nielsen Norman Group** — articles courts sur lisibilité, tests utilisateurs : [https://www.nngroup.com/](https://www.nngroup.com/)  
- **Steve Krug** — *Don’t Make Me Think* (principes de scan et de simplicité).

### Design visuel & système

- **William Lidwell & al.** — *Universal Principles of Design* (grille, hiérarchie, contraste).  
- **Jenifer Tidwell** — *Designing Interfaces* (patterns UI récurrents).  
- **Material Design** / **Apple Human Interface Guidelines** — utiles pour **comportement** et **accessibilité**, pas pour **copier** l’esthétique si elle casse la marque.

### Couleur

- **Josef Albers** — *Interaction of Color* (relations de couleur, pas recette magique « psychologie » simpliste).

### Motion

- **Documentation motion** des systèmes ouverts (ex. Material Motion) + règle d’or : **réduire** si l’utilisateur le demande.

### Illustration & direction- Pas de « livre unique » : construire une **moodboard** interne (3–5 références **abstraites** table / convivialité) + **interdiction** explicite **stock food** (DA §2).  
- **Critique de marque** : sites type *UnderConsideration / Brand New* pour **apprendre** ce qui fatigue ou date (pas pour copier).

### Communautés & inspiration (avec prudence)

- **Behance / Dribbble** : exploration ; **filtrer** le **generic SaaS** et le **3D burger**.  
- **AIGA**, conférences **UX** locales : mise en réseau avec **illustrateur·rices** editorial.

---

## 3. Brief créatif — illustration « gustative » sans nourriture « ancrée »

**À transmettre tel quel** à un·e illustrateur·rice ou à une session Cursor **Design** (prompt **#25** dans `V1_CONCEPT_BRAINSTORM_TO_CODE.md`).

### Intent

- Évoquer **faim**, **table**, **partage**, **chaleur**, **humain** — **sans** photoréalisme ni clichés (burger/pizza/sushi stock).  
- Style : **ligne fluide**, **formes simplifiées**, **2–3 plans** de profondeur, **grain** papier optionnel.  
- **Silhouettes** assises : **pas** de traits faciaux détaillés ; diversité **silhouette** (taille, posture) sans stéréotype.  
- Éléments « nourriture » : **abstraits** — courbe de **pain**, **rondeur** de plat, **vapeur** en traits légers, **cercle** assiette vide avec **lumière** — jamais **packshot**.

### Interdits

- **Shutterstock food** aesthetic, **néon** appétit, **emoji** géants en hero.  
- **Personnages** caricaturaux par âge ou origine.  
- **Surcharge** : une **scène** forte par hero, pas dix éléments.

### Livrables typiques

- Hero landing **desktop + mobile** (crop).  
- **Empty states** Discover / repas (légèreté).  
- **Favicon** / motif répétable optionnel (grain + ligne).

---

## 4. Contre-pied au nom — confiance **toutes générations**

Le nom **oral, jeune, argot** peut **exclure** une partie des **seniors** au premier abord. Le design **compense** par :

| Levier | Action |
|--------|--------|
| **Sobriété premium** | Beaucoup d’air, grille stable, pas de « fun » visuel agressif. |
| **Typo** | Corps **≥ 16 px** équivalent, interlignage généreux ; **display** réservé aux titres. |
| **Contraste** | AA minimum ; boutons et liens **non** uniquement couleur. |
| **Vocabulaire UI** | CTA clairs : *Proposer un repas*, *Voir les profils* — pas que du jargon. |
| **Illustration** | **Intemporelle** (ligne, lumière) plutôt que **tendance** TikTok 6 mois. |
| **Motion** | Discret ; respect **réduction de mouvement**. |

**Phrase interne** : *« Le nom invite à la proximité ; le visuel garantit le sérieux du cadre. »*

---

## 5. Check-list « commande agence » (avant prod)

- [ ] Moodboard validé (3 directions max) — **1** retenue.  
- [ ] Grille **8 pt** ou **4 pt** documentée.  
- [ ] Palette **figée** avec tokens `ptg-*` + états hover/disabled.  
- [ ] Export **SVG** propre (pas400 nœuds inutiles).  
- [ ] Test **contraste** + **zoom 200 %** + **VoiceOver** sur écran clé.  
- [ ] **Reduced motion** testé.

---

## 6. Liens internes

- **`DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md`** — référence maîtresse (couleurs, typo, motion, icono).  
- **`IDENTITE_VISUELLE_COMPLETE.md`** — scène et identité.  
- **`DESIGN_SYSTEM.md`** — implémentation.  
- **`MARKETING_OFFICIEL.md`** — ton verbal vs ton visuel.

---

*v1 — document de travail ; enrichir avec références concrètes au fil des livraisons freelances.*
