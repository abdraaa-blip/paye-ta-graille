# Paye ta graille — Document vision produit (officiel v1)

**Statut** : document de **cadrage** pour investisseurs, recrutement, partenaires et équipe produit.  
**Compléments techniques** : `PRODUCT_SPEC.md` · **Métriques** : `METRICS_PRODUCT.md` · **Engagement** : `SYSTEME_ENGAGEMENT_NATUREL.md`.

---

## 1. Idée du projet

**Paye ta graille** est une plateforme pour organiser des **repas réels** entre humains, avec des **intentions explicites** (social, partage du coût, invitation). Ce n’est **ni** une application de rencontre marketing-first, **ni** une application restaurant pure, **ni** une application de paiement sociale. Le cœur du produit : **une table**, un **moment IRL**, un **cadre lisible**.

Le nom porte une **double lecture** (payer le repas / le « pacte » oral autour de la graille) et une **personnalité** francophone assumée. Le design et la voix compensent la dureté possible du nom par **chaleur**, **clarté** et **respect**.

---

## 2. Mission

**Réduire la solitude à table** et **faciliter le lien** en s’appuyant sur le **repas** comme prétexte social **universel** et **socialement défendable**.

**En une phrase** : permettre à chacun de dire **ce qu’il propose autour de l’assiette**, puis de le **vivre** dans le monde réel, sans performance inutile.

**Promesse canon (ADN)** : **Ne mange plus seul.**

---

## 3. Vision long terme

**À 3 ans (indicatif)** : devenir la **référence locale** dans plusieurs villes pour « **trouver une table** » quand on veut **manger avec quelqu’un**, avec une **réputation de confiance** (sécurité, modération, transparence).

**À 5 ans et au-delà** : une **infrastructure légère** du repas social (duo, groupes, événements curés, partenariats resto) **sans** remplacer les amis ni **industrialiser** la relation humaine. La marque reste **table d’abord**.

**Horizon produit** (phasé dans la spec) : duo stable, puis **repas ouvert** et feed pour la densité locale, puis **groupe**, **événements**, **contacts graille**, une **zone « Mes tables »** (relations réelles, historique, favoris ; option marketing **Friendzone** documentée), **jauge relationnelle privée**, partenariats et modèles économiques **non extractifs** au démarrage.

---

## 4. Philosophie (non négociables)

1. **Le pic émotionnel est hors écran** : le repas. L’application est un **pont**, pas une destination addictive.  
2. **Intention avant ambiguïté** : intentions repas (**J’invite · On partage · Je me fais inviter**) et intention sociale (**Ami · Ouvert · Dating léger**) pour **cadrer** sans humilier.  
3. **Pas de dark patterns** : pas de culpabilité, pas de FOMO mensonger, nudges **plafonnés** et **réglables**.  
4. **Sécurité et dignité** : lieu public, signalement, refus élégant, modération **sérieuse** dès que le réel est engagé.  
5. **Honnêteté produit** : pas de promesse « moins cher » sans preuve ; pas de promesse santé ou romantique ; **allergènes** : l’app relaie des **besoins**, la **conformité plat** incombe aux **exploitants** (cadre UE).  
6. **Données et graphe social** : pas de DM à froid ; repas croisé en **double opt-in** ; jauge **privée**, jamais classement public cruel.  
7. **« Qui ramène quoi »** réservé aux formats **potluck / maison / pique-nique**, pas par défaut au duo resto.  
8. **Monétisation** : pas de pub invasive ni de vente du graphe en **tête de roadmap** ; tout revenu futur doit rester **compatible** avec la confiance (voir garde-fous Premium dans `PRODUCT_SPEC.md` §11).

---

## 5. Problème et opportunité (investisseurs)

**Problème** : solitude à table, friction pour **oser** proposer un repas à un inconnu ou un quasi-inconnu, fatigue des **apps de rencontre** quand le besoin est surtout **social** ou **culinaire**.

**Opportunité** : le repas est un **job-to-be-done** clair (« on mange ? »), **légitime** socialement, **scalable** par ville avec effets de réseau **IRL**.

**Risques assumés dans la documentation** : cold start géographique, modération, réputation, concurrence indirecte (dating, événements Facebook), dépendance aux **partenaires** resto si monétisation B2B.

---

## 6. Annexe — Rappel des **garde-fous produit** (spec §0)

Les points suivants sont issus du **projet initial** et restent **actifs** comme **principes** même s’ils ne sont pas tous des « features » livrées jour 1 :

- Découper le livrable en **vagues** (V1 duo → V1.5 feed → V2 événements et graphe avancé).  
- Accepter un usage **dating** partiel du marché **sans** en faire le marketing principal.  
- Séparer **intention repas** et **flux monétaire**.  
- Nudges **éthiques** (transparence, opt-out).  
- Repas croisé : **double opt-in**, graphe **invisible**.

**Référence** : `PRODUCT_SPEC.md` section 0.

---

## 7. Documents liés dans le dossier

| Besoin | Fichier |
|--------|---------|
| Spec détaillée, data, API | `PRODUCT_SPEC.md` |
| Audit cohérence & MVP | `AUDIT_PRODUIT_GLOBAL.md` |
| Matrice états repas | `MATRICE_REPAS_ETATS_PERMISSIONS.md` |
| Corpus slogans intégral | `ANNEXE_CORPUS_RECYCLAGE_COMPLET.md` |

---

*v1 officielle. Toute évolution majeure de mission ou vision = nouvelle version datée + changelog en tête de fichier.*
