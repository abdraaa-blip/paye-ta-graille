# Paye ta graille — Direction créative & landing (expérience « gustative » sans cliché)

**Identité visuelle complète (palette, typo, icônes, photo, règles)** : **`IDENTITE_VISUELLE_COMPLETE.md`** — **source de vérité** visuelle v1.

**Mission** : faire **ressentir** manger ensemble — **sans** photo burger « stock », **sans** clipart — avec une esthétique **intemporelle** et **inclusive** (y compris **seniors** : le design compense un nom très « jeune / street » si besoin).

**Principe** : **le nom peut être brut** ; **l’image est irréprochable** — chaleur, lumière, silence graphique, **table comme lieu universel**.

**Synthèse d’élite (stratégie marque)** : le design **compense**, **sublime** et **transcende** le nom — comme les grandes marques intemporelles : un nom franc, porté par une esthétique **noble**.

**Phrase de boussole** : *« Le design doit donner envie de rester à table. »*

**Vision coalition (métaphore de travail)** : une même scène pensée comme si **peintre classique**, **DA d’agence**, **designer Apple** (clarté, respiration), **street artist** (énergie **maîtrisée** — pas graffiti sur le hero principal), **architecte d’intérieur** (lumière, matière), **chef étoilé** (composition **abstraite**), **psychologue visuel** (calme, confiance) collaboraient — **sans** mélange décoratif sans hiérarchie.

**Alignement tokens** : **`IDENTITE_VISUELLE_COMPLETE.md`** §2 · **`DESIGN_SYSTEM.md`** · implémentation **`src/app/globals.css`** (vérité code).

---

## 1) Concept central — **« La table vivante »**

**Une seule image mentale** : une **table** (vue du dessus ou perspective douce), **silhouettes** sans visages, **formes organiques** qui **suggèrent** nourriture sans la montrer :

| Suggestion (abstrait) | Éviter (littéral) |
|----------------------|-------------------|
| Courbe chaude = **pain / partage** | baguette photoréaliste |
| Cercles = **assiettes / convivialité** | pizza vue du dessus cliché |
| Taches douces = **sauce / chaleur** | splash ketchup comique |
| Grains / fibres = **matière** | photo plat Instagram |

**Règle d’or** : si ça ressemble à **Shutterstock « food friends »**, on **jette**.

---

## 2) Style visuel — signature (synthèse multi-métiers)

Penser comme une **rencontre** entre : **DA magazine premium** + **illustration éditoriale** + **architecture d’intérieur** (matériaux, lumière) + **chef** (composition d’assiette **abstraite**) + **psychologie visuelle** (sécurité, calme) — **pas** mélange décoratif sans hiérarchie.

**Qualités visibles** :
- **Illustration semi-abstraite** (vector doux ou raster peint, **pas** flat cheap).  
- **Silhouettes** : 3–5 personnages, **postures** naturelles (assis, bras sur table), **légère flou** optionnel sur bords (chaleur, pas « erreur »).  
- **Lignes fluides** : tables ovales, nappes en courbe, **pas** grille rigide type SaaS 2018.  
- **Minimalisme haut de gamme** : beaucoup d’**air**, peu d’objets — chaque forme **porte du sens**.

**Inspirations (références de culture design — à adapter, pas copier)** :
- **Éditorial** : *Monocle*, *Cereal* (lumière, voyage, calme).  
- **Gastronomie abstraite** : couvertures **Osteria** / guides **Michelin** (élégance, **pas** le plat en héros).  
- **Fresques contemporaines** maîtrisées (formes organiques, **pas** lettrage graffiti agressif sur la landing principale).  
- **Impressionnisme** (lumière chaude, touches de couleur **hors** contour dur) — en **micro-texture** ou **fond**, pas pastiche.

---

## 3) Contre-pied au nom (inclusion intergénérations)

| Risque « nom » | Réponse design |
|------------------|----------------|
| « Trop jeune / argot » | typo **lisible**, tailles **généreuses**, contrastes **AA** |
| « Pas pour moi » | **aucune** posture « fête » caricaturale ; **scènes calmes** |
| « Tech froide » | matière **papier/toile**, grain léger, **pas** glassmorphism cheap |

**Hero** : peut être **100% illustration** + typographie — **pas** besoin de photo « jeunes qui rient ».

---

## 4) Palette émotionnelle (landing + app — harmoniser avec `DESIGN_SYSTEM`)

| Rôle | Hex (proposition landing) |
|------|---------------------------|
| Fond / lumière | `#F6F1E8` (crème), `#EDE4D7` (sable) |
| Surface | `#FFFFFF` à chaud (pas blanc clinique) |
| Texte | `#1A1714` |
| Accent chaleur | `#D96B2B` (orange brûlé) — CTA |
| Accent profondeur | `#9B3B2E` (rouge tomate profond) — rare, liens |
| Nature / validation | `#5C7F61` (vert olive doux) |
| Ligne / illustration | `#C4B8A8` (taupe chaud) |

**Test** : CTA orange sur crème — valider **contraste** taille ≥16px.

---

## 5) Typographie (inclusivité + luxe calme)

- **Titres** : **Fraunces**, **Playfair Display**, ou **Source Serif 4** (chaleur éditoriale) — **un** serif display max.  
- **UI** : **Inter** ou **Source Sans 3** (lisibilité seniors + écrans).  
- **Échelle** : H1 hero **40–52px** mobile, interlignage **1.1–1.2** titres, **1.45–1.55** corps.

---

## 6) Structure de page (landing)

### Hero
- Visuel **« table vivante »** (illustration unique, loop **optionnelle** Lottie très lente).  
- H1 : **« Pas une app de rencontre. Une table. »** *(ou variante test)*  
- Sous : **« Repas réels entre humains. »**  
- CTA primaire **Télécharger** / secondaire **Voir comment ça marche**.

### Section 2 — **3 intentions** (visuellement iconiques)
- 3 cartes : **J’invite · On partage · Je me fais inviter** — **icônes abstraites** (couverts stylisés, partage de cercle), **pas** emoji géants cheap en seul signal.

### Section 3 — **Modes** (1v1 · groupe · Table surprise)
- **Silhouettes** + **légende courte** ; Table surprise en **carte distincte** « cadre d’abord ».

### Section 4 — **Émotion / preuve**
- **Témoignages** texte + **illustration** cohérente (pas forcément photo visages) ; **consentement** si photo.

### Section 5 — **Sécurité & simplicité**
- 4 icônes + phrases — rassure **sans** légalèse visible.

### Footer
- CGU, confidentialité, contact — **lisible**.

---

## 7) Motion & « fluidité »

- **Scroll** : parallax **très léger** (respect `prefers-reduced-motion`).  
- **Hero** : boucle **20–40 s** quasi imperceptible (vapeur chaude, reflet verre) — **opt-in** réduit motion.  
- **Micro-interactions** : hover cartes **2–4px** lift + ombre chaude.

---

## 8) Brief pour illustrateur·rice (ou générateur **contrôlé**)

**À fournir** :
- Moodboard mots + **3 refs visuelles** (droit OK).  
- Format : **SVG** ou **PNG 2×** ; safe zones mobile.  
- **Interdits** : visages reconnaissables sans droit ; nourriture photoréaliste ; stéréotypes culturels.

**Prompt type (Midjourney / etc.)** — à adapter, vérifier droits sortie :

> Editorial illustration, warm cream background, **top-down elegant dining table**, **abstract organic shapes** suggesting bread and plates, **faceless human silhouettes** seated, **soft golden light**, **no photorealistic food**, **no text**, **no logos**, minimalist premium magazine style, subtle paper grain, calm inclusive atmosphere — **not** cartoon, **not** stock photo.

*(Itérer : « more abstract », « fewer shapes », « older silhouettes optional » pour tests inclusion.)*

---

## 9) Accessibilité & « jamais vu » (sans exclure)

- **Contraste** AA minimum ; **focus** clavier visible ; **taille touch** 44px.  
- **« Jamais vu »** = **cohérence + matière + silence** — pas accumulation d’effets.  
- **Éviter** : auto-play son ; texte sur image sans contraste.

---

## 10) Cohérence avec l’app

- La **landing** est une **promesse** ; l’**app** doit **répéter** les mêmes matériaux (couleurs, arrondis, illustration **système** en empty states).  
- Fichier technique : étendre `DESIGN_SYSTEM.md` avec **composants marketing** (`HeroTableVivante`, `SectionIntentions`).

---

## 11) Prompt maître (Cursor / Figma / illus)

```text
[MISSION] Direction créative landing Paye ta graille — « La table vivante ».

[CONTRAINTES] Pas de food photoréaliste ; pas de clipart ; silhouettes sans visages ; palette crème + orange brûlé + olive ; serif display + sans UI ; hero illustration unique ; motion légère accessible ; contrepoint inclusif au nom street.

[LIVRABLES] (1) Moodboard texte + 5 refs type (2) Palette + typo (3) Wireframe landing sections (4) Composants Figma list (5) Brief illustrateur 200 mots (6) 2 prompts image abstraits (7) Check-list a11y

[ÉLÉVATION] 3 idées pour différenciation sans surcharger ; 3 erreurs à éviter absolument.
```

---

## 12) Prompt design ultime — identité visuelle « coalition » (à coller dans Cursor)

```text
Tu es une équipe composée de : directeurs artistiques, illustrateurs, peintres, designers UX/UI, architectes d’intérieur, designers sensoriels, psychologues visuels.

Mission : concevoir l’identité visuelle complète de "Paye ta graille".

Objectif : expérience visuelle intemporelle, élégante, émotionnelle, universelle (toutes générations).

Contrainte principale : ne jamais représenter la nourriture de manière cliché — toujours suggérer plutôt que montrer.

Style attendu : illustrations semi-abstraites, silhouettes humaines, formes organiques inspirées de la nourriture, ambiance chaleureuse.

Visuel principal : scène avec table stylisée, silhouettes en interaction, lumière chaude, composition artistique — concept "La table vivante".

À produire : palette couleurs, typographie, style illustration, système d’icônes, ambiance générale, direction photo.

Règles : pas de cliché visuel, pas de surcharge, pas de design cheap — priorité à l’émotion.

Objectif final : identité reconnaissable, mémorable, émotionnellement forte.

Contexte source de vérité : docs/IDENTITE_VISUELLE_COMPLETE.md, docs/CREATIVE_DIRECTION_VISUAL.md, docs/DESIGN_SYSTEM.md — ne pas contredire silhouettes sans visages, pas food stock, table comme lieu universel.
```

---

*v1 — produire assets réels avec illustrateur + audit contraste avant lancement.*
