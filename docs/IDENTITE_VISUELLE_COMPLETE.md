# Paye ta graille — Identité visuelle complète (v1)

**Équipe cible** : DA · illustration · UX/UI · espace & matière · sensoriel · psychologie visuelle.  
**Objectif** : identité **intemporelle**, **élégante**, **émotionnelle**, **universelle** (toutes générations).

**Contrainte d’or** : **ne jamais** montrer la nourriture en **cliché** (burger/pizza stock) — **toujours suggérer** (formes, lumière, texture, table). L’app ne « montre » pas la nourriture : elle fait **ressentir** l’expérience de **manger ensemble**.

**Nom × design** : le nom peut être **brut** ; le design est **noble** — *« Le design doit donner envie de rester à table. »*

**Synthèse DA « agence » (univers, colorimétrie émotionnelle, motion, gating)** : `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md`.

**Documents liés** : `DESIGN_SYSTEM.md` (tokens techniques app) · `CREATIVE_DIRECTION_VISUAL.md` (landing « table vivante ») · `BRAND_BOOK.md` (narratif marque).

---

## 1) Scène signature — **visuel principal**

**Une composition** (hero + key visual système) :

- **Table** stylisée : vue **légèrement plongeante** ou perspective **douce** (pas fisheye, pas 3D cheap).  
- **4–6 silhouettes** : assises, **gestes** de partage (bras tendu, verre levé abstrait), **sans visages** ni détails ethniques lisibles — **universel**.  
- **Lumière chaude** : une **source** (lampe suspendue abstraite ou soleil de fin de journée **suggéré** par dégradé).  
- **Formes organiques** sur/near table : **courbes** (pain), **ellipses** (assiettes), **taches douces** (sauce / couleur), **grain** (papier/toile) — **rien de photoréaliste**.

**Émotion visée** : *« on est déjà à table »* — calme, anticipation, lien.

---

## 2) Palette couleurs (système unifié app + marketing)

### Fonds & surfaces
| Token | Hex | Usage |
|-------|-----|--------|
| `ptg-bg` | `#F6F1E8` | fond global (crème chaud, légèrement plus « éditorial » que blanc) |
| `ptg-bg-elevated` | `#FAF6EF` | sections alternées |
| `ptg-surface` | `#FFFFFF` | cartes (blanc **légèrement cassé** acceptable) |
| `ptg-muted` | `#E4D9CA` | séparateurs, zones secondaires |
| `ptg-line` | `#C9BCAD` | traits illustration, bordures discrètes |

### Texte
| Token | Hex |
|-------|-----|
| `ptg-text` | `#1A1714` |
| `ptg-text-muted` | `#5E564C` |

### Accents (chaleur / appétit **suggéré**, pas « sauce ketchup »)
| Token | Hex | Usage |
|-------|-----|--------|
| `ptg-accent` | `#D56E2A` | CTA primaire, liens forts |
| `ptg-accent-deep` | `#9A4528` | hover / profondeur (avec contraste vérifié) |
| `ptg-rose-dish` | `#B85C4E` | rare : chaleur « tomate / terre cuite », touches illustration |

### Validation & nature
| Token | Hex | Usage |
|-------|-----|--------|
| `ptg-success` | `#5A7A5E` | succès (olive doux, pas vert néon) |
| `ptg-danger` | `#A33A32` | destruction / signalement (sobre) |

### Dégradés (sensoriel)
- **Hero** : `linear-gradient(165deg, #F6F1E8 0%, #EDE4D7 45%, #E8DCC8 100%)` + **vignette** légère sur bords (focus centre table).  
- **Jamais** : dégradé arc-en-ciel saturé type startup 2019.

**Contraste** : valider **AA** sur tout texte < 18px ; CTA **plein** + texte blanc si accent saturé — sinon texte `#1A1714` sur bouton **outline**.

---

## 3) Typographie

| Rôle | Police | Usage |
|------|--------|--------|
| **Display / marque** | **Fraunces** (soft) ou **Source Serif 4** | H1 landing, grands titres marketing |
| **UI / corps** | **Inter** ou **Source Sans 3** | app entière, corps landing |
| **Chiffres / métadonnées** | **Tabular nums** on pour heures, prix | |

**Échelle** (mobile, `rem`)  
- Display : **2.25–2.75rem** · H2 : **1.5rem** · H3 : **1.125rem** · Corps : **1rem** · Caption : **0.8125rem**

**Règles** : interlignage corps **1.5** ; **pas** de titres en **CAPS** longs ; **tracking** léger sur display seulement.

---

## 4) Style illustration (système)

**Technique** : vector **doux** (courbes Bézier longues) **ou** raster peint (texture **grain 3–6%**), **pas** flat icon géant seul sur hero.

**Ligne** : **sans contour noir dur** ; bords **colorés** dans la famille taupe / brun chaud.

**Profondeur** : **2–3 couches** max (fond dégradé → table → silhouettes + formes).

**Palette illustration** : strictement **tokens** ci-dessus + **2 touches** optionnelles par scène (ex. reflet **ambre** sur verre abstrait).

**Interdits** : emojis comme substitut d’illustration ; **clipart** ; **mains** hyper détaillées ; nourriture **lisible**.

**Scènes déclinables** (bibliothèque) :  
1. Hero « table vivante » · 2. Empty state « table vide, une chaise de plus » · 3. Match « deux silhouettes + lumière » · 4. Table surprise « formes + point d’interrogation doux » · 5. Repas confirmé « vibration chaleureuse minimal ».

---

## 5) Système d’icônes

**Style** : **stroke 1.75–2px**, coins **arrondis**, grille **24px**, optique **alignée** (pas mathématique froide).

**Métaphore** : **couverts abstraits**, **cercle partagé**, **calendrier minimal**, **épingle** — **pas** burger, pizza, hot-dog.

**États** : outline par défaut ; **rempli** léger (`ptg-accent` à 12% opacité) pour actif ; **danger** seulement signalement.

**Jeu** : idéalement **une** famille (Lucide customisé ou set dédié) — **pas** mélange Material + Fluent.

---

## 6) Ambiance générale (sensorielle + psychologie visuelle)

| Dimension | Choix |
|-----------|--------|
| **Lumière** | chaude, **basse** (soir), jamais néon froid |
| **Texture** | papier / toile / grain léger — **humanise** le digital |
| **Densité** | **beaucoup d’air** ; peur du vide = combler par **lumière**, pas par widgets |
| **Mouvement** | lent, **easing** doux ; respect `prefers-reduced-motion` |
| **Son** (phase 2) | optionnel, chaleur feutrée — voir `DESIGN_SYSTEM.md` |

**Émotion prioritaire** : **soulagement + appartenance** — pas excitation cheap.

---

## 7) Direction photo (quand la photo existe)

**Usage** : **preuve humaine** (témoignages), **partenaires resto** — **pas** hero générique « gens qui mangent ».

**Règles** :  
- lumière **naturelle** ou **restaurant** réelle ; **pas** flash direct.  
- **dos / profil** ou **flou** consenti ; diversité **réelle**, pas tokenisme.  
- **jamais** assiette héros burger ; si plat visible = **abstrait** (flou mouvement, gros plan matière).

**Traitement** : alignement **couleur** avec LUT chaude proche des tokens ; **pas** saturation Instagram.

---

## 8) Règles de composition (anti-surcharge, anti-cheap)

1. **Max 1** illustration héro par viewport ; le reste = **typo + respiration**.  
2. **Pas** de 8 ombres + 5 dégradés + 12 badges.  
3. **Pas** de glassmorphism **+** néon **+** illustration **+** photo sur un même bloc.  
4. **Hiérarchie** : 1 idée visuelle / écran marketing ; 1 CTA primaire.

---

## 9) Reconnaissance & intemporalité

**Signes distinctifs** (à répéter partout) :  
- **Table + silhouettes + lumière chaude**  
- **Formes organiques** non littérales  
- **Typo display serif** chaleureuse + **sans** UI sobre

**Éviter** le style « app food 2016 » : vert flashy, photos stock sourire, icônes 3D bonbons.

---

## 10) Mise à jour des autres fichiers

- **`DESIGN_SYSTEM.md`** : peut **converger** vers les hex `ptg-*` de ce document (remplacer anciens si besoin lors implémentation).  
- **`CREATIVE_DIRECTION_VISUAL.md`** : scène hero = **identique** à §1 ici (une seule vérité).

---

## 11) Check-list livraison design

- [ ] Tokens Figma = tokens code  
- [ ] Illustration hero **export** (SVG/PNG 2×) + **dark** optionnel plus tard  
- [ ] Set icônes 24/20px + états  
- [ ] 5 illustrations **empty / état**  
- [ ] Audit **contraste** + **focus** clavier  
- [ ] Guide **photo** 1 page pour partenaires / UGC

---

*v1 — figer après revue DA + test lecture 5 personnes (20–70 ans).*
