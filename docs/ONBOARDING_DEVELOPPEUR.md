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

Ouvrir `http://localhost:3000` · santé API : `http://localhost:3000/api/health`

## Base de données

1. Créer un projet sur [Supabase](https://supabase.com).  
2. SQL Editor : exécuter le contenu de `supabase/migrations/20260412120000_core_profiles_meals.sql` (ou utiliser CLI Supabase si vous migrez en pipeline).  
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

## Prochaines branches fonctionnelles

Voir `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` (sprints 0–5).

## Dépannage

- **Build CI** : des placeholders `NEXT_PUBLIC_*` sont injectés dans GitHub Actions pour que `next build` ne échoue pas sans vrai projet Supabase.  
- **Erreur Supabase client** : vérifier `.env.local` et redémarrer `npm run dev`.
