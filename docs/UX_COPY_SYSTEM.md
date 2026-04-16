# Paye ta graille — Système de textes UX (ton, messages, copy)

**Banque « textes finaux » + variantes A/B + parcours écran par écran** : **`COPY_UX_COMPLET_V1.md`** (prioritaire pour l’implémentation). Ce fichier reste la **charte de ton** et les règles de fréquence.

**Statut** : v1 copy — à valider en tests utilisateurs (5–10 entretiens).  
**Alignement** : voir `PRODUCT_SPEC.md` (nudges éthiques, pas de culpabilité, pas de promesses santé).

---

## 1) Ton global

| DO | DON’T |
|----|--------|
| Humain, léger, intelligent | Lourd, startup bullshit |
| Tutoiement naturel | Vouvoiement sauf besoin accessibilité |
| Parfois drôle, léger | Clown, memes forcés |
| Rassurant sur le social | Pression, culpabilité, comparaison |
| Clair en 1 phrase | Blocs de texte longs |

**Règle** : chaque écran a **une phrase d’intention** + **un CTA principal** + **une sortie gracieuse** (passer / plus tard).

---

## 2) Banque de copy par surface

### Accueil (home)

- Titre possible : **« On mange ? »**  
- Sous-textes (rotation / A-B test) :  
  - « T’as faim ou t’as envie de rencontrer quelqu’un ? »  
  - « Une table t’attend peut-être déjà »  

### Profil & onboarding (titres de section)

- « Ton style à table »  
- « Comment tu manges, comment tu rencontres »  
- « Ta vibe culinaire »  

### Boutons d’intention repas (primaires)

- **« J’invite »** `🍽️`  
- **« On partage »** `⚖️` (50/50 implicite dans l’aide contextuelle)  
- **« Je me fais inviter »** `🍜`  

*Aide inline (courte)* : « Tu proposes de payer le repas » · « Chacun paye sa part » · « Tu es ouvert·e à être invité·e »

### Après repas

- « C’était comment ? »  
- « Un bon moment se garde… ou se répète »  
- **Neutre (recommandé)** : « Envie de remettre ça ensemble ? »  
- Variante : « Tu les revois à table ? » *(évite le binaire il/la)*  

### Jauge relationnelle (privée, V2)

- « Vous avez partagé plusieurs tables »  
- « Ça commence à bien matcher autour de l’assiette »  
- « Compagnon de graille validé » `💚` *(emoji optionnel selon plateforme)*  

### Notifications / nudges in-app (soft)

- « Ça fait un moment que vous n’avez pas mangé ensemble »  
- « Une table pourrait vous réunir à nouveau »  

### Motivation (sans compétition)

- « Tu crées du lien. Continue. »  
- « T’as le sens du partage » `🍽️`  

### Prévention douce (hydratation / chaleur — pas médical)

- « Bois de l’eau. Ton corps te dira merci » `💧`  
- « Bien manger, c’est bien. Bien s’hydrater, c’est mieux » *(ton léger ; pas une vérité scientifique affichée comme tel)*  
- « 5 fruits et légumes… et au moins une bonne compagnie » `🍽️`  

### Utilisateur peu actif (invitation, pas reproche)

- « Et si tu ne mangeais pas seul ce soir ? »  
- « Quelqu’un a peut-être faim au même moment que toi »  

---

## 3) Règles de fréquence & conformité nudge

- **Plafond** : max **1** rappel “revoir X” / semaine / paire (ajustable).  
- **Backoff** : si ignoré 2 fois → silence prolongé.  
- **Opt-out** : réglage global “rappels : calme / normal / off” (voir spec produit).  
- **Transparence** : les messages motivationnels sont des **encouragements**, pas des scores cachés.  
- **Santé** : pas de diagnostic, pas de promesse “minceur / santé garantie”.

---

## 4) Microcopy système (erreurs / refus / vide)

| Situation | Copy |
|-----------|------|
| Refus de repas | « Pas de souci — d’autres tables existent. » |
| Liste vide discover | « Personne dans ton rayon pour l’instant. Élargis un peu ? » |
| Er réseau | « Petit souci de connexion. Réessaie dans un instant. » |
| Signalement envoyé | « Merci. On regarde ça. » |

---

## 5) Glossaire produit (stable)

- **Contact graille** : lien positif post-repas (opt-in mutuel).  
- **Repas ouvert** : annonce spontanée + réponses limitées.  
- **Compagnon de graille** : palier **privé** de récurrence de tables (pas un titre public obligatoire).

---

*Document vivant : versionner à chaque vague de release (V1 / V1.5 / V2).*
