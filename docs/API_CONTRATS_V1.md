# Paye ta graille — Contrats API V1 (brouillon)

**Statut** : aligné `PRODUCT_SPEC.md` §9 et `BLUEPRINT_PRODUIT_FINAL_MVP.md`. Les schémas JSON exacts viendront avec l’implémentation (Zod).

## Conventions

- Base : `/api`  
- Auth : session Supabase (cookie) ou header `Authorization` selon implémentation retenue.  
- Erreurs : JSON `{ "error": { "code": string, "message": string } }` + HTTP 4xx/5xx cohérents.  
- **429** : `code: "rate_limited"` + en-tête `Retry-After` (secondes) sur routes à coût / abus (discover, messages, création repas, Places, signalement, profil, transitions repas) — impl. `src/lib/api/rate-limit.ts`.

## Routes

### `GET /api/health`

- **Auth** : non.  
- **Réponse** : `{ ok: true, service, time }`.

### `GET /api/profile` (à implémenter)

- **Auth** : oui.  
- **Réponse** : profil du `auth.uid()`.

### `PATCH /api/profile` (à implémenter)

- **Auth** : oui.  
- **Body** : champs profil partiels validés.

### `GET /api/discover` (à implémenter)

- **Auth** : oui.  
- **Query** : `city`, `radius_km`, filtres intentions.  
- **Réponse** : liste **limitée** de profils publics (champs non sensibles uniquement).

### `POST /api/meals` (à implémenter)

- **Auth** : oui.  
- **Body** : `guest_user_id` ou identifiant cible, `window_start`, `budget_band`, …  
- **Réponse** : repas créé en `proposed`.

### `GET|PATCH /api/meals/[id]` (à implémenter)

- Transitions d’état selon règles métier + participant.

### `POST /api/meals/[id]/venue` (à implémenter)

- Lieu Places attaché.

### `GET|POST /api/meals/[id]/messages` (à implémenter)

- Guard : ouvert seulement si matrice le permet.

### `GET /api/places/search` (à implémenter)

- **Auth** : oui.  
- **Query** : `q`.  
- **Serveur** : appelle Google Places avec clé secrète.

### `POST /api/report` (à implémenter)

- **Body** : type, `meal_id` optionnel, description.  
- **RGPD** : conservation limitée.

---

*Versionner ce fichier à chaque changement de contrat.*
