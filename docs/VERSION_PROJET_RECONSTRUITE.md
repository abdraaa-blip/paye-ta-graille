# Paye ta graille — Version reconstruite & optimisée (carte décisionnelle)

**Rôle** : **recomposition** du projet après analyse de tout le corpus (validé, non validé, explorations) — sans refaire 50 documents.  
**Règle** : *« Est-ce que cela élève le projet sans le trahir ? »*

**Lecture complémentaire** : `PROJET_PTGR_VERSION_OPTIMISEE.md` (pyramide) · `LIVRABLE_MVP_REFERENCE_LANCEMENT.md` (MVP jour J) · `INTEGRATION_PRODUIT_SYNTHESE.md` (traçabilité code/doc) · `DECISIONS_PRODUIT_LOG.md` (pourquoi).

---

## 1. Essence — ce que le produit **est** (et ne sera pas)

**Paye ta graille** est une **logistique de table** : transformer l’envie de **ne pas manger seul** en **rendez-vous réel**, avec des **intentions d’addition lisibles** et un **cadre de confiance**. Ce n’est **pas** une app de rencontre marketing-first, **pas** un réseau à feed infini, **pas** une promesse de couple.

**Pic de valeur** : **hors écran** — le succès se mesure en **tables `completed`**, pas en temps passé dans l’app.

---

## 2. Tri intelligent des idées (synthèse)

| Famille d’idées | **Retenu / amplifié** | **Reporté (puissant mais risqué)** | **Refusé ou dilué** |
|-----------------|------------------------|-------------------------------------|----------------------|
| Intentions repas (3 modes) | **Cœur** — contrat social + UX + différenciation | — | 4e mode « flou » |
| Intentions sociales (ami / ouvert / dating léger) | **Oui** — cadrage sans vendre l’amour | — | Angle « critères couple » |
| Discover intent-first | **Oui** — rappel intention avant contact | — | DM à froid |
| Machine d’états + chat matrice A | **Oui** — **validé serveur** (`meal-transitions.ts`) | Chat ouvert dès match (variante B) sans quota | — |
| Mes compagnons + **La Friend zone** | **Oui** — taquin **secondaire**, H1 sobre | Friend zone seule en titre | Moquerie / humiliation |
| Jauge privée duo | **Oui** — paliers doux, **jamais** public | — | Classement global |
| Healthy / végé + micro-messages | **Oui** — inclusif, pas culpabilisant | — | Coach santé dur |
| Marketing « assumable » / seconde graille | **Oui** — `MARKETING_OFFICIEL` §2.8–2.9 | — | « La seule app » sans juriste |
| Table surprise / seconde graille (module) | Backlog **après** liquidité duo | — | Tout lancer en V1 |
| Repas suspendu / solidarité | Backlog **avec** partenaires + legal | — | Algo « mérite » |
| Feed / repas ouverts / groupe N | V1.5 / V2 | — | Avant preuve duo |
| Engagement « dopamine ×100k » | **Reformulé** — anticipation **réelle**, viralité **table** | — | Dark patterns, addiction écran |
| Monétisation agressive | Après confiance mesurable | — | Paywall jour 1 |

**Pépites parfois « cachées » dans le dossier** : **repas croisé** (médiateur, graphe invisible) ; **événements curés** ; **qui ramène quoi** (potluck) ; **Graille à l’aveugle** (opt-in fort) — toutes **gardées** dans les specs modules, **pas** noyées dans le MVP code.

---

## 3. Les **12** idées les plus fortes (amplifiées en une phrase)

1. **Trois intentions repas** = la personne sait *qui paie* avant de parler — **clarté = confiance**.  
2. **Pas de swipe comme cœur** = on choisit une **table**, pas une photo optimisée.  
3. **Chat après le lieu** (variante A) = **moins de harcèlement**, plus de sérieux.  
4. **Refus élégant** partout = la dignité est **produit**, pas option.  
5. **Signalement + modération** = **infrastructure** de réseau social réel.  
6. **Mes compagnons** = **mémoire des tables** ; **Friend zone** = **signature** anti-dating **si** cadrée.  
7. **Jauge privée** = récompense **relationnelle** sans gamification toxique.  
8. **DA « suggérer » la nourriture** = premium **sans** banque d’images cheap.  
9. **Ville pilote** = la promesse tient **là où** il y a densité — pas dilution nationale jour 1.  
10. **North Star IRL** = métriques **honnêtes** pour investisseurs **et** utilisateurs.  
11. **Modules sensibles** (surprise, suspendu) = **profondeur** future sans casser le MVP.  
12. **Corpus copy + prompts Cursor** = **industrialisation** de la cohérence voix / marque.

---

## 4. Incohérences — **résolues** ou **canalisées**

| Sujet | Traitement |
|-------|------------|
| Trop de « sources de vérité » texte | Pyramide docs + `ux-copy.ts` / `MARKETING_OFFICIEL` |
| Neuro / engagement répété | Canon : `SYSTEME_ENGAGEMENT_NATUREL` + `RETENTION_ETHICAL` ; neuro = `PROMPT_ENGAGEMENT_*` (outil) |
| « Je me laisse » vs « Je me fais inviter » | Canon produit : **Je me fais inviter** (`intent-labels`, décisions) |
| `completed` / transitions repas | **Serveur** + `DECISIONS` + `MATRICE` (MVP : hôte ou invité·e peut clôturer depuis `confirmed`) |
| Tags profil catégorie SQL | `tagKeyToProfileCategory` — plus tout en `personality` |

---

## 5. Manques réels & **ajouts stratégiques** (non-feature)

À ajouter **pour un produit solide**, **sans** changer l’ADN :

| Ajout | Pourquoi |
|-------|-----------|
| **CGU + confidentialité** rédigées (juriste) | Bloquant « publique large » |
| **RLS** testée scénario par scénario | Bloquant confiance données |
| **Rate limiting** API (discover, messages, report) | Abus & coûts |
| **Gate liquidité** explicite (1 ville / N utilisateurs min) | Évite mort par vide perçu |
| **Check-list a11y** parcours critique | Aligné promesse « humain » |
| **`NEXT_PUBLIC_SITE_URL` + redirects Supabase** | Auth & OG qui marchent en prod |
| **Observabilité** (Sentry ou équivalent) post-bêta | Debug réel utilisateur |

*Aucun* de ces points n’est une « feature fun » : ce sont des **fondations** pour que les idées fortes **tiennent** au contact du réel.

---

## 6. Structure claire du dossier (où lire quoi)

| Besoin | Document |
|--------|----------|
| **Vision & tri** (ce fichier + vue maître) | `VERSION_PROJET_RECONSTRUITE.md` · `PROJET_PTGR_VERSION_OPTIMISEE.md` |
| **MVP développable + sprints** | `BLUEPRINT_PRODUIT_FINAL_MVP.md` |
| **Lancement / équipe** | `LIVRABLE_MVP_REFERENCE_LANCEMENT.md` |
| **Investisseurs / audit global dossier** | `DOSSIER_OFFICIEL_INDEX.md` · `RAPPORT_AUDIT_DOSSIER_MONDE_2026-04-13.md` |
| **Arbitrages datés** | `DECISIONS_PRODUIT_LOG.md` |
| **Idées ↔ code intégré** | `INTEGRATION_PRODUIT_SYNTHESE.md` |
| **Brainstorm & prompts Cursor** | `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §6 |
| **États × chat** | `MATRICE_REPAS_ETATS_PERMISSIONS.md` |
| **Sécu / prod** | `AUDIT_TECHNIQUE_CODEBASE.md` · `AUDIT_FINAL_PRE_PRODUCTION.md` · `AUDIT_MVP_VALIDATION_2026-04-13.md` · `DEPLOIEMENT_VERCEL.md` · `SECURITE_CHECKLIST_CODE.md` · `RLS_SCENARIOS_CHECKLIST.md` |
| **Rien ne se perd (copy)** | `ANNEXE_CORPUS_RECYCLAGE_COMPLET.md` |

---

## 7. Ambition **sans trahison**

- **Plus forte** : modules & narratifs (**seconde graille**, solidarité, événements) **documentés** et **phasés**, pas brûlés en V1.  
- **Plus claire** : une **machine d’états** comprise par produit, UX **et** API.  
- **Plus cohérente** : une **voix**, une **DA**, des **décisions** tracées.  
- **Plus ambitieuse** : viser **la référence** du repas social **IRL** — avec **patience** et **dignité**.

---

*Document pivot « reconstruction » — à garder court ; le détail vit dans les fichiers cités.*
