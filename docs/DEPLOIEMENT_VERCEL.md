# Paye ta graille — Déploiement Vercel (Next.js + Supabase)

**Prérequis** : projet **Next.js** (App Router) dans un **repo Git** ; compte **Vercel** ; projet **Supabase** ; domaine (optionnel).

**Sécurité** : ne **jamais** committer les secrets ; utiliser **variables d’environnement** Vercel.

---

## 1. Structure projet attendue

```
paye-ta-graille/          (dossier à la racine Git si le repo contient ce seul projet)
├── package.json          (scripts build, start, lint, typecheck)
├── next.config.ts
├── tsconfig.json
├── src/app/             (App Router)
├── middleware.ts
├── .env.local           (gitignored — dev local)
└── README.md
```

Si ton dépôt Git a **un niveau au-dessus** (dossier parent + sous-dossier `paye-ta-graille/`), dans Vercel → **Settings** → **Root Directory**, mets **`paye-ta-graille`** (là où se trouve `package.json`).

**Build** : `npm run build` doit passer **avant** branche protégée / déploiement prod.

**Prévol** : `npm run deploy:preflight` lit `.env.local` et signale variables manquantes (dont Stripe si module paiement actif) et l’illustration hero — utile avant un push vers Vercel.

---

## 2. Variables d’environnement (liste type)

### Public (préfixe `NEXT_PUBLIC_` uniquement si nécessaire côté client)

| Variable | Usage |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé **anon** (respect RLS) |
| `NEXT_PUBLIC_SITE_URL` | **Fortement recommandé en prod** : `https://ton-domaine.tld` — métadonnées, liens Stripe, et **redirect OTP / magic link** (`/auth`, `signInWithOtp` → `/auth/callback`). Sans ça, le fallback utilise l’origine courante (ok en dev, fragile si email ouvert ailleurs). |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Carte navigateur (Maps JS) — restreindre la clé par référent HTTP |
| `NEXT_PUBLIC_PTG_MODULE_SHARE` / `…_FOOD_RESCUE` / `…_PAYMENTS` | Modules « Graille+ » (`1` / `true` pour activer) |
| `NEXT_PUBLIC_PTG_SURPRISE_GRAILLE` | `0` / `false` pour masquer la surprise sur Découvrir |
| `NEXT_PUBLIC_PTG_UX_VARIANT` | `b` pour variante copy (voir `ux-variant.ts`) |
| `NEXT_PUBLIC_PTG_PUBLIC_BETA` | `1` = bandeau bêta + comportement SEO associé |
| `NEXT_PUBLIC_PTG_HERO_ART` | URL absolue image hero (voir `next.config` `remotePatterns`) ; chemin sous `public/` sinon |
| `NEXT_PUBLIC_PTG_OG_IMAGE` | Optionnel : image **Open Graph / Twitter** (ex. 1200×630) ; sinon = même source que le hero |
| `NEXT_PUBLIC_PTG_HERO_ART_NIGHT` | Optionnel : image bandeau sombre (Partenaires, Expériences, Repas ouverts) ; absent = même URL que le hero |
| `NEXT_PUBLIC_PTG_HERO_ART_MOBILE` | Optionnel : recadrage hero **&lt; 640px** (`picture`) ; absent = une seule image |
| `NEXT_PUBLIC_PTG_HERO_ART_NIGHT_MOBILE` | Optionnel : recadrage mobile pour le bandeau nuit ; absent = pas de source séparée |
| `NEXT_PUBLIC_PTG_HERO_ART_BRAND` | Optionnel : fond illustré « marque » (ex. À propos) ; défaut `brand-marketplace.webp` |
| `NEXT_PUBLIC_PTG_HERO_ART_BRAND_MOBILE` | Optionnel : recadrage mobile pour ce fond ; absent = une seule image |
| `NEXT_PUBLIC_PTG_HERO_ILLUSTRATION` | `0` / `false` pour désactiver l’illustration locale |

**Images en URL distante** : chaque hostname utilisé doit être connu au **build** — la liste exacte des variables est dans **`config/public-hero-image-url-env-keys.json`** (lue par `next.config.ts` et `deploy-preflight`). **Changer de CDN ou d’hôte → nouveau déploiement** pour régénérer `remotePatterns`.

### Serveur uniquement (sans préfixe public)

| Variable | Usage |
|----------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | **Uniquement** API routes / tâches admin — ne jamais exposer au client |
| `DATABASE_URL` | Si connexion directe Postgres (optionnel si tout via Supabase) |
| `RESEND_API_KEY` | Emails transactionnels (ex. **repas proposé** → invité·e, si clé + domaine / expéditeur valides) |
| `RESEND_FROM_EMAIL` | Expéditeur Resend vérifié, ex. `Paye ta graille <notifications@ton-domaine.tld>` ; défaut dev `onboarding@resend.dev` |
| `GOOGLE_PLACES_API_KEY` | Places API **côté serveur** (`/api/places/*`) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Paiements si `NEXT_PUBLIC_PTG_MODULE_PAYMENTS` actif |
| `PTG_MODULE_REQUIRE_VERIFIED_EMAIL` | Modules Graille+ : exiger email vérifié (`0` pour désactiver en dev) |
| `PTG_BASE_URL` | Scripts smoke / `wait-for-health` — base HTTP (défaut `http://127.0.0.1:3000` côté scripts) |
| `PTG_CHECK_PORT` | Optionnel : port pour `npm run checks:prod-local` (`next start -p …`) si **3000** est déjà utilisé |
| `PTG_GROWTH_ADMIN_USER_IDS` | UUIDs Supabase (séparés par virgule ou espace) autorisés sur `/interne/croissance` et `GET /api/growth/kpi` sans secret |
| `PTG_GROWTH_KPI_SECRET` | Secret optionnel pour `GET /api/growth/kpi` (en-tête `x-ptg-growth-kpi-secret`) — scripts / outils externes |
| `NEXT_DEV_ALLOWED_ORIGINS` | Dev : IP/host LAN pour `next dev` multi-appareils (voir `next.config`) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate-limit distribué (recommandé prod multi-instance) |
| `PTG_CSP_REPORT_ONLY` / `PTG_CSP_REPORT_URI` | Durcissement CSP progressif (report-only puis enforce) |

**À configurer dans** : Vercel → Project → **Settings** → **Environment Variables** (Production + Preview + Development selon besoin).

---

## 3. Configuration Vercel

1. **Importer** le repo Git (GitHub/GitLab/Bitbucket).  
2. **Framework** : Next.js (détection auto).  
3. **Root directory** : laisser `/` sauf monorepo.  
4. **Build command** : `npm run build` (équivalent pnpm : `pnpm run build` — même idée : exécuter le script `build` du manifest).  
5. **Output** : défaut Next (pas export statique sauf choix explicite incompatible avec API dynamiques).  
6. **Node** : aligner sur `engines` du `package.json` (ex. **20+**).  
7. Branch **Production** : `main` (ou `master`).

---

## 4. Fichiers utiles (à ajouter au repo code)

| Fichier | Rôle |
|---------|--------|
| `vercel.json` | **Cron** : `GET /api/cron/meal-reminders` chaque heure (rappels e-mail + clôture auto repas) ; headers/rewrites restent optionnels selon besoin |
| `.env.example` | Liste des clés **sans valeurs** pour onboarding dev |
| `.github/workflows/ci.yml` | `lint` + `typecheck` + `build` + **Playwright** (smoke HTTP + navigateur) + job **beta-seo** Playwright (`NEXT_PUBLIC_PTG_PUBLIC_BETA=1`) ; `smoke:public` reste disponible hors CI |
| `.github/dependabot.yml` | PR hebdomadaires **npm** (dépendances) — à merger après `verify` / build |
| `src/app/global-error.tsx` | Fallback si erreur au niveau root layout (évite écran blanc brut) |
| `public/hero/landing-watercolor.png` | Source PNG du fond d’accueil ; `npm run optimize:hero` produit `landing-watercolor.webp` (largeur max **1920px**) — versionner le WebP dans Git. |
| `public/hero/landing-watercolor-{night,mobile,night-mobile}.png` | Optionnels : mêmes noms en `.webp` générés par `optimize:hero` si les PNG existent ; à relier via `.env` (`NEXT_PUBLIC_PTG_HERO_ART_*`) si tu n’utilises pas les chemins par défaut. |
| `public/hero/brand-marketplace.png` | Optionnel : composition « marché » pour pages marque ; `optimize:hero` → `brand-marketplace.webp` |
| `config/public-hero-image-url-env-keys.json` | Source unique des clés d’URL images pour `remotePatterns` + preflight — à mettre à jour si tu ajoutes une nouvelle variable `NEXT_PUBLIC_*` pointant vers une image distante. |

**Headers sécurité** : définis dans **`next.config.ts`** (`/:path*`) — le `middleware` ne fait que la session Supabase, pour éviter de dupliquer les mêmes en-têtes. En **production Vercel** (`VERCEL_ENV=production`), **HSTS** est ajouté automatiquement. La **CSP** tourne en report-only par défaut (`PTG_CSP_REPORT_ONLY=1`) pour un rollout sans casse; passer à `0` après vérification des rapports.

**SEO** : `src/app/sitemap.ts` et `src/app/robots.ts` — **ne pas** dupliquer un `public/robots.txt` (source unique : `robots.ts`). En prod sans bêta, le sitemap liste les pages marketing/légal indexables ; `robots.txt` pointe vers `/sitemap.xml` et interdit `/api/` et `/interne/`. Avec **`NEXT_PUBLIC_PTG_PUBLIC_BETA=1`**, le sitemap est vide et `robots.txt` interdit tout le site (complément au `noindex` des metadata). **`src/app/manifest.ts`** expose `/manifest.webmanifest` (couleurs / nom pour installation légère).

---

## 5. Supabase + Vercel

- **Migrations** : après chaque release qui modifie le schéma, appliquer les fichiers du dossier `supabase/migrations/` sur le projet cible (CLI `supabase db push` ou exécution manuelle dans le SQL Editor). Sans cela, les vues KPI (`growth_kpi_daily`), colonnes `user_settings` (préférences + compteur e-mail jour), colonnes rappels repas sur `meals`, ou tables métier peuvent être désynchronisées du code Next.
- **Cron (rappels repas J-24 / J-2h + clôture auto)** : `vercel.json` déclenche chaque heure `GET /api/cron/meal-reminders`. Même route : après les rappels, les repas **`confirmed`** dont la fin de créneau + **`PTG_MEAL_AUTO_COMPLETE_GRACE_HOURS`** (défaut 24) est dépassée passent en **`completed`** (sauf si **`PTG_MEAL_AUTO_COMPLETE=off`**). Sur Vercel, définir **`CRON_SECRET`** : la plateforme envoie `Authorization: Bearer <CRON_SECRET>`. Sans secret, la route répond 503. Pour les mails de rappel : **`RESEND_API_KEY`** ; pour lecture / update repas : **`SUPABASE_SERVICE_ROLE_KEY`** ; migrations `20260430100000_meals_reminder_columns.sql` et `20260430200000_auto_complete_meals_rpc.sql`. Vérifie que ton **plan Vercel** inclut les tâches planifiées (Cron Jobs).
- Activer **RLS** sur toutes les tables exposées.  
- **Ne pas** exposer la `service_role` au client.  
- URL Supabase + anon key en **Preview** pour branches de test si base dédiée ou schéma isolé (recommandé : **projet Supabase preview** ou reset script).

### Auth — URLs de redirection (indispensable)

Dans Supabase **Authentication → URL configuration** :

- **Site URL** : `https://<ton-domaine-prod.vercel.app>` (ou domaine custom).  
- **Redirect URLs** : inclure **chaque origine** utilisée, par ex.  
  `http://localhost:3000/auth/callback` (dev ; si `next dev` utilise **3001** car 3000 est pris, ajouter aussi `http://localhost:3001/auth/callback`),  
  `https://<preview>.vercel.app/auth/callback` (previews),  
  `https://<prod>/auth/callback`.  

Sans cela, le **magic link** / **échange de code** après le mail échoue.

**À propos de `NEXT_PUBLIC_SITE_URL`** : en prod, fixe-la sur l’URL canonique (custom ou `*.vercel.app`) pour que les liens dans les mails OTP pointent vers le bon domaine.

### Sessions (« rester connecté »)

- Après connexion (OTP / magic link), la session est portée par des **cookies** gérés par Supabase + le middleware Next : l’utilisateur reste connecté tant que les jetons sont valides (rafraîchissement automatique), sans case « rester connecté » côté app.
- Les **durées** (JWT, refresh) se règlent dans le **dashboard Supabase** (Authentication / paramètres de session — libellés selon la version du dashboard). Raccourcis-les si tu cibles des **terminaux partagés** ; pense à garder **Déconnexion** visible (ex. écran Moi).
- Une case « rester connecté » dédiée n’apporte guère tant que le comportement par défaut est déjà persistant ; l’important est la **durée de session** projet + l’**éducation utilisateur** (déconnexion, appareil partagé).

---

## 6. Étapes de déploiement (ordre)

1. Variables d’environnement **Preview** → déployer une **Preview** sur une PR.  
2. Smoke test staging (auth, page d’accueil, une route API).  
3. Variables **Production** → merge `main` → déploiement prod.  
4. Attacher **domaine** personnalisé (DNS selon Vercel).  
5. Vérifier **HTTPS** forcé.

---

## 7. Vérifications post-déploiement

- [ ] Page d’accueil **200**  
- [ ] `GET /api/health` → **200**, JSON `ok: true` et `version` (champ `version` du `package.json`)  
- [ ] Local / preview rapide : `npm run checks:prod-local` (start + wait health + smoke + stop serveur)  
- [ ] Après déploiement : `PTG_BASE_URL=https://<ton-domaine> npm run test:e2e` (smoke Playwright) ou `npm run smoke:public` si `next start` déjà actif — routes listées + kicker hero → `/a-propos`  
- [ ] Si mode bêta public: `PTG_BASE_URL=https://<ton-domaine> npm run assert:beta-seo`  
- [ ] Seconde graille : vérifier anonymat public (donneur affiché “Membre vérifié” avant claim), puis déverrouillage identité seulement après claim confirmé  
- [ ] Auth (inscription / magic link) **fonctionne**  
- [ ] Aucune clé secrète dans le bundle client (inspecter sources / Network)  
- [ ] `/api/*` erreurs **500** loguées (Vercel Logs / Supabase Logs)  
- [ ] Temps de réponse **p95** acceptable sur `/api/discover` (taille résultat limitée)  
- [ ] **CORS** : uniquement domaines autorisés si API séparée  
- [ ] **RGPD** : lien politique confidentialité footer

---

## 8. Checklist finale avant mise en ligne « publique large »

- [ ] **CGU** et **politique confidentialité** en ligne  
- [ ] **Signalement** et contact abuse  
- [ ] **Sentry** (ou équivalent) pour erreurs runtime (recommandé)  
- [ ] **Rate limiting** actif sur routes sensibles  
- [ ] **Plan rollback** Vercel (Deployments → **Promote** version stable)  
- [ ] **Sauvegarde** / export stratégie Supabase comprise

---

## 9. Test final (simulation utilisateur réel)

À exécuter sur **Preview** ou **Production** après code :

1. Créer un compte (email A).  
2. Compléter onboarding.  
3. Second compte (email B) ou compte test pair.  
4. Parcours **proposition** → **acceptation** → **lieu** → **confirm** → **jour J** (mock date si besoin).  
5. **Post-repas** + absence de fuite données entre utilisateurs non liés (test RLS).

---

*v1 guide déploiement. Adapter aux versions exactes de Next / Supabase au moment du build.*
