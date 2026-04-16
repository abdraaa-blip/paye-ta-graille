# Paye ta graille — Section « amis » (UX & branding) — spec v1

**Mission** : concevoir l’espace qui valorise les **relations nées autour des repas réels**, pas une liste de profils à consommer.

**Phrase guide** (ressenti cible) :

> *Ce ne sont pas des profils… ce sont des gens avec qui j’ai partagé un moment.*

**Contraintes** : se différencier du **dating classique** ; valoriser **amitié et lien** ; rester **élégant** et **inclusif** ; ton **humain, chaleureux, légèrement taquin**, **jamais** moqueur ni excluant.

**Stratégie naming (Friendzone)** : voir **`ZONE_AMIS_FRIENDZONE_STRATEGIE.md`**. Ce document descend au **niveau écran et interactions**.

---

## 1. Nom de la section

### Principal (recommandé produit)

| Libellé | Usage |
|---------|--------|
| **Mes tables** | Onglet ou entrée principale **Moi** → section dédiée. Court, ancré repas, universel. |

**Sous-titre permanent** (sous le H1 de la zone) :

- **« Les gens avec qui tu as mangé. »**  
- Variante B : **« Des moments réels, pas des fiches. »**

### Alternatif « fun » (secondaire, jamais seul dans la nav)

| Libellé | Où | Condition |
|---------|-----|------------|
| **Bienvenue en Friendzone** | Sous-titre **optionnel** ou bannière une fois | Toujours **2 lignes** d’explication en dessous (retournement positif). |
| **La vraie Friendzone** | Campagne RS / landing | A/B + public FR. |
| **Mes compagnons** | Variante si alignement maximal avec palier « compagnon de graille » | A/B avec « Mes tables ». |

**À ne pas faire** : onglet bottom nav intitulé uniquement **Friendzone** sans contexte.

---

## 2. Organisation des contacts (architecture de l’écran)

### 2.1 Principe

Une **seule liste principale** = personnes avec au moins **un repas `completed`** en commun (ou contact graille **mutuel** si règle produit l’étend). **Pas** de mélange avec les « suggestions discover ».

### 2.2 Segments (filtres en haut de liste, chips)

| Filtre | Contenu |
|--------|---------|
| **Tous** | Tout le monde éligible à la zone. |
| **Favoris** | Marqués « remanger avec plaisir » (cœur ou étoile **discrète**, pas emoji agressif). |
| **Récents** | Tri par **dernier repas ensemble** (date). |

**Ordre par défaut** : **récence** du dernier repas, puis **favoris** en tête si même date (option produit).

### 2.3 Carte contact (ligne ou card)

**Contenu** (de haut en bas, mobile) :

1. **Photo** + **prénom** (ou pseudo si préférence).  
2. **Méta** : « Dernier repas : {date relative} · {lieu court optionnel} ».  
3. **Indicateur de lien** (discret) : texte palier ou **petit** picto table (pas de score numérique public).  
4. **Actions** : voir §5.

**Interdits sur la carte** : pourcentage de « compatibilité », rang « top », streak dating, « en ligne maintenant ».

---

## 3. Système de progression (« compagnon de graille »)

### 3.1 Règles

- **Privé** : visible **uniquement** pour la paire (toi + cette personne). **Jamais** de classement entre utilisateurs.  
- **Incrément** : +1 quand un repas duo (ou groupe règle V2) passe **`completed`** avec cette personne.  
- **Pas de décrément punitif** (pas de perte de niveau pour « avoir ignoré un message »).  
- **Affichage** : libellé **texte** doux + éventuelle **jauge** très discrète (segmentée 2–4 paliers max).

### 3.2 Paliers suggérés (copy)

| Repas `completed` ensemble (indicatif) | Libellé affiché (exemple) | Ton |
|----------------------------------------|---------------------------|-----|
| 1 | **Première table** | neutre, accueil |
| 2 | **Habitué·e de table** | chaleureux |
| 3–4 | **Compagnon de graille** | déjà dans le glossaire ; fierté douce |
| 5+ | **Table fidèle** (ou garder « compagnon de graille » + mention « ça se répète ») | pas de surenchère |

**Option taquine réservée** (sous-libellé ou tooltip au 3e repas, **opt-in** humour) : **« Classique du menu »** (uniquement si tests quali OK).

### 3.3 Écran détail d’une relation (tap sur la ligne)

- **Résumé** : nombre de repas ensemble, dernières dates (liste courte).  
- **CTA** : **Proposer un repas**, **Message** (si autorisé), **Retirer des favoris**, **Signaler** (discret).  
- **Encart rappel** : « Les bons liens se nourrissent à table, pas à l’infini sur l’écran. » (option, une ligne max)

---

## 4. Interactions possibles

| Action | Comportement | Garde-fou |
|--------|----------------|-----------|
| **Inviter / Revoir à table** | Ouvre le flux **Proposer un repas** pré-rempli (créneau vide, intention héritée du profil). | Pas de spam : **cooldown** optionnel (ex. pas plus de X propositions / 24 h à la même personne sans réponse). |
| **Message** | Visible si **contact graille** mutuel **ou** repas en cours / chat autorisé par matrice. Sinon : **« Le chat s’ouvre quand… »** (renvoi règles). | Jamais DM harcèlement depuis cette liste sans cadre. |
| **Favori** | Toggle cœur / étoile ; **pas** de notification à l’autre (recommandé) pour éviter pression. | |
| **Profil** | Lien vers **fiche** telle qu’après repas (pas mode discover complet si règle produit). | Transparence sur ce que l’autre voit. |
| **Retirer de la liste** | **Masquer** ou « ne plus proposer » : formulation **sans** humiliation (« Tu ne verras plus {prénom} ici » + undo 10 s). | Pas de wording type « supprimer l’ami ». |

---

## 5. Ton (micro-copy par état)

| Contexte | Exemple |
|----------|---------|
| Liste vide | **« Ici, pas de swipe. Quand tu auras partagé une table, les gens apparaîtront ici. »** |
| Liste vide variante | **« Pas encore de table en commun. Va explorer ou propose un repas. »** |
| Une personne | Sous-titre section : **« Une belle table à prolonger. »** |
| Section header taquin (option) | **« Bienvenue en Friendzone »** + ligne 2 : **« Ici, ça veut dire : vous vous êtes retrouvé·es à manger. Point. »** |

**Inclusivité** : accords **épicènes** (retrouvé·es), éviter **il/elle** imposés dans les modèles ; **pas** de blagues sur le corps, l’âge, le couple.

---

## 6. Navigation (recommandation)

- **V2** : éviter un **4e** onglet bottom si possible. **Entrée** : **Moi** → **Mes tables** (ligne menu ou carte hero).  
- Si bottom nav passe à 4 items plus tard : libellé **Mes tables** uniquement.

---

## 7. Anti-patterns (dating à ne pas recopier)

- Swipe sur les « amis ».  
- Score, ligue, badge « crush ».  
- « X a vu ton profil ».  
- Comparaison entre contacts.  
- Notification **à l’autre** « tu as été mis en favori ».  
- Surnoms humiliants sur les paliers.

---

## 8. Cohérence avec le reste du produit

- **Recontact graille** post-repas : alimente l’entrée dans cette zone une fois le lien **mutuel**.  
- **Matrice repas** : `MATRICE_REPAS_ETATS_PERMISSIONS.md`.  
- **Textes** à synchroniser : `COPY_UX_COMPLET_V1.md` (table V2).

---

## 9. Check-list avant ship

- [ ] Liste = **uniquement** repas réels (ou opt-in mutuel documenté).  
- [ ] Aucun signal type **dating** sur les cartes.  
- [ ] Paliers **privés** et **non punitifs**.  
- [ ] **Friendzone** seulement avec **explication** ou en **hors produit**.  
- [ ] Tests inclusifs (genré, âge, sensibilité au mot friendzone).

---

*v1 UX section amis. Itérer après tests utilisateurs.*
