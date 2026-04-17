# Paye ta graille

**Ne mange plus seul.** Rencontres sociales autour du repas réel (invite · 50/50 · se faire inviter). Réseau social IRL du repas. Ce dépôt contient **l’application Next.js** (racine) et **docs/**.

---

## Application (code)

| Élément | Détail |
|---------|--------|
| **Stack** | Next.js 15 (App Router) · React 19 · TypeScript strict · Supabase (`@supabase/ssr`) |
| **Scripts** | Voir § ci-dessous : **toujours** `npm run <nom>` pour les scripts du `package.json` (c’est la forme fiable). |
| **Config** | `.env.example` · `.nvmrc` (Node 20) · `next.config.ts` (en-têtes sécurité, **HSTS** si `VERCEL_ENV=production`) · `vercel.json` (cron horaire `GET /api/cron/meal-reminders` : rappels e-mail + clôture auto `confirmed`→`completed`, `CRON_SECRET` sur Vercel ; vars optionnelles `PTG_MEAL_AUTO_COMPLETE*`) · `middleware.ts` (session Supabase ; hors statiques, métadonnées crawl & **`/api/cron/*`**) · `robots.ts` / `sitemap.ts` (SEO ; désactivés en bêta publique) · `not-found` / `error` / `global-error` · `/api/health` + `version` (`src/lib/app-version.ts`) · CI `.github/workflows/ci.yml` (job `workflow-lint` fail-fast, puis lint/types/build + **Playwright** desktop, **mobile-consistency**, **bêta SEO**) + `.github/workflows/ci-governance.yml` (garde-fou workflow/docs) + `.github/workflows/nightly-release-gate.yml` (gate strict nocturne `verify:release`) |
| **DB** | Migrations dans `supabase/migrations/` : noyau `20260412120000_core_profiles_meals.sql` + **Graille+** `20260418140000_graille_plus_share_rescue_payments.sql` (partage, seconde graille, `payment_ledger`) + instrumentation growth `20260420100000_growth_events.sql` (`growth_events`) + vues KPI `20260420103000_growth_kpi_views.sql` → `20260426120000_growth_kpi_partners.sql` → **`20260427100000_growth_kpi_funnel.sql`** (`growth_kpi_daily` : partenaires + funnel produit) + préférences notif `20260416093000_user_settings_notification_prefs.sql` + compteur e-mail jour `20260428100000_user_settings_email_nudge_counter.sql` + RPC atomique `20260429103000_reserve_meal_email_nudge_rpc.sql` (`user_settings`) + rappels repas `20260430100000_meals_reminder_columns.sql` + clôture auto `20260430200000_auto_complete_meals_rpc.sql` (`meals`). **Ordre** : appliquer toutes les migrations sur la base distante après chaque release qui touche le schéma. |
| **Dev** | `docs/ONBOARDING_DEVELOPPEUR.md` · **UI** : `docs/DESIGN_SYSTEM.md` (tokens : `src/app/ptg-tokens.css`) · sécurité : `docs/SECURITE_CHECKLIST_CODE.md` · RLS : `docs/RLS_SCENARIOS_CHECKLIST.md` · API : `docs/API_CONTRATS_V1.md` · **Stripe** (plus tard) : `docs/NOTE_PAIEMENT_STRIPE.md` · bêta : `NEXT_PUBLIC_PTG_PUBLIC_BETA=1` (bandeau + **noindex** + robots/sitemap fermés) |

**Scripts npm** (`package.json`) : exécuter avec **`npm run …`** :

| Commande | Rôle |
|----------|------|
| `npm ci` | Installe les dépendances **exactement** selon le lockfile (**pas** de `run`). |
| `npm run dev` | Serveur de développement Next.js (`localhost:3000`). |
| `npm run build` | Build production (Vercel / CI). |
| `npm run build:beta` | Build clean forcé en bêta (`NEXT_PUBLIC_PTG_PUBLIC_BETA=1`). |
| `npm run start` | Lance le serveur **après** un `build` (prod locale). |
| `npm run lint` | ESLint sur le projet. |
| `npm run lint:fix` | ESLint avec corrections auto quand possible. |
| `npm run typecheck` | TypeScript sans émettre de fichiers. |
| `npm run verify` | Lint + typecheck + tests scripts (`test:scripts`) + garde fichiers sensibles versionnés (`assert:tracked-safe`) ; même base que la CI avant le `build`. |
| `npm run assert:tracked-safe` | Échoue si un secret / `.env*.local` / clé type PEM est **suivi** par git (déjà inclus dans `verify`). |
| `npm run verify:full` | `verify` + `build:clean` (purge `.next` puis build). |
| `npm run verify:ship` | `verify` + `build:clean` + **Playwright desktop + mobile** (`test:e2e` puis `test:e2e:mobile`, Chromium requis : `npm run test:e2e:install`). |
| `npm run verify:release` | `verify:ship` + `test:e2e:beta-seo` (validation release la plus stricte). |
| `npm run verify:mobile` | `verify` + suite Playwright mobile (`test:e2e:mobile`) pour gate anti-régression responsive. |
| `npm run assert:beta-seo` | Vérifie `robots.txt` + `sitemap.xml` en mode bêta public (`NEXT_PUBLIC_PTG_PUBLIC_BETA=1`). |
| `npm run wait:health` | Attend que `/api/health` réponde 200 (utile CI / scripts d’orchestration locale). |
| `npm run checks:prod-local` | Lance `next start` (`-p` via `PTG_CHECK_PORT` ou `PORT`, défaut 3000), propage `PTG_BASE_URL` aux smoke, puis coupe le serveur. Si **EADDRINUSE** sur 3000 : `PTG_CHECK_PORT=3010` et `PTG_BASE_URL=http://127.0.0.1:3010`. |
| `npm run checks:prod-local:beta-seo` | Enchaîne **`build:beta`**, `start`, smoke, puis `assert:beta-seo` (flux bêta bout en bout). |
| `npm run checks:ci-governance` | Pré-check local du garde-fou CI governance (utile avant push quand `.github/workflows/*.yml` est modifié). |
| `npm run checks:ci-governance:main` | Pré-check CI governance en simulation PR contre `main` (`--base main`). |
| `npm run checks:ci-governance:master` | Pré-check CI governance en simulation PR contre `master` (`--base master`). |
| `npm run checks:ci-governance:default` | Pré-check CI governance contre la branche par défaut du remote (`origin/HEAD`). |
| `npm run checks:ci-governance:auto` | Alias ergonomique de `checks:ci-governance:default`. |
| `npm run ship` | `verify` + (si workflows touchés) governance locale + `git add -A` + commit si changements + `git push` — message : `npm run ship -- "chore: …"` ou `PTG_SHIP_MESSAGE`. Options : `--dry-run`, `--no-verify`, `--no-governance`. |
| `npm run ship:dry` | Même pré-vol que `ship` sans commit ni push. |
| `npm run deploy:preflight` | Contrôle `.env.local` + hero / vars avant déploiement (voir `docs/DEPLOIEMENT_VERCEL.md`). |
| `npm run optimize:hero` | Convertit le PNG hero en WebP (largeur max 1920px). Génère aussi `landing-watercolor-{night,mobile,night-mobile}.webp`, `brand-marketplace.webp`, les assets homogènes `brand-stage-*.webp` (focal points via `config/brand-stage-focal-points.json`), optionnel `brand-poster.webp` + `public/og/paye-ta-graille-share.webp` si les PNG existent. Voir `.env.example` / `DEPLOIEMENT_VERCEL.md`. |
| `npm run optimize:hero:dry` | Prévisualise les transformations de `optimize:hero` (sources, dimensions, crop focal point, sorties) sans écrire de fichiers. |
| `npm run cron:meal-reminders` | Appelle `GET /api/cron/meal-reminders` (variables `CRON_SECRET` + `PTG_BASE_URL`, serveur déjà lancé). |
| `npm run smoke:public` | Smoke HTTP des routes publiques + invariants HTML (accueil, bandeau `ptg-night-stage` sur Partenaires / Expériences / Repas ouverts) — serveur requis. |
| `npm run test:e2e` | Playwright : smoke HTTP + accueil navigateur (`e2e/`, `webServer` `next start`, `PTG_E2E_BASE_URL` défaut `http://127.0.0.1:4010`). |
| `npm run test:e2e:mobile` | Playwright mobile dédié (`playwright.mobile.config.ts`, profil Pixel 7) : cadrage image, continuité fond, stress viewport/orientation. |
| `npm run test:e2e:beta-seo` | Playwright uniquement `e2e/beta-seo.spec.ts` (rebuild bêta auto via `build:beta`, puis run ; `PTG_SKIP_BETA_BUILD=1` possible en CI si build déjà fait **et** marqueur bêta présent). |
| `npm run test:e2e:full` | `build:clean` puis `test:e2e`. |
| `npm run test:e2e:install` | Télécharge Chromium pour Playwright (une fois par machine / CI). |
| `npm run test:scripts` | Tests Node ciblés sur les helpers scripts (`scripts/__tests__`). |

**Config** : `config/public-hero-image-url-env-keys.json` liste les variables d’environnement dont les valeurs peuvent être des URL d’images distantes (alignement `next.config` / preflight).

**Démarrage rapide**

```bash
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_SUPABASE_* puis :
npm ci
npm run dev
```

**Déploiement** : `docs/DEPLOIEMENT_VERCEL.md` : en prod, renseigner de préférence **`NEXT_PUBLIC_SITE_URL`** (Open Graph / `metadataBase`) et les redirect URLs Supabase.
**CI** : `docs/CI_RUNBOOK.md` : réaction rapide en cas d’échec (`verify`, `mobile-consistency`, `beta-seo`) + gate nocturne `verify:release`.  
Évolution workflows: `docs/CI_WORKFLOW_COOKBOOK.md` (pattern job, artefacts, résumé standard).

**GitHub CLI (Windows)** : si `gh` n’est pas reconnu dans PowerShell, utiliser `& "C:\Program Files\GitHub CLI\gh.exe" ...` ou ajouter `C:\Program Files\GitHub CLI\` au `PATH`.

---

## Documentation produit (vision → MVP)

**Entrées recommandées**

1. `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` : MVP gelé, archi, sprints  
2. `docs/PROJET_PTGR_VERSION_OPTIMISEE.md` : synthèse maître du dossier  
3. `docs/VERSION_PROJET_RECONSTRUITE.md` : tri idées, amplification, ADN, structure  
4. `docs/DOSSIER_OFFICIEL_INDEX.md` : pack investisseurs / partenaires · audit : `docs/RAPPORT_AUDIT_DOSSIER_MONDE_2026-04-13.md`  
5. `docs/AUDIT_FINAL_PRE_PRODUCTION.md` : audit + checklist prod  
6. `docs/AUDIT_MVP_VALIDATION_2026-04-13.md` : validation MVP vs doc + trous test bêta  

**Journal de décisions** : `docs/DECISIONS_PRODUIT_LOG.md`

**Vue projet optimisée** : `docs/PROJET_PTGR_VERSION_OPTIMISEE.md` · **Blueprint** : `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` · **Audit final** : `docs/AUDIT_FINAL_PRE_PRODUCTION.md` · **Vercel** : `docs/DEPLOIEMENT_VERCEL.md`

---

## Dossier officiel (investisseurs, devs, partenaires)

**Index** : `docs/DOSSIER_OFFICIEL_INDEX.md`

| Document | Rôle |
|----------|------|
| `docs/VISION_PRODUIT_OFFICIEL.md` | Mission, vision, philosophie |
| `docs/UX_PRODUIT_OFFICIEL.md` | Fonctionnalités, parcours, logique sociale |
| `docs/MARKETING_OFFICIEL.md` | Positionnement, slogans, storytelling, ton |
| `docs/LEGAL_STRUCTURE_OFFICIEL.md` | Structure légale (plans) |
| `docs/BRAND_OFFICIEL.md` | Marque, valeurs, univers, ton |
| `docs/ANNEXE_CORPUS_RECYCLAGE_COMPLET.md` | Corpus total recyclable |

---

## Liste complète `docs/`

- `docs/PROJET_PTGR_VERSION_OPTIMISEE.md` : synthèse maître  
- `docs/VERSION_PROJET_RECONSTRUITE.md` : reconstruction décisionnelle (tri, refus, ambition)  
- `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` : produit constructible  
- `docs/AUDIT_FINAL_PRE_PRODUCTION.md` : audit + checklist  
- `docs/AUDIT_MVP_VALIDATION_2026-04-13.md` : validation MVP / test bêta  
- `docs/RAPPORT_AUDIT_DOSSIER_MONDE_2026-04-13.md` : audit investisseurs / cohérence globale  
- `docs/DEPLOIEMENT_VERCEL.md` : Vercel  
- `docs/DECISIONS_PRODUIT_LOG.md` : ADR léger  
- `docs/ONBOARDING_DEVELOPPEUR.md` : setup dev  
- `docs/SECURITE_CHECKLIST_CODE.md` : sécurité  
- `docs/RLS_SCENARIOS_CHECKLIST.md` : scénarios RLS à valider  
- `docs/API_CONTRATS_V1.md` : contrats API  
- `docs/PLAN_TEST_BETA.md` : scénario test bêta, priorités, check-list  
- `docs/PRODUCT_SPEC.md` : spec produit + tech  
- `docs/AUDIT_PRODUIT_GLOBAL.md` : audit cohérence  
- `docs/MATRICE_REPAS_ETATS_PERMISSIONS.md` : états × chat × notifs  
- `docs/UX_COPY_SYSTEM.md` · `docs/COPY_UX_COMPLET_V1.md` : copy  
- `docs/DESIGN_SYSTEM.md` · `docs/IDENTITE_VISUELLE_COMPLETE.md` · `docs/DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` · `docs/CREATIVE_DIRECTION_VISUAL.md` : design  
- `docs/MARKETING_POSITIONING.md` · `docs/MARKETING_OFFICIEL.md` : marketing  
- `docs/LAUNCH_PLAYBOOK.md` · `docs/VIRAL_GROWTH.md` · `docs/CRISIS_PLAYBOOK.md`  
- `docs/SCALE_ARCHITECTURE.md` · `docs/METRICS_PRODUCT.md`  
- `docs/USER_PERSONAS.md` · `docs/HUMAN_EXPERIENCE.md`  
- `docs/UI_SCREENS.md` · `docs/UX_PRODUIT_OFFICIEL.md` · `docs/UX_SECTION_AMIS_MES_TABLES.md` · `docs/ZONE_AMIS_FRIENDZONE_STRATEGIE.md`  
- `docs/MODULE_TABLE_SURPRISE_SPEC.md` · `docs/TABLE_SURPRISE_SECOND_GRAILLE.md`  
- `docs/MODULE_REPAS_SUSPENDU.md` · `docs/SUSPENDED_MEAL_AND_DISCOVERY.md`  
- `docs/RETENTION_ETHICAL.md` · `docs/SYSTEME_ENGAGEMENT_NATUREL.md` · `docs/PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md`  
- `docs/RESTAURANT_PARTNERSHIPS.md` · `docs/INVESTOR_PITCH.md` · `docs/BRAND_BOOK.md`  
- `docs/PROMPT_LIBRARY_EXTENDED.md` · `docs/PROMPT_*` (réécriture, audit, créa, documentation)  
- `docs/PROMPT_DOCUMENTATION_CORPUS_ET_LEGAL.md` · `docs/LEGAL_STRUCTURE_OFFICIEL.md`

---

## Prochaine étape technique (checklist courte)

1. **Supabase** : appliquer toutes les migrations du dossier (dont Graille+ si tu utilises partage / seconde graille / paiement).  
2. **Env** : copier `.env.example` → `.env.local` ; modules optionnels `NEXT_PUBLIC_PTG_MODULE_*` ; Stripe + service role quand tu actives le paiement (`docs/NOTE_PAIEMENT_STRIPE.md`).  
3. **Archi modules** : `docs/ARCHITECTURE_MODULES.md` (API, RLS, flux).
4. **Test réel** : `docs/PLAN_TEST_BETA.md` (priorités, dépendances, check-list) + `docs/TEST_UTILISATEUR_GUIDE.md` (scénarios A–E et critères).

Produit / vision : toujours `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` et l’index `docs/DOSSIER_OFFICIEL_INDEX.md`.
