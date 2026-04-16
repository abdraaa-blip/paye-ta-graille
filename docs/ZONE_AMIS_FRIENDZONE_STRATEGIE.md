# Paye ta graille — Zone « relations réelles » & clin d’œil Friendzone (stratégie v1)

**Statut** : proposition **produit + marque** validée en analyse, **à tester** en quali (dont femmes, seniors, personnes sensibles au vocabulaire dating) avant gel international.

**Idée d’origine** : une zone dédiée aux **personnes avec qui on a vraiment mangé** (amis validés, favoris, historique de tables, **jauge** / paliers type « compagnon de graille »). Nom évocateur **La Friend zone** (deux mots, clin d’œil lisible) pour **taquiner** les apps de rencontre et affirmer : ici, le lien passe par **la table**, pas par le swipe.

**Exécution code (hub)** : libellés centralisés dans `src/lib/companions-copy.ts` (`COMPANIONS_ZONE_PLAYFUL_NAME`, `COMPANIONS_ZONE_PLAYFUL_EXPLAIN`) ; page `src/app/reseau-graille/page.tsx` affiche ce nom **au-dessus** du titre officiel **Mes compagnons**.

---

## 1. Analyse stratégique

### Points forts

- **Différenciation** immédiate vs dating classique.  
- **Mémorabilité** et ton **taquin** alignés avec la personnalité de la marque.  
- **Cohérence** avec le positionnement : **réel**, **consenti**, **répétition de repas** comme preuve de lien.

### Risques (à ne pas sous-estimer)

| Risque | Détail |
|--------|--------|
| **Connotation négative** | « Friendzone » = rejet, frustration, cliché **machiste** dans une partie de la culture pop. |
| **Publics** | Peut **heurter** ou sembler **léger** pour certaines femmes, personnes **âgées**, ou toute personne qui a vécu le terme comme **humiliation**. |
| **Premium** | Si le ton est **gras** ou partout dans l’UI, ça peut **casser** l’élégance chère à l’identité visuelle. |
| **International** | Jeu de mots **anglais** : moins lisible hors FR / BE / CH francophone. |

**Conclusion** : l’idée est **bonne** si elle est **bicéphale** : nom **propre** dans le produit + clin d’œil **secondaire** (onboarding une fois, sous-titre marketing, campagne RS), pas comme **seul** titre d’onglet sans contexte.

---

## 2. Décision produit recommandée (double niveau)

### Niveau A — Nom **officiel** dans l’app (onglet, navigation, settings)

**Recommandation** : un libellé **neutre, chaleureux, premium** :

| Option | Note |
|--------|------|
| **Mes tables** | ancrage repas, très clair |
| **Mes compagnons** | humain, proche du glossaire « compagnon de graille » |
| **Mes gens** | oral, inclusif |

**Choix privilégié doc** : **« Mes tables »** (titre principal) avec sous-texte du type **« Les gens avec qui tu as mangé »**. Variante : **« Mes compagnons »** si tu veux coller au palier « compagnon de graille ».

### Niveau B — Clin d’œil **Friendzone** (taquin, assumé mais **cadre**)

- **Sous-titre** optionnel sous le header de la zone : **« Bienvenue en Friendzone »** + picto table (pas cœur brisé).  
- **Une seule fois** : carte onboarding **« Ici, la friendzone, c’est un compliment »** avec 2 lignes de contexte.  
- **Campagnes** social ads : **« La vraie Friendzone »** / **« Friendzone version graille »** en **A/B** strict.

**À éviter comme titre unique** sur stores ou écran critique sans explication : **Friendzone** seul.

---

## 3. Contenu de la zone (produit)

Réunion logique de ce qui existe ou est prévu en V2 :

- **Contacts graille** (opt-in mutuel post-repas).  
- **Favoris** (personnes marquées « remanger volontiers » si feature retenue).  
- **Historique** des repas **completed** avec la personne (privé).  
- **Jauge relationnelle** (privée) : paliers **sans** punition, **sans** classement public.

**Palier / labels** (recyclage des idées proposées, cohérents avec la voix existante) :

| Paliers possibles | Usage |
|-------------------|--------|
| **Compagnon de graille** | déjà dans le glossaire V2 |
| **Habitué·e de table** | récurrence intermédiaire |
| **Table fidèle** | image mémorable, positif |
| **Classique du menu** | très taquin, réserver **sous** palier ou **badge** optionnel humoristique, pas titre d’onglet |

---

## 4. Micro-textes (banque + prudences)

### Reco **produit** (titres, empty states)

- **« Ici, pas de swipe. Que des gens avec qui t’as partagé un repas. »**  
- **« Les gens avec qui t’as vraiment mangé. »**

### Taquin **marketing** (secondaire, test A/B)

- **« La seule friendzone où tu veux rester. »**  
  - **Prudence** : superlatif **« la seule »** (risque crédibilité / juridique marketing). Préférer : **« Une friendzone où tu veux rester »** ou **« Enfin une friendzone qui fait du bien »**.

### Métas « retournement positif »

- **« Ici, friendzone veut dire : on s’est retrouvé·es à table. »**  
- **« Pas de rejet : juste des tables qui se répètent. »** (à valider : ne pas nier la complexité émotionnelle ; usage **marketing** plutôt qu’écran post-repas sensible)

### Accessibilité copy

- Toujours une **phrase explicative** si « Friendzone » apparaît, pour les **non-bilingues** et les **sensibles** au mot.

---

## 5. Phasage

| Vague | Contenu |
|-------|---------|
| **V1** | Pas d’onglet dédié complet ; **recontact graille** et historique minimal si besoin. |
| **V2** | **Contacts graille** + liste enrichie + jauge = **corps** de la zone **« Mes tables »**. |
| **Marketing** | Clin d’œil Friendzone **dès** campagne ciblée FR, **mesure** réactions. |

---

## 6. Liens documents existants

- **Spec UX écrans, liste, paliers, interactions** : **`UX_SECTION_AMIS_MES_TABLES.md`**.  
- Contacts / jauge : `PRODUCT_SPEC.md` (V2), `UX_PRODUIT_OFFICIEL.md`.  
- Ton : `MARKETING_OFFICIEL.md`, `UX_COPY_SYSTEM.md`, `PROMPT_REECRITURE_ET_VOIX.md`.  
- Corpus : phrases §4 dans **`ANNEXE_CORPUS_RECYCLAGE_COMPLET.md`** (section G).

---

## 7. Tests quali (questions à poser)

1. Le mot **Friendzone** te fait penser à quoi en **premier** ? (positif / neutre / négatif)  
2. Préfères-tu voir **« Mes tables »** ou **« Friendzone »** dans la barre du bas ?  
3. Est-ce que **« Classique du menu »** comme palier te fait sourire ou te gêne ?

---

*v1 stratégie. Gel naming après tests et revue inclusive interne.*
