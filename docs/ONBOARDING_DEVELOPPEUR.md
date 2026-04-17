# Paye ta graille — Onboarding développeur

## Prérequis

- **Node.js 20+** (voir `.nvmrc`)
- Compte **Supabase** (projet dédié dev / staging)
- Compte **Vercel** (optionnel au jour 1)

## Commandes npm (rappel)

Pour tout script défini dans `package.json` → **`npm run <nom>`** (`dev`, `build`, `lint`, `typecheck`, `lint:fix`, `start`).  
**Sans `run`** : commandes npm natives comme **`npm ci`**, **`npm install`**, **`npm install <paquet>`** — ce ne sont pas des scripts du projet.

## Installation

```bash
cd paye-ta-graille
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
npm ci   # nécessite package-lock.json (fourni) ; sinon npm install une fois puis commit du lock
npm run dev
```

**Illustration d’accueil** : si tu changes `public/hero/landing-watercolor.png`, lance `npm run optimize:hero` puis commit le `landing-watercolor.webp` produit (voir aussi `README.md`). **Carte réseaux sociaux** : option `NEXT_PUBLIC_PTG_OG_IMAGE` (fichier `public/…` ou URL) pour une image 1200×630 sans toucher au hero LCP.

Ouvrir `http://localhost:3000` · santé API : `http://localhost:3000/api/health` · scripts smoke / `wait:health` : défaut **`http://127.0.0.1:3000`** (`PTG_BASE_URL` si besoin)

## Base de données

1. Créer un projet sur [Supabase](https://supabase.com).  
2. Appliquer **toutes** les migrations du dossier `supabase/migrations/` **dans l’ordre des timestamps** (SQL Editor ou `supabase db push`). Le fichier `20260412120000_core_profiles_meals.sql` est le socle ; en bout de chaîne courante : rappels **`20260430100000_meals_reminder_columns.sql`**, RPC clôture auto **`20260430200000_auto_complete_meals_rpc.sql`** (sinon le cron utilise un fallback Node plus lent).  
3. **Auth** : activer Email (magic link) dans Authentication → Providers.  
4. Tester l’inscription depuis l’app dès les écrans auth branchés.

## Structure code (orientation)

| Chemin | Rôle |
|--------|------|
| `src/app/` | App Router, pages, layouts |
| `src/app/api/` | Route Handlers (API) |
| `src/lib/supabase/` | Clients navigateur / serveur |
| `src/types/` | Types partagés (repas, profil) |
| `docs/` | Produit, UX, légal, déploiement |

## Test bêta (parcours réel)

Check-list, priorités et scénario **2 comptes** : **`docs/PLAN_TEST_BETA.md`**.

## Prochaines branches fonctionnelles

Voir `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` (sprints 0–5).

## Dépannage

- **CI GitHub** : `.github/workflows/ci.yml` enchaîne `verify`, `deploy:preflight`, `build`, puis **Playwright** (`test:e2e`) ; un job séparé **`beta-seo`** rebuild avec `NEXT_PUBLIC_PTG_PUBLIC_BETA=1` et lance `test:e2e:beta-seo`.  
- **Build CI** : des placeholders `NEXT_PUBLIC_*` sont injectés dans GitHub Actions pour que `next build` ne échoue pas sans vrai projet Supabase.  
- **Erreur Supabase client** : vérifier `.env.local` et redémarrer `npm run dev`.
- **Windows + `next dev --turbopack`** : après `npm run clean:next`, des erreurs `ENOENT` sur `.next/static/development/_buildManifest.js.tmp.*` peuvent apparaître. Essaie `npm run dev:stable` (Webpack) ou relance `dev` sans nettoyer le cache entre deux runs.
- **`checks:prod-local` / `checks:prod-local:beta-seo`** : le script vérifie que **le serveur lancé par le script** répond (nonce dans `/api/health`). Si le port est déjà pris par un autre `next dev` / `next start`, ferme-le ou utilise `PTG_CHECK_PORT=3010` avec `PTG_BASE_URL=http://127.0.0.1:3010`.
- **`deploy:preflight`** sans clés Google : en local uniquement, tu peux définir `PTG_PREFLIGHT_ALLOW_MISSING_PLACES=1` dans l’environnement ou dans `.env.local` pour passer le préflight sans `GOOGLE_PLACES_API_KEY` / `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (un avertissement sera affiché).
