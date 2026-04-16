# Prompts avancés — stratégie, growth, invest, risques (niveau « boîte qui scale »)

**Rôle** : briques **critiques** que les équipes sérieuses ne négligent pas — à utiliser avec Cursor / LLM en rappelant la **source de vérité produit** : `SYSTEME_COMPLET_PAYE_TA_GRAILLE.md`, `PROMPTS_EXTERNES_ALIGNEMENT.md`, `MARKETING_POSITIONING.md`.

**Règle** : chaque sortie doit rester **alignée ADN** (table d’abord, pas dating-first, pas faux feed, pas gamification toxique).

---

## Cartographie — prompts → documents déjà dans le repo

| # | Thème | Doc existante (approfondir / mettre à jour) |
|---|--------|---------------------------------------------|
| 1 | Lancement | `LAUNCH_PLAYBOOK.md` |
| 2 | Viralité & growth | `VIRAL_GROWTH.md` |
| 3 | Investisseurs & pitch | `INVESTOR_PITCH.md` |
| 4 | Addiction saine / rétention | `RETENTION_ETHICAL.md`, `SYSTEME_ENGAGEMENT_NATUREL.md` |
| 5 | Restaurateurs B2B | `RESTAURANT_PARTNERSHIPS.md` |
| 6 | Scalabilité | `SCALE_ARCHITECTURE.md`, `PRODUCT_SPEC.md` |
| 7 | Échecs & crise | `CRISIS_PLAYBOOK.md`, `SECURITE_CHECKLIST_CODE.md` |
| 8 | Personas | `USER_PERSONAS.md` |
| 9 | UI écran par écran | `UI_SCREENS.md`, `DESIGN_SYSTEM.md` |
| 10 | Métriques | `METRICS_PRODUCT.md` |
| 11 | Nom & branding | `BRAND_OFFICIEL.md`, `BRAND_BOOK.md`, `MARKETING_POSITIONING.md` |
| 12 | Expérience émotionnelle | `HUMAN_EXPERIENCE.md`, `UX_COPY_SYSTEM.md` |
| 13 | Générosité intégrée (repas suspendu) | `MODULE_REPAS_SUSPENDU.md`, `SUSPENDED_MEAL_AND_DISCOVERY.md` |
| 14 | Table surprise (matching spontané, sécurisé) | `MODULE_TABLE_SURPRISE_SPEC.md`, `TABLE_SURPRISE_SECOND_GRAILLE.md` |
| 15 | Identité visuelle & DA « table vivante » | `CREATIVE_DIRECTION_VISUAL.md`, `IDENTITE_VISUELLE_COMPLETE.md`, `DESIGN_SYSTEM.md` |

**Usage** : coller le prompt ci-dessous dans une session ; en sortie, **mettre à jour** la ligne du tableau (ou créer une annexe datée) plutôt que de multiplier les fichiers orphelins.

---

## 1. Stratégie de lancement (critique)

```text
Tu es un expert en lancement de startups (type Uber, Airbnb, Tinder).

Mission : concevoir le lancement réel de "Paye ta graille".

Objectif :
- obtenir les 100 premiers utilisateurs
- créer les premières rencontres réelles
- générer des témoignages authentiques

Contraintes :
- budget limité
- effet viral local (ville par ville)

À produire :
- stratégie de lancement par ville
- événements physiques de départ (tables organisées)
- techniques pour créer les premiers matchs
- méthodes pour éviter "l'effet vide" (aucun utilisateur)
- plan pour atteindre 100 → 1000 utilisateurs

Tu dois penser terrain, réel, concret, actionnable.

Contexte produit (ne pas contredire) : Paye ta graille = repas IRL, intentions claires, pas faux feed ; voir docs/SYSTEME_COMPLET_PAYE_TA_GRAILLE.md.
```

**Livrables attendus** : calendrier 0–90 jours, playbook « première ville », liste risques effet vide + mitigations.

---

## 2. Viralité & growth

```text
Tu es un expert en growth hacking et viralité.

Mission : rendre "Paye ta graille" viral.

À produire :
- mécaniques de partage naturel (sans forcer)
- moments où l'utilisateur parle de l'app
- boucles virales intégrées au produit
- idées de contenu TikTok / Instagram
- déclencheurs émotionnels de partage

Objectif : que chaque utilisateur puisse en ramener un autre sans effort.

Tu dois éviter : spam, marketing agressif.

Tu dois créer du viral organique basé sur l'expérience réelle.

Contexte : pas de promesse creuse ; cohérent avec MARKETING_POSITIONING.md (table d'abord).
```

**Livrables attendus** : 3 boucles produit max, hooks courts, métriques de partage à instrumenter (voir METRICS_PRODUCT.md).

---

## 3. Investisseurs & pitch

```text
Tu es un VC (investisseur) et expert en pitch startup.

Mission : transformer "Paye ta graille" en projet investissable.

À produire :
- pitch deck complet (structure)
- problème / solution
- taille de marché
- business model crédible
- vision long terme
- storytelling fondateur

Tu dois répondre à : "Pourquoi ce projet peut devenir énorme ?"

Tu dois être exigeant, critique, réaliste.

Contexte : lire INVESTOR_PITCH.md existant et l'améliorer, pas inventer des chiffres sans hypothèses.
```

**Livrables attendus** : outline deck 10–12 slides, liste questions VC pièges, risques honnêtes.

---

## 4. Mécaniques d'addiction saine

```text
Tu es expert en psychologie comportementale et design d'engagement.

Mission : créer une rétention forte sans dépendance toxique.

À produire :
- boucles d'engagement naturelles
- attachement émotionnel produit
- habitudes utilisateur
- moments de retour dans l'app

Tu dois :
- éviter toute manipulation négative
- favoriser des comportements sains et sociaux

Objectif : que les gens reviennent pour vivre, pas scroller.

Contexte : RETENTION_ETHICAL.md, SYSTEME_ENGAGEMENT_NATUREL.md — interdit score public, culpabilité, FOMO sale.
```

**Livrables attendus** : boucles « repas → souvenir → envie de table », garde-fous éthiques, signaux d'alarme à ne pas franchir.

---

## 5. Expérience restaurateurs (B2B)

```text
Tu es expert en partenariats restaurants.

Mission : intégrer les restaurants dans "Paye ta graille".

À produire :
- pourquoi les restos accepteraient
- modèle gagnant-gagnant
- intégration dans l'app
- avantages pour eux (trafic, visibilité)
- système simple pour onboarder un resto

Objectif : créer un écosystème durable avec les professionnels.

Contexte : RESTAURANT_PARTNERSHIPS.md — pas marketplace résa générique.
```

**Livrables attendus** : offre partenaire V1, critères de sélection, FAQ resto, risques réputation.

---

## 6. Scalabilité produit

```text
Tu es architecte produit senior.

Mission : anticiper la croissance de "Paye ta graille".

À produire :
- problèmes à 1k / 10k / 100k utilisateurs
- solutions techniques
- limites du système actuel
- évolutions nécessaires

Objectif : éviter que le produit casse en grandissant.

Contexte : SCALE_ARCHITECTURE.md, stack Next/Supabase actuelle.
```

**Livrables attendus** : matrice charge, goulots (discover, chat, modération), ordre de migration technique.

---

## 7. Échecs & scénarios négatifs

```text
Tu es expert en gestion de crise produit.

Mission : imaginer tout ce qui peut mal tourner.

À produire :
- scénarios catastrophes (sécurité, abus, désengagement)
- points faibles du concept
- solutions préventives
- protocoles d'urgence

Objectif : renforcer le produit avant qu'il casse.

Contexte : CRISIS_PLAYBOOK.md, signalement, rencontres IRL, modération.
```

**Livrables attendus** : top 10 risques, triggers d'escalade, communication crise, ownership.

---

## 8. Personas ultra détaillés

```text
Tu es expert en recherche utilisateur.

Mission : créer des profils utilisateurs réels.

À produire :
- 5 à 10 personas détaillés
- leurs peurs
- leurs motivations
- leurs usages de l'app
- leurs objections

Objectif : designer le produit pour des humains réels, pas abstraits.

Contexte : enrichir USER_PERSONAS.md — cohérent avec intention repas + social.
```

**Livrables attendus** : fiches persona (1 page chacune), citations fictives réalistes, anti-personas.

---

## 9. UI détaillée (écran par écran)

```text
Tu es UI designer senior.

Mission : designer chaque écran de "Paye ta graille".

À produire :
- wireframes (description textuelle ou structure)
- structure écran
- placement boutons
- hiérarchie visuelle

Objectif : une app claire, belle, intuitive.

Contexte : UI_SCREENS.md, DESIGN_SYSTEM.md — mobile-first, décision < 10 s.
```

**Livrables attendus** : liste écrans MVP + états vides + erreurs ; pas de divergence avec MATRICE_REPAS_ETATS_PERMISSIONS.md.

---

## 10. Métriques produit

```text
Tu es analyste produit.

Mission : définir les métriques clés.

À produire :
- KPI principaux
- taux de conversion
- rétention
- fréquence des repas

Objectif : comprendre si le produit fonctionne vraiment.

Contexte : METRICS_PRODUCT.md — North Star liée aux repas réels complétés, pas vanity DAU seul.
```

**Livrables attendus** : définitions formelles, cohortes, seuils d'alerte, anti-KPI (ce qu'il ne faut pas optimiser).

---

## 11. Nom, branding & identité (profond)

```text
Tu es expert en branding.

Mission : renforcer la marque "Paye ta graille".

À produire :
- perception du nom
- variantes possibles (si exploration)
- storytelling de marque
- territoire émotionnel

Objectif : créer une marque forte et mémorable.

Contexte : BRAND_OFFICIEL.md, MARKETING_POSITIONING.md — nom déjà verrouillé sauf exercice exploratoire explicitement demandé.
```

**Livrables attendus** : audit nom, guidelines ton, cohérence avec identité visuelle existante.

---

## 12. Expérience émotionnelle globale

```text
Tu es designer d'expérience humaine.

Mission : concevoir l'émotion globale du produit.

À produire :
- ce que ressent l'utilisateur à chaque étape
- moments clés
- souvenirs créés

Objectif : que l'app marque les gens.

Contexte : HUMAN_EXPERIENCE.md — pic émotionnel hors app (table), pas sur l'écran.
```

**Livrables attendus** : journey émotionnel (courbe), moments « peak » et « end », copy d'accompagnement.

---

## 13. Générosité intégrée — repas suspendu

**Spec complète + prompt coalition déjà rédigés dans** `MODULE_REPAS_SUSPENDU.md` **(§0 à §11).**

```text
Tu es un expert en psychologie sociale, économie comportementale et design de systèmes altruistes.

Mission : concevoir un système de générosité intégré à "Paye ta graille".

Nom du module : "Repas suspendu" (ou équivalent).

Objectif : permettre d'offrir un repas à un autre utilisateur de manière élégante, non intrusive et émotionnellement positive.

Contraintes : aucune stigmatisation ; aucune hiérarchie visible ; pas de gamification agressive ; opt-in receveur ; attribution équitable (pas "qui mérite").

Fonctionnalités : offrir un repas / une table ; paiement simple ; attribution ; notification douce ; remerciement optionnel.

Tu dois définir : UX, logique d'attribution, textes, risques et solutions.

Contexte : lire et respecter docs/MODULE_REPAS_SUSPENDU.md.
```

**Livrables attendus** : flows figés, page transparence, avis juridique sur le montage paiement / bon repas.

---

## 14. Table surprise (spontanéité sans perte de contrôle)

**Spec complète + prompts §11–§12 dans** `MODULE_TABLE_SURPRISE_SPEC.md`. **Slogan « seconde graille »** : `TABLE_SURPRISE_SECOND_GRAILLE.md`.

```text
Tu es expert en psychologie comportementale, UX design et systèmes de matching.

Mission : concevoir un module "Table surprise" pour "Paye ta graille".

Objectif : deux utilisateurs se rencontrent sans se connaître à l'avance, de façon spontanée, sécurisée et fluide.

Contraintes : simple, rassurant, jamais intrusif, toujours contrôlable, éviter l'inconfort.

Attendu : bouton Table surprise ; matching encadré ; lieu + moment ; validation des deux côtés ; refus et annulations clairs.

Contexte : docs/MODULE_TABLE_SURPRISE_SPEC.md — opt-in, cadre avant personne, double validation, lieux publics.
```

**Livrables attendus** : machine d’états, matrice intentions, feature flag, tests refus / expiration.

---

## 15. Identité visuelle — coalition DA (table vivante)

**Prompt complet §12 dans** `CREATIVE_DIRECTION_VISUAL.md`. Fondations : **suggérer** plutôt que montrer ; silhouettes sans visages ; pas de food stock ; palette crème / sable / orange brûlé / tomate / olive (`globals.css`).

**Livrables attendus** : moodboard, hero « table vivante », système icônes abstrait, audit contraste, brief illustrateur.

---

## Utilisation en équipe

1. Choisir un numéro, coller le bloc dans Cursor avec **« applique le contexte du repo paye-ta-graille »**.  
2. Demander une **sortie structurée** (tableaux, checklists) et une **section risques / limites**.  
3. **Fusionner** le résultat dans le document listé en cartographie (PR sur le repo).  
4. Ne pas contredire **`SYSTEME_COMPLET_PAYE_TA_GRAILLE.md`** sans décision produit explicite (`DECISIONS_PRODUIT_LOG.md`).

---

*v1 — pack prompts « haut niveau » aligné dossier officiel.*
