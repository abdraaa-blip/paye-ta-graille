# Paye ta graille — Prompt documentation complète, page « À propos », corpus & cadre légal (v1)

**Objectif** : guider un LLM (ou une équipe) pour **produire ou mettre à jour** l’ensemble des textes **publics** et **internes** qui racontent le projet, plus la **liste** des documents **légaux et conformité** nécessaires.  
**Contrainte rédactionnelle** : voix humaine, fluide, **sans** abus de tirets cadratins au milieu des phrases (voir `PROMPT_REECRITURE_ET_VOIX.md`).

**Alignement** : `PRODUCT_SPEC.md` · `BRAND_BOOK.md` · `MARKETING_POSITIONING.md` · `UX_COPY_SYSTEM.md` · **dossier officiel** : `DOSSIER_OFFICIEL_INDEX.md` · corpus intégral : `ANNEXE_CORPUS_RECYCLAGE_COMPLET.md`.

---

## 1) Rôle des phrases « slogan » non gelées

Beaucoup de formulations du fichier `MARKETING_POSITIONING.md` sont des **pistes** ou **slogans secondaires**. **Toutes ne doivent pas** apparaître comme slogan officiel.

**Règle** : toute phrase **non retenue** comme slogan court peut **rester** utile comme :

- matière pour la **page À propos** ou **Manifeste** ;
- **sous-titres** de sections sur le site ;
- **citations** dans un communiqué ou un README public ;
- **accroches** longues (2 lignes) sur une campagne, si testées.

**Interdit** : empiler **cinq** accroches contradictoires sur un même écran sans hiérarchie.

---

## 2) Banque de formulations à recycler (hors slogan gelé)

*À intégrer dans les longs textes quand pertinent, pas comme empilement.*

**Promesse / ADN**  
- Ne mange plus seul.  
- Pas une app de rencontre. Une table.  
- On commence par manger.  
- Rencontrer sans la gêne.  
- Une app que tu peux assumer… parce que c’est d’abord un repas.

**Social / simplicité**  
- Mange. Le reste vient tout seul.  
- Un repas, et peut-être plus.  
- À table, tout devient simple.  
- Manger ensemble, c’est déjà se rencontrer.  
- Tu manges. Tu rencontres. C’est tout.  
- Une table. Deux inconnus. Et ça suffit.  
- Pas de swipe. Juste une table.  
- Moins d’écran. Plus de vrai.

**Gourmand / humain**  
- Pour ceux qui aiment manger… et les gens.  
- Des rencontres qui ont du goût.  
- La rencontre version gourmande.

**Direct / viral doux**  
- T’as faim ? T’es pas obligé d’être seul.  
- Viens, on mange.  
- Ce soir, t’as une table.  
- Quelqu’un a faim comme toi.

**Accroches pub courtes** (à adapter au format)  
- Tu télécharges pas une date. Tu réserves une faim.  
- Table ce soir ?  
- Pas besoin d’excuse : c’est un repas.  
- Ce soir, quelqu’un mange pas loin de toi.

**Micro-onboarding** (déjà UX)  
- On mange ?  
- T’as faim ou t’as envie de rencontrer quelqu’un ?  
- Une table t’attend peut-être déjà.

**Modules** (si exposés publiquement, avec cadre éthique)  
- Table surprise, seconde graille (nommage interne / marketing à cadrer dans spec dédiée).  
- Repas suspendu : générosité, transparence, dignité.

Le LLM doit **classer** chaque phrase utilisée : **S** slogan officiel, **H** hero long, **A** à propos, **C** campagne, **I** interne seulement.

---

## 3) Méga-prompt « corpus projet + À propos + packs doc » (copier-coller)

> Tu es **rédacteur·rice éditorial·e** + **chef de projet documentation** pour **Paye ta graille**. Tu écris des textes **publics** et **internes** en français, **tutoiement** pour l’utilisateur final, **vous** uniquement pour clauses légales si convention standard.
>
> **Tâche 1 — Page « À propos » (web)** :  
> Structure recommandée : **Pourquoi on existe** (problème solitude / prétexte repas) · **Ce qu’on fait** (repas IRL, intentions) · **Ce qu’on n’est pas** (pas dating forcé, pas promesse magique) · **Comment on protège** (cadre, signalement, transparence) · **L’équipe ou la démarche** (placeholder honnête si anonyme) · **Contact**.  
> Intègre des formulations de la banque ci-dessus en **H2 / chapô**, pas en liste de slogans. **Pas** de longs tirets cadratins dans les phrases. Phrases courtes.
>
> **Tâche 2 — Document « idée du projet » (10 à 15 min de lecture)** :  
> Narratif : origine, utilisateurs, boucle IRL, vision V2, **limites** assumées. Ton calme, intelligent, une pointe d’humour max.
>
> **Tâche 3 — Kit presse (1 page)** : promesse, chiffres si fournis sinon « en lancement », contacts, visuels décrits (pas générés).
>
> **Tâche 4 — Liste des documents légaux et conformité à produire ou faire valider par un avocat** :  
> Pour chaque item : **nom du document**, **objectif**, **public**, **statut** (à rédiger / brouillon / validation juridique).  
> Inclure au minimum : **Mentions légales** ; **CGU** ; **Politique de confidentialité** ; **Politique cookies** (si UE) ; **charte de modération** ; **procédure signalement** ; **règles mineurs** (interdiction ou cadre strict) ; **conditions partenaires resto** si B2B ; **mentions dons / repas suspendu** si actif ; **mentions billetterie événements** si V2 ; **DPA** si sous-traitants ; **registre traitements** (RGPD, interne).
>
> **Tâche 5 — Cohérence** : signale toute contradiction avec une spec technique ou éthique fournie.
>
> **Sortie** : livre les sections **dans l’ordre** Tâche 1 à 5, avec titres Markdown `##`.

---

## 4) Fichiers déjà présents vs à créer

**Déjà couverts par la doc produit actuelle** (enrichir, ne pas doublonner sans fusion planifiée) :  
`PRODUCT_SPEC.md`, `BRAND_BOOK.md`, `MARKETING_POSITIONING.md`, `UX_COPY_SYSTEM.md`, modules table surprise / repas suspendu, engagement naturel.

**Typiquement encore à produire côté projet réel** (noms indicatifs) :

| Document | But |
|----------|-----|
| `LEGAL_MENTIONS.md` | base mentions légales |
| `LEGAL_CGU.md` | conditions d’utilisation |
| `LEGAL_CONFIDENTIALITE.md` | politique données personnelles |
| `LEGAL_COOKIES.md` | traceurs, consentement |
| `TRUST_MODERATION_CHARTER.md` | règles communauté, sanctions, appel |
| `TRUST_SAFETY_REPORTING.md` | signalement IRL / in-app |
| `LEGAL_MINORS_POLICY.md` | politique âge minimum, vérifications |
| `PARTNER_RESTAURANT_TERMS.md` | cadre partenariat |
| `LEGAL_SUSPENDED_MEAL_DISCLOSURES.md` | transparence dons si module actif |
| `EVENT_TICKETING_TERMS.md` | si billetterie V2 |

Le prompt section 3 demande explicitement cette **liste** dans la sortie LLM même si les fichiers n’existent pas encore.

---

## 5) Rappel tonal (une phrase)

**Paye ta graille** parle comme un **hôte** qui veut que tu te sentes **à l’aise**, pas comme une **machine à clics**.

---

*v1 — tout texte légal final = validation professionnelle obligatoire.*
