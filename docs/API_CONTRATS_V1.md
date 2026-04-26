# Paye ta graille — Contrats API V1

**Statut** : aligné sur le code (`src/app/api/**`, Zod dans chaque handler), `PRODUCT_SPEC.md` §9 et `BLUEPRINT_PRODUIT_FINAL_MVP.md`. Les détails de validation exacts restent dans les schémas Zod côté serveur.

## Conventions

- Base : `/api`  
- Auth : session Supabase (cookies) via `requireSession` sur les routes protégées.  
- Erreurs : JSON `{ "error": { "code": string, "message": string } }` + HTTP 4xx/5xx cohérents.  
- **429** : `code: "rate_limited"` + en-tête `Retry-After` (secondes) sur routes à coût / abus — impl. `src/lib/api/rate-limit.ts`.

## Routes

### `GET /api/health`

- **Auth** : non.  
- **Réponse** : `{ ok: true, service, version, time, publicBeta? }` — pas de secret ni nonce ; `version` = champ `version` du `package.json` (suivi déploiement).

### `GET /api/growth/kpi`

- **Auth** : session Supabase + UUID dans `PTG_GROWTH_ADMIN_USER_IDS`, **ou** en-tête `x-ptg-growth-kpi-secret` égal à `PTG_GROWTH_KPI_SECRET` (les deux variables doivent être configurées côté serveur pour activer la route).  
- **Query** : `days` (1–366, défaut 30).  
- **Réponse** : `{ days, rows, thresholds }` — une ligne par jour depuis la vue `growth_kpi_daily` (totaux, funnel auth/découverte/repas/lieux/statuts/onboarding/accueil, **`funnel_invite_attributions`**, **`funnel_feedback_submitted`** si migration `20260502100000` appliquée ; sinon le serveur retombe sur une requête sans ces colonnes), partenaires, actifs ; chaque ligne inclut aussi agrégats **feedback** (`feedback_answers`, `feedback_avg_score`) issus de `user_feedback`. Champs dérivés par ligne : `partners_cta_total`, `partners_ctr_percent`. **`thresholds`** : profil d’alertes digest (voir `getGrowthKpiThresholds`).  
- **429** : rate limit par admin ou par hash de secret.

### `GET /api/profile`

- **Auth** : oui.  
- **Réponse** : `{ profile, tags, settings }` — ligne `profiles` pour `auth.uid()` (création minimale si absente), tags `profile_tags`, préférences `user_settings` (nudge, etc.).  
- **429** : non sur GET (pas de rate limit explicite sur GET dans l’impl. actuelle).

### `PATCH /api/profile`

- **Auth** : oui.  
- **Body** : JSON strict — champs partiels : `display_name`, `photo_url` (https ; `http://localhost` / `127.0.0.1` en dev), `city`, `radius_km`, `latitude`/`longitude` (paire obligatoire si l’une est envoyée), intentions (`social_intent`, `meal_intent`, …), `tags[]`, paramètres nudge (`nudge_level`, heures silencieuses, `nudge_max_per_day`).  
- **Réponse** : même forme que `GET /api/profile` (ré-agrégation après mise à jour).  
- **429** : `profile_patch`.

### `GET /api/discover`

- **Auth** : oui.  
- **Query** : `limit` optionnel (1–50, défaut 20).  
- **Serveur** : RPC Supabase `discover_profiles(p_limit)`.  
- **Réponse** : `{ profiles: [...] }` ; **503** `rpc_missing` si la RPC n’existe pas.  
- **429** : `discover_get`.

### `GET /api/discover/surprise`

- **Auth** : oui.  
- **Query** : `exclude` optionnel — liste d’UUID séparés par des virgules (profils déjà montrés récemment côté client, pour faire tourner les propositions tant qu’il existe d’autres candidats).  
- **Réponse** : `{ profiles: [...], profile, compatible_strict }` — jusqu’à **3** profils distincts par tirage (mélange aléatoire dans le pool « strict » intentions repas, sinon pool élargi) ; `profile` duplique le premier pour compat. Le compte courant est toujours exclu côté serveur (filet de sécurité). **503** si RPC absente.  
- **429** : `discover_surprise_get`.

### `GET /api/meals`

- **Auth** : oui.  
- **Réponse** : `{ meals }` — repas où l’utilisateur est hôte ou invité, avec `venues` attachées par repas.

### `POST /api/meals`

- **Auth** : oui.  
- **Body** : `{ guest_user_id: uuid, window_start?, window_end?, budget_band?, format?: "duo" | "group" }` (strict). `format: "group"` active le module potluck côté détail.  
- **Réponse** : repas créé `status: "proposed"` (+ notification e-mail invité en arrière-plan si configuré).  
- **429** : création repas (fenêtre horaire).

### `GET /api/meals/[id]`

- **Auth** : oui.  
- **Réponse** : `{ meal }` avec `venues` ; **403** si non participant ; **404** si inconnu.

### `PATCH /api/meals/[id]`

- **Auth** : oui, participant.  
- **Body** : au moins un de `status` (transitions métier : `matched`, `cancelled`, `venue_proposed`, `venue_confirmed`, `confirmed`, `completed`) ou `potluck` (mode + assignments par `user_id`).  
- **Réponse** : repas mis à jour ; erreurs **400** si transition invalide.  
- **429** : `meal_patch`.

### `POST /api/meals/[id]/venue`

- **Auth** : oui, **hôte** uniquement.  
- **Body** : `{ name, place_id?, address?, lat?, lng? }` (strict).  
- **État repas** : `matched` ou `venue_proposed` ; sinon **400** `bad_state`.  
- **429** : `venue_post`.

### `GET /api/meals/[id]/messages`

- **Auth** : oui, participant.  
- **Réponse** : `{ messages, meal_status }`.

### `POST /api/meals/[id]/messages`

- **Auth** : oui, participant.  
- **Body** : `{ body: string }` (1–4000 car.).  
- **Guard** : chat ouvert seulement si `meal.status` ∈ `venue_confirmed`, `confirmed` ; sinon **403** `chat_closed`.  
- **Réponse** : **201** `{ message }`.  
- **429** : `meal_message_post`.

### `GET /api/places/search`

- **Auth** : oui.  
- **Query** : `q` (2–120 caractères).  
- **Serveur** : Google Places Text Search (`GOOGLE_PLACES_API_KEY`) ; **503** si clé absente.  
- **Réponse** : `{ results }` (max 12 entrées normalisées).  
- **429** : `places_search`.

### `POST /api/report`

- **Auth** : oui.  
- **Body** : `{ detail: string (10–4000), contact?: string, meal_id?: uuid }` (strict). Si `meal_id` : l’utilisateur doit être hôte ou invité du repas.  
- **Réponse** : `{ ok: true, report: { id, created_at } }` ; **503** `reports_table_missing` si table absente.  
- **429** : `report_post` (6 / heure).  
- **RGPD** : persistance en base `reports` — durée de conservation à définir côté produit / purge.

### Autres handlers (même conventions d’erreur ; détail dans le code)

- **Paiements** : `POST /api/payments/checkout`, `GET /api/payments/ledger` (session) ; `POST /api/stripe/webhook` (signature Stripe, sans session utilisateur).  
- **Lieux (Google)** : `GET /api/places/autocomplete`, `nearby`, `details` ; `POST /api/places/memory` — auth session + rate limits selon route.  
- **Navette / offres** : `GET|POST /api/food-rescue`, `POST /api/food-rescue/[id]/claim`, `GET|POST /api/share-offers`, `POST /api/share-offers/[id]/reserve`.

### `POST /api/growth/event`

- **Auth** : oui (session Supabase).  
- **Body** : JSON `{ "event": string, "context"?: string, "metadata"?: object }` — `event` dans une **allowlist** serveur (liste unique `src/lib/growth-event-names.ts` : funnel, `surprise_graille_rolled`, `invite_*`, `invite_attribution`, `feedback_submitted`, `growth_alert_acknowledged`, modules Lieux, partenaires, etc.). Pour `invite_attribution`, `metadata.inv_token` est accepté (taille plafonnée) puis **retiré** de la ligne stockée ; seul un résumé `invite_signing` est persisté.  
- **Réponses** : **202** `{ "ok": true }` ; **400** validation ; **401** non connecté ; **429** `rate_limited` (fenêtre par utilisateur) ; **500** si insert `growth_events` échoue.

### `GET /api/invite/link-token`

- **Auth** : oui (session Supabase).  
- **Query** : `source` obligatoire, une des valeurs `accueil` | `decouvrir` | `repas` | `repas_matched` | `repas_confirmed` | `repas_completed`.  
- **Réponse** : `{ "token": string | null }` — jeton signé pour lien `/commencer?…&inv=…` si `PTG_INVITE_LINK_SECRET` (≥ 16 car.) est défini ; sinon `token: null` (liens anonymes uniquement).  
- **429** : rate limit par utilisateur.

### `GET /api/cron/meal-reminders`

- **Auth** : non (cron machine). **`Authorization: Bearer <CRON_SECRET>`** obligatoire ; sans variable **`CRON_SECRET`** → **503** `cron_disabled`. Mauvais secret → **401** `unauthorized`. Sans client service role → **503** `no_service_role`.  
- **Serveur** : `SUPABASE_SERVICE_ROLE_KEY` + **Resend** pour e-mails ; colonnes `meals.reminder_24h_sent_at` / `reminder_2h_sent_at` (migration `20260430100000_meals_reminder_columns.sql`).  
- **Rappels** : repas `confirmed`, invité renseigné, `window_start` futur — envois J-24 / J-2h.  
- **Clôture auto** : RPC Postgres `auto_complete_confirmed_meals(p_grace_hours)` (migration `20260430200000_auto_complete_meals_rpc.sql`). Si la RPC est **introuvable** (migration pas appliquée), **fallback** boucle Node (même règle métier). **Autre erreur RPC** → pas de fallback : `auto_complete_error` renseigné. Fin de créneau = `window_end` si ≥ `window_start`, sinon `window_start` ; puis **`PTG_MEAL_AUTO_COMPLETE_GRACE_HOURS`** (défaut **24**). Désactiver : **`PTG_MEAL_AUTO_COMPLETE=off`** (ou `0` / `false`).  
- **Réponse** : JSON `{ ok: true, scanned, reminders_24h_claimed, reminders_2h_claimed, auto_completed, auto_complete_error?, auto_complete_used_fallback? }` (`used_fallback` = **true** uniquement si la boucle Node a remplacé la RPC absente) ou `{ ok: false, error }`.

---

*Versionner ce fichier à chaque changement de contrat.*
