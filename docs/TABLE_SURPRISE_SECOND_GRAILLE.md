# Paye ta graille — **Seconde graille** (slogan) & **Table surprise** (module)

**Spec détaillée UX / matching / refus / états** : **`MODULE_TABLE_SURPRISE_SPEC.md`**.

**Objectif** : ancrer une **promesse mémorable** + une mécanique **spontanée** (deux inconnus, cadre sûr) **sans** pression, **sans** jugement profil, **sans** piège sécurité.

---

## 1) Slogan — « seconde graille / seconde chance »

### Formulations (à tester A/B)

| # | Slogan | Usage |
|---|--------|--------|
| A | **« Tout le monde mérite une seconde graille. »** | **hero recommandé** — campagne / manifeste, fort & inclusif |
| B | **« Une seconde graille, ça change tout. »** | social ads, moins lourd |
| C | **« Parfois, tout commence à la deuxième graille. »** | storytelling, fins gourmets / humain |
| D | **« À table, on a toujours une seconde chance. »** | angle “recommencer” sans culpabiliser le 1er repas |
| E | **« Une rencontre ratée ? Reviens manger. »** | **à manier avec prudence** : ne pas suggérer que “manger” répare tout — usage ciblé, préférer A ou D en lead |

**Rappel produit** : si le slogan évoque une **2e chance** après un repas “raté”, le produit doit **permettre** réellement un **nouveau départ** (ex. nouveau match **sans** score public de l’échec précédent).

**Lien marque** : intégrer dans `BRAND_BOOK.md` / `MARKETING_POSITIONING.md` comme **axe secondaire** (ne pas remplacer « Ne mange plus seul » en hero principal sans test).

---

## 2) Module — concept (ce que tu décris)

**Intention utilisateur** : « **Je veux une table sans passer par le choix infini des profils** » — surprise contrôlée, **distance bornée**, **lieu public**, **double validation**.

**Ce n’est pas** : un date forcé ; un jeu dangereux ; une obligation d’aller au bout.

---

## 3) Nom public (éviter les faux pas)

| Nom | Avantages | Risques |
|-----|-------------|---------|
| **Graille à l’aveugle** | mémorable, ton Paye ta graille | **Accessibilité / sens** du mot « aveugle » — peut heurter ; à éviter en **titres marketing** officiels |
| **Table surprise** | élégant, positif, clair | moins “street” |
| **Repas mystère** | ludique | concurrence sémantique (escape game food) |
| **Match spontané** | clair | évoque dating — à dosifier |

**Recommandation** : **« Table surprise »** en libellé produit + sous-titre **« Sans choisir le profil : tu choisis le cadre. »**  
**Alias interne / communauté** : « graille surprise » si la communauté l’adopte — **pas** comme seul nom store.

---

## 4) UX complète (parcours)

### 4.1 Entrée
- Bouton **« Table surprise »** (Profil / Accueil secondaire / section **Découvrir** — à A/B test).  
- **Écran explicatif** (obligatoire 1ère fois) : 4 bullets max + **« Comment ça marche »** détaillé.

**Bullets type**  
- Tu ne vois **pas** le profil complet avant d’accepter le **cadre** (zone, créneau, intention).  
- **L’app propose** une personne compatible + **2–3 lieux** ou **1 lieu** selon réglage ville.  
- **Tu valides** ou tu passes — **zéro obligation**.  
- **Lieu public** · **signalement** 1 tap.

### 4.2 Paramètres (avant lancement du “tirage”)

- **Rayon** : ex. 2 / 5 / 10 km (défaut **5 km** en ville dense).  
- **Créneau** : « ce soir » / « demain midi » / plage horaire.  
- **Intention repas** : hérite de **J’invite / On partage / Je me fais inviter** (doit matcher **logiquement** entre les deux — matrice produit).  
- **Filtres durs** : intention sociale (ami / ouvert / dating léger), **tags alimentaires** déclarés si **compatibilité repas** requise.

### 4.3 Proposition système

- **Match** : 1 candidat **tiré** parmi pool **opt-in Table surprise** + **règles** (rayon, créneau, intentions).  
- **Lieu** :  
  - **Option A (recommandée)** : **2–3 restaurants** éligibles (prix, ouvert, distance) — l’utilisateur choisit **en 1 tap** après acceptation du binôme ;  
  - **Option B** : 1 lieu proposé par l’app (plus “pur hasard”, plus risqué goût).  
- **Écran “Table proposée”** : **silhouette** / prénom **seulement** + distance + créneau + **intentions** (texte) — **pas** galerie photo complète avant **acceptation mutuelle du cadre**.

### 4.4 Validation mutuelle

- Les **deux** tapent **« OK pour cette table »** — sinon **expire** (ex. 2 h) sans pénalité **stigmatisante** (cooldown léger anti-spam seulement si abus répété).

### 4.5 Après acceptation cadre

- **Alors seulement** : fiche profil **enrichie** (photo, tags) — pour **réduire** malaise “piège” tout en gardant surprise initiale.  
- Enchaînement identique au repas classique : confirmation, jour J, post-repas.

### 4.6 Déclinaisons (plus tard)

- **Table surprise — thème** (burger, italien…) : filtre **tag Graille** + lieux.  
- **Groupe** : **V2** (complexité + modération).

---

## 5) Logique d’attribution (algo “intelligent” = **contraintes + hasard**)

**Entrées autorisées** : géoloc, créneau, intentions repas + sociales, préférences alimentaires **déclarées**, historique **sécurité** (bans, signalements), **vérification** minimale.

**Entrées interdites** : inférence “mérite / solitude / revenu” ; score social visible.

**Sélection** : tirage **uniforme** ou pondéré **uniquement** par **équité d’accès** (ex. priorité soft à ceux qui ont **moins** utilisé Table surprise **si** objectif lancement — **transparent** dans l’aide).

---

## 6) Copy émotionnelle (FR)

### Activation
- **« Table surprise »**  
- Sous : **« Tu choisis le cadre. La personne arrive après. »**

### Proposition
- **« Une table pour toi — mode surprise. »**  
- **« Quelqu’un veut manger comme toi, pas loin. »** *(ton chaleureux)*

### Refus
- **« Pas ce soir — une autre table arrivera. »**

### Post-match réussi
- **« Parfois, la meilleure graille est celle qu’on n’a pas choisie. »** *(usage modéré, campagne)*

### Lien « seconde graille »
- **« Tout le monde mérite une seconde graille. »** — utiliser surtout **hors** flux où on pourrait lire une **pression** sur le 1er repas raté.

---

## 7) Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Sécurité (inconnus + surprise) | vérif progressive, lieu public, double opt-in, signalement, **historique** comportement |
| Malaise “piège” | révélation profil **après** accord sur cadre ; **annulation** simple |
| Fraude / bots | rate limits, device checks légers, cooldown |
| Nom « aveugle » | **Table surprise** en UI officielle |
| Dating forcé | intentions sociales + **escape** clair |
| Resto “hasard” nul | **Option A** 2–3 lieux ciblés > hasard pur |
| Pression sociale | pas de streak ; pas de “tu rates la surprise” |

---

## 8) Lien avec le reste du produit

- Machine d’états repas : réutiliser `PRODUCT_SPEC.md` avec état **`surprise_pending`**.  
- Émotion : `HUMAN_EXPERIENCE.md` (pic surprise contrôlée).  
- Métriques : taux **OK cadre** → **completed** ; taux **abandon** avant reveal profil.

---

## 9) Prompt maître (Cursor — élévation max)

```text
[MODULE] Paye ta graille — « Table surprise » + slogan « seconde graille » (assets copy, pas hero sans A/B).

[CONTRAINTES]
- Pas de stigmatisation ; pas de hiérarchie visible ; double validation ; lieu public ; reveal profil complet seulement après accord cadre ; pas d’inférence « méritant ».
- UI officielle : libellé « Table surprise » ; éviter « aveugle » en marketing public.
- Géo : rayon max paramétrable ; restaurants : proposer 2–3 options (pas hasard pur obligatoire V1).

[LIVRABLES]
1) User stories + états (surprise_pending, reveal, …)
2) Matrice compatibilité intentions (invite/partage/invité)
3) Wireframes texte (onboarding module + proposition + reveal)
4) Copy FR complète + variantes slogan « seconde graille »
5) Risques + tests sécurité (E2E)
6) Feature flag + kill switch + modération

[ÉLÉVATION] Propose 3 améliorations qui augmentent sécurité perçue SANS tuer la surprise ; signale tout trade-off dating.
```

---

*v1 — valider « reveal après accord cadre» en test utilisateur (10 sessions).*
