# Paye ta graille — Déploiement Vercel (Next.js + Supabase)

**Prérequis** : projet **Next.js** (App Router) dans un **repo Git** ; compte **Vercel** ; projet **Supabase** ; domaine (optionnel).

**Sécurité** : ne **jamais** committer les secrets ; utiliser **variables d’environnement** Vercel.

---

## 1. Structure projet attendue

```
/
├── package.json          (scripts build, start, lint, typecheck)
├── next.config.ts       (ou .mjs)
├── tsconfig.json
├── src/app/             (App Router)
├── .env.local           (gitignored — dev local)
└── README.md
```

**Build** : `npm run build` doit passer **avant** branche protégée / déploiement prod.

---

## 2. Variables d’environnement (liste type)

### Public (préfixe `NEXT_PUBLIC_` uniquement si nécessaire côté client)

| Variable | Usage |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé **anon** (respect RLS) |
| `NEXT_PUBLIC_SITE_URL` | **Recommandé en prod** : `https://ton-domaine.tld` (métadonnées / Open Graph) — sinon Vercel utilise `VERCEL_URL` au build |

### Serveur uniquement (sans préfixe public)

| Variable | Usage |
|----------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | **Uniquement** API routes / server actions qui contournent RLS avec extrême prudence (admin) |
| `DATABASE_URL` | Si connexion directe Postgres (optionnel si tout via Supabase client) |
| `RESEND_API_KEY` | Emails transactionnels |
| `GOOGLE_PLACES_API_KEY` | Recherche lieux **proxy** côté serveur |
| `NEXTAUTH_SECRET` / secrets session | Si auth additionnelle (adapter au choix Supabase Auth) |

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
| `vercel.json` | Optionnel : headers sécurité, rewrites rares ; souvent **inutile** si défaut Next suffit |
| `.env.example` | Liste des clés **sans valeurs** pour onboarding dev |
| `.github/workflows/ci.yml` | `lint` + `typecheck` + `build` + tests sur PR |

**Headers sécurité** (recommandés en `next.config` ou middleware) : `X-Frame-Options`, `Referrer-Policy`, **CSP** progressive.

---

## 5. Supabase + Vercel

- Activer **RLS** sur toutes les tables exposées.  
- **Ne pas** exposer la `service_role` au client.  
- URL Supabase + anon key en **Preview** pour branches de test si base dédiée ou schéma isolé (recommandé : **projet Supabase preview** ou reset script).

### Auth — URLs de redirection (indispensable)

Dans Supabase **Authentication → URL configuration** :

- **Site URL** : `https://<ton-domaine-prod.vercel.app>` (ou domaine custom).  
- **Redirect URLs** : inclure **exactement**  
  `http://localhost:3000/auth/callback` (dev),  
  `https://<preview>.vercel.app/auth/callback` (chaque preview si besoin),  
  `https://<prod>/auth/callback`.  

Sans cela, le **magic link** échoue après déploiement.

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
