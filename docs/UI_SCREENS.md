# Paye ta graille — UI : wireframes & hiérarchie (mobile-first)

**Rôle** : référence implémentation (Figma peut reprendre 1:1).  
**Sources** : `DESIGN_SYSTEM.md`, `UX_COPY_SYSTEM.md`, écrans `PRODUCT_SPEC.md` §3.

**Cadre global** : viewport **375×812** (réf.) ; **safe-area** haut/bas ; **max 1 CTA primaire** par écran sauf exception explicite.

---

## 0) Squelette app (hors onboarding)

```
┌──────────────────────────────┐
│ ◀ Titre écran          [···]│  ← header 56px, retour + actions
├──────────────────────────────┤
│                              │
│        ZONE SCROLL           │  ← contenu, padding 16px
│                              │
├──────────────────────────────┤
│ [ Accueil ] [ Explorer ] [ Moi ] │  ← bottom nav 3 items, 56px + safe
└──────────────────────────────┘
```

**Hiérarchie type** : **H1** (22–28px) → **sous-texte** (15px, muted) → **cartes** → **CTA pleine largeur** en bas (sticky si scroll long).

---

## 1) Splash / valeur (écran 1)

**But** : promesse en **≤10 s**.  
**Hiérarchie** : logo / nom → **H1** → 1 ligne → CTA.

```
┌──────────────────────────────┐
│                              │
│         [ Logo PTG ]         │
│                              │
│   Ne mange plus seul.       │  H1
│   Repas réels. Intentions   │  body muted, 2 lignes max
│   claires.                  │
│                              │
│   ····· o o o ·····         │  pagination dots (option)
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │      Commencer           │ │  PRIMARY pleine largeur
│ └──────────────────────────┘ │
│   J’ai déjà un compte        │  SECONDARY texte lien
└──────────────────────────────┘
```

**Boutons** : **Commencer** (primary) · **J’ai déjà un compte** (ghost/link).

---

## 2) Auth (écran 2)

```
┌──────────────────────────────┐
│ ◀ Retour                     │
│                              │
│   Connexion                  │  H1
│   Email ou téléphone         │  caption
│                              │
│   ┌────────────────────────┐ │
│   │ email@…                │ │  input
│   └────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │   Continuer              │ │  PRIMARY
│ └──────────────────────────┘ │
│   En continuant, tu acceptes │  légal 12px
│   les CGU.                   │
└──────────────────────────────┘
```

**États** : erreur format email sous champ ; loading sur CTA.

---

## 3) Profil minimal (écran 3)

```
┌──────────────────────────────┐
│ ◀   Profil            [1/9]  │
│                              │
│   [  avatar  +  cam  ]       │  cercle 96px, tap = pick
│                              │
│   Pseudo                     │  label
│   ┌────────────────────────┐ │
│   │ Sofia                  │ │
│   └────────────────────────┘ │
│   Ville                      │
│   ┌────────────────────────┐ │
│   │ Lyon ▼                 │ │
│   └────────────────────────┘ │
│   Rayon   ————●—— 12 km      │  slider
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │   Continuer              │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

## 4) Intention sociale (écran 4)

**Hiérarchie** : titre section → **3 cartes sélectionnables** (1 choix) → aide.

```
│   Pour cadrer la table       │  H2
│   (pas un test de personnalité) │ muted
│                              │
│   ┌──────────┐ ┌──────────┐  │
│   │  Ami     │ │  Ouvert  │  │  cards tap = select, ring si actif
│   └──────────┘ └──────────┘  │
│   ┌──────────┐               │
│   │ Dating   │               │  léger, même poids visuel
│   │ léger    │               │
│   └──────────┘               │
```

**CTA** : Continuer (sticky bottom).

---

## 5) Intention repas (écran 5) — **écran signature**

**Hiérarchie** : H2 → **3 blocs égaux** (icone + titre + micro-ligne) → aide.

```
│   Ton intention repas        │  H2
│                              │
│ ┌──────────────────────────┐ │
│ │ 🍽  J’invite              │ │
│ │     Tu proposes de payer │ │  body muted 1 ligne
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ⚖  On partage             │ │
│ │     Chacun sa part       │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ 🍜  Je me fais inviter   │ │
│ │     Ouvert à être invité·e│ │
│ └──────────────────────────┘ │
```

**Placement** : empilement vertical, **gap 12px** ; carte sélectionnée = **bordure accent** + fond surface légère.

---

## 6) Tags personnalité (6) & habitudes (7) & Graille (8)

**Pattern commun** : titre H2 → **chips** wrap → compteur “3/8 max” → Continuer sticky.

```
│   Ta vibe culinaire          │
│   3 max                      │  caption
│   [ drôle ] [ calme ] …      │  chips
```

**Grille chips** : min-height 44px touch ; **2 colonnes** option sur petits écrans si labels longs.

---

## 7) Objectif ici (9) & Préférences table (10)

**Objectif** : chips multi ou single selon spec.  
**Préférences table** : 3 **radio cards** (même pattern que intention sociale).

---

## 8) Contraintes alimentaires (11) & Nudges (12)

```
│   Contraintes alimentaires   │
│   ┌────────────────────────┐ │
│   │ (texte court)          │ │  textarea 3 lignes max
│   └────────────────────────┘ │
│   ⚠️ Confirme au restaurant   │  bannière info
```

**Nudges** : 3 **segmented control** horizontal : Calme | Normal | Off

**CTA final onboarding** : **Terminer** → vers Accueil.

---

## 9) Accueil (13)

**But** : **1 action évidente** selon état (pas de dashboard chargé).

```
┌──────────────────────────────┐
│   On mange ?                 │  H1 (copy system)
│   Une table t’attend peut-être│  muted
│                              │
│   ┌─ REPAS EN COURS ─────┐   │  si state actif
│   │ Jeu 19:30 · Les Cinq │   │  card résumé
│   │ Voir le repas      → │   │
│   └──────────────────────┘   │
│                              │
│   ┌────────────────────────┐ │
│   │   Explorer des tables  │ │  PRIMARY
│   └────────────────────────┘ │
│   ┌────────────────────────┐ │
│   │   Proposer un repas      │ │  SECONDARY outline
│   └────────────────────────┘ │
└──────────────────────────────┘
```

**Bottom nav** : Accueil · Explorer · Moi.

---

## 10) Explorer (14)

```
│ Filtres  [ Rayon ▼ ] [ Budget ▼ ]   │  barre horizontale scroll chips
│                              │
│ ┌──────────────────────────┐ │
│ │ [photo]  Marc, 38      │ │  card 72px thumb gauche
│ │ On partage · 2 km      │ │  meta ligne
│ │ “Cuisine du monde”      │ │  1 ligne max italique
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ …                        │ │
│ └──────────────────────────┘ │
```

**Vide** : illustration légère + “Personne dans ton rayon…” + CTA **Élargir le rayon**.

---

## 11) Fiche profil autre (15)

**Hiérarchie** : photo hero → nom + meta → tags → **CTA sticky**.

```
│ ┌──────────────────────────┐ │
│ │      [ photo héro ]      │ │  ratio 4:5, gradient bas
│ │  Marc · 38 · 2 km        │ │  overlay texte
│ └──────────────────────────┘ │
│   Tags… (chips)              │
│   Intention : On partage     │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ Proposer un repas        │ │  PRIMARY sticky
│ └──────────────────────────┘ │
│   Signaler                   │  lien discret
└──────────────────────────────┘
```

---

## 12) Proposition repas (16)

```
│ Proposer un repas à Marc     │  H1
│                              │
│ Créneau   [ Jeu 19:30 ▼ ]    │
│ Zone      [ Presqu’île ▼ ]   │
│ Budget    [ ~20–30€ ▼ ]      │
│ Ton intention (rappel)       │  read-only chip
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │        Envoyer           │ │
│ └──────────────────────────┘ │
```

---

## 13) Réception demandes (17)

```
│ Demandes reçues              │
│                              │
│ ┌──────────────────────────┐ │
│ │ Lina · On partage        │ │
│ │ Ven 20:00 · Croix-Rousse │ │
│ │ [ Accepter ] [ Refuser ] │ │  2 boutons même largeur
│ └──────────────────────────┘ │
```

**Refus** : sheet modal “Pas ce soir” + **message optionnel court** + Confirmer.

---

## 14) Match (18)

**Moment émotionnel** : **beaucoup d’air**, peu de texte.

```
│                              │
│         ✓                  │  illustration / animation douce
│                              │
│   C’est oui.                │  H1
│   Vous allez manger ensemble │ body
│                              │
│   Rappel : lieu public,     │  encart info 14px
│   respect mutuel.           │
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │   Choisir un lieu        │ │  PRIMARY
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

## 15) Choix lieu (19)

```
│ Choisir un lieu              │
│ [ 🔍 Rechercher…          ]  │
│ Filtres [ Prix ] [ Distance] │
│                              │
│ ○ Les Cinq Gourmands  800m  │  liste radio rows 56px
│ ○ Chez Marcel         1.2km │
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │   Proposer ce lieu       │ │
│ └──────────────────────────┘ │
```

**Variante duo** : l’autre reçoit **Accepter / Contre-proposition** (MVP : accepter seulement).

---

## 16) Confirmation mutuelle (20)

```
│ Rendez-vous                  │
│ Les Cinq Gourmands           │  H2
│ Jeu 19:30                    │  meta
│ [ Voir sur Maps          ]  │  lien
│                              │
│   Toi        Lui             │  2 colonnes avatars
│   ✓          ⏳              │  états check
│                              │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │      J’y vais             │ │  PRIMARY (toggle confirmé)
│ └──────────────────────────┘ │
```

---

## 17) Chat pré-repas (21)

```
┌──────────────────────────────┐
│ ◀  Marc · Jeu 19:30    [···] │
├──────────────────────────────┤
│                              │
│   bulles…                    │  zone messages
│                              │
├──────────────────────────────┤
│ ┌────────────────────┐ [Env] │
│ │ Message…          │       │  input + bouton
│ └────────────────────┘       │
└──────────────────────────────┘
```

**Règle** : pas d’input si **permission** absente (écran explicatif à la place).

---

## 18) Jour J (22)

```
│ Ton repas ce soir            │
│ Les Cinq · 19:30             │
│ ┌──────────────────────────┐ │
│ │   Ouvrir dans Maps       │ │  PRIMARY
│ └──────────────────────────┘ │
│   Signaler un problème       │  lien rouge doux / secondary
└──────────────────────────────┘
```

---

## 19) Post-repas (23)

```
│ C’était comment ?            │  H1
│                              │
│   [ 😐 ] [ 🙂 ] [ 🤩 ]       │  3 pictos larges OU chips
│                              │
│   “Un bon moment se garde…”  │  citation option
│                              │
│ ┌──────────────────────────┐ │
│ │  Prochaine table ensemble │ │  SECONDARY
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │  Terminer                │ │  GHOST
│ └──────────────────────────┘ │
```

---

## 20) Feed (24) & Répondre (25) — V1.5

**Feed** : liste de **cards** type post (auteur, type, heure, CTA **Répondre**).  
**Répondre** : **thread** en bas sheet ou écran plein ; **quota** affiché (“2 places”).

---

## 21) V2 — référence courte

| Écran | Structure |
|-------|-----------|
| Créer repas groupe | Form : titre, date, cap, lieu type → CTA Publier |
| Qui ramène quoi | Grille 4 slots + assignation tap |
| Événement | Hero image, prix, CTA **Réserver** |
| Contacts graille | Liste + CTA **Inviter à manger** |
| Repas croisé | Pick 2 contacts + CTA **Proposer** |
| Jauge lien | Barre douce + texte palier (privé) |

---

## 22) Hiérarchie visuelle — règles globales

1. **Un seul focus** : primary CTA en bas sauf listes d’actions équivalentes (Accepter/Refuser).  
2. **Espacement** : sections **24px** ; sous-sections **16px**.  
3. **Couleur** : texte principal `ptg-text` ; actions secondaires **outline** ; danger **texte** + confirmation modal.  
4. **Lisibilité** : pas plus de **3 niveaux** typographiques visibles sans scroll sur les écrans décision.

---

## 23) Livrable Figma (recommandé)

- Frames **375** + **430** (grand mobile).  
- Composants : `Button/Primary`, `Card.Profile`, `Chip`, `Header`, `BottomNav`, `Input`, `Modal`.  
- Variants : **default / loading / error / empty** pour Explorer & Demandes.

---

*Document UI v1 — aligné avec tokens `DESIGN_SYSTEM.md`.*
