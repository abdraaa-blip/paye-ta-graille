# Paye ta graille : copy UX complet (v1 finale + variantes A/B)

**Statut** : banque de textes **prête implémentation** (onboarding, écrans cœur, notifications, erreurs).  
**Ton** : humain, chaud, simple. Phrases courtes. **Aucun** tiret cadratin au milieu des phrases.  
**Règle** : si une phrase sonne artificielle, la remplacer par la variante **B** ou la réécrire localement en gardant le sens.

**Alignement** : intentions repas **J’invite · On partage · Je me fais inviter** (`PRODUCT_SPEC.md`).  
**Référence process** : `PROMPT_REECRITURE_ET_VOIX.md` · ton global `UX_COPY_SYSTEM.md`.

---

## 1) Principes (rappel express)

- Tutoiement. Une intention par écran quand c’est possible. Toujours une **sortie** (Plus tard, Passer, Pas maintenant).  
- Pas de culpabilité, pas de FOMO mensonger, pas de promesse santé ou dating forcé.  
- Emojis : **option** selon plateforme. Si tu les retires, le texte doit tenir debout tout seul.

---

## 2) Slogans & promesses (marketing + splash)

**Officiel recommandé (combo)**  
- Ligne 1 : **Ne mange plus seul.**  
- Ligne 2 : **Pas une app de rencontre. Une table.**

**Variante A (plus douce)**  
- Ligne 1 : **On commence par manger.**  
- Ligne 2 : **Le reste, s’il arrive, arrive à table.**

**Variante B (plus directe)**  
- Ligne 1 : **Repas réels entre humains.**  
- Ligne 2 : **Tu choisis ton intention. On s’occupe du cadre.**

**Sous lignes splash (rotation, max 2 lignes)**  
- A : **Intentions claires. Moins de blabla.**  
- B : **Une table, un vrai moment.**  
- C : **T’as faim, ou t’as envie de voir du monde ? Les deux, c’est ok.**

**Accroches courtes (stores, pas forcément slogans gelés)**  
- **Une table t’attend peut-être déjà.**  
- **Moins d’écran. Plus de vrai.**  
- **Ce soir, tu peux ne pas être seul à table.**

---

## 3) Onboarding (parcours)

### Splash / valeur (écran 1)

| Élément | Texte final | Variante B |
|---------|-------------|------------|
| H1 | Ne mange plus seul. | Repas réels. Intentions simples. |
| Sous-texte | Pas une app de rencontre. Une table. | Tu dis comment tu veux manger. On t’aide à le vivre. |
| CTA primaire | Commencer | C’est parti |
| Lien secondaire | J’ai déjà un compte | Me connecter |

### Auth (écran 2)

| Élément | Texte final | Variante B |
|---------|-------------|------------|
| Titre | Connexion | Revenir |
| Sous-texte | Email ou téléphone, au choix. | On t’envoie un lien. Simple. |
| Label champ | Email ou numéro | Ton email ou ton mobile |
| CTA | Continuer | Recevoir le lien |
| Légal | En continuant, tu acceptes nos conditions. | En continuant, tu lis et tu acceptes les règles d’usage. |

### Profil minimal (écran 3)

| Élément | Texte final |
|---------|-------------|
| Titre | Ton profil |
| Sous-texte | Un pseudo, une photo, un coin où tu vis. |
| Labels | Pseudo · Ville · Rayon autour de toi |
| CTA | Continuer |

### Intention sociale (écran 4)

| Élément | Texte final |
|---------|-------------|
| Titre | Pour cadrer la table |
| Sous-texte | Pas un test de personnalité. Juste du contexte. |
| Carte 1 | **Ami** · Tu vises surtout des gens que tu connais déjà ou que tu veux revoir. |
| Carte 2 | **Ouvert** · Tu es partant pour rencontrer, sans te mettre la pression. |
| Carte 3 | **Dating léger** · Tu ne fermes pas la porte, mais le repas passe avant. |
| CTA | Continuer |

### Intention repas (écran 5)

| Élément | Texte final | Variante B (micro-ligne) |
|---------|-------------|---------------------------|
| Titre | Ton intention repas | Comment tu proposes la table |
| Bloc 1 | **J’invite** · Tu proposes de payer le repas. | **J’invite** · C’est ton geste. |
| Bloc 2 | **On partage** · Chacun paie sa part. | **On partage** · Simple et clair. |
| Bloc 3 | **Je me fais inviter** · Tu es ouvert à qu’on t’invite. | **Je me fais inviter** · Tu viens avec plaisir si on te propose. |
| CTA | Continuer | OK pour la suite |

### Tags personnalité (6)

| Élément | Texte final |
|---------|-------------|
| Titre | Ton style à table |
| Sous-texte | Choisis jusqu’à 8 traits. Tu peux en changer plus tard. |
| Compteur | Tu as choisi X sur 8 |

### Tags habitudes (7)

| Élément | Texte final |
|---------|-------------|
| Titre | Tes habitudes |
| Sous-texte | Ça aide à matcher sans te mettre dans une case trop étroite. |

### Graille (8)

| Élément | Texte final |
|---------|-------------|
| Titre | Ta vibe culinaire |
| Sous-texte | Ce que tu aimes manger, sans prise de tête. |

### Objectif ici (9)

| Élément | Texte final |
|---------|-------------|
| Titre | Ce que tu cherches ici |
| Sous-texte | Plusieurs réponses possibles. |

### Préférences table (10)

| Élément | Texte final |
|---------|-------------|
| Titre | À table, tu préfères |
| Option A | **Tout le monde** · Tu es à l’aise avec des profils variés. |
| Option B | **Des profils proches des miens** · Tu aimes quand ça ressemble un peu à toi. |
| Option C | **J’aime faire découvrir** · Tu prends plaisir à proposer des lieux ou des idées. |

### Contraintes alimentaires (11)

| Élément | Texte final |
|---------|-------------|
| Titre | Contraintes alimentaires |
| Sous-texte | Note ce qui compte pour toi. Une ligne suffit souvent. |
| Placeholder | Exemple : sans arachides, végétarien, halal… |
| Encart | Pense à confirmer au lieu le jour J. L’info sur les plats, c’est leur responsabilité. |

### Nudges (12)

| Élément | Texte final |
|---------|-------------|
| Titre | Les rappels |
| Sous-texte | Tu gardes la main. On ne spam pas. |
| Segments | **Calme** · **Normal** · **Off** |
| Aide Calme | Rappels utiles seulement si un repas est prévu. |
| Aide Normal | Quelques idées douces si tu veux remettre ça. |
| Aide Off | Silence total côté notifs marketing. Les alertes repas restent si tu en as besoin. |
| CTA final | Terminer | Entrer dans l’app |

---

## 4) Accueil & navigation

### Accueil (13)

| Élément | Texte final | Variante B |
|---------|-------------|------------|
| H1 | On mange ? | Ta prochaine table |
| Sous-texte | Une table t’attend peut-être déjà. | Quand tu veux, on t’aide à trouver du monde. |
| Carte repas en cours | **Repas prévu** · {jour} {heure} · {lieu court} | **Rendez-vous** · même contenu |
| Lien carte | Voir le repas | Détails du repas |
| CTA primaire | Explorer des tables | Voir qui mange près de moi |
| CTA secondaire | Proposer un repas | Lancer une invitation |

### Bottom nav

| Onglet | Label |
|--------|-------|
| 1 | Accueil |
| 2 | Explorer |
| 3 | Moi |

---

## 5) Explorer & profils

### Explorer (14)

| Élément | Texte final |
|---------|-------------|
| Titre | Autour de toi |
| Filtres | Rayon · Budget |
| Vide | Personne dans ton rayon pour l'instant. Tu veux élargir un peu ? |
| CTA vide | Élargir le rayon |
| Erreur liste | Petit souci de chargement. Réessaie dans un instant. |

### Fiche profil autre (15)

| Élément | Texte final |
|---------|-------------|
| CTA | Proposer un repas |
| Lien discret | Signaler |

### Proposition repas (16)

| Élément | Texte final |
|---------|-------------|
| Titre | Proposer un repas à {prénom} |
| Labels | Créneau · Zone · Budget |
| Rappel intention | Ton intention : {J’invite / On partage / Je me fais inviter} |
| CTA | Envoyer |

### Demandes reçues (17)

| Élément | Texte final |
|---------|-------------|
| Titre | Demandes reçues |
| Bouton 1 | Accepter |
| Bouton 2 | Refuser |

### Sheet refus

| Élément | Texte final |
|---------|-------------|
| Titre | Refuser avec tact |
| Sous-texte | Un court message, c’est mieux. Optionnel. |
| Placeholder | Merci pour ta proposition, pas dispo cette fois. |
| CTA | Envoyer le refus |
| Fermer | Annuler |

---

## 6) Match, lieu, confirmation, chat, jour J

### Match (18)

| Élément | Texte final | Variante B |
|---------|-------------|------------|
| H1 | C’est oui. | Vous vous dites oui. |
| Corps | Vous allez manger ensemble. | La table est posée. Il reste le lieu. |
| Encart | Lieu public, respect mutuel. On garde les choses simples. | même sens, ton plus sec |
| CTA | Choisir un lieu | Trouver un lieu |

### Choix lieu (19)

| Élément | Texte final |
|---------|-------------|
| Titre | Choisir un lieu |
| Recherche | Rechercher un lieu |
| CTA | Proposer ce lieu |
| Attente autre | {Prénom} propose un lieu. Patiente un peu. |

### Confirmation mutuelle (20)

| Élément | Texte final |
|---------|-------------|
| Titre | Rendez-vous |
| Sous-texte | {Lieu} · {jour} {heure} |
| Lien | Voir sur Maps |
| Colonnes | Toi · {Autre} |
| États | Confirmé · En attente |
| CTA | J’y vais |
| Info | Tu peux annuler si vraiment nécessaire. Préviens l’autre personne. |

### Chat pré-repas (21)

| Élément | Texte final |
|---------|-------------|
| Titre barre | {Prénom} · {jour} {heure} |
| Placeholder input | Écrire un message |
| Bouton envoi | Envoyer |
| Sans permission | Le chat s’ouvre quand vous êtes tous les deux au bon stade. Patiente encore un peu. |

### Jour J (22)

| Élément | Texte final | Variante B |
|---------|-------------|------------|
| Titre | Ton repas aujourd’hui | Ce soir, c’est table |
| Sous-texte | {Lieu} · {heure} | Même infos |
| CTA | Ouvrir dans Maps | S’y rendre |
| Lien | Signaler un problème | Besoin d’aide |

### Post-repas (23)

| Élément | Texte final | Variante B |
|---------|-------------|------------|
| Titre | C’était comment ? | Alors, cette table ? |
| Sous-texte | Un clic suffit. Pas de roman. | Trois réponses, c’est tout. |
| CTA secondaire | Prochaine table ensemble | On remet ça ? |
| CTA fantôme | Terminer | Plus tard |

**Micro ligne option sous les smileys**  
- A : **Les bons moments reviennent quand on veut.**  
- B : **Rien d’obligatoire. Juste une envie.**  

---

## 7) Moi & réglages (extra cœur V1)

| Élément | Texte final |
|---------|-------------|
| Titre onglet | Moi |
| Lien profil | Modifier mon profil |
| Lien nudges | Rappels et notifications |
| Lien aide | Aide et sécurité |
| Lien déconnexion | Me déconnecter |

---

## 8) Feed & réponse (V1.5, textes de base)

| Élément | Texte final |
|---------|-------------|
| Titre | Tables ouvertes |
| Sous-texte | Des envies du moment près de toi. |
| CTA carte | Répondre |
| Thread | Conversation liée à l’annonce |
| Quota | {n} places restantes |

---

## 9) V2 (labels courts, à brancher plus tard)

| Zone | Texte final |
|------|-------------|
| Groupe | Repas à plusieurs |
| Potluck | Qui ramène quoi |
| Événement | Événement et billet |
| **Mes tables** (nom d’onglet / zone officielle V2) | Les gens avec qui t’as mangé |
| Sous-titre option (clin d’œil) | Bienvenue en Friendzone *(une ligne d’explication obligatoire sous le mot, voir `ZONE_AMIS_FRIENDZONE_STRATEGIE.md`)* |
| Contacts | Contacts graille *(intégrés dans Mes tables ou entrée dédiée selon IA)* |
| Repas croisé | Inviter deux personnes |
| Jauge | Votre fil rouge, en privé |
| Empty state zone tables | Ici, pas de swipe. Que des gens avec qui t’as partagé un repas. |

---

## 10) Notifications (push & in-app)

**Règle** : une notif = une info utile ou une vraie fenêtre sociale. Pas de clickbait.

| Situation | Texte final | Variante B |
|-----------|-------------|------------|
| Demande reçue | {Prénom} te propose un repas. | Une table pour toi, signée {Prénom}. |
| Demande acceptée | {Prénom} a dit oui. Il reste le lieu. | Oui pour la table. Place au lieu. |
| Lieu proposé | Un lieu est proposé. Tu confirmes ? | Nouveau lieu à lire. |
| Rappel J-24 | Demain, table à {heure}. | Rappel doux : demain tu manges avec {Prénom}. |
| Rappel J-2h | Dans deux heures : {lieu}. | Bientôt à table. Pense à prévenir si retard. |
| Post-repas doux | Envie de remettre ça un jour ? | Si ça t’a plu, tu peux proposer une suite. |
| Inactif doux | Et si ce soir tu ne mangeais pas seul ? | Quelqu’un mange peut-être près de toi. |
| Signalement reçu | Merci. On regarde ça avec sérieux. | Message reçu. On traite. |

---

## 11) Erreurs, vides, système

| Situation | Texte final | Variante B |
|-----------|-------------|------------|
| Réseau | Connexion instable. Réessaie. | On n’a pas réussi à joindre le serveur. Un instant et tu relances. |
| 404 soft | Rien ici pour l’instant. | Cette page est vide. Reviens en arrière. |
| Refus envoyé | C’est noté. Pas de souci. | Message envoyé. |
| Action impossible | On ne peut pas faire ça pour l’instant. | Impossible pour le moment. |
| Signalement | Merci. On regarde ça. | Merci pour le signalement. |
| Succès générique | C’est bon. | OK, c’est enregistré. |

---

## 12) Sécurité & modération (courts)

| Élément | Texte final |
|---------|-------------|
| Titre sheet signalement | Signaler |
| Intro | Raconte ce qui s’est passé. Reste factuel. |
| CTA | Envoyer |
| Après envoi | Merci. On revient vers toi si besoin. |

---

## 13) Glossaire affichable (tooltips courts)

| Terme | Tooltip |
|-------|---------|
| Contact graille | Un lien pour remanger ensemble, seulement si vous êtes d’accord tous les deux. |
| Repas ouvert | Une envie publiée. Les réponses restent sous l’annonce. |
| Compagnon de graille | Un petit texte privé quand vous partagez souvent la table. Pas un trophée public. |

---

## 14) Cohérence globale (check rapide)

- [ ] Les trois intentions sont **écrites pareil** partout.  
- [ ] Pas de **match** au sens dating si tu veux éviter l’ambiguïté : ici on dit **oui pour la table**, **c’est oui**, **accord**.  
- [ ] Chaque écran critique a **Plus tard**, **Refuser**, ou **Terminer** quand il le faut.  
- [ ] Aucune phrase ne **culpabilise** pour l’absence.  
- [ ] Relire à voix haute : ça passe pour une **vraie** conversation.

---

*v1. À gel après 5 à 10 tests utilisateurs. Les variantes B servent d’A/B ou de secours éditorial.*
