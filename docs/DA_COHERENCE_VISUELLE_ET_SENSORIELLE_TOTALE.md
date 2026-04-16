# Paye ta graille — Cohérence visuelle & sensorielle totale (v1)

**Niveau cible** : direction artistique **agence premium internationale** · UI/UX senior · perception & psychologie de la couleur · motion · architecture d’expérience digitale.

**Promesse d’expérience** : **chaleureuse**, **élégante**, **immersive** (au sens **douce**, pas « spectacle assourdissant »), **humaine**, **universelle** (toutes générations, toutes sensibilités visuelles raisonnables).

**Règle absolue (gating)** : chaque élément visuel ou sensoriel doit répondre oui à :

> *« Est-ce que cela renforce l’expérience humaine et émotionnelle ? »*

Sinon → **supprimer** ou **simplifier**.

**Documents liés** : `IDENTITE_VISUELLE_COMPLETE.md` (scène, illustration, photo) · `DESIGN_SYSTEM.md` (composants, grille, implémentation : **à aligner** sur les hex ci-dessous) · `CREATIVE_DIRECTION_VISUAL.md` · `PROMPT_COHERENCE_VISUELLE_ET_SENSORIELLE.md` · **`DA_BRIEF_RECHERCHE_MULTIMETIERS_ILLUSTRATION.md`** (carte disciplines, ressources, brief illustrateur, contre-pied au nom).

---

## 1) Univers visuel global

### Style graphique

- **Position** : **minimal premium** + **semi-illustré** pour le marketing et les états vides ; **abstrait gustatif** pour évoquer la nourriture **sans** la montrer.
- **Langage formel** : courbes longues, surfaces calmes, **beaucoup d’air**, hiérarchie nette. Pas de « collage startup » ni de kitsch culinaire.

### Niveau de réalisme

- **Jamais** photoréalisme alimentaire ni **stock food** (burger, pizza, cliché delivery).
- **Réalisme humain** acceptable : **textures** (papier, grain léger), **lumière** crédible, **silhouettes** (pas de traits faciaux stéréotypés).
- **Niveau 0–1** sur une échelle « glossy 3D appétit » : on reste **bas**, volontairement **éditorial**.

### Identité émotionnelle (en trois mots internes)

**Accueil · anticipation · lien.**  
Pas excitation casino, pas cynisme froid. Le produit dit : *tu es attendu·e à une vraie table*, pas *accroche-toi à l’écran*.

---

## 2) Colorimétrie

### Philosophie (perception & psychologie)

- **Température** dominante **chaude** (crème, taupe, ambre) : associactions culturelles au **foyer**, au **partage**, au **soir**.
- **Saturation** : contenue sur les grandes surfaces ; les **accents** portent l’énergie sans **crier** (évite l’orange pur écran « promo »).
- **Vert** : **sage**, **olive**, jamais néon « validation startup ».
- **Rouge** : réservé au **sens critique** (danger, signalement), dosé.

Les couleurs évoquent la **chaleur humaine** et le **partage** ; la **nourriture** passe par des **nuances terre / ambre / rose terre cuite** en **petites touches**, jamais en cliché figuratif.

### Couleurs principales (structurelles)

| Rôle | Token | Hex | Usage |
|------|-------|-----|--------|
| Fond global | `ptg-bg` | `#F6F1E8` | toile de fond app & landing |
| Surface élevée | `ptg-bg-elevated` | `#FAF6EF` | sections alternées |
| Carte / modale | `ptg-surface` | `#FFFFFF` | contenants lisibles |
| Texte principal | `ptg-text` | `#1A1714` | corps, titres UI |
| CTA / lien fort | `ptg-accent` | `#D56E2A` | action primaire, emphase modérée |

### Couleurs secondaires (support & structure)

| Rôle | Token | Hex | Usage |
|------|-------|-----|--------|
| Secondaire / divider | `ptg-muted` | `#E4D9CA` | séparateurs, zones repos |
| Ligne / contour doux | `ptg-line` | `#C9BCAD` | bordures, traits illustration |
| Texte atténué | `ptg-text-muted` | `#5E564C` | sous-titres, méta |
| Profondeur / hover | `ptg-accent-deep` | `#9A4528` | survol, pressed (vérifier contraste) |

### Couleurs « émotionnelles » (sémantique produit)

Ce ne sont pas de nouvelles teintes obligatoires : ce sont des **rôles** assignés au système existant pour garder la **cohérence**.

| Moment produit | Intention émotionnelle | Tokens à mobiliser | Règle |
|----------------|------------------------|----------------------|--------|
| **Accueil** | calme, confiance, « chez soi » | `ptg-bg`, `ptg-surface`, `ptg-text` | peu ou pas d’accent sur le premier écran si inutile |
| **Rencontre** (exploration, profils) | curiosité **douce**, chaleur sociale | `ptg-line`, `ptg-accent` **très** parcimonieux, illustrations silhouettes | pas de rouge, pas saturation max |
| **Succès** (confirmation, repas OK) | soulagement, validation | `ptg-success` `#5A7A5E` | animation **lente**, pas confettis agressifs |
| **Surprise** (table surprise, reveal) | émerveillement **contrôlé** | `ptg-rose-dish` `#B85C4E` en **petite surface** + lumière en dégradé | jamais stroboscope, jamais teinte criarde sur tout l’écran |
| **Attention / erreur** | gravité sans panique | `ptg-danger` `#A33A32` | texte d’erreur **clair** + action corrective |

### Contrastes & accessibilité (lisibilité « parfaite » = exigence process)

- **WCAG 2.x** : cible **AA** minimum sur tout texte courant ; **AAA** souhaitable sur combinaisons critiques (ex. petits labels).
- **Texte sur `ptg-accent`** : si contraste insuffisant avec blanc, utiliser **bouton plein** + pictogramme, ou texte **très sombre** sur bouton outline, ou ajuster la teinte (documenter le choix dans le design system code).
- **Ne jamais** seuls la couleur pour l’état : **icône**, **texte**, ou **pattern** en plus.
- **Daltonisme** : valider les paires **succès / danger / accent** avec simulateur ; éviter le vert/rouge comme seule paire d’opposition sur un même widget.

### Dégradé hero (sensoriel, cohérent marque)

`linear-gradient(165deg, #F6F1E8 0%, #EDE4D7 45%, #E8DCC8 100%)` + **vignette** légère si besoin de focus central.  
**Interdit** : arc-en-ciel, mesh néon, multicolore « pitch deck 2019 ».

---

## 3) Typographie

### Style principal (UI & corps)

- **Inter** ou **Source Sans 3** : **moderne**, **lisible**, **neutre chaleureux** (pas géométrique froid).
- **Corps** : interlignage **1.5** ; longueurs de ligne raisonnables ; pas de blocs illisibles sur mobile.

### Style secondaire (accent émotionnel)

- **Fraunces** (soft) ou **Source Serif 4** : **display** landing et grands titres **ponctuels** (héros, sections éditoriales).
- **Règle** : une **seule** famille display dans tout le produit. Pas mélange Poppins + Fraunces + autre sans raison documentée.

### Hiérarchie (mobile, `rem`)

| Niveau | Taille indicative | Usage |
|--------|-------------------|--------|
| Display | 2.25–2.75 rem | hero rare |
| H2 | ~1.5 rem | sections |
| H3 | ~1.125 rem | sous-sections |
| Corps | 1 rem | lecture |
| Caption | 0.8125 rem | méta, légendes |

### Interdits typo

- **Surcharge** : pas de 4 graisses différentes sur un même écran sans système.
- **Gadgets** : pas d’outline arc-en-ciel, pas de texte en perspective 3D, pas de néon sur corps.
- **CAPS** longs : interdits pour des phrases ; réservé à micro-labels si besoin.

---

## 4) Iconographie

- **Stroke** 1.75–2 px, **coins arrondis**, grille **24 px** (déclinaison **20 px** dense).
- **Métaphores** : table, **partage** (cercle, couverts abstraits), **temps** (calendrier minimal), **lieu** (épingle douce). **Pas** d’icônes nourriture littérales.
- **Cohérence** : **une** famille (ex. Lucide retravaillé ou set dédié). Jamais mélange Material + Fluent + custom au hasard.
- **États** : outline par défaut ; remplissage **léger** (`ptg-accent` ~12 % opacité) pour actif ; danger **uniquement** signalement / destruction.
- **Surcharge** : max **1** icône + texte par ligne d’action principale ; pas d’icônes dans chaque mot du paragraphe.

---

## 5) Univers sensoriel (au-delà du plat)

### Ce que l’on veut « ressentir »

- **Convivialité de table** : compositions **centrées**, **espace** autour des sujets, lumière **basse** et **chaude**.
- **Chaleur du partagé** : **tons crème**, touches **ambre / terre cuite** rares, **grain** papier ou toile léger sur illustrations.
- **Spontanéité de la rencontre** : **motion** qui **respire** (entrées en fondu court, léger décalage des couches), pas de wiggle permanent.

### Canaux

| Canal | Direction | Limite |
|-------|-----------|--------|
| **Vue** | lumière, profondeur 2–3 plans, grain optionnel | pas de busy pattern sous le texte |
| **Toucher** | zones **≥ 44 px**, retour haptique **discret** | pas de vibration en boucle |
| **Motion** | voir §6 | `prefers-reduced-motion` = alternative instantanée ou fondu minimal |
| **Son** (phase 2) | « restaurant calme », filtres doux, opt-in | jamais autoplay sans action |

### Immersion

- **Oui** : immersion par **atmosphère** (lumière, silence graphique, temporalité du repas).
- **Non** : immersion par **surcharge** sensorielle (particules partout, sons à chaque scroll).

---

## 6) Motion design

### Principes

- **Fluide** : courbes type **ease-out** sur entrées ; éviter linear brutal sur UI émotionnelle.
- **Léger** : durées typiques **200–400 ms** ; micro-feedback tap **court** (ex. scale 0.98 → 1).
- **Jamais agressif** : pas de shake, pas de flash, pas de parallax extrême sur texte critique.
- **Naturel** : une **seule** animation « héro » par transition d’écran ; le reste **supporte** la compréhension.

### Chographie recommandée

| Événement | Motion | Durée indicative |
|-----------|--------|------------------|
| Navigation | fondu + léger déplacement vertical **4–8 px** | 220–280 ms |
| Match / succès | pulse **très** léger ou **glow** soft sur carte | 300–500 ms |
| Modale | scale 0.96 → 1 + opacity | 200–260 ms |
| Liste | stagger **court** (30–50 ms entre items), **max** 5 items | total plafonné |

### Accessibilité

- Respect strict de **`prefers-reduced-motion`** : désactiver stagger, parallax, auto-play décoratif.

---

## 7) Synthèse « reconnaissance immédiate »

Trois **signaux** visuels non négociables :

1. **Table + silhouettes + lumière chaude** (système illustration / hero).  
2. **Palette crème–taupe–ambre** maîtrisée (pas food neon).  
3. **Display serif chaleureux** + **sans UI sobre** sur mobile.

---

## 8) Alignement implémentation

- **Hex canon** : ce document et `IDENTITE_VISUELLE_COMPLETE.md` sont la **référence unique**.  
- **`src/app/globals.css`** : tokens `--ptg-*` + alias `--ptg-emotion-*` (accueil, rencontre, succès, surprise, attention).  
- **`DESIGN_SYSTEM.md`** : tableau palette synchronisé avec le code.

---

## 9) Check-list livraison (DA + UX)

- [ ] Chaque écran passe le **gating** « renforce l’humain ? »  
- [ ] Audit **contraste** exporté (rapport PDF ou lien outil).  
- [ ] Illustrations : **0** cliché alimentaire direct.  
- [ ] Motion : scénario **reduced motion** testé sur device.  
- [ ] Icon set : **une** famille, états complets.

---

*v1 — figer après revue créative interne + test lecture multi-âges.*
