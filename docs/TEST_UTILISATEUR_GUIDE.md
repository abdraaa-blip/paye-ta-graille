# Test utilisateur — guide rapide (Paye ta graille)

Objectif: valider un parcours réel sans ambiguïté.

## 1) Préparer l'environnement

1. Vérifier les variables `.env.local` minimales:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Si modules Graille+ actifs:
   - `NEXT_PUBLIC_PTG_MODULE_SHARE=1`
   - `NEXT_PUBLIC_PTG_MODULE_FOOD_RESCUE=1`
   - `NEXT_PUBLIC_PTG_MODULE_PAYMENTS=1` (optionnel si Stripe pas prêt)
3. Lancer:
   - `npm run verify`
   - `npm run build`
   - `npm run start`
4. Smoke test public:
   - `npm run smoke:public`

## 2) Scénarios à jouer (ordre recommandé)

### Scénario A — premier usage
1. Ouvrir `/commencer`
2. Compléter onboarding (profil de base)
3. Arriver sur `/accueil`
4. Vérifier que la navigation principale est claire

### Scénario B — découverte et proposition
1. Ouvrir `/decouvrir`
2. Utiliser les filtres (addition + ambiance)
3. Cliquer `Proposer un repas` sur un profil
4. Vérifier arrivée sur `/repas/nouveau?guest=...`

### Scénario C — suivi repas
1. Ouvrir `/repas`
2. Vérifier état, date de mise à jour, lien vers détail
3. Ouvrir un repas `/repas/[id]` et vérifier cohérence des actions

### Scénario D — espace personnel
1. Ouvrir `/moi`
2. Changer le niveau de rappel `Calme / Normal / Off`
3. Vérifier message de confirmation et cohérence de l'état

### Scénario E — modules Graille+
1. `/graille-plus`
2. `/partage-graille` (création + réservation)
3. `/seconde-graille` (création + claim)
4. `/paiement-repas` (si Stripe branché)

## 3) Ce qu'il faut vérifier à chaque étape

- Aucun écran blanc
- Aucun bouton inactif sans explication
- Messages d'erreur compréhensibles (pas de stack technique)
- Retour arrière possible
- Temps de réponse acceptable

## 4) Simulation multi-utilisateurs (simple)

Option rapide:
- Utilisateur A: navigateur normal
- Utilisateur B: fenêtre privée ou autre navigateur

Tester:
- A propose un repas à B
- B voit la proposition
- B interagit (acceptation / suite de flow)

## 5) Critères de validation avant test externe

- `verify` et `build` passent
- migrations Supabase appliquées
- pas d'erreurs bloquantes en console navigateur sur les flows clés
- au moins 1 parcours complet A -> B validé

