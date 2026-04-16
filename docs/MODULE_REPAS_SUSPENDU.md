# Paye ta graille — Module **Repas suspendu** (générosité intégrée)

**Rôle** : psychologie sociale + économie comportementale + design de systèmes **altruistes**.  
**Objectif** : générosité **élégante**, **non intrusive**, **positive** — renforce le **lien** et l’**image** de la marque sans **stigmatiser** ni créer de **hiérarchie visible**.

**Document complémentaire** : `SUSPENDED_MEAL_AND_DISCOVERY.md` (roadmap impact, lieux).

---

## 0) Dimension produit — pourquoi c’est rare (et fragile)

**Ce que le module introduit** : l’idée n’est pas seulement « offrir un repas à un inconnu » — c’est **l’altruisme dans une app sociale**, avec une **signature émotionnelle** possible pour Paye ta graille.

**Si c’est bien exécuté** : plaisir de donner, surprise positive côté receveur, **viralité émotionnelle** naturelle, image de marque chaleureuse.

**Si c’est mal pensé** : malaise, culpabilité, sentiment d’être « classé », instrumentalisation, rumeurs — **la magie disparaît**.

**Noms à privilégier** (éviter *don* lourd, *charité* mal perçue) :

| Usage | Formulation |
|--------|-------------|
| Concept fort | **Repas suspendu** (référence culturelle café suspendu) |
| Action | **Offrir une table** · **Offrir un repas** |
| Statut neutre | **Table offerte** |
| Variante | **Inviter quelqu’un** (dans le flux, sans infantiliser) |

**Jamais en copy receveur** : « tu es pauvre donc tiens », « tu mérites », toute **hiérarchie visible** entre utilisateurs.

---

## 1) Principes non négociables

| Principe | Implémentation |
|----------|----------------|
| **Dignité** | jamais de libellé ou logique « pauvre / aidé / méritant » |
| **Égalité perçue** | pas de badge public « receveur » ; pas de classement |
| **Autonomie** | opt-in explicite pour **recevoir** ; opt-in pour **remercier** |
| **Transparence** | l’utilisateur comprend **pourquoi** il peut recevoir (règles), sans exposition des autres |
| **Pas de gamification agressive** | pas de leaderboard dons ; pas de points criards |

**Cadre comportemental** : favoriser l’**altruisme warm-glow** (plaisir de donner) et la **gratitude** sans **surveillance** ni **comparaison**.

---

## 2) Architecture du module (vue d’ensemble)

```
[ Offrir un repas ]  →  Paiement  →  Crédit "table suspendue"
                              ↓
         File d’attribution (pool opt-in + règles + tirage équitable)
                              ↓
         Notification receveur (douce)  →  Réserver créneau / lieu
                              ↓
         Repas complété  →  [ Remercier ] (optionnel, anonymisable)
                              ↓
         Accusé réception côté donneur (agrégé / anonyme)
```

---

## 3) UX complète (parcours)

### 3.1 Point d’entrée (donneur)

- **Emplacement** : menu **« + »** ou section **Profil > Générosité** — **pas** sur l’écran d’accueil principal en V1 (évite saturation + instrumentalisation).  
- **Bouton** : **« Offrir une table »** (préféré à « don » / « charité »).

**Écran D1 — Explication (3 lignes max)**  
- « **Une table pour quelqu’un qui l’a demandée.** »  
- « **Anonyme possible.** Pas de liste, pas de jugement. »  
- Lien **« Comment ça marche ? »** (sheet courte).

**Écran D2 — Montant**  
- Chips : 10 € · 15 € · 20 € · **Autre** (borné min/max légaux produit).  
- Texte : « **Le montant devient un crédit repas** chez nos partenaires ou en bon d’expérience. » *(à caler juridiquement)*

**Écran D3 — Message (optionnel)**  
- Placeholder : « Un mot sympa (optionnel) » — max 120 car.  
- Toggle **« Rester anonyme »** (défaut : selon positionnement produit ; recommandation : **anonyme par défaut** pour réduire malaise).

**Écran D4 — Paiement**  
- Stripe (ou équivalent) ; récap ; CTA **« Confirmer »**.

**Écran D5 — Confirmation**  
- « **Merci.** Ta table est suspendue. »  
- Sous-texte : « **Quand quelqu’un la prendra**, tu recevras une notification discrète. » *(si politique notif donneur)*

### 3.2 Attribution → notification (receveur)

**Push / in-app (doux)**  
- Titre : **« Une table pour toi »**  
- Corps : « **Quelqu’un t’invite à manger.** Choisis un créneau cette semaine. »  
- CTA : **« Voir les propositions »** — jamais « tu as reçu une aumône ».

**Écran R1 — Valorisation sans hiérarchie**  
- Visuel chaleureux (illustration table, pas « cadeau géant » kitsch).  
- « **C’est une table Paye ta graille** — comme les autres, avec une intention en plus : quelqu’un a voulu **ouvrir une place**. »

**Écran R2 — Choix concret**  
- Même UX qu’un repas classique : **créneaux**, **zone**, **lieux éligibles** au montant.  
- **Aucun** badge « offert » visible pour les tiers sur le profil receveur.

**Écran R3 — Confirmation**  
- Identique au flux repas standard (`confirmed`) — **normalisation** = dignité.

### 3.3 Post-repas

**Écran T1 — Remerciement optionnel**  
- « **Envoyer un merci ?** » — deux options : **« Oui, anonyme »** · **« Oui, avec prénom »** · **« Non merci »**  
- Interdit : obligation ; interdit : notation du donneur.

**Écran T2 — Côté donneur (notification)**  
- « **Quelqu’un a profité de ta table.** » + extrait message si autorisé, sinon **« Message anonyme : Merci. »**

---

## 4) Logique d’attribution (« intelligente » = **équitable + opaque sur les personnes, transparente sur les règles**)

### 4.1 Pool d’éligibilité (entrées **uniquement** déclaratives / comportementales non sensibles)

Une personne peut **recevoir** une table suspendue si **toutes** les conditions suivantes sont vraies (exemple V1) :

1. **Opt-in actif** : « **Je peux recevoir une table offerte** » (formulation neutre) + rappel pédagogique une ligne.  
2. **Profil complet** minimum (téléphone vérifié, intention repas, lieu).  
3. **Pas de suspension** / signalement grave en cours.  
4. **Cooldown** : n’a pas reçu de table suspendue dans les **30 derniers jours** (évite concentration).  
5. **Disponibilité** : a indiqué au moins **1 créneau** recevable dans la fenêtre du don (ville compatible).

**Interdit dans l’algo V1** : inférence sur revenu, fréquence de repas, « activité faible », santé mentale, apparence, minorité protégée comme critère de **priorisation**.

### 4.2 Matching « intelligent » **légitime** (non stigmatisant)

Paramètres **autorisés** pour rapprocher offre et receveur :

- **Ville / rayon** (cohérence logistique)  
- **Fenêtre temporelle** (validité du crédit)  
- **Montant** ↔ **restaurants / formules éligibles**  
- **Contraintes alimentaires** déjà déclarées (halal, sans alcool, etc.) — **uniquement** pour **compatibilité repas**, pas pour scoring social

### 4.3 Sélection finale parmi l’ensemble éligible

**Méthode recommandée** : **tirage pondéré aléatoire** avec poids **uniquement** liés à l’**équité temporelle**, ex. :

- poids de base = 1  
- **léger bonus** si la personne n’a **jamais** reçu de table suspendue (max 1× vie ou plafonné) — à formuler en interne comme « **priorité d’accès** » **sans** affichage utilisateur  
- **malus** si a **refusé sans motif** plusieurs fois de suite (évite gaspillage) — avec **plafond** et **transparence** dans l’aide (« si tu refuses souvent au dernier moment, tu seras moins prioritaire »)

**Alternative** : **FIFO** parmi opt-in (simple) — moins « smart » mais très défendable.

**Transparence utilisateur** : page **« Comment les tables sont attribuées ? »** — règles en langage humain, **zéro** promesse de « on choisit le plus méritant ».

---

## 5) Textes émotionnels (banque FR)

### Donneur
- « **Offrir une table** »  
- « **Une place de plus à la table du monde.** » *(usage modéré)*  
- « **Merci.** Ta table est suspendue. »  
- Erreur paiement : « **Petit souci de paiement.** Réessaie dans un instant. »

### Receveur

- « **Une table pour toi.** »  
- « **Quelqu’un t’invite à manger** » *(notification — simple, beau)*  
- « **Une table t’attend** » + détails créneau / lieu (comme un repas normal)  
- Variante : « **Quelqu’un t’invite à manger** — à ta façon : tu choisis le créneau. »  
- Refus sans culp : « **Pas de souci.** La table ira à quelqu’un d’autre cette semaine. »

### Remerciement
- « **Merci pour ce moment** » *(après repas — ton chaleureux, optionnel)*  
- « **Un merci à envoyer ?** » *(jamais « tu dois remercier »)*  
- Confirmation : « **C’est envoyé.** »

### Anti-stigmatisation (interdits)
- « Tu as été choisi parce que… »  
- « Aide aux démunis » sur le flux receveur  
- Toute métrique visible « niveau de générosité » comparée aux autres

---

## 6) Fidélité / points (si présent)

**Recommandation V1** : **aucun point visible** pour le don.  
**V1.5** : **badge privé** donneur (« **Hôte du cœur** » visible **uniquement** sur son profil **lui**) — pas de classement.

Si **points** existent pour **effets produit** (priorité file événement) : **déclaration claire** dans les paramètres (« **impact** de tes tables offertes ») — pas de surprise.

---

## 7) Risques & solutions

| Risque | Solution |
|--------|----------|
| Stigmatisation « receveur » | **normaliser** le flux comme un repas ; pas de badge public ; copy neutre |
| Rumeur « arnaque / argent qui disparaît » | **traçabilité** comptable + transparence partenaires + FAQ |
| Gaspillage (crédits non utilisés) | expiration claire + **relance** douce receveur + **remboursement** donneur selon politique légale |
| Fraude (multi comptes pour recevoir) | vérif téléphone, cooldown, détection velocity, modération |
| Pression morale sur donneur | pas de compteur public ; pas de push « donne encore » |
| Pression sur receveur | refus facile ; pas de décompte de « dette » |
| Complexité juridique (don vs vente de bon) | **valider** montage avec expert **avant** scale |
| « Algo intelligent » perçu comme injuste | tirage + règles publiques + support humain sur contestation |

---

## 8) Métriques produit (saines)

- **Taux d’utilisation** du crédit (attribué → `completed`)  
- **Délai** attribution → completed  
- **Taux de remerciements** (volontaire — indicateur doux, pas KPI de performance receveur)  
- **Répétition don** (donneurs récurrents) — **privé**, agrégé analytics

---

## 9) Phasage (rappel)

- **V1** : utilisateur → utilisateur, opt-in, tirage équitable, remerciement optionnel.  
- **V2** : restos partenaires, bons formule.  
- **V3** : **asso** + vouchers — hors logique « méritant » algorithmique.

---

## 10) Prompt maître (implémentation)

```text
[MODULE] Repas suspendu — Paye ta graille.

[CONTRAINTES] Pas de stigmatisation ; pas de hiérarchie visible ; pas de gamification agressive ; opt-in receveur ; algo = règles publiques + compatibilité repas + tirage équitable (pas d’inférence socio).

[LIVRABLES] (1) Flows donneur/receveur/post-repas (2) États machine + tables DB (3) Copy FR finale (4) Page transparence attribution (5) Liste risques + tests E2E (6) Feature flag kill switch

[ÉLÉVATION] Propose 3 améliorations UX qui augmentent la dignité perçue ; signale tout trade-off légal.
```

---

## 11) Prompt « coalition » — générosité intégrée (à coller dans Cursor)

```text
Tu es un expert en psychologie sociale, économie comportementale et design de systèmes altruistes.

Mission : concevoir un système de générosité intégré à "Paye ta graille".

Nom du module : "Repas suspendu" (ou équivalent : Offrir une table, Table offerte).

Objectif : permettre aux utilisateurs d'offrir un repas à un autre utilisateur de manière élégante, non intrusive et émotionnellement positive.

Contraintes :
- aucune stigmatisation
- aucune hiérarchie visible entre utilisateurs
- expérience simple et naturelle
- pas de gamification agressive

Fonctionnalités :
- bouton "offrir un repas" / "offrir une table"
- paiement simple et sécurisé
- attribution intelligente parmi opt-in (pas "qui mérite")
- réception douce et valorisante
- message de remerciement optionnel au donneur

Tu dois définir : UX complète, logique d'attribution, textes émotionnels, risques et solutions.

Objectif final : mécanique de générosité naturelle qui renforce le lien social et l'image du produit.

Contexte source de vérité : docs/MODULE_REPAS_SUSPENDU.md — ne pas contredire les principes dignité / opt-in / tirage équitable.
```

---

*v1 — valider wording « recevoir une table offerte » en test utilisateur (5 entretiens).*
