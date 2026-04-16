# Paye ta graille — Audit produit global (v1)

**Portée** : documentation actuelle du dossier `paye-ta-graille` (vision, UX, design, social, business, sécurité, scalabilité). **Pas** de code audité ici (repo applicatif non livré dans ce dossier).

**Règle de tri** : toute évolution proposée doit répondre oui à :

> *« Est-ce que cela rend le produit plus solide, plus clair et plus viable ? »*

---

## 1) Analyse

### 1.1 Vision produit

**Force** : promesse **claire** et **différenciante** (repas IRL, intentions explicites, anti « dating forcé »). ADN « Ne mange plus seul » est **mémorable**.

**Tension** : le **nom** oral (paye / paie) et la **charge** « graille » demandent un **sous-titre** stable partout (stores, onboarding). C’est anticipé dans `BRAND_BOOK.md`, à **geler** tôt.

**Cohérence** : `PRODUCT_SPEC.md`, `MARKETING_POSITIONING.md`, `BRAND_BOOK.md`, `HUMAN_EXPERIENCE.md` sont **alignés** sur l’idée centrale. Bon socle.

### 1.2 UX

**Force** : parcours **découpé** (`UI_SCREENS.md`), machine d’états repas (`PRODUCT_SPEC.md`), copy **prête** (`COPY_UX_COMPLET_V1.md`), engagement **éthique** (`SYSTEME_ENGAGEMENT_NATUREL.md`, `RETENTION_ETHICAL.md`).

**Manques** : pas encore de **matrice unique** « écran → états → erreurs → permissions chat » en **un seul fichier** (dispersé entre spec et UI). Risque de dérive à l’implémentation.

**Risque** : onboarding **9 étapes** + tags multiples = fatigue. La spec admet le phasing, mais le **ressenti** utilisateur mérite un **test** (5 à 10 entretiens déjà prévus dans plusieurs docs).

### 1.3 Design

**Force** : identité **canon** (`IDENTITE_VISUELLE_COMPLETE.md`, `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md`), prompts créa, convergence `DESIGN_SYSTEM.md` vers les **mêmes** hex.

**Incohérence résiduelle** : `PRODUCT_SPEC.md` §5 cite encore **Inter + Poppins** alors que la chaîne design a basculé vers **Inter / Source Sans + Fraunces / Source Serif 4**. **À corriger** dans le spec pour une seule vérité.

**Manque** : pas de **fichier tokens export** (JSON / CSS) dans ce dossier, normal sans repo code, mais à prévoir au build.

### 1.4 Logique sociale

**Force** : intentions repas et sociales, chat **conditionnel**, refus **élégant**, signalement, jauge **privée** V2, repas croisé en **double opt-in** (spec).

**Risques** : modules **Table surprise** et **Repas suspendu** sont riches (`MODULE_*`) mais **lourds** pour un **MVP technique** et pour la **modération**. La logique sociale « duo simple » peut être **diluée** si tout arrive en V1.

**Zone floue** : usage **dating** par les utilisateurs malgré le positionnement. La spec le reconnaît, mais il faut des **règles produit** continues (modération, copy, signalement) pas seulement un paragraphe.

### 1.5 Business model

**Force** : pistes **non destructrices** au début (pas de pub invasive, pas de monétisation du graphe en tête). B2B resto et événements **cohérents** avec la table.

**Faiblesse** : **Premium** tôt peut entrer en conflit avec **équité** de découverte et **confiance** (« payant = avantage injuste »). Il faut un **principe écrit** : ce que le premium **ne** fait **pas** (ex. pas priorité sur la sécurité ou le match).

**Manque** : **prix**, **packs**, **seuil** de lancement monétisation absents (normal en exploration, à trancher avant levée sérieuse).

### 1.6 Sécurité

**Force** : outline légal IRL, RLS Supabase, rate limiting mentionné, signalement, conservation preuves « limitée » évoquée.

**Manques critiques (hors spec narrative)** : **CGU**, **politique confidentialité**, **procédure modération**, **mineurs**, **charte données** : listés dans `PROMPT_DOCUMENTATION_CORPUS_ET_LEGAL.md` et `PRODUCT_SPEC.md` §10 mais **pas rédigés**. C’est le **plus gros trou** pour la viabilité.

**Risque** : chat + géoloc + rencontre IRL = **surface d’abus** élevée sans **playbook** opérationnel testé (partiellement dans `CRISIS_PLAYBOOK.md`).

### 1.7 Scalabilité

**Force** : `SCALE_ARCHITECTURE.md` est **réaliste** (paliers 1k / 10k / 100k, early warnings, queues, PostGIS).

**Cohérence** : aligné avec `METRICS_PRODUCT.md` (North Star repas complété, show-up, pas DAU creux).

**Manque** : pas de **SLA interne** cible (ex. p95 discover) **chiffré** en V1 hors indicateur indicatif dans SCALE.

---

## 2) Diagnostic

### 2.1 Points forts

| Domaine | Détail |
|---------|--------|
| Narratif | Promesse, ton, expérience humaine bien documentés |
| Éthique | Rétention saine, engagement naturel, anti dark patterns explicites |
| Produit | Phasing V1 / V1.5 / V2 et corrections §0 du `PRODUCT_SPEC.md` |
| UX écrit | Copy complète + variantes A/B |
| Design | DA et identité suffisantes pour lancer Figma |
| Tech | Stack claire, schéma tables, routes API logiques |
| Croissance | Launch, viralité, métriques, scale, crise |

### 2.2 Faiblesses

| Sujet | Détail |
|-------|--------|
| Juridique | Documents légaux **absents** du dossier |
| Single source | Quelques **doublons** et **décalages** (ex. typo spec vs DA) |
| Matrice états | Logique repas **fragmentée** entre fichiers |
| MVP scope | Tentation d’ajouter modules sensibles **trop tôt** |
| Business | Premium sans **garde-fous** écrits |
| Preuve | Peu de **chiffres terrain** (normal pré-build) |

### 2.3 Risques

| Risque | Gravité | Mitigation |
|--------|----------|------------|
| Incident IRL médiatisé | Élevée | Modération, signalement, CGU, crise playbook, assurance à étudier |
| Fuite données (RLS) | Élevée | Tests RLS, revue sécurité avant scale |
| Cold start géo | Moyenne | Ville pilote, concierge, seuil avant marketing |
| Positionnement « dating » | Moyenne | Copy + produit + modération alignés |
| Dette doc | Faible | Restructuration proposée §4 |

### 2.4 Zones floues

- **Activation** : qui valide qu’un repas est **completed** (self report mutuel, un seul côté, preuve check-in resto) ? À figer avant métriques sérieuses.
- **No-show** : politique **exacte** (avertissement, strike, rien en V1) mentionnée comme phase ultérieure, à cadrer avant scale locale.
- **Repas suspendu** : flux **d’argent** et **transparence** réglementaire, hors compétence doc seule, besoin avocat.

---

## 3) Optimisation (actions concrètes)

1. **Corriger** `PRODUCT_SPEC.md` §5 pour refléter **exactement** typo et palette `IDENTITE_VISUELLE_COMPLETE.md` / `DESIGN_SYSTEM.md`.
2. **Matrice états** : voir **`MATRICE_REPAS_ETATS_PERMISSIONS.md`** (créée suite audit ; à ajuster si variante chat B retenue).
3. **Geler** le **MVP livrable** en trois lignes dans le README : **V1 = duo + une ville + modération manuelle + sans** table surprise / repas suspendu **en prod** sauf **feature flag off**.
4. **Ajouter** un paragraphe **Premium** dans `PRODUCT_SPEC.md` ou `INVESTOR_PITCH.md` : **interdits** et **limites** pour préserver confiance.
5. **Prioriser** la rédaction **externe avocat** des CGU / confidentialité / signalement avant ouverture publique.
6. **Fusionner** à terme les redondances **rétention** : `RETENTION_ETHICAL.md` peut rester charte courte ; `SYSTEME_ENGAGEMENT_NATUREL.md` reste le détail ; éviter un **troisième** doc équivalent sans rôle distinct (le prompt neuro reste **cadre LLM**, OK).

---

## 4) Restructuration proposée (architecture documentaire)

**Pyramide de vérité (du haut vers le bas)**

| Niveau | Fichier(s) | Rôle |
|--------|------------|------|
| 1 | `PRODUCT_SPEC.md` | Vision, règles, phasing, data, API, légal outline, backlog |
| 2 | `MATRICE_REPAS_ETATS_PERMISSIONS.md` *(à créer)* | Exécution UX + permissions |
| 3 | `COPY_UX_COMPLET_V1.md` + `UX_COPY_SYSTEM.md` | Textes + ton |
| 4 | `IDENTITE_VISUELLE_COMPLETE.md` + `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` + `DESIGN_SYSTEM.md` | Visuel + implémentation |
| 5 | `METRICS_PRODUCT.md` + `SCALE_ARCHITECTURE.md` | Mesure et scale |
| 6 | Modules | `MODULE_TABLE_SURPRISE_SPEC.md`, `MODULE_REPAS_SUSPENDU.md` **après** V1 stable |
| 7 | Ops & crise | `LAUNCH_PLAYBOOK.md`, `CRISIS_PLAYBOOK.md`, `VIRAL_GROWTH.md` |
| 8 | Juridique | Dossier `docs/legal/` ou fichiers `LEGAL_*.md` **quand rédigés** |

**MVP réaliste (recommandation audit)**

| Inclus V1.0 | Exclu ou flag off |
|-------------|-------------------|
| Auth, profil, intentions, discover duo, proposition, acceptation, lieu, double confirmation, jour J, post-repas, signalement minimal, email notifs | Table surprise, repas suspendu, feed repas ouvert, groupe, événements, premium payant |
| **Une** ville ou **un** cluster géographique avec **ops** humaine | Multi-ville marketing massif |

---

## 5) Recommandations prioritaires

| ID | Priorité | Action | Effort |
|----|----------|--------|--------|
| P0-1 | P0 | Rédaction / relecture **juridique** (CGU, confidentialité, modération) | Externe |
| P0-2 | P0 | Matrice **états repas + permissions** (`MATRICE_REPAS_ETATS_PERMISSIONS.md`) | Fait v1, itérer |
| P0-3 | P0 | Tests **RLS** + scénarios abus chat dès premier code | M |
| P1-1 | P1 | Aligner **PRODUCT_SPEC** design §5 sur identité canon | S |
| P1-2 | P1 | Paragraphe **Premium** (limites) + règle équité découverte | S |
| P1-3 | P1 | Décision **completed** repas (qui valide, quand) dans spec | S |
| P2-1 | P2 | Dossier `docs/legal/` indexé par README | S |
| P2-2 | P2 | Instrumentation funnel **C1 à C5** (`METRICS_PRODUCT.md`) dans analytics spec | M |
| P3-3 | P3 | Condenser liens README en **« parcours lecteur »** (fondateur, design, juridique) | S |

*(S = small, M = medium, effort relatif documentation ou spec.)*

---

## 6) Synthèse exécutive

Le projet est **documentairement mature** pour une **phase design et spec avant code**. La **cohérence** globale est **bonne** sur le **produit** et l’**expérience**. Les **incohérences** restantes sont surtout **détail design dans le spec** et **dispersion** de la logique états. Le **plus grand écart de viabilité** est **légal + trust ops**, pas la vision marketing.

**Version optimisée du projet** : même vision, **MVP géographiquement borné**, **modules sensibles en V1.5+**, **documentation en pyramide** ci-dessus, **juridique** en parallèle bloquant.

---

*v1 audit. Rafraîchir après premier trimestre de données réelles ou premier incident review.*
