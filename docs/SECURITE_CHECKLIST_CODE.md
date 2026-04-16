# Paye ta graille — Sécurité (checklist code & infra)

## Authentification

- [ ] Supabase Auth uniquement via **anon key** côté client.  
- [ ] **Service role** réservé aux scripts admin / Edge Functions isolées, jamais dans le bundle client.  
- [ ] Sessions : préférer patterns officiels `@supabase/ssr` (middleware refresh si activé).  
- [x] `middleware.ts` : matcher **exclut** `_next/static`, `_next/image`, favicon, `icon.svg`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest` (pas de `getUser` inutile sur ces requêtes).

## Données (RLS)

- [ ] **RLS activé** sur toutes les tables exposées au client.  
- [ ] Aucune policy `using (true)` sur données personnelles sans **analyse** (discover = RPC ou route serveur filtrée).  
- [ ] Tests : utilisateur A **ne lit pas** les repas / profils de B sans règle explicite.

## API Routes

- [ ] Valider le corps (Zod ou équivalent) sur **POST/PATCH**.  
- [x] **Rate limiting** applicatif (fenêtre glissante par `userId` sur discover, création repas, messages, lieu Places, signalement, profil, transitions repas) — voir `src/lib/api/rate-limit.ts`. Pour la prod à fort trafic, compléter avec **Redis / Upstash** (limite partagée entre instances serverless).  
- [x] **KPI croissance** (`/interne/croissance`, `GET /api/growth/kpi`) : allowlist `PTG_GROWTH_ADMIN_USER_IDS` et/ou `PTG_GROWTH_KPI_SECRET` (comparaison temps constant), rate limit dédié, agrégats globaux via **service role** uniquement serveur ; page **noindex**.  
- [ ] Pas de clé Places / Resend dans le client.

## Headers

- [x] En-têtes défense (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) dans `next.config.ts` — **une seule source** (pas de doublon dans `middleware.ts`).  
- [x] **HSTS** (`Strict-Transport-Security`) ajouté uniquement quand `VERCEL_ENV === "production"` (pas en preview / dev local).  
- [ ] Compléter **CSP** progressivement si scripts tiers.

## Contenu & abus

- [ ] Signalement branché + file modération.  
- [ ] Logs **sans** corps message complet en clair si sensible (RGPD).
- [x] **Seconde graille** : anonymat public actif côté API/UI (`food-rescue`) — identité du donneur masquée pour le public, déverrouillée uniquement pour le récupérateur confirmé ; identité du récupérateur visible uniquement au donneur sur ses propres annonces.

## Privacy by design

- [x] Minimisation des payloads API sur modules sensibles : éviter `select("*")` + réponses whitelistées (pas de fuite de colonnes internes).  
- [x] Signaux collectifs lieux agrégés/anonymisés avec seuil de confiance (pas d’exposition d’avis individuels).  
- [x] Politique **Confidentialité** (`/legal/confidentialite`) : mentionne usage first-party, Seconde graille, lieux / mémoire perso — à tenir alignée avec le code lors des évolutions.

## Déploiement

- [ ] Variables Vercel par environnement (Preview vs Production).  
- [ ] Pas de secrets dans les logs build.  
- [ ] Bêta ouverte : `NEXT_PUBLIC_PTG_PUBLIC_BETA=1` active bandeau + **noindex** (metadata) + **`robots.txt` disallow /** + **sitemap vide** (voir `src/lib/public-beta.ts`, `robots.ts`, `sitemap.ts`).

---

*Compléter après revue OWASP ASVS ciblée pour la surface réelle du produit.*
