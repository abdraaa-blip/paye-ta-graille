# Architecture modules « Graille+ » (Paye ta graille)

Document de référence pour **Partage de graille**, **Seconde graille** et **Paiement du repas**. La V1 (rencontres, intentions, profils) reste le socle ; les modules sont **optionnels** et pilotés par des **feature flags** côté build (`NEXT_PUBLIC_*`).

## 1. Principes

- **Modularité** : chaque module a ses routes, ses tables (ou préfixe de tables), ses jobs et ses écrans ; pas de logique métier entremêlée sans façade claire.
- **Activation** : `src/lib/feature-modules.ts` — flags `NEXT_PUBLIC_PTG_MODULE_SHARE`, `NEXT_PUBLIC_PTG_MODULE_FOOD_RESCUE`, `NEXT_PUBLIC_PTG_MODULE_PAYMENTS`. Si aucun n’est actif, pas d’entrée **Graille+** dans la nav.
- **Télémétrie** : clés stables `MODULE_TELEMETRY_KEYS` pour compter les vues / conversions par module sans coupler le code métier.

## 2. Cartographie technique

| Module | Routes app (MVP contenu)     | Backend cible (Supabase + API Next) |
|------------------|------------------------------|--------------------------------------|
| Partage culinaire | `/partage-graille` | Tables `share_offers`, `share_reservations` — API `GET/POST /api/share-offers`, `POST /api/share-offers/[id]/reserve` ; même **ville** (normalisée) que le profil |
| Seconde graille   | `/seconde-graille` | Tables `food_rescue_listings`, `food_rescue_claims` — API `GET/POST /api/food-rescue`, `POST /api/food-rescue/[id]/claim` ; quota **12** réservations / 7 j / utilisateur |
| Paiement          | `/paiement-repas`  | Table `payment_ledger` ; `POST /api/payments/checkout` (Stripe Checkout) ; `GET /api/payments/ledger` ; webhook `POST /api/stripe/webhook` (**service role** Supabase pour MAJ statut) |

**Hub** : `/graille-plus` agrège les liens et reflète l’état des flags.

## 3. Flux utilisateurs (cibles)

### 3.1 Partage de graille

1. Hôte avec **profil vérifié** (niveau à définir : téléphone, pièce d’identité légère, etc.) crée une offre : type de plat, allergènes, quantité, mode gratuit / participation (montant plafonné et visible), zone de retrait.
2. Invité parcourt liste + carte (permission explicite), réserve une ou N parts.
3. Confirmation / messagerie existante ; signalement et modération alignés sur le reste de la plateforme.

### 3.2 Seconde graille

1. Publication rapide d’un surplus (gratuit ou petit prix), créneau de disponibilité.
2. Liste et carte locale ; récupération avec **quota** (ex. X prises / semaine par compte).
3. Ton UX positif, pas culpabilisant ; rappels hygiène / DLC en disclaimer.

### 3.3 Paiement du repas

1. Depuis un repas : intention « j’invite », « 50/50 », « je me fais inviter » mappée sur un **montant ou une répartition** affichée avant paiement.
2. Paiement via **Stripe** (Checkout ou Elements) : aucune carte stockée côté app.
3. Fonds **bloqués** jusqu’à validation du repas (double confirmation, code, ou délai + règles CGU).
4. Capture / transfert vers bénéficiaire (Connect) ou remboursement partiel selon modèle juridique retenu.
5. **Logs** : chaque changement d’état en base + idempotence sur webhooks.

## 4. Sécurité & conformité paiement

- **PCI** : données carte uniquement chez Stripe.
- **Secrets** : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` en variables serveur uniquement.
- **Statut réglementaire** : à valider avec un avocat (intermédiaire de paiement, marketplace, mandataire, etc.) et, si besoin, l’**ACPR** / cadre **PSD2** — la page produit ne remplace pas cette analyse.
- **KYC** : pour les hôtes ou pros qui encaissent régulièrement, prévoir vérification Stripe Connect.

## 5. Points légaux France / UE à surveiller

- **Partage / participation** : éviter la **vente non déclarée** et la **revente de denrées** hors cadre ; privilégier don, participation forfaitaire transparente, limites de fréquence ; informations **allergènes** (réf. réglementation consommateur / pratiques loyales).
- **Hygiène** : disclaimers clairs « préparé par un particulier » ; pas de garantie « type restau pro » ; modération et signalement.
- **Données** : géolocalisation = **consentement** et finalité ; minimisation (quartier vs adresse exacte selon le flux).
- **Anti-gaspillage** : même prudence sanitaire + transparence prix (don vs vente symbolique).
- **CGU / médiation** : rôle de la plateforme (mise en relation vs vente) explicité ; procédure litige et remboursement.

## 6. Monétisation & évolution

- **Commission** faible sur flux paiement, affichée **avant** validation.
- **Premium** ultérieur : visibilité, badges vérif, quotas étendus — découpé par module pour ne pas pénaliser la V1.
- **Rollout** : activer un seul flag par environnement (staging → prod partielle → complet).

## 7. Incohérences / risques identifiés (amélioration continue)

- **Nav « Rencontres »** : le lien pointe vers `/decouvrir` (cohérent) ; la page **Événements** est encore un module partiel (`/experiences`) — à aligner sur la même nomenclature produit quand le périmètre sera figé.
- **Vérification profil** : à brancher réellement sur Partage (aujourd’hui mention produit / juridique sur la page).
- **Escrow** : le bon pattern Stripe (capture différée vs Connect avec transferts) dépend du statut légal ; prototyper deux branches techniques derrière un flag interne.

## 8. Fichiers de code utiles

- `src/lib/feature-modules.ts` — flags et clés télémétrie.
- `src/components/AppNav.tsx` — entrée conditionnelle Graille+.
- `src/app/graille-plus/page.tsx` — hub.
- `src/app/partage-graille/page.tsx`, `seconde-graille/page.tsx`, `paiement-repas/page.tsx` — contenu MVP + `ModuleDisabledNotice` si flag off.

## 9. Couche « growth » douce (sans dark patterns)

- **Copie** : `src/lib/growth-copy.ts` — micro-textes, CTA courts, libellés modules.
- **Surprise graille** : `GET /api/discover/surprise` — tirage serveur parmi `discover_profiles`, priorité aux paires d’intentions **invite ↔ etre_invite** et **partage ↔ partage** ; sinon tirage large même ville avec mention « soft ». UI : `SurpriseGrailleCard` sur Rencontres. Flag : `NEXT_PUBLIC_PTG_SURPRISE_GRAILLE` (désactiver avec `0` / `false` ; absent = activé).
- **Accueil** : phrase du jour (rotation déterministe) + lien « Invite quelqu’un à manger » pour connectés uniquement.
