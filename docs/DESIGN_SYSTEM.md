# Design system — Paye ta graille

Référence **canonique** pour une UI cohérente, scalable et reconnaissable.  
**Source de vérité** : `src/app/ptg-tokens.css` + `src/app/globals.css`. Ce document décrit les règles ; le code impose les contraintes.

---

## 1. Identité & signature

| Élément | Rôle |
|--------|------|
| **Traits culinaires** | Silhouettes au trait fin (`PtgLandingDecor.tsx`), couleur `--ptg-sketch-ink` — présence sans photo, sans surcharge. |
| **Ligne accent** | `--ptg-accent-rule-gradient` + classes `.ptg-accent-rule`, `ptg-section-heading--signature` — « coup de pinceau » sous les titres, même gradient partout. |
| **Fond** | Crème + grain papier + motif traits (`--ptg-sketch-motif`) — chaleur maîtrisée, pas « illustration app ». |
| **Ton** | Premium accessible : chaud, humain, jamais agressif. |

**Règle d’or** : nouvel écran = réutiliser ces primitives avant d’ajouter du style inline ou une nouvelle couleur hors tokens.

---

## 2. Fichiers source

| Fichier | Rôle |
|---------|------|
| `src/app/ptg-tokens.css` | Couleurs (niveaux 0→4), espacements, rayons, ombres, typo scale, interlignes, z-index, boutons, gradients signature, textures. |
| `src/app/globals.css` | Composants : surfaces, boutons, typographie, nav, formulaires, cartes, listes profil, animations. |
| `src/components/PtgLandingDecor.tsx` | Décor SVG signature (landing + `PtgAppFlow` subtle). |
| `src/app/layout.tsx` | **Inter** (corps), **Fraunces** (titres / display) via variables CSS. |

---

## 3. Palette

### Niveau 0 — Atmosphère
- `--ptg-bg`, `--ptg-sand`, `--ptg-butter`, `--ptg-apricot-wash`, `--ptg-muted`

### Niveau 1 — Surfaces
- `--ptg-surface`, `--ptg-bg-elevated`, bordures `--ptg-line`, `--ptg-line-subtle`

### Niveau 2 — Texte
- `--ptg-text`, `--ptg-text-muted`, `--ptg-ink-display` (titres)

### Niveau 3 — Accent & CTA
- `--ptg-accent`, `--ptg-accent-deep`, `--ptg-accent-muted`, `--ptg-accent-glow`

### Niveau 4 — Sémantique produit
- Succès : `--ptg-success` / `--ptg-olive`
- Surprise / chaleur secondaire : `--ptg-rose-dish`, `--ptg-emotion-surprise`
- Attention / erreur : `--ptg-danger`
- Info : `--ptg-info`

### Secondaire (équilibre)
- `--ptg-secondary-sage`, `--ptg-secondary-dusty-rose`, `--ptg-secondary-warm-gray` — rôles complémentaires sans nouvelles teintes « au hasard ».

Les alias `--ptg-color-*` et `--ptg-emotion-*` servent aux thèmes futurs et au copy UX.

---

## 4. Typographie

| Token / classe | Usage |
|----------------|--------|
| `--ptg-font-sans` (Inter) | Corps, labels, boutons |
| `--ptg-font-display` (Fraunces) | Display, titres carte, section headings |
| `.ptg-type-display` | H1 écrans app / hero (clamp via `--ptg-text-display-*`) |
| `.ptg-type-display--hero` | Gradient sur la home marketing |
| `.ptg-type-title` | H2 logique (sections courtes) |
| `.ptg-section-heading` | Titres de bloc ; `--signature` = ligne accent dessous |
| `.ptg-card-title` | Titre dans une carte |
| `.ptg-type-kicker` | Surtitre accent |
| `.ptg-type-body` | Paragraphe standard (`--ptg-leading-body`) |
| `--ptg-text-2xs` → `--ptg-text-xl` | Échelle complète dans `ptg-tokens.css` : micro-label (`2xs`), caption (`xs`), dense (`sm`), UI14px (`ui-sm`), pont 15px (`md-sm`), corps (`base`), titres intermédiaires (`md` … `xl`) |
| `.ptg-font-2xs` … `.ptg-font-md` | Utilitaires `font-size` (fin de `globals.css`) — composer avec les classes typo sémantiques ; en inline React, préférer `fontSize: "var(--ptg-text-…)"` |
| `--ptg-btn-font-size-sm` | Alias de `--ptg-text-md-sm` (CTA secondaires, ghost) |
| `.ptg-type-label` | Labels formulaires |
| `.ptg-type-prose-h2` | Titres dans articles longs (légal, docs) — sous le H1 page |
| `.ptg-page-head`, `.ptg-page-head__eyebrow`, `.ptg-wizard-meta` | En-têtes de page / étapes |

Poids : `--ptg-font-weight-*` (400 → 700).  
Interlignes : `--ptg-leading-tight` … `--ptg-leading-relaxed`.

---

## 5. Espacements & layout

- Échelle **4px** : `--ptg-space-1` … `--ptg-space-10`
- Colonnes : `--ptg-content-max` (28rem), `--ptg-content-wide`
- Rythme vertical : `.ptg-stack`, `.ptg-prose` / `.ptg-prose-wide`
- Modificateurs de gap (à composer **avec** `.ptg-stack`) : `.ptg-stack--tight` (~0,75rem), `.ptg-stack--dense` (~0,65rem), `.ptg-stack--compact` (~0,5rem), `.ptg-stack--roomy` (~0,85rem)

---

## 6. Composants UI (catalogue)

### Boutons
| Classe | Usage |
|--------|--------|
| `.ptg-btn-primary` | Action principale (min `--ptg-btn-height-lg`) |
| `.ptg-btn-primary--compact` | Barres d’actions dans cartes |
| `.ptg-btn-secondary` | Action secondaire outline |
| `.ptg-btn-secondary--compact` | Paire avec primary compact |
| `.ptg-btn-ghost` | Tertiaire, lien discret |

Liens : `a.ptg-btn-primary` sans soulignement.

### Surfaces & cartes
| Classe | Usage |
|--------|--------|
| `.ptg-surface` | Carte / bloc par défaut (hover bordure sauf si static) |
| `.ptg-surface--static` | Listes denses, formulaires — pas de hover structurel |
| `.ptg-surface-pad` / `ptg-surface-pad-lg` | Padding standard |
| `.ptg-surface` + `.ptg-card` / `--lg` / `--compact` | Padding carte nommé (`1rem` / `1.25rem` / `0.75rem`) — **toujours** avec `.ptg-surface` |
| `.ptg-surface` + `.ptg-card--xl` | Padding large (états vides, blocs d’emphase) |
| `.ptg-surface` + `.ptg-card--inset` | Bandeau / ligne dense : padding vertical `--ptg-space-3`, horizontal `--ptg-space-4` |
| `.ptg-scene-card` | Coin « assiette » décoratif léger |
| `.ptg-ritual-card`, `.ptg-surface.ptg-surprise-card` | Variantes émotionnelles |

### Carte menu (`PtgMenuCard`)
| Élément | Rôle |
|--------|------|
| `src/components/PtgMenuCard.tsx` | Enveloppe **`.ptg-page-head`** sur les parcours app : bordure dégradée, encoche, tampon optionnel, glyphe SVG par variante. |
| `globals.css` `.ptg-menu-card`, `.ptg-menu-card--*` | **Variantes** (tokens uniquement) : `ember`, `apricot`, `sage`, `kin`, `ledger`, `spark`, `mist`, `pin`. |
| Hors périmètre | **À propos** : livret dédié (`AProposClient` / `.ptg-about-livret*`) — ne pas fusionner sans refonte copy. |

**Règle** : nouvel écran avec intro type « menu » → une variante existante + tampon court ; nouvelle teinte seulement si aucune variante ne convient.

### Listes & profils
| Classe | Usage |
|--------|--------|
| `.ptg-profile-list` | Liste verticale profils (découvrir) |
| `.ptg-profile-card` | Item interactif (lift au survol) |
| `.ptg-profile-row` + `.ptg-profile-row__main` | Ligne avatar + contenu |
| `.ptg-list-vertical` / `--loose` | Stacks génériques |
| `.ptg-list-plain` | Liste sans puce, colonne flex + gap `--ptg-space-3` |
| `.ptg-list-plain--tight` / `--snug` | Gaps plus serrés (suggestions lieu, cartes repas) |
| `.ptg-list-plain--scroll-md` | Liste courte scrollable (`max-height` ~240px) |
| `.ptg-prose-list` | `ul` / `ol` à puces dans blocs texte (légal, modules, récap) |
| `.ptg-prose-list--sm` / `--xs` / `--md` | Tailles de texte alignées sur l’échelle typo |

### Navigation & filtres
- `.ptg-nav`, `.ptg-nav-link`, `.ptg-nav-link--active` (soulignement gradient)
- `.ptg-filter-chip`, `.ptg-filter-chip--active`
- `.ptg-chip` (sélection multiple)

### Formulaires
- `.ptg-form-panel`, `.ptg-field`, `.ptg-label`, `.ptg-input`, `.ptg-choice*`
- `.ptg-link-back`

### Feedback
- `.ptg-banner`, `.ptg-banner-warn`, `.ptg-reward-banner`

### Marketing
- `.ptg-hero-*`, `.ptg-kicker-pill`, `.ptg-landing-decor`, `.ptg-accent-rule` — sur l’accueil, le pill « Paye ta graille » (`.ptg-kicker-pill--hero`) est un **lien** vers `/a-propos` (`a.ptg-kicker-pill--link`, pas de clignotement).
- **Liste profils** : route `/decouvrir` (URL sans accent) ; tampon carte « Autour de toi » ; entrée nav **Rencontres**. Dans les phrases en français, utiliser **Découvrir** (accent), pas `Decouvrir`.

---

## 7. Hiérarchie visuelle (ordre de scan)

1. **Display / H1** + ligne accent si bloc d’intro  
2. **Surtitre** (kicker / eyebrow) quand il cadre la page  
3. **CTA primaire** — une seule action dominante par écran si possible  
4. **Cartes** — contenu groupé ; titres en `.ptg-card-title` ou `.ptg-section-heading`  
5. **Texte secondaire** — `.ptg-type-body`, métadonnées plus petites via `--ptg-text-sm` / `xs`

---

## 8. Micro-interactions

- Durées : `--ptg-duration`, `--ptg-duration-slow` ; easings `--ptg-ease-out`, `--ptg-ease-spring`
- Surfaces interactives : ombre + bordure + léger `translate` (cartes profil, hero card)
- `.ptg-accent-rule` : animation `ptg-brush-shimmer` légère
- Chips / nav : `scale` à l’active
- **`prefers-reduced-motion: reduce`** : animations décor et transitions boutons désactivées ou neutralisées

---

## 9. Z-index

Utiliser `--ptg-z-behind`, `--ptg-z-base`, `--ptg-z-raised`, `--ptg-z-sticky`, `--ptg-z-skip` pour éviter les empilements opaques.

---

## 10. Accessibilité

- Focus : `outline` général ; boutons / chips : `--ptg-shadow-focus`
- Zones tactiles : respecter `--ptg-btn-height-*` (min ~44px recommandé)
- Décor : `aria-hidden` sur les SVG non porteurs de sens

---

## 11. Évolution (process)

1. **Nouveau besoin couleur** → token dans `ptg-tokens.css`, puis `var(--ptg-…)`.
2. **Nouveau motif récurrent** → classe dans `globals.css` + une ligne ici.
3. **Éviter** : hex / `rgb` inline dans les composants React.
4. **Éviter** : deux styles différents pour le même type de bloc (ex. deux cartes sans `ptg-surface`).

---

## 12. Résumé une phrase

> Une colonne chaude, une typo display humaine, une ligne accent partagée, des cartes `ptg-surface`, des CTA typés — et des traits culinaires discrets pour signer sans encombrer.
