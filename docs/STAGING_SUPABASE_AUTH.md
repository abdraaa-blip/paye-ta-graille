# Branche `staging` + base Supabase + auth — guide opérationnel

Ce document enchaîne **Git**, **Vercel**, **Supabase** (DB + Auth) pour un environnement de **préproduction** stable. Il complète `docs/DEPLOIEMENT_VERCEL.md` et `docs/ONBOARDING_DEVELOPPEUR.md`.

---

## 1. Objectif

| Élément | Rôle |
|---------|------|
| **Branche Git `staging`** | Code « candidat » avant `master` / prod ; déploiement Vercel **Preview** ou domaine dédié. |
| **Projet Supabase staging** | Postgres + Auth **isolés** de la prod (recommandé) : migrations identiques, données jetables. |
| **Auth** | Magic link / OTP : les **Redirect URLs** doivent inclure **chaque origine** (localhost, staging, previews). |

---

## 2. Projet Supabase « staging »

1. Dashboard [Supabase](https://supabase.com/dashboard) → **New project** (région proche des utilisateurs test).  
2. **Project Settings → API** : noter `Project URL` et `anon` `public` key → variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` côté Vercel **Preview** (voir §5).  
3. **Project Settings → API → service_role** : une seule fois, copier la clé → `SUPABASE_SERVICE_ROLE_KEY` sur Vercel (Preview staging uniquement ; jamais dans le client).  
4. **SQL / migrations** : appliquer **tous** les fichiers `supabase/migrations/*.sql` **dans l’ordre des timestamps** (SQL Editor batch ou CLI `supabase link` + `supabase db push`). Même ordre que pour la prod.  
5. **Authentication → Providers** : activer **Email** (magic link / OTP selon ta config actuelle).

Sans migrations complètes, les routes `/api/discover`, repas, feedback, cron, etc. peuvent renvoyer **503** ou erreurs SQL — c’est normal tant que le schéma n’est pas aligné.

---

## 3. Auth — URL Configuration (obligatoire)

Dans **Authentication → URL Configuration** du projet **staging** :

### Site URL

Mets l’URL **principale** utilisée par les testeurs, par exemple :

- `https://<ton-projet-staging>.vercel.app`, ou  
- un sous-domaine custom `https://staging.ton-domaine.tld` si tu l’attaches à la branche `staging`.

### Redirect URLs (allow list)

Ajoute **au minimum** :

| URL | Contexte |
|-----|----------|
| `http://localhost:3000/auth/callback` | Dev local |
| `http://localhost:3001/auth/callback` | Si `next dev` utilise le port 3001 |
| `https://<URL-fixe-staging>/auth/callback` | Déploiement staging stable (recommandé) |

Pour les **Preview Vercel** dont l’URL change à chaque commit, Supabase accepte en général un **wildcard** (selon ton projet) :

- `https://*.vercel.app/auth/callback`

Vérifie dans le dashboard que la sauvegarde est acceptée ; sinon ajoute les motifs listés dans l’erreur ou les URLs exactes des previews (onglet **Deployments** sur Vercel).

**Important** : le **projet Supabase staging** doit avoir cette liste pour **staging** ; ne réutilise pas la prod sans avoir dupliqué les URLs, sinon les redirections échouent.

---

## 4. Côté application (`NEXT_PUBLIC_SITE_URL`)

Dans `src/lib/site-url.ts`, l’ordre est : `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost.

- **Preview Vercel** : si tu **ne** définis **pas** `NEXT_PUBLIC_SITE_URL`, l’app utilise `VERCEL_URL` (canonique pour ce déploiement) — pratique quand chaque preview a une URL différente **et** que Supabase autorise `*.vercel.app`.  
- **Staging fixe** : si tu as une URL stable (domaine ou branche Vercel dédiée), définis **`NEXT_PUBLIC_SITE_URL=https://…`** dans les variables **Preview** pour cette branche : les métadonnées et certains liens restent cohérents.

En **prod**, fixe toujours `NEXT_PUBLIC_SITE_URL` sur l’URL canonique (custom ou `*.vercel.app` définitif).

---

## 5. Vercel — branch `staging` + variables

### Créer / pousser la branche Git

```bash
git fetch origin
git checkout master
git pull origin master
git checkout -b staging # si la branche n’existe pas encore localement
git push -u origin staging
```

Sur GitHub : tu peux ouvrir une **Pull Request** `staging` → `master` quand tu veux promouvoir le code ; la branche `staging` peut vivre en permanence comme rampe de préprod.

### Rattacher l’environnement « staging »

1. **Vercel** → projet → **Settings → Git** : la branche **Production** reste en général `master` (ou `main`).  
2. Chaque **push** sur `staging` déclenche un **Preview Deployment** (comportement par défaut).  
3. **Settings → Environment Variables** :  
   - Ajoute les clés **Supabase staging** (et le reste : `CRON_SECRET`, Resend, Google, etc. **pour test**, pas les secrets prod).  
   - Scope : **Preview** ; si l’UI le permet, limite au **branch** `staging` pour ne pas mélanger avec d’autres PRs.  
   - Si toutes les previews doivent partager la même base : mets les mêmes variables sur tout **Preview** (plus simple, moins isolé par PR).

### Domaine stable (optionnel mais utile)

**Settings → Domains** : attacher un sous-domaine (ex. `staging.ton-domaine.tld`) au **dernier déploiement de la branche `staging`** (documentation Vercel : domaine par branche). Réutilise cette URL dans **Site URL** + **Redirect URLs** Supabase.

---

## 6. Vérifications rapides après déploiement staging

1. `GET https://<staging>/api/health` → `200`, `"ok": true`.  
2. Ouvrir `/auth`, demander un magic link, cliquer le lien → arrivée sur `/auth/callback` **sans** erreur OAuth / redirect.  
3. `npm run smoke:public` avec `PTG_BASE_URL=https://<staging>` (serveur déjà déployé — pas besoin de `next start` local).  
4. Parcours **2 comptes** : `docs/PLAN_TEST_BETA.md`.

---

## 7. Récap des erreurs fréquentes

| Symptôme | Cause probable |
|----------|----------------|
| Magic link redirige vers la mauvaise origine | `NEXT_PUBLIC_SITE_URL` prod mélangée avec Preview ; ou Redirect URLs incomplètes. |
| `Invalid redirect` Supabase | URL exacte du callback absente de la allow list (ajouter `https://…/auth/callback`). |
| 503 sur `/api/discover` | RPC / migrations manquantes sur le projet **staging**. |
| Cron / rappels ne partent pas | `CRON_SECRET` preview, `RESEND_*`, `SUPABASE_SERVICE_ROLE_KEY` non définis ou migrations cron absentes. |

---

## 8. Ce que ce dépôt ne peut pas faire à ta place

- Créer le projet Supabase ni les clés (dashboard).  
- Saisir les variables dans Vercel (dashboard).  
- Valider les wildcards Redirect sur ton plan Supabase.

Dès que **staging** + **DB** + **auth** sont verts, enchaîne avec `docs/TEST_UTILISATEUR_GUIDE.md` pour les tests réels.
