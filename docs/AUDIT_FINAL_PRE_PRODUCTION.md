# Paye ta graille — Audit final pré-production (v1)

**Date de référence** : 2026-04-12.  
**Périmètre audité** : dossier **`paye-ta-graille`** (documentation produit / UX / design / légal / ops).  
**Hors périmètre à l’origine de ce document** : le **code applicatif** n’était pas encore audité ligne à ligne (l’audit portait surtout sur le dossier `docs/`).

**Mise à jour (2026-04-12, même journée)** : le dépôt contient désormais une app **Next.js** (`src/`, `package.json`), des **routes API**, des migrations **Supabase** sous `supabase/migrations/`, et des écrans alignés progressivement sur `COPY_UX_COMPLET_V1.md`. Les verdicts **« À faire (code) »** ci-dessous restent valides jusqu’à exécution de `npm run build`, tests RLS/E2E et audit contraste sur composants réels.

**Conclusion exécutive** : le **kit documentation** est **globalement cohérent** et **prêt à cadrer** un build. La mise en ligne **exige** encore des **CGU / confidentialité** rédigées (juridique), des **tests** (E2E, RLS, accessibilité) sur le **code réel**, et une passe **prod** (variables Vercel, smoke tests) — voir checklist en fin de document.

**Règle** : chaque critère ci-dessous est noté **OK (doc)** · **À faire (code)** · **Bloquant légal** · **N/A** selon le cas.

---

## Phase 1 — Audit global

### 1. Produit

| Critère | Verdict | Notes |
|---------|---------|--------|
| Cohérence vision / MVP | **OK (doc)** | `VISION_PRODUIT_OFFICIEL`, `BLUEPRINT_PRODUIT_FINAL_MVP`, `PRODUCT_SPEC` alignés sur phasing V1. |
| Logique fonctionnelle | **OK (doc)** | Machine d’états + `MATRICE_REPAS_ETATS_PERMISSIONS`. |
| Fluidité parcours | **OK (doc)** | `UI_SCREENS` + `COPY_UX_COMPLET_V1`. |
| Simplicité vs complexité | **OK (doc)** | Modules sensibles **hors** MVP code ; risque résiduel : onboarding long → **tests utilisateurs**. |

### 2. UX / UI

| Critère | Verdict | Notes |
|---------|---------|--------|
| Lisibilité wireframes | **OK (doc)** | Hiérarchie 1 CTA, règles §22 `UI_SCREENS`. |
| Interactions | **OK (doc)** | Matrice chat / notifs. |
| Cohérence écrans | **OK (doc)** | Carte §5 `BLUEPRINT` ↔ `UI_SCREENS`. |
| Expérience globale | **À faire (code)** | Validation réelle après implémentation + **a11y** clavier. |

### 3. Design & colorimétrie

| Critère | Verdict | Notes |
|---------|---------|--------|
| Cohérence tokens | **OK (doc)** | `IDENTITE_VISUELLE_COMPLETE` + `DESIGN_SYSTEM` alignés (palette canon). |
| Contraste | **OK (doc)** | Règles WCAG dans DA ; **À faire (code)** : audit outil sur composants réels. |
| DA | **OK (doc)** | `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE`. |
| Uniformité | **À faire (code)** | Figma / composants React à aligner sur tokens. |

### 4. Copywriting

| Critère | Verdict | Notes |
|---------|---------|--------|
| Ton humain | **OK (doc)** | `COPY_UX_COMPLET_V1`, `PROMPT_REECRITURE_ET_VOIX`. |
| Cohérence | **OK (doc)** | Intention **Je me fais inviter** harmonisée (voir § corrections). |
| Anti « voix IA » | **OK (doc)** | Règles explicites ; relecture humaine **recommandée** avant campagne. |

### 5. Technique (code)

| Critère | Verdict | Notes |
|---------|---------|--------|
| Structure | **À faire (code)** | Repo Next.js présent : valider arborescence, boundaries RSC/client, cohérence avec `BLUEPRINT`. |
| Erreurs TS / lint | **À faire (code)** | `npm run typecheck` + `npm run lint` + `npm run build` sur CI. |
| Perf | **À faire (code)** | Images WebP, RSC, cache discover : voir `SCALE_ARCHITECTURE`. |
| Données | **À faire (code)** | RLS Supabase **tests obligatoires**. |

### 6. Sécurité

| Critère | Verdict | Notes |
|---------|---------|--------|
| Modèle menaces (doc) | **OK (doc)** | Signalement, chat borné, pas de DM froid. |
| Auth / données | **À faire (code)** | Supabase Auth + RLS + politique conservation. |
| Abus | **À faire (code)** | Rate limit, admin signalements. |
| Conformité | **Bloquant légal** | `LEGAL_STRUCTURE_OFFICIEL` : clauses **à rédiger** avant pub ouverte. |

### 7. Performance

| Critère | Verdict | Notes |
|---------|---------|--------|
| Doc | **OK (doc)** | Paliers scale, index DB. |
| Runtime | **À faire (code)** | Lighthouse, p95 API après build. |

### 8. Scalabilité

| Critère | Verdict | Notes |
|---------|---------|--------|
| Doc | **OK (doc)** | `SCALE_ARCHITECTURE.md` (1k / 10k / 100k). |

---

## Phase 1 bis — Bugs / incohérences / faiblesses identifiés

| ID | Type | Détail | Gravité |
|----|------|--------|---------|
| A1 | **Doc / contexte** | ~~Absence de code Next.js~~ → **code présent** ; bloquant déploiement = build + env + légal (voir checklist) | P0 |
| A2 | **Bloquant légal** | CGU / politique confidentialité **non rédigées** | P0 |
| A3 | **Produit** | Règle `completed` : proposition en `DECISIONS_PRODUIT_LOG`, **à valider** équipe | P1 |
| A4 | **Doc** (corrigé) | « Je me laisse inviter » vs canon **Je me fais inviter** dans 2 fichiers | P3 |
| A5 | **Risque** | Onboarding 12 écrans : fatigue possible | P2 (tests) |

**Éléments inutiles** : pas de doc « vide » identifiée ; les prompts multiples ont des **rôles** distincts (voir `PROJET_PTGR_VERSION_OPTIMISEE`).

---

## Phase 2 — Corrections effectuées (cette passe)

| Fichier | Correction |
|---------|------------|
| `docs/CREATIVE_DIRECTION_VISUAL.md` | **Je me fais inviter** (alignement produit). |
| `docs/UI_SCREENS.md` | idem sur l’écran intention repas. |

**Non corrigé ici** (hors scope fichier) : création du dépôt Next.js, implémentation API, RLS.

---

## Phase 3 — Validation design (documentation)

- **Harmonie** : palette crème / ambre / olive validée sur papier.  
- **Choix** : pas de food cliché ; silhouettes + table (DA).  
- **Condition prod** : maquettes Figma + build **à valider** sur **vrais devices** et **simulateurs daltonisme**.

**Verdict doc** : **Validé** comme **direction** ; **non** équivalent à **QA visuelle** sur build.

---

## Phases 4 à 6 — Déploiement, tests

**Instructions détaillées Vercel** : **`docs/DEPLOIEMENT_VERCEL.md`** (créé dans la même passe).

**Tests utilisateur réel** (compte, navigation, repas) : **impossibles** sans application ; checklist dans `DEPLOIEMENT_VERCEL.md` section **post-déploiement** + `BLUEPRINT` sprint 5.

---

## Livrable synthèse

| Livrable | Statut |
|----------|--------|
| 1. Rapport d’audit complet | **Ce document** |
| 2. Liste corrections | **§ Phase 2** |
| 3. Validation globale | **Doc OK pour cadrer le build** ; **pas** « app publiable sans code » |
| 4. Instructions Vercel | **`DEPLOIEMENT_VERCEL.md`** |
| 5. Checklist finale | **Fin de `DEPLOIEMENT_VERCEL.md`** + rappels légaux ci-dessus |

---

## Checklist « mise en ligne » (réaliste)

- [ ] Repo Next.js + Supabase opérationnel  
- [ ] `npm run build` **vert** en local et sur CI  
- [ ] RLS **testé** (scénarios abus)  
- [ ] CGU + confidentialité **publiées** + contact  
- [ ] Variables d’environnement Vercel **renseignées** (voir `DEPLOIEMENT_VERCEL.md`)  
- [ ] Domaine + HTTPS  
- [ ] Smoke test parcours inscription → proposition (staging)  
- [ ] Plan **rollback** (promote previous deployment Vercel)

---

*v1 audit final doc. Réexécuter sur le **repo code** dès le premier merge sur `main`.*

---

## Annexe — Réaudit consolidé **2026-04-13** (code + design + déploiement)

**Périmètre** : `src/`, `middleware.ts`, `next.config.ts`, `globals.css`, CI, docs techniques liées.  
**Références** : `AUDIT_TECHNIQUE_CODEBASE.md` · `LIVRABLE_MVP_REFERENCE_LANCEMENT.md` · `DEPLOIEMENT_VERCEL.md`.

### Synthèse verdict

| Zone | Verdict | Commentaire honnête |
|------|---------|---------------------|
| **Produit / parcours** | **Bon (doc + code alignés)** | Machine d’états repas **validée côté API** (`meal-transitions.ts`) ; matrice chat **variante A** respectée sur messages. |
| **UX / UI** | **Bon MVP** | Tokens dans `globals.css` ; boutons **min-height 44px** ; `:focus-visible` ; `SkipLink` + `main#contenu-principal`. Reste : **tests clavier** sur tous les flux. |
| **Design / colorimétrie** | **Cohérent** | Palette canon (crème, terracotta, olive, danger) ; **themeColor** viewport aligné `--ptg-bg`. Audit **contraste automatisé** (axe/Lighthouse) recommandé sur écrans denses. |
| **Copy** | **Bon** | Centralisation `ux-copy.ts` / `marketing-copy.ts` ; relecture humaine avant campagne publique. |
| **Technique** | **Renforcé** | Redirect OAuth sécurisé, UUID repas, `photo_url` https, transitions repas, tags catégories ; **ESLint** ignore `node_modules` explicitement (perf CI). |
| **Sécurité** | **Partielle** | Surface app durcie ; **RLS SQL** + **rate limiting** = P0 avant grosse com’. |
| **Performance** | **Correcte MVP** | Pas de bundle excessif repéré ; images profil en `<img>` (OK court terme) ; discover limité (50). |
| **Scalabilité** | **Doc OK** | Voir `SCALE_ARCHITECTURE.md` ; RPC discover à surveiller par ville. |

**Publication « grand public »** : **non** sans **CGU/confidentialité juridiques**, **smoke tests** sur Preview Vercel, et **validation RLS**. **Bêta fermée / pilote** : réaliste une fois env + Supabase + parcours repas vérifiés.

### Corrections / évolutions relevées (2026-04-13)

| Élément | Action |
|---------|--------|
| ESLint | `ignorePatterns` inclut **`node_modules/**`** (`.eslintrc.json`) |
| Viewport | `themeColor` = **`#f6f1e8`** (aligné DA) |
| `.env.example` | Variable optionnelle **`NEXT_PUBLIC_PTG_UX_VARIANT`** documentée |
| Transitions repas | Déjà en prod code : `src/lib/meal-transitions.ts` |
| Audit technique | `AUDIT_TECHNIQUE_CODEBASE.md` maintenu |

### Simulation utilisateur (checklist manuelle post-déploiement Preview)

1. Accueil → pas d’erreur console ; SkipLink fonctionne.  
2. Auth magic link (Supabase) : redirect **sans** open redirect (`/auth/callback`).  
3. Onboarding / profil : tags enregistrés avec **catégories** cohérentes.  
4. Discover → proposition repas → **invité·e** accepte → hôte lieu → invité·e confirme lieu → **J’y vais** → **Repas fait** ; tenter un **PATCH** illégal (outils dev) → **400**.  
5. Footer : liens légaux chargent.  
6. Mobile : zones tactiles, pas de texte coupé critique.

### Livrable final (rappel)

1. **Rapport d’audit** : ce fichier + `AUDIT_TECHNIQUE_CODEBASE.md`.  
2. **Corrections** : § Annexe ci-dessus + journal `DECISIONS_PRODUIT_LOG.md`.  
3. **Validation globale** : **prêt bêta technique** ; **pas** « prod ouverte » sans légal + RLS + limites d’abus.  
4. **Déploiement Vercel** : `DEPLOIEMENT_VERCEL.md`.  
5. **Checklist finale** : § Checklist mise en ligne + §8 de `DEPLOIEMENT_VERCEL.md`.
