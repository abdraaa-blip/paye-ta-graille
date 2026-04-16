# Paye ta graille — Synthèse d’intégration produit (cycles & backlog)

**Rôle** : **point unique** après analyse / prompts / idées — ce qui est **intégré**, ce qui est **reporté**, ce qui est **refusé** (avec raison).  
**Ne remplace pas** la pyramide : **`PROJET_PTGR_VERSION_OPTIMISEE.md`** (vue maître) · **`BLUEPRINT_PRODUIT_FINAL_MVP.md`** (MVP développable) · **`DECISIONS_PRODUIT_LOG.md`** (ADR).

**Règle** : chaque ligne doit répondre oui à *« Est-ce que cela améliore réellement le produit ? »*

---

## Phase 1 — Analyse (sources traitées)

| Source | Contenu pris en compte |
|--------|-------------------------|
| `V1_CONCEPT_BRAINSTORM_TO_CODE.md` | Intentions, prompts #1–#26, modules phasés |
| `DECISIONS_PRODUIT_LOG.md` | Arbitrages datés (friend zone, neuro, marketing, etc.) |
| `PRODUCT_SPEC.md` · `BLUEPRINT_*` | Périmètre V1 / V1.5 / V2 |
| `MARKETING_OFFICIEL.md` · `ZONE_AMIS_*` | Positionnement, clin d’œil **La Friend zone** |
| `PROMPT_ENGAGEMENT_NEURO_*` · `SYSTEME_ENGAGEMENT_*` | Engagement **sain**, viralité IRL |
| `DA_*` · `UX_COPY_SYSTEM.md` | Cohérence ton & DA |
| Code `src/` | Écart doc ↔ écran réel |

---

## Phase 2 — Récupération (idées à fort potential non triviales)

| Idée | Statut |
|------|--------|
| Hub compagnons différenciant vs dating | **Intégré** — `La Friend zone` + copy `companions-copy.ts`, `/reseau-graille` |
| Leviers neuro / viralité **sans** dark patterns | **Intégré** — prompt neuro §4–§7, prompt Cursor **#26** |
| Rappel **intention d’addition** avant contact (discover) | **Intégré** — micro-copy `UX_DISCOVER` + affichage carte |
| Navigation vers le **réseau / compagnons** | **Intégré** — lien dans `AppNav` |
| Avatars discover **accessibles** | **Intégré** — `alt` descriptif |
| Liste contacts + jauge persistée | **Backlog V2** — spec déjà dans `UX_SECTION_AMIS_*`, `BLUEPRINT` |
| Confirmation **intention invité·e** (repas) | **Backlog** — prompt #5, non implémenté sans ticket |
| `completed` double tap vs auto 24h | **Décision ouverte** — `DECISIONS` + `BLUEPRINT` §4 |

---

## Phase 3 — Tri stratégique

| Verdict | Critère |
|---------|---------|
| **Conserver** | Renforce clarté, confiance, North Star **table réelle** |
| **Fusionner** | Doublons neuro / rétention → canon `SYSTEME_ENGAGEMENT` + `PROMPT_ENGAGEMENT` |
| **Reporter** | Module Table surprise, repas suspendu, feed, groupe — après liquidité duo |
| **Refuser** | « Addiction écran » comme objectif, dark patterns, Friend zone **seule** en H1 sans contexte |

---

## Phase 4 — Intégrations réalisées (traçabilité)

| Élément | Où c’est vivant |
|---------|------------------|
| Zone **La Friend zone** | `src/lib/companions-copy.ts`, `src/app/reseau-graille/page.tsx`, `MARKETING_OFFICIEL` §6, `DECISIONS` 2026-04-25 |
| Engagement neuro + viralité éthique | `PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md`, prompt **#26**, `V1_CONCEPT` 6.1 |
| Discover : rappel intention + a11y | `src/lib/ux-copy.ts` (`UX_DISCOVER.proposeContextHint`), `DiscoverClient.tsx` (`alt` photo) |
| Nav vers compagnons | `src/components/AppNav.tsx` (lien **Compagnons** → `/reseau-graille`, état actif `current="reseau"`) |
| Machine d’états repas (serveur) | `src/lib/meal-transitions.ts` + `api/meals/[id]` PATCH |
| Tags profil : catégorie SQL | `tagKeyToProfileCategory` + `api/profile` |
| URL canonique / OG | `src/lib/site-url.ts` + `layout` `metadataBase` ; env **`NEXT_PUBLIC_SITE_URL`** |
| Journal décisions | `DECISIONS_PRODUIT_LOG.md` (remplace la mention « à créer » du PROJET v1) |
| Synthèse lancement MVP (1 doc pivot) | `LIVRABLE_MVP_REFERENCE_LANCEMENT.md` |

---

## Phase 5 — Optimisation continue (prochaines actions à plus forte valeur)

1. **P0** : trancher et coder la règle **`completed`** + analytics alignés `METRICS_PRODUCT.md`.  
2. **P0** : parcours **invité·e** / confirmation intention (`MATRICE_*`, `MealDetailClient`).  
3. **P1** : check-list **a11y** parcours critique (auth → discover → repas → signalement) — une page dans `UX_PRODUIT_OFFICIEL` ou `AUDIT_*`.  
4. **P1** : gate **ville pilote** explicite dans `LAUNCH_PLAYBOOK` (une règle chiffrée).  
5. **V2** : persistance `graille_contacts`, jauge, liste compagnons — déjà spec.  
6. **Technique** : revue continue **`AUDIT_TECHNIQUE_CODEBASE.md`** (sécurité, RLS, rate limit, machine d’états).

---

## Éléments explicitement **non** intégrés en surface produit (volonté)

- Nouvel onglet ou module **hors** roadmap V1.  
- Promesses **prix** / « la seule app » sans relecture juridique.  
- Gamification **classement** public des compagnons.

---

*Document vivant : mettre à jour après chaque cycle majeur (pitch, user tests, levée).*
