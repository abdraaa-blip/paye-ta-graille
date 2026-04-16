# Paye ta graille — Version projet optimisée (synthèse maître v1)

**Rôle** : **une lecture** pour recomposer le dossier après analyse multi-documents (42 fichiers `docs/`).  
**Construction développable** (architecture, MVP, carte UX, sprints) : **`BLUEPRINT_PRODUIT_FINAL_MVP.md`**.  
**Règle de tri** : chaque décision doit répondre oui à :

> *« Est-ce que cela élève le projet sans le trahir ? »*

**ADN immuable** (ne pas négocier) : **repas IRL**, **intentions explicites**, **table avant dating**, **humain et dignité**, **confiance > volume de features**, **pic émotionnel hors écran**.

---

## 1. Analyse complète (synthèse)

### 1.1 Ce que le dossier fait déjà très bien

| Zone | Pépites / forces |
|------|-------------------|
| **Vision** | Promesse **Ne mange plus seul**, différenciation dating, phasing V1 / V1.5 / V2 réaliste (`PRODUCT_SPEC` §0). |
| **UX** | Parcours 31 écrans, machine d’états, matrice états × chat × notifs, copy complète + variantes A/B. |
| **Confiance** | Chat conditionnel, refus élégant, signalement, jauge **privée**, engagement **éthique** (rétention saine). |
| **Marque** | Corpus slogans exhaustif, storytelling, identité visuelle + DA totale, ton humain. |
| **Scale & ops** | Paliers 1k / 10k / 100k, launch, crise, viralité **sans** spam, métriques **IRL**. |
| **Modules** | Table surprise + **seconde graille**, repas suspendu : **profondeur** rare sur un MVP social. |
| **Social réel** | **Mes compagnons** + **La Friend zone** (hub `/reseau-graille`) **cadrée** : différenciation mémorable sans casser l’élégance si bien placée. |

### 1.2 Incohérences repérées (à traiter par process, pas panique)

| Sujet | Statut |
|-------|--------|
| Multiples « sources de vérité » texte | Résolu par **pyramide** §3 ; `COPY_UX_COMPLET_V1` + `MARKETING_OFFICIEL` pour externes. |
| Répétition engagement / rétention / neuro | **Canonical** : `SYSTEME_ENGAGEMENT_NATUREL` + `RETENTION_ETHICAL` ; `PROMPT_ENGAGEMENT_NEURO_*` = **cadre LLM**, pas une 3e doctrine produit. |
| Juridique | Toujours **structure** sans clauses ; **P0** avant ouverture publique. |

### 1.3 Manques réels (ajouts stratégiques §6)

- **Décision produit écrite** : qui valide `completed`, politique no-show **chiffrée** (même brouillon).  
- **Journal de décisions** : **`DECISIONS_PRODUIT_LOG.md`** (actif).  
- **Gate ville pilote** (seuil liquidité avant marketing massif) : esquisse dans SCALE / LAUNCH, à **nommer** comme règle produit une ligne.  
- **Accessibilité produit** (pas seulement DA) : check-list parcours critique.  
- **Repo code** : **Next.js + Supabase** dans ce dépôt — voir `LIVRABLE_MVP_REFERENCE_LANCEMENT.md`, `INTEGRATION_PRODUIT_SYNTHESE.md`, `VERSION_PROJET_RECONSTRUITE.md`.

### 1.4 Idées « non validées » à ne pas jeter

Tout ce qui est en **module** ou **V1.5+** reste **backlog priorisé** : Table surprise, repas suspendu, feed, groupe, événements, **Mes tables** complète. **Rien n’est supprimé** du corpus : `ANNEXE_CORPUS_RECYCLAGE_COMPLET.md`.

---

## 2. Tri intelligent (décisions)

| Catégorie | Traitement |
|-----------|------------|
| **Garder tel quel** | ADN, phasing, matrice repas, copy V1, identité DA, métriques North Star IRL, playbooks crise / lancement. |
| **Améliorer / fusionner** | Engagement : lire **d’abord** `SYSTEME_ENGAGEMENT_NATUREL` ; `RETENTION_ETHICAL` en rappel court ; prompts en annexe méthode. |
| **Reporter (pas faible, mais risque)** | Table surprise, repas suspendu, monétisation avancée : **après** liquidité duo + **trust** mesurable. |
| **Supprimer du MVP surface (pas des docs)** | Surcharge nav, **La Friend zone** seule en H1 sans « Mes compagnons », superlatifs « la seule… », promesses prix sans preuve. |
| **Amplifier** | **Mes compagnons** / future **Mes tables** comme **preuve sociale** du modèle ; **seconde graille** comme **narratif relance** ; **ville pilote** comme stratégie ; **garde-fous Premium** déjà écrits. |

---

## 3. Structure optimisée du projet (documentation)

**Pyramide de lecture** (du plus stable au plus spécialisé) :

| Niveau | Document | Rôle |
|--------|----------|------|
| **0** | **`PROJET_PTGR_VERSION_OPTIMISEE.md`** (ce fichier) | Vue maître, tri, ADN, liens |
| **0a** | **`LIVRABLE_MVP_REFERENCE_LANCEMENT.md`** | Synthèse lancement : vision, MVP, archi, UX, DA, sécu, business |
| **0a-bis** | **`VERSION_PROJET_RECONSTRUITE.md`** | Reconstruction : tri idées, amplification, ADN, structure |
| **0b** | **`INTEGRATION_PRODUIT_SYNTHESE.md`** | Cycles intégration, backlog, refus documentés |
| **1** | `VISION_PRODUIT_OFFICIEL.md` · `PRODUCT_SPEC.md` | Vision + exécution technique / backlog |
| **2** | `UX_PRODUIT_OFFICIEL.md` · `UI_SCREENS.md` · `MATRICE_REPAS_ETATS_PERMISSIONS.md` · `UX_SECTION_AMIS_MES_TABLES.md` | UX complète |
| **3** | `COPY_UX_COMPLET_V1.md` · `UX_COPY_SYSTEM.md` | Textes |
| **4** | `MARKETING_OFFICIEL.md` · `MARKETING_POSITIONING.md` | Marque externe + historique |
| **5** | `BRAND_OFFICIEL.md` · `IDENTITE_VISUELLE_COMPLETE.md` · `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` · `DESIGN_SYSTEM.md` | Brand + implémentation visuelle |
| **6** | `METRICS_PRODUCT.md` · `SCALE_ARCHITECTURE.md` · `AUDIT_PRODUIT_GLOBAL.md` | Mesure, scale, audit |
| **7** | `LAUNCH_PLAYBOOK.md` · `VIRAL_GROWTH.md` · `CRISIS_PLAYBOOK.md` · `RESTAURANT_PARTNERSHIPS.md` · `INVESTOR_PITCH.md` | Go-to-market |
| **8** | Modules + suspens | `MODULE_*`, `SUSPENDED_*`, `TABLE_SURPRISE_*`, `ZONE_AMIS_*` |
| **9** | `HUMAN_EXPERIENCE.md` · `USER_PERSONAS.md` | Recherche utilisateur |
| **10** | `LEGAL_STRUCTURE_OFFICIEL.md` + futur `docs/legal/*` | Conformité |
| **11** | `ANNEXE_CORPUS_RECYCLAGE_COMPLET.md` | Rien ne se perd |
| **12** | `PROMPT_*` · `PROMPT_LIBRARY_EXTENDED.md` | Outils équipe |

**Entrée partenaires / investisseurs** : `DOSSIER_OFFICIEL_INDEX.md`.

---

## 4. Version produit « optimisée » (une colonne vertébrale)

### Proposition unique (élevée, simple)

**Paye ta graille** transforme l’envie de **ne pas manger seul** en **rendez-vous réel**, avec des **intentions claires** et un **cadre de confiance**. Ce n’est pas une usine à profils. C’est une **logistique de table**.

### Vagues (inchangées dans l’esprit, renforcées dans la communication)

1. **V1** : duo + qualité + une géographie où la promesse tient. **Métrique** : repas `completed`, show-up.  
2. **V1.5** : **densité** (feed / repas ouvert) **sans** casser la confiance (quotas, pas de DM froid).  
3. **V2** : **groupe**, **événements**, **Mes tables** (lien réel), **jauge privée**, monétisation **encadrée**.

### Les trois piliers (amplification)

| Pilier | Contenu amplifié |
|--------|-------------------|
| **Clarté** | Intentions repas + sociales visibles tôt ; états repas **une** matrice ; pas de jargon dating. |
| **Confiance** | Signalement, modération, lieu public, transparence nudges, juridique **avant** scale marketing. |
| **Réel** | North Star = tables complétées ; **Mes compagnons** / Friend zone comme **preuve** du modèle ; engagement **sans** addiction d’écran. |

---

## 5. Sélection des meilleures idées (top 12)

1. **Intentions repas** (J’invite / On partage / Je me fais inviter) comme levier **juridique-social** et UX.  
2. **Matrice états** pour éviter les fuites et les mauvais chats.  
3. **Rétention par prochaine table**, pas par feed infini.  
4. **Identité visuelle** « suggérer » la nourriture, silhouettes, chaleur (différenciation premium).  
5. **Copy** humaine, sorties gracieuses, anti culpabilité.  
6. **Ville pilote** + anti cold start explicite.  
7. **Garde-fous Premium** (déjà dans le spec).  
8. **Mes compagnons** + **La Friend zone** **secondaire** (taquin **contrôlé**).  
9. **Seconde graille** / table surprise comme **relance** narrative (hors pression).  
10. **Repas suspendu** comme **impact** (avec transparence légale).  
11. **Personas + human experience** pour ne pas designer pour soi seul.  
12. **Crisis + metrics** ensemble (culture **incident-ready**).

---

## 6. Ajouts stratégiques recommandés (nouveaux, expliqués)

| Ajout | Pourquoi | Où le formaliser |
|--------|----------|------------------|
| **ADR court** « décisions structurantes » | Évite la dérive quand l’équipe grossit. | **`DECISIONS_PRODUIT_LOG.md`** (actif). Synthèse d’intégration : **`INTEGRATION_PRODUIT_SYNTHESE.md`**. |
| **Règle `completed`** | Sans ça, les métriques et la zone compagnons restent floues. | `PRODUCT_SPEC` + `MATRICE_*` (paragraphe unique suffit au début). |
| **Gate liquidité** explicite | Évite brûler la marque sur 10 villes vides. | `LAUNCH_PLAYBOOK` + phrase dans `VISION_OFFICIEL`. |
| **Check-list a11y parcours** | L’inclusivité est déjà dans le ton ; il faut le **parcours**. | `UX_SECTION_*` ou `UI_SCREENS` en annexe. |
| **Dossier `docs/legal/`** versionnée | Due diligence investisseur / stores. | Déjà listé dans `LEGAL_STRUCTURE_OFFICIEL.md` ; **exécuter**. |

**Rien de tout cela** n’ajoute une feature utilisateur : ça **solidifie** le produit.

---

## 7. Ce qu’on refuse (anti-dilution)

- Empiler **5 modules sensibles** en V1.  
- **Gamifier** la honte, le corps, la compétition amoureuse.  
- **Promettre** ce que la densité locale ne permet pas.  
- Transformer l’app en **feed** avant d’avoir prouvé le **duo**.  
- Perdre le **tutoiement chaleureux** pour un ton **SaaS corporate**.

---

## 8. Synthèse exécutive (30 secondes)

**Paye ta graille** est un **produit documenté à un niveau rare pour la phase pré-code** : vision, UX, copy, DA, confiance, scale, modules d’impact. La version **optimisée** ne change **pas** l’idée : elle **ordonne**, **priorise**, et **exige** trois compléments **non sexy** mais **critiques** : **légal rédigé**, **règle `completed`**, **pilotage par ville**. Le reste est déjà **fort** ; il faut **l’exécuter** sans dilution.

---

## 9. Action immédiate (ordre recommandé)

1. Lire ce fichier + `DOSSIER_OFFICIEL_INDEX.md`.  
2. Geler **MVP V1** sur `AUDIT_PRODUIT_GLOBAL.md` + `PRODUCT_SPEC.md`.  
3. Trancher **`completed`** + variante chat **A** dans `MATRICE_REPAS_ETATS_PERMISSIONS.md`.  
4. Lancer **juridique** parallèle au code.  
5. **Code** : Next + Supabase selon backlog §12 du `PRODUCT_SPEC.md`.

---

*v1 synthèse maître. Mettre à jour après première série de données terrain ou levée.*
