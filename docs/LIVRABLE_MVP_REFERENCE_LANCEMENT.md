# Paye ta graille — Référence lancement MVP (synthèse unique)

**Usage** : **une lecture** pour aligner équipe, investisseurs et devs le jour J — puis plonger dans les docs cités.  
**Règle** : chaque bloc doit répondre oui à *« Est-ce que cela rend ce produit meilleur, plus clair, plus fort, plus désirable ? »*

**État repo** : application **Next.js + Supabase** déjà amorcée (`src/`). Ce fichier **ne duplique pas** le blueprint : il **ordonne** et **pointe** vers la vérité.

---

## 1. Vision produit forte & différenciation

| Pilier | Contenu |
|--------|---------|
| **Promesse** | Ne pas manger seul → **repas réel**, cadre clair, **table avant dating**. |
| **Contrat social** | **3 intentions repas** : j’invite · on partage · je me fais inviter — visibles tôt, base juridique & UX. |
| **Différenciation** | Pas une usine à swipe ; **logistique de table** ; marketing **assumable** (honte → fierté) sans promesse amoureuse. |
| **Signature zone lien** | **Mes compagnons** + clin d’œil **La Friend zone** (amitié assumée autour du plat) — voir `ZONE_AMIS_FRIENDZONE_STRATEGIE.md`. |
| **North Star** | Repas **`completed`**, confiance, **densité locale** — pas rétention écran toxique (`SYSTEME_ENGAGEMENT_NATUREL.md`, `PROMPT_ENGAGEMENT_NEURO_MULTI_SENSORIEL.md`). |

---

## 2. MVP prêt à développer (gel fonctionnel)

### Inclus V1 (ship avant scale)

- Auth (magic link), profil + tags + intentions, **discover** filtré, **repas duo** (proposition → match → lieu → confirmation → jour J → fin).
- Chat **conditionnel** (matrice A : après `venue_confirmed` / `confirmed` — déjà aligné API messages).
- Lieux via **Places** serveur, signalement, **admin minimal**.
- **Pas** de revenu obligatoire en V1.0 si possible (liquidité d’abord).

### Exclu surface V1 (documenté, pas oublié)

- Feed / repas ouverts denses, **groupe N**, événements billet, **liste compagnons persistée + jauge**, Table surprise, repas suspendu **en prod large**, monétisation lourde.

**Détail technique développable** : `BLUEPRINT_PRODUIT_FINAL_MVP.md` §2–4, §12–13.  
**Arbitrages datés** : `DECISIONS_PRODUIT_LOG.md`.  
**Idées intégrées vs backlog** : `INTEGRATION_PRODUIT_SYNTHESE.md`.

---

## 3. Architecture technique (référence)

| Couche | Choix | Détail |
|--------|-------|--------|
| Frontend | Next.js App Router, TS | `src/app/*` |
| Data | Supabase Auth + Postgres + **RLS** | clients `src/lib/supabase/*` |
| API | Route Handlers | `src/app/api/*` — session `requireSession()`, Zod strict |
| Email | Resend (ou équivalent) | blueprint §3 |
| Lieux | Google Places | clé **serveur** uniquement |

**Sécurité app** : `AUDIT_TECHNIQUE_CODEBASE.md` (redirect OAuth, UUID repas, photo https, RLS à valider SQL).

**Schéma états repas** : `none` → `proposed` → `matched` → `venue_proposed` → `venue_confirmed` → `confirmed` → `completed` \| `cancelled` — source `MATRICE_REPAS_ETATS_PERMISSIONS.md`.

**À trancher P0** : règle unique **`completed`** (double confirmation vs auto 24h) — inscrire dans `DECISIONS_PRODUIT_LOG.md` puis coder.

---

## 4. UX complète & cohérence (écran par écran)

| Ressource | Rôle |
|-----------|------|
| `PRODUCT_SPEC.md` §3 | Liste exhaustive écrans V1 / V1.5 / V2 |
| `BLUEPRINT_PRODUIT_FINAL_MVP.md` §5 | Tableau V1 + renvois `COPY_UX_COMPLET_V1.md`, `UI_SCREENS.md` |
| `UX_PRODUIT_OFFICIEL.md` | Parcours, logique sociale produit |
| `src/lib/ux-copy.ts` | Textes **implémentés** (variantes A/B) |
| Onboarding | `OnboardingWizard.tsx`, `tag-options.ts`, `intent-labels.ts` |

**Principes** : compréhension en moins de 10 s, refus élégant, pas de DM froid, **rappel intention** avant proposition (`UX_DISCOVER.proposeContextHint`).

---

## 5. Design system & DA premium

| Ressource | Rôle |
|-----------|------|
| `DESIGN_SYSTEM.md` | Tokens, composants |
| `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` | DA totale |
| `DA_BRIEF_RECHERCHE_MULTIMETIERS_ILLUSTRATION.md` | Illustration, inclusion, brief agence |
| `IDENTITE_VISUELLE_COMPLETE.md` | Fondations visuelles |

**Résumé tokens** (rappel) : fond chaud, texte profond, accent terracotta, **suggérer** la nourriture sans cliché stock — motion douce, `prefers-reduced-motion`.

---

## 6. Logique sociale & systèmes clés

| Système | V1 | Après |
|---------|-----|--------|
| « Matching » | Proposition **explicite** + acceptation mutuelle | Filtres, densité |
| Repas duo | Machine d’états + permissions chat | Politique no-show |
| Groupes / qui ramène quoi | — | V2 |
| Table surprise / seconde graille | Spec module | Après traction duo |
| Repas suspendu | Spec module | Partenaires + legal |
| Mes compagnons / Friend zone | Hub vision + copy | Liste + jauge V2 |

**Engagement** : `SYSTEME_ENGAGEMENT_NATUREL.md`, `RETENTION_ETHICAL.md` — pas dark patterns.

---

## 7. Copywriting & branding (sources canon)

- **Marque & slogans** : `MARKETING_OFFICIEL.md` (§2.8–2.9 assumable / seconde graille / aveugle).  
- **Voix & micro-copy** : `UX_COPY_SYSTEM.md`, `PROMPT_REECRITURE_ET_VOIX.md`.  
- **Corpus recyclage** : `ANNEXE_CORPUS_RECYCLAGE_COMPLET.md`.  
- **Prompts Cursor** : `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §6.1–6.3 (bloc fixe + #1–#26).

---

## 8. Sécurité, confiance, modération

- **RLS** : audit SQL pré-prod ; alignement avec checks API.  
- **Signalement** : `api/report`, table `reports`.  
- **Modération** : file + ban manuel MVP.  
- **Legal** : `LEGAL_STRUCTURE_OFFICIEL.md` avant ouverture large.  
- **Crisis / lancement** : `CRISIS_PLAYBOOK.md`, `LAUNCH_PLAYBOOK.md`.

---

## 9. Business & croissance (cadrage)

- **V1** : croissance **IRL** (invitation à table, ville pilote), métriques `METRICS_PRODUCT.md`.  
- **V2+** : Premium encadré, partenaires resto, événements — voir `PRODUCT_SPEC.md`, `VIRAL_GROWTH.md`, `INVESTOR_PITCH.md`.

---

## 10. Ordre de lecture équipe (1h → profondeur)

1. **Ce fichier** (15 min).  
2. `PROJET_PTGR_VERSION_OPTIMISEE.md` — ADN & pyramide docs.  
3. `BLUEPRINT_PRODUIT_FINAL_MVP.md` — MVP + sprints.  
4. `V1_CONCEPT_BRAINSTORM_TO_CODE.md` §6.1 — prompts Cursor.  
5. Spécialistes : `MATRICE_REPAS_ETATS_PERMISSIONS.md`, `AUDIT_TECHNIQUE_CODEBASE.md`, `MARKETING_OFFICIEL.md`.

---

## 11. Action immédiate (lancement « maintenant »)

1. **Geler** règle `completed` + inscrire dans `DECISIONS_PRODUIT_LOG.md`.  
2. **Valider RLS** Supabase vs parcours API réel.  
3. **Compléter** parcours critique jusqu’à `completed` +1 test E2E manuel.  
4. **Juridique** : brouillon CGU / confidentialité lié depuis l’app.  
5. **Pilote** : une zone géo + objectif tables / semaine (`LAUNCH_PLAYBOOK.md`).

---

*Document pivot v1 — à garder court ; le détail vit dans les fichiers cités.*
