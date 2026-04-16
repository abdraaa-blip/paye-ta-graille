# Checklist RLS & SQL — scénarios à valider (MVP)

À exécuter dans le **SQL Editor** Supabase (rôle avec droits lecture) et depuis **deux comptes** réels (Alice / Bob) dans l’app ou `curl` avec JWT.

**Migrations de référence** : `20260412120000_core_profiles_meals.sql`, `20260412140000_mvp_discover_venues_messages_reports.sql`.

---

## Profils & tags

| # | Scénario | Attendu |
|---|----------|---------|
| P1 | Alice `select` sur `profiles` où `id = Bob` | **Refusé** (0 ligne) |
| P2 | Alice `select` sur sa ligne | **OK** |
| P3 | Alice `update` le profil de Bob | **Refusé** |
| P4 | Alice CRUD `profile_tags` pour `profile_id = Alice` | **OK** |
| P5 | Alice insert tag pour Bob | **Refusé** |

## Repas

| # | Scénario | Attendu |
|---|----------|---------|
| M1 | Alice liste les repas où elle n’est ni hôte ni invité | **0 ligne** |
| M2 | Bob tente `update` statut d’un repas Alice–Bob sans être participant | **Refusé** (trigger + RLS) |
| M3 | Transitions invalides (ex. `proposed` → `completed`) | **Erreur** `invalid_status_transition` |

## Discover

| # | Scénario | Attendu |
|---|----------|---------|
| D1 | `rpc discover_profiles` en tant qu’Alice | Retourne uniquement des profils **même ville** (normalisation casse), **pas** soi-même |
| D2 | Lecture directe `select * from profiles` (client anon) | Pas d’accès massif : policies **own row** uniquement |

## Messages repas

| # | Scénario | Attendu |
|---|----------|---------|
| C1 | Chat `select` quand repas en `matched` | **0 ligne** (policy exige `venue_confirmed`+ sauf lecture completed — aligné migration) |
| C2 | `insert` message quand statut `confirmed` | **OK** |
| C3 | `insert` message quand statut `venue_proposed` | **Refusé** |

## Lieux (venues)

| # | Scénario | Attendu |
|---|----------|---------|
| V1 | Invité·e `insert` venue | **Refusé** (hôte seul en MVP) |
| V2 | Participant `select` venue du repas | **OK** |

## Signalements

| # | Scénario | Attendu |
|---|----------|---------|
| R1 | Alice `select` signalement créé par Bob | **Refusé** |
| R2 | Alice `select` ses signalements | **OK** |

---

**Note** : la logique métier des transitions est aussi dans **`validate_meal_row`** ; les routes Next.js dupliquent des garde-fous UX — les deux doivent rester alignés (`docs/MATRICE_REPAS_ETATS_PERMISSIONS.md`).
