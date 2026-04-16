# Paye ta graille — Sécurité (checklist code & infra)

## Authentification

- [ ] Supabase Auth uniquement via **anon key** côté client.  
- [ ] **Service role** réservé aux scripts admin / Edge Functions isolées, jamais dans le bundle client.  
- [ ] Sessions : préférer patterns officiels `@supabase/ssr` (middleware refresh si activé).

## Données (RLS)

- [ ] **RLS activé** sur toutes les tables exposées au client.  
- [ ] Aucune policy `using (true)` sur données personnelles sans **analyse** (discover = RPC ou route serveur filtrée).  
- [ ] Tests : utilisateur A **ne lit pas** les repas / profils de B sans règle explicite.

## API Routes

- [ ] Valider le corps (Zod ou équivalent) sur **POST/PATCH**.  
- [x] **Rate limiting** applicatif (fenêtre glissante par `userId` sur discover, création repas, messages, lieu Places, signalement, profil, transitions repas) — voir `src/lib/api/rate-limit.ts`. Pour la prod à fort trafic, compléter avec **Redis / Upstash** (limite partagée entre instances serverless).  
- [ ] Pas de clé Places / Resend dans le client.

## Headers

- [ ] `middleware.ts` : headers sécurité (déjà en place) ; compléter **CSP** progressivement.

## Contenu & abus

- [ ] Signalement branché + file modération.  
- [ ] Logs **sans** corps message complet en clair si sensible (RGPD).

## Déploiement

- [ ] Variables Vercel par environnement (Preview vs Production).  
- [ ] Pas de secrets dans les logs build.  
- [ ] Bêta ouverte : `NEXT_PUBLIC_PTG_PUBLIC_BETA=1` active bandeau + `robots: noindex` (évite indexation involontaire).

---

*Compléter après revue OWASP ASVS ciblée pour la surface réelle du produit.*
