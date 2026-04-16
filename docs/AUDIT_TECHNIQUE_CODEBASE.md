# Paye ta graille — Audit technique codebase (Next.js + Supabase)

**Portée** : `src/` (App Router, API routes, libs), `middleware.ts`.  
**Méthode** : revue statique alignée blueprint (`BLUEPRINT_PRODUIT_FINAL_MVP.md`), OWASP basique, exigence prod.  
**Date** : 2026-04-13 (à réactualiser après gros chantiers).

---

## 1. Architecture & structure

| Aspect | Évaluation | Détail |
|--------|------------|--------|
| **Stack** | Cohérent | Next 15 App Router, TS, Supabase SSR (`@supabase/ssr`), Zod sur les entrées API. |
| **API** | Clair | Routes REST par ressource (`/api/meals`, `/api/profile`, …), erreurs JSON homogènes (`jsonError`). |
| **Session** | Bon | `requireSession()` centralisé ; anon key côté serveur uniquement pour user-scoped RLS (comportement attendu). |
| **Séparation** | Correcte | Copy dans `lib/*-copy.ts`, petite couche `lib/api/*`. Marge : factoriser lecture « repas + participant » (répétition sur 3 routes). |

---

## 2. Sécurité

| Sujet | Gravité | Statut |
|-------|---------|--------|
| **Open redirect** sur `/auth/callback?next=` | Haute | **Corrigé** : `safeAuthRedirectPath()` (`src/lib/http/safe-redirect-path.ts`) — chemins relatifs uniquement, pas `//`, pas schémas. |
| **IDs repas non validés** | Basse | **Corrigé** : `requireUuidParam()` avant requêtes DB (`meals/[id]`, `messages`, `venue`). |
| **photo_url arbitraire** | Moyenne | **Renforcé** : URL obligatoire **https** (http localhost en dev seulement) — limite `javascript:` / exfiltration bête. |
| **RLS Supabase** | Critique (infra) | Hors fichier TS : les policies doivent refléter host/guest ; **audit SQL** obligatoire pré-prod. |
| **Clé Places** | OK | `GOOGLE_PLACES_API_KEY` serveur uniquement ; proxy `/api/places/search`. |
| **En-têtes** | Bon | `middleware.ts` : `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. |
| **Rate limiting** | Manquant | **P1** : quotas par IP / user sur `discover`, `messages`, `report`, `places` (Edge middleware ou service type Upstash). |
| **CSP** | À étudier | Pas de CSP stricte : ajout possible après inventaire scripts / styles inline. |

---

## 3. Logique métier & cohérence produit

| Sujet | Risque | Recommandation |
|-------|--------|----------------|
| **Transitions `meals.status`** | Mitigé | **Partiellement corrigé** : validation applicative dans `src/lib/meal-transitions.ts` + PATCH `meals/[id]`. Compléter par trigger SQL ou politique stricte si besoin juridique. |
| **Machine d’états** | Doc vs code | Aligner tests manuels / E2E avec `MATRICE_REPAS_ETATS_PERMISSIONS.md` (chat après `venue_confirmed` / `confirmed` déjà respecté dans `messages`). |
| **Tags profil** | Faible | PATCH insère tous les tags en `category: "personality"` : si le schéma distingue graille / ici, **corriger** le mapping. |

---

## 4. Performance & scalabilité

| Sujet | Note |
|-------|------|
| **Middleware** | `getUser()` sur presque toutes les routes : coût latence ; envisager matcher restreint si mesures le justifient. |
| **Discover** | RPC `discover_profiles` : performance = index SQL + limite `limit` (déjà bornée 1–50). |
| **Places** | `revalidate: 0` : OK pour fraîcheur ; ajouter cache court optionnel si quota Google serré. |
| **Images** | Avatars : URLs externes ; Next `<Image>` domaines distants à configurer si passage Image optimisée. |

---

## 5. Qualité & maintenabilité

| Bonnes pratiques observées | Pistes |
|----------------------------|--------|
| Zod `.strict()` sur payloads | Continuer sur toute nouvelle route. |
| Types `meal` partiels | Éviter dérive : réexporter types générés Supabase quand disponibles. |
| Duplication checks repas | Introduire `lib/api/meal-access.ts` (fetch + assert participant). |

---

## 6. Points critiques (priorisés)

1. **RLS + politiques SQL** — validation manuelle / outil avant prod.  
2. **Machine d’états repas** — une seule couche authoritative (DB ou serveur).  
3. **Rate limiting** — anti-abus discover / messages / signalement.  
4. **Tests** — au minimum tests de contrat sur routes API critiques + parcours auth.

---

## 7. Corrections livrées dans ce cycle

- `src/lib/http/safe-redirect-path.ts` + usage dans `auth/callback/route.ts`.  
- `src/lib/api/params.ts` (`requireUuidParam`) + usage `meals/[id]`, `messages`, `venue`.  
- `src/app/api/profile/route.ts` — validation `photo_url` (https / localhost dev) ; catégories tags via `tagKeyToProfileCategory`.  
- `src/lib/meal-transitions.ts` + validation PATCH `api/meals/[id]` (machine d’états).

---

## 8. Validation niveau qualité (synthèse)

| Critère | Niveau actuel (honeste) |
|---------|-------------------------|
| Prêt prod « lean » | **Proche** après RLS + états + rate limit + juridique. |
| Maintenabilité | **Bonne** pour la taille du repo. |
| Sécurité surface app | **Renforcée** sur redirect et validation IDs ; dépend fortement de Supabase. |

*Ce document complète `AUDIT_FINAL_PRE_PRODUCTION.md` / `AUDIT_PRODUIT_GLOBAL.md` (produit) par l’angle **code & infra applicative**.*
