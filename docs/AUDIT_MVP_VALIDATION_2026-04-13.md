# Audit validation MVP — Paye ta graille (2026-04-13)

**Périmètre** : alignement **documentation produit** ↔ **code** (`paye-ta-graille/`), avec focus **test utilisateur réel immédiat**.  
**Verdict global** : **testable en bêta fermée** si Supabase (migrations + auth), `GOOGLE_PLACES_API_KEY` optionnelle (saisie lieu manuelle), et parcours magic link sont configurés. **Non « terminé produit »** : emails transactionnels, admin signalements, juridique publique, métriques instrumentées.

---

## 1. Validation par pilier

| Pilier | Statut | Commentaire |
|--------|--------|-------------|
| Auth magic link | **OK** | `signInWithOtp`, callback sécurisé (`safe-redirect-path`), cookies session corrects après correction callback. |
| Profil + intentions + tags | **OK** | API `GET/PATCH /api/profile`, onboarding local, sync brouillon. |
| Discover | **OK** | RPC `discover_profiles` (même ville), filtres client ; **bloquait sans ville** → **corrigé** (gate post-login + bannière accueil). |
| Repas duo + états | **OK** | Trigger SQL + API + `meal-transitions.ts` ; lieu ; chat matrice A. |
| Chat | **OK** | Ouvert `venue_confirmed` / `confirmed` ; lecture étendue `completed` côté RLS. |
| Lieux | **Partiel** | Places serveur si clé ; sinon saisie manuelle (copy MealDetail). |
| Signalement | **Partiel** | `POST /api/report` + table ; **pas d’interface admin / file** dans l’app. |
| Notifs email (rappels) | **Manquant** | Blueprint / livrable : Resend + événements repas — **non implémenté** dans le code. |
| Légal | **Brouillon** | Pages `/legal/cgu`, `/legal/confidentialité` + footer ; **relecture juridique requise** avant pub large. |
| RLS | **OK sur papier** | Migrations ; **validation manuelle** : `RLS_SCENARIOS_CHECKLIST.md`. |
| Rate limiting | **OK (V1)** | Par utilisateur en mémoire ; Upstash recommandé si scale. |
| Modules « vision » (repas ouverts, expériences) | **Hors MVP code** | Pages explicites « en construction » — **ne bloquent pas** le duo. |

---

## 2. Éléments manquants ou faibles (honest list)

**Bloquants pour une ouverture large (pas pour une bêta technique)**

1. CGU / confidentialité **validées juridiquement**.  
2. **Admin minimal** signalements (liste, statuts, ban).  
3. **Emails** (invitation repas, rappel J-24 / J-2h, magic link prod via SMTP fiable).  
4. **Observabilité** (Sentry, logs structurés) sur incidents utilisateur.  
5. **Tests E2E** parcours : auth → profil → discover → proposition → acceptation → lieu → chat → `completed`.  
6. **Décision figée** `completed` : double tap vs auto 24h (`DECISIONS_PRODUIT_LOG` encore « à valider ») — le code autorise déjà `PATCH → completed` depuis `confirmed`.

**Approximations / dette**

- Blueprint mentionne `meal_participants` / threads génériques : le **code** utilise **`guest_user_id` sur `meals`** + `meal_messages` — **cohérent MVP**, doc schéma à traiter comme « logique équivalente ».  
- Discover : pas de filtre **rayon géo** réel (égalité **ville** texte) — acceptable pilote une ville.  
- `aria-current` sur la nav : retiré sur écrans « repas » pour éviter **faux positif** « Moi ».

---

## 3. Corrections effectuées lors de cet audit

| Changement | Fichiers / zone |
|------------|-----------------|
| **Gate profil** après auth si ville ou pseudo insuffisant | `auth/callback/route.ts` (tampon cookies + une seule redirect) |
| Bannière **complète ta ville** sur accueil | `AccueilClient.tsx`, `ux-copy.ts` |
| Bannière **première connexion** sur fiche profil | `profil/page.tsx`, `ProfilClient.tsx`, `ux-copy.ts` |
| Libellé canon **Je me fais inviter** | `intent-labels.ts`, `ux-copy.ts`, `LIVRABLE_MVP_REFERENCE_LANCEMENT.md` |
| Nav repas : plus de `aria-current="page"` erroné sur « Moi » | `RepasListClient`, `NouveauRepasForm`, `repas/nouveau/page`, `MealDetailClient` |
| Décision tracée | `DECISIONS_PRODUIT_LOG.md` |
| Erreurs API côté client (dont corps vide / 429) | `read-api-error.ts` — repas détail, nouveau repas, signaler |
| Bandeau bêta optionnel | `BetaBanner` + `NEXT_PUBLIC_PTG_PUBLIC_BETA=1` |

---

## 4. Améliorations proposées (priorisées post-audit)

| Priorité | Action | Pourquoi |
|----------|--------|----------|
| P0 | Passer la **checklist RLS** avec 2 comptes réels | Confiance données. |
| P0 | **SMTP / Resend** sur Supabase + modèles mail MVP | Sans ça, friction auth et aucun rappel repas. |
| P1 | **E2E** (Playwright) sur URL de préprod | Régression avant chaque release. |
| P1 | **Écran admin** minimal (signalements) ou export SQL + procédure | Modération blueprint. |
| P2 | **Upstash** rate limit | Cohérence multi-instance Vercel. |
| P2 | Instrumenter funnel C1–C5 (`METRICS_PRODUCT.md`) | Pilotage North Star. |

---

## 5. Plein potentiel en phase de test (réponse directe)

Pour que la bêta **apprenne vite** sans trahir l’ADN :

1. **Densité** : lancer **une ville / un quartier** avec seuil de profils minimum (gate liquidité).  
2. **Onboarding humain** : les 20–50 premiers testeurs peuvent avoir un **message d’accueil** (email ou Notion) — pas besoin de feature code.  
3. **Boucle fermée** : questionnaire5 questions post-repas (Typeform lien) — **hors app** acceptable MVP.  
4. **Transparence** : bannière « bêta » sur l’accueil (option) pour calibrer les attentes (repas ouverts / expériences = vision).  
5. **Sécurité ressentie** : rappeler **lieu public** + **signalement** visibles avant premier rendez-vous (copy déjà présente partiellement — renforcer sur fiche repas si besoin).

---

## 6. Conclusion

- **Validation MVP technique** : **oui**, pour **bêta fermée** avec config infra correcte.  
- **Validation « produit fini »** : **non** — il manque notifs, admin, juridique, tests automatisés et arbitrage `completed` final.  
- **Blocage utilisateur réel majeur** sur discover vide : **réduit** par la gate profil et les bannières.

*Document vivant : mettre à jour après chaque release bêta.*
