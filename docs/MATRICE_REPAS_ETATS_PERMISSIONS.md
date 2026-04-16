# Paye ta graille — Matrice repas : états, écrans, chat, notifications

**Objectif** : **une seule** référence pour aligner **produit**, **UX**, **backend** et **notifs** sur le flux duo V1.  
**Machine d’états** (rappel `PRODUCT_SPEC.md`) :  
`none` → `proposed` → `matched` → `venue_proposed` → `venue_confirmed` → `confirmed` → `completed` | `cancelled`

**Légende** : Chat = fil lié au repas · Notifs = push/email/in-app autorisés **si** l’utilisateur n’a pas tout coupé (voir réglages nudges).

---

## Tableau principal (duo V1)

| État | Écrans / focus utilisateur | Chat | Notifs typiques (exemples) | Annulation |
|------|----------------------------|------|-----------------------------|------------|
| `none` | Accueil, Explorer, Proposition | Non | Aucune liée au repas | N/A |
| `proposed` | Demandes reçues / attente côté envoi | Non | « {Prénom} te propose un repas » (destinataire) | Soit partie peut retirer avant acceptation (règle produit à nommer : annulation `proposed`) |
| `matched` | Match, encart règles IRL | **Paramétrable** : souvent **off** jusqu’à `venue_confirmed` (spec) | « C’est oui », « Il reste à choisir un lieu » | Soit partie, selon politique (prévenir l’autre) |
| `venue_proposed` | Choix lieu, vote ou acceptation | Idem paramétrage | « Un lieu est proposé » | Idem |
| `venue_confirmed` | Rendez-vous, carte | **Oui** si règle produit « chat après lieu » | Confirmation lieu, rappel J-24 si `confirmed` proche | Idem |
| `confirmed` | Jour J, Maps, signalement | Oui (modéré) | J-24, J-2h, changement horaire si applicable | Annulation **<24h** à traiter (politique no-show phase 2, à afficher clairement en V1 si annulation possible) |
| `completed` | Post-repas, recontact optionnel | **Fermeture** progressive : lecture seule ou archivage après X jours (à décider) | Post-repas doux, **max** fréquence nudges `RETENTION_ETHICAL.md` | N/A |
| `cancelled` | Message de clôture, retour accueil | Non (archivage) | « Le repas est annulé » (factuel, ton neutre) | État terminal |

---

## Permissions chat (décision produit à figer en build)

| Variante | Règle | Avantage | Risque |
|----------|-------|----------|--------|
| **A (stricte)** | Chat ouvert seulement après `venue_confirmed` | Moins de harcèlement avant engagement lieu | Frictions si besoin de se coordonner tôt |
| **B (souple)** | Chat dès `matched` avec **quota** messages avant lieu | Coordination | Modération plus chargée |

**Recommandation audit** : **A** pour V1 pilote, passer à **B** avec quota si retours terrain.

---

## Notifications : matrice minimale

| Transition | Destinataire | Obligatoire / opt-in |
|------------|--------------|----------------------|
| → `proposed` | Destinataire demande | Fortement recommandé (email ou push) |
| → `matched` | Les deux | Oui |
| → `venue_confirmed` | Les deux | Oui |
| Veille / jour J | Les deux si `confirmed` | Oui (rappels utiles) |
| → `cancelled` | Les deux | Oui (factuel) |
| Post `completed` | Les deux | **Opt-in** / calme selon réglages |

---

## Écrans `UI_SCREENS.md` ↔ états (raccourci)

| Écran logique | États concernés |
|---------------|-----------------|
| Demandes reçues | `proposed` (entrant) |
| Match | `matched` |
| Choix lieu | `matched` → `venue_proposed` |
| Rendez-vous / double confirmation | `venue_confirmed` → `confirmed` |
| Jour J | `confirmed` |
| Post-repas | `completed` |

---

## Zones encore ouvertes (à trancher avant scale)

1. **`completed` (MVP)** : **chacun·e peut** passer `confirmed` → `completed` (tap « Repas fait ») — `meal-transitions.ts`. **Clôture auto** : cron `GET /api/cron/meal-reminders` passe en `completed` après fin de créneau + grâce (`PTG_MEAL_AUTO_COMPLETE_GRACE_HOURS`, défaut 24). Double validation des deux parties = plus tard si besoin.  
2. **Contenu `cancelled`** : raison visible pour l’autre partie oui/non.  
3. **Durée de rétention** des messages après `completed` / `cancelled`.

---

*v1 — synchronisé avec les routes `meals` (validation transitions PATCH).*
