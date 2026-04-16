# Mes compagnons — stratégie & prompt rédaction

## Décision branding

| Rôle | Choix |
|------|--------|
| **Nom officiel (UI, nav)** | **Mes compagnons** |
| **Clin d’œil (second plan)** | *« La seule friendzone où tu reviens avec plaisir. »* + variante plus douce *« Bienvenue en friendzone… version graille. »* |
| **À éviter en titre principal** | « Friendzone » seul (connotation rejet / apps de rencontre) |

Le mot « friendzone » reste **positif et optionnel** : sous-titre, italique, ou campagne. Jamais comme seul nom de section.

## Implémentation code

- Copy centralisée : `src/lib/companions-copy.ts`
- Navigation accueil / Moi : `src/lib/ux-copy.ts` (`linkReseau`, `navReseau`) pointe sur `COMPANIONS_NAV_LABEL`
- Page vision : `src/app/reseau-graille/page.tsx` (URL inchangée `/reseau-graille` pour ne pas casser les liens)
- Après repas : `MealDetailClient` → lien `COMPANIONS_MEAL_COMPLETED_LINK_LABEL`

## Jauge (noms retenus)

1. **Connaissance de table** (1 repas)  
2. **Habitué·e** (2–3)  
3. **Table fidèle** (4–6)  
4. **Classique du menu** (7–10)  
5. **Compagnon de graille** (sommet, chaleur sans trophée compétitif)

Micro-phrases jauge : `COMPANIONS_JAUGE_WHISPERS` (réutilisé dans `micro-moments-copy.ts`).

## Micro-textes (référence)

- *« Ici, pas de swipe. Que des gens avec qui t’as partagé un repas. »*
- *« La seule friendzone où tu reviens avec plaisir. »*
- *« Les gens avec qui t’as vraiment mangé. »*

## Prompt — conception section « amis » (pour rédacteur·rice ou IA)

Tu es un·e expert·e en UX sociale et en branding produit.

**Mission** : concevoir la section **« Mes compagnons »** de l’application **Paye ta graille**.

**Objectif** : une zone qui valorise les **relations réelles** nées autour des repas (pas un catalogue de profils).

**Contraintes** :

- Se différencier des applis de rencontre classiques.
- Valoriser l’amitié, le lien réel, la mémoire du partage.
- Rester **élégant·e** et **inclusif·ve**.
- Ton **humain**, **chaleureux**, **légèrement taquin**, jamais moqueur ni excluant.
- Nom officiel propre : **Mes compagnons** (ou **Mes tables** en variante). Clin d’œil **La Friend zone** sur le hub (`/reseau-graille`) : **nom de zone** au-dessus du H1, ton **positif** (amitié assumée autour du repas), jamais moqueur — voir `companions-copy.ts`.

**À définir / détailler** :

- Organisation des contacts (validés, repas passés, favoris, historique).
- Système de progression (jusqu’à **Compagnon de graille**).
- Interactions : inviter à un nouveau repas, revoir, message léger, repas croisé.

**Objectif ressenti** :

> « Ce ne sont pas des profils… ce sont des gens avec qui j’ai partagé un moment. »

**Livrable** : textes d’écran, empty states, erreurs, et une ligne éditoriale pour le marketing (sans sur-utiliser le mot « friendzone »).
