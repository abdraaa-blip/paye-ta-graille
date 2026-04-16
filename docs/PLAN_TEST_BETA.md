# Plan test bêta — Paye ta graille

Document opérationnel pour **test utilisateur réel** et revue équipe. Complète `docs/ONBOARDING_DEVELOPPEUR.md` et `docs/DEPLOIEMENT_VERCEL.md`.

**Scénarios pas à pas (A → E)** : **`TEST_UTILISATEUR_GUIDE.md`**.

---

## 1. Couverture produit (résumé audit)

| Zone | Statut test local / CI | Dépendance |
|------|------------------------|------------|
| Landing, accueil, nav | OK (Playwright smoke HTTP +1 test navigateur) | — |
| Auth magic link | À valider avec **vrai** Supabase + redirect URLs | Projet Supabase |
| Profil, ville, onboarding | OK code ; données = profil + `user_settings` | Migrations |
| Découvrir (`/api/discover`) | OK si RPC `discover_profiles` déployée | Migration `ensure_discover_profiles` |
| Repas : création, détail, statuts, lieu, chat | OK si tables `meals`, `meal_messages`, venues | Migrations core |
| Signalement `/signaler` | OK si table `reports` | Migration MVP |
| Lieux (Google) | OK si clés Places + Maps | `.env` |
| **Repas ouverts**, **Expériences**, **Compagnons** (liste) | Pages **périmètre produit** : explicite « pas encore » / « à venir » | Pas de bug : intentionnel |
| **Graille+** (partage, seconde graille, paiement) | Contenu masqué ou notice si flags `NEXT_PUBLIC_PTG_MODULE_*` off | Flags + Stripe pour paiement |
| Cron rappels + clôture auto | Route `/api/cron/meal-reminders` | `CRON_SECRET`, Resend, service role, migrations rappels + RPC `auto_complete_confirmed_meals` |
| KPI `/interne/croissance` | 404 si non admin / non configuré | `PTG_GROWTH_*`, service role |

---

## 2. Tests automatisés (équipe)

```bash
npm ci
npm run verify:ship
```

Inclut : ESLint, TypeScript, `next build`, Playwright (routes publiques + rendu accueil).

Bêta SEO : `npm run test:e2e:beta-seo` (après build avec `NEXT_PUBLIC_PTG_PUBLIC_BETA=1`).

---

## 3. Tâches restantes (priorisées)

### Critique (bloquant test réel représentatif)

1. **Supabase** : appliquer **toutes** les migrations dans l’ordre sur l’environnement de test (voir `supabase/migrations/`).
2. **Auth** : redirect URLs exactes (`/auth/callback`) pour chaque origine (localhost, preview, prod).
3. **Découverte** : sans `discover_profiles`, la liste « Autour de toi » renvoie 503 — vérifier migration dédiée.

### Important (vite après le premier test)

4. **Cron** : `CRON_SECRET` sur Vercel + plan avec Cron Jobs ; sinon pas de rappels ni clôture auto serveur.
5. **E-mails** : `RESEND_*` + `SUPABASE_SERVICE_ROLE_KEY` pour repas proposé, rappels, quotas RPC.
6. **Paiement** : module désactivé par défaut ; pour tester Stripe → `NEXT_PUBLIC_PTG_MODULE_PAYMENTS=1` + clés + `docs/NOTE_PAIEMENT_STRIPE.md`.

### Amélioration (non bloquant MVP duo)

7. **Compagnons** : graphe / liste post-repas (spec Phase 2+).
8. **Repas ouverts** : fil spontané (spec).
9. **Notifs in-app** / push : non implémentés ; e-mail + rappels cron pour l’instant.
10. **Double validation** « repas fait » : un seul clic + auto après créneau (voir `docs/DECISIONS_PRODUIT_LOG.md`).

---

## 4. Scénario manuel recommandé (2 comptes)

**Compte A (hôte)**  
1. `/auth` → magic link → callback.  
2. Compléter **profil** (ville, pseudo, intentions).  
3. `/decouvrir` → choisir un profil → **proposer un repas** (ou flow équivalent depuis la fiche).

**Compte B (invité)**  
4. Même auth + profil minimal.  
5. Accepter / faire avancer le repas : **matched** → lieu (hôte) → **venue_confirmed** (invité) → **confirmed** → message chat → **Repas fait** ou attendre clôture auto.

**Vérifier**  
- Liste `/repas` des deux côtés.  
- `/signaler?meal=<uuid>` si besoin.  
- Pas d’erreur console bloquante sur `/repas/[id]`.

---

## 5. Simuler « plusieurs utilisateurs »

- Deux navigateurs profilés (ou navigation privée + normal), **deux e-mails** distincts sur le même projet Supabase.  
- Option : projet Supabase **preview** + branche Vercel pour ne pas polluer la prod.

---

## 6. Validation « tout fonctionne »

- [ ] `GET /api/health` → `ok: true` sur l’URL de test.  
- [ ] Auth aller-retour sans boucle infinie.  
- [ ] Au moins **un** repas passé de `proposed` à `confirmed` puis `completed` (manuel ou après créneau + cron).  
- [ ] Aucune erreur **500** sur une page critique du parcours ci-dessus.  
- [ ] (Option) `npm run cron:meal-reminders` avec `CRON_SECRET` + serveur lancé → JSON `ok: true`.

---

## 7. Données / mocks

- Pas de seed obligatoire : les profils sont créés à l’inscription.  
- Pour Lieux : sans clé Google, l’API renvoie 503 — acceptable pour un test « social » sans carte.  
- Stripe : utiliser **mode test** et cartes test Stripe si le module paiement est activé.

---

*Dernière mise à jour : alignée sur le code du dépôt (Next15, App Router, Supabase).*
