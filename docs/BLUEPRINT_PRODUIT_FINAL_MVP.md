# Paye ta graille — Blueprint produit final & MVP développable (v1)

**Rôle** : **document unique** pour aligner **produit, design, dev, legal, ops** avant et pendant le build.  
**Règle** : chaque bloc doit répondre oui à :

> *« Est-ce que cela rend ce produit meilleur, plus clair, plus fort, plus désirable ? »*

**Synthèse stratégique** : `PROJET_PTGR_VERSION_OPTIMISEE.md` · **Décisions** : `DECISIONS_PRODUIT_LOG.md`.

**ADN** : repas **IRL**, intentions **claires**, **table avant dating**, **confiance**, pic émotionnel **hors app**.

---

## 1. Vision produit (version finale courte)

**Une phrase** : Paye ta graille transforme l’envie de **ne pas manger seul** en **rendez-vous réel**, avec des **intentions explicites** et un **cadre de confiance**.

**Différenciation** : pas une app de rencontre marketing-first ; le **repas** est le prétexte **normal** ; le succès se mesure en **tables complétées**, pas en scroll.

---

## 2. MVP V1 (gel périmètre « développable maintenant »)

### Inclus

| Domaine | Périmètre |
|---------|-----------|
| Auth | Email magic link (ou téléphone si priorisé) |
| Profil | Pseudo, photo, ville, rayon, intentions sociale + repas, tags, contraintes alimentaires, nudges |
| Discover | Liste profils compatibles, filtres rayon / budget, états vides |
| Repas duo | Proposition → acceptation/refus → match → lieu → double confirmation → jour J → post-repas |
| Chat | Minimal, **après règle choisie** (recommandation audit : post `venue_confirmed`, variante A dans `MATRICE_REPAS_ETATS_PERMISSIONS.md`) |
| Lieu | Recherche Places **côté serveur** |
| Notifs | Email (MVP) + in-app si temps ; rappels J-24 / J-2h si repas confirmé |
| Confiance | Signalement + **admin minimal** (champ ban manuel) |
| Métriques | Instrumenter funnel C1–C5 (`METRICS_PRODUCT.md`) |

### Exclu du code V1.0 (documenté, pas oublié)

| Exclu | Document |
|-------|----------|
| Feed repas ouvert, annonces | V1.5 `PRODUCT_SPEC` |
| Groupe, événements, billets | V2 |
| Contacts graille **liste dédiée**, jauge, **Mes tables** complète | V2 `UX_SECTION_AMIS_MES_TABLES.md` |
| Table surprise, repas suspendu | Modules |
| Premium payant, Stripe | Post traction |
| PWA, son | Option |

---

## 3. Architecture technique (référence implémentation)

### Stack

| Couche | Choix |
|--------|--------|
| Frontend | **Next.js** (App Router), **TypeScript** strict, RSC où pertinent |
| Hébergement | **Vercel** |
| Backend / data | **Supabase** : Auth, Postgres, **RLS**, Storage (photos), Realtime **si** chat |
| Email | **Resend** (ou équivalent) |
| Lieux | **Google Places** (proxy route serveur, clé jamais client) |

### Schéma logique (V1)

```
Client (Next) ──► API Routes / Server Actions ──► Supabase (RLS)
                      │
                      └──► Places API (serveur uniquement)
                      └──► Resend (notifs email)
```

### Base de données V1 (tables minimales)

| Table | Rôle |
|-------|------|
| `profiles` | id = auth.uid, display_name, photo_url, city, radius_km, social_intent, meal_intent, … |
| `profile_tags` | (profile_id, tag_key, category) |
| `user_settings` | nudge_level, locale |
| `meals` | duo, statuts, fenêtre, budget, participants |
| `meal_participants` | meal_id, user_id, role, RSVP |
| `venues` | meal_id, place_id, coords, nom |
| `threads` | lié meal_id |
| `messages` | RLS strict par participant |
| `reports` | signalements (schéma minimal MVP) |

**Index** : ville + intentions + statut repas ; géo selon `SCALE_ARCHITECTURE.md` (geohash ou PostGIS phase 2).

### API V1 (routes Next)

| Route | Méthode | Rôle |
|-------|---------|------|
| `/api/profile` | GET/PATCH | Profil authentifié |
| `/api/discover` | GET | Liste compatible |
| `/api/meals` | POST | Créer proposition |
| `/api/meals/[id]` | GET/PATCH | Transitions d’état |
| `/api/meals/[id]/venue` | POST | Attacher lieu |
| `/api/meals/[id]/messages` | GET/POST | Chat **guard** |
| `/api/places/search` | GET | Proxy Places |
| `/api/report` | POST | Signalement |

**Transversal** : rate limiting sur discover, meals, messages ; logs **sans** PII inutile.

---

## 4. Machine d’états repas (cœur logique)

```
none → proposed → matched → venue_proposed → venue_confirmed → confirmed → completed | cancelled
```

**Source détaillée** : `MATRICE_REPAS_ETATS_PERMISSIONS.md` + `PRODUCT_SPEC.md` §4.

### Décision à figer jour 1 (inscrire dans `DECISIONS_PRODUIT_LOG.md`)

**`completed`** : recommandation blueprint **MVP** : les **deux** participants tapent **« Repas fait »** (ou équivalent) **ou** passage auto **24h** après l’horaire confirmé **si** aucun signalement ouvert (à trancher produit, une seule règle suffit pour ship).

---

## 5. UX écran par écran (V1) — carte vers les docs détaillés

| # | Écran | CTA principal | Textes | Wireframe |
|---|-------|---------------|--------|-----------|
| 1 | Splash / valeur | Commencer | `COPY_UX` §3 | `UI_SCREENS` §1 |
| 2 | Auth | Continuer | idem | §2 |
| 3 | Profil minimal | Continuer | idem | §3 |
| 4 | Intention sociale | Continuer | idem | §4 |
| 5 | Intention repas | Continuer | idem | §5 |
| 6–8 | Tags | Continuer | idem | §6 |
| 9–10 | Objectif, préférences table | Continuer | idem | §7 |
| 11 | Contraintes alimentaires | Continuer | idem | §8 |
| 12 | Nudges | Terminer | idem | §8 |
| 13 | Accueil | Explorer / Proposer | idem | §9 |
| 14 | Explorer | Proposer un repas | idem | §10 |
| 15 | Fiche profil | Proposer un repas | idem | §11 |
| 16 | Proposition repas | Envoyer | idem | §12 |
| 17 | Demandes | Accepter / Refuser | idem | §13 |
| 18 | Match | Choisir un lieu | idem | §14 |
| 19 | Choix lieu | Proposer ce lieu | idem | §15 |
| 20 | Rendez-vous | J’y vais | idem | §16 |
| 21 | Chat | Envoyer | idem | §17 |
| 22 | Jour J | Ouvrir Maps | idem | §18 |
| 23 | Post-repas | Terminer / suite | idem | §19 |

**Source copy** : `COPY_UX_COMPLET_V1.md` · **Hiérarchie** : `UI_SCREENS.md` §22.

---

## 6. Design system (implémentation)

**Tokens** : `IDENTITE_VISUELLE_COMPLETE.md` §2 · **DA** : `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` · **CSS / composants** : `DESIGN_SYSTEM.md`.

**Résumé** : fond `ptg-bg` **#F6F1E8**, texte **#1A1714**, accent **#D56E2A**, success olive **#5A7A5E**, danger **#A33A32** ; typo UI **Inter** ou **Source Sans 3** ; display **Fraunces** ou **Source Serif 4** ; motion 200–400 ms, `prefers-reduced-motion`.

---

## 7. Logique sociale (règles code + copy)

- **Trois intentions repas** : contrat social et économique lisible.  
- **Trois intentions sociales** : cadrage sans imposer le dating en marketing.  
- **Pas de DM à froid** ; chat **borné** au repas selon matrice.  
- **Refus élégant** ; **signalement** ; **lieu public** rappelé.  
- **Recontact graille** : opt-in **mutuel** post-repas (préfigure **Mes tables** V2).

---

## 8. Systèmes clés (niveau produit)

| Système | V1 | Après |
|---------|-----|--------|
| « Matching » | **Mutuel** sur proposition explicite, pas algo opaque | Affinage filtres |
| Repas | Machine d’états §4 | No-show policy |
| Groupes | — | V2 |
| Table surprise | — | Module |
| Repas suspendu | — | Module |
| Mes tables | — | V2 `UX_SECTION_AMIS_MES_TABLES.md` |

---

## 9. Engagement & rétention

**Canonical** : `SYSTEME_ENGAGEMENT_NATUREL.md` + `RETENTION_ETHICAL.md`.  
**Implémentation** : nudges **plafonnés**, réglages calme/normal/off, pas de culpabilité.

---

## 10. Sécurité & modération (MVP)

- RLS **testé** sur profiles, meals, messages.  
- Signalement **+** file admin (Notion ou mini UI).  
- Rappels **lieu public** ; pas de promesse de sécurité absolue.  
- **CGU / confidentialité** : `LEGAL_STRUCTURE_OFFICIEL.md` **avant** ouverture pub large.

---

## 11. Business (V1)

**Revenu** : **aucun** en V1.0 si possible (focus liquidité + confiance).  
**Ensuite** : Premium encadré (`PRODUCT_SPEC` §11), B2B resto, événements V2.

---

## 12. Ordre d’implémentation (sprints indicatifs)

| Sprint | Livrables |
|--------|-----------|
| **0** | Repo, CI, Supabase, Auth, `profiles` + RLS, layout + tokens |
| **1** | Onboarding complet (état client), discover lecture seule |
| **2** | `meals` proposed / matched, notifs email, écrans 16–18 |
| **3** | Lieu, confirmation, jour J, post-repas |
| **4** | Chat + guard, signalement, admin minimal, métriques |
| **5** | Durcissement perf, tests E2E flux repas, **pilot launch** une ville |

---

## 13. Métriques de lancement

North Star pilot : **tables `completed` / semaine / zone pilote** + **show-up** + **C5** (inscrit complet → `completed` 14j). Voir `METRICS_PRODUCT.md`.

---

## 14. Prochaine action matérielle

1. **Repo applicatif** : le codebase **Paye ta graille** (Next + Supabase) est déjà amorcé — synthèse lancement **`LIVRABLE_MVP_REFERENCE_LANCEMENT.md`**.  
2. Poursuivre les sprints §12 selon l’état réel des tables RLS, du parcours `completed`, et des tests.  
3. Nouveau dépôt vide : alors `git init`, scaffold, et caler les écrans sur le tableau §5.

**Ce blueprint** ne remplace pas le code : il **oriente** l’implémentation et le gel MVP.

---

*v1 blueprint. Mettre à jour après gel `completed` et choix chat inscrits dans `DECISIONS_PRODUIT_LOG.md`.*
