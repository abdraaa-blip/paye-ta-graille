# Paye ta graille — Rapport d’audit dossier (niveau « investisseurs + build »)

**Date** : 2026-04-13 · **Périmètre** : vision, UX, design, logique sociale, business, sécurité, scalabilité, **alignement doc ↔ code**.  
**Règle** : *« Est-ce que cela rend le produit plus solide, plus clair et plus viable ? »*

**Documents officiels demandés (mission)** : **déjà présents** dans ce dépôt — pas de duplication ; ce rapport **cartographie**, **diagnostique** et **priorise**. Le recyclage intégral des idées et phrases vit dans **`ANNEXE_CORPUS_RECYCLAGE_COMPLET.md`** + docs sources listées dans **`DOSSIER_OFFICIEL_INDEX.md`**.

---

## 1. Synthèse exécutive

| Verdict | Détail |
|---------|--------|
| **Vision / différenciation** | **Solide** : table IRL, intentions, anti-dating-first, North Star hors écran — `VISION_PRODUIT_OFFICIEL.md`, `MARKETING_OFFICIEL.md`. |
| **Dossier investisseur** | **Présentable** avec **réserves** : juridique et deck externe à compléter ; preuve traction à construire. |
| **MVP technique** | **Testable** (bêta fermée) : Next.js + Supabase + parcours duo + discover + signalement — voir `AUDIT_MVP_VALIDATION_2026-04-13.md`. |
| **Risque principal** | **Liquidité locale** + **confiance** (RLS validée, modération, CGU avocat) avant ouverture large. |

---

## 2. Analyse par dimension

### 2.1 Vision produit

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| Mission claire | OK | `VISION_PRODUIT_OFFICIEL.md` §1–2 |
| Philosophie non négociable | OK | idem §4 |
| Phasage long terme | OK | idem §3 + `PRODUCT_SPEC.md` |
| Cohérence « repas d’abord » vs lien profond | OK (marketing cadre le ressenti) | `MARKETING_OFFICIEL.md` + `UX_HOME.whisper` (`ux-copy.ts`) |

### 2.2 UX / produit

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| Parcours V1 | OK sur papier | `UX_PRODUIT_OFFICIEL.md`, `UI_SCREENS.md`, `COPY_UX_COMPLET_V1.md` |
| Implémentation | **Partielle** (MVP duo prioritaire) | `src/app/*`, `BLUEPRINT_PRODUIT_FINAL_MVP.md` |
| Modules avancés | **Spécifiés, non cœur V1** | repas ouvert, expériences, table surprise, suspendu — `DOSSIER_OFFICIEL_INDEX.md` §4 |
| Friction résiduelle | **Acceptable** si ville + migrations | gate post-login, `INTEGRATION_PRODUIT_SYNTHESE.md` |

### 2.3 Design & DA

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| Direction | OK | `BRAND_OFFICIEL.md`, `DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` |
| Tokens / composants | OK (doc) ; **valider** sur build réel | `DESIGN_SYSTEM.md`, `globals.css` |
| Cohérence colorimétrique | **À QA** sur devices | audit contraste en prod |

### 2.4 Logique sociale

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| Double opt-in repas | OK | `MATRICE_REPAS_ETATS_PERMISSIONS.md` + trigger SQL |
| Chat borné | OK (matrice A) | API messages + RLS |
| Anti-DM froid | OK | discover → proposition |
| Graphe / jauge | **V2** | `UX_SECTION_AMIS_MES_TABLES.md` |

### 2.5 Business & croissance

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| Modèle V1 | Liquidité d’abord, pas revenu obligatoire | `LIVRABLE_MVP_REFERENCE_LANCEMENT.md`, `PRODUCT_SPEC.md` §11 |
| Viralité | **Éthique** documentée | `SYSTEME_ENGAGEMENT_NATUREL.md`, `VIRAL_GROWTH.md` |
| Métriques | **À instrumenter** | `METRICS_PRODUCT.md` |

### 2.6 Sécurité

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| App (routes, auth, redirect) | Bonne base | `AUDIT_TECHNIQUE_CODEBASE.md`, `SECURITE_CHECKLIST_CODE.md` |
| RLS | **À valider scénarios** | `RLS_SCENARIOS_CHECKLIST.md` |
| Rate limiting | V1 mémoire ; **Upstash** si scale | `src/lib/api/rate-limit.ts` |
| Bêta SEO | OK si flag | `NEXT_PUBLIC_PTG_PUBLIC_BETA` + `layout` metadata |

### 2.7 Scalabilité

| Critère | Évaluation | Référence |
|---------|------------|-----------|
| Schéma V1 | Suffisant pilote | migrations `supabase/migrations/` |
| Post-traction | Documenté | `SCALE_ARCHITECTURE.md` |

---

## 3. Diagnostic

### Points forts

- ADN **clair et rare** : repas réel, intentions, pas usine à swipe.  
- **Corpus** riche et **recyclable** sans perte (`ANNEXE_CORPUS_RECYCLAGE_COMPLET.md`).  
- **Décisions tracées** (`DECISIONS_PRODUIT_LOG.md`).  
- **Code** aligné machine d’états + matrice chat.

### Faiblesses

- **Emails transactionnels** et **admin signalements** absents du code.  
- **Discover** : filtre géo = ville texte (OK pilote, limite scale).  
- **Onboarding** long (fatigue possible — tests utilisateurs).  

### Risques

- **Ouverture publique** sans CGU avocat + RLS battle-testée.  
- **Attente** « repas ouverts / expériences » vs livrable duo → gérer la **communication** (pages « en construction » = bon reflex).  

### Zones floues

- Règle finale **`completed`** (double confirmation vs auto 24h) — `DECISIONS_PRODUIT_LOG.md`.  
- **Premium** : volontairement **plus tard** — ne pas diluer avant preuve duo.

---

## 4. Optimisation (sans superflu)

| Action | Effet |
|--------|--------|
| Garder **un** blueprint gelé + **un** index officiel | Réduit dispersion cognitive. |
| Phaser modules sensibles | Table surprise, suspendu, N-groupe **hors** exécution V1 large. |
| Renforcer **preuve** (tables `completed`, NPS post-repas) | Crédibilité investisseur + produit. |

---

## 5. Restructuration — « version optimisée » du projet

**Pyramide de vérité** (ordre de lecture / build) :

```
                    VISION_PRODUIT_OFFICIEL
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
MARKETING_OFFICIEL   UX_PRODUIT_OFFICIEL   BRAND_OFFICIEL
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              BLUEPRINT_PRODUIT_FINAL_MVP
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       PRODUCT_SPEC + MATRICE      LIVRABLE_MVP_REFERENCE
              │                           │
              ▼                           ▼
         Code (src/)              Ops (Vercel, RLS, juridique)
```

**MVP réaliste (déjà orienté build)** : `BLUEPRINT_PRODUIT_FINAL_MVP.md` §2 + `LIVRABLE_MVP_REFERENCE_LANCEMENT.md` + état code `AUDIT_MVP_VALIDATION_2026-04-13.md`.

---

## 6. Documents officiels — état de livraison

| Document demandé | Fichier existant | Complément |
|------------------|------------------|--------------|
| Vision | `VISION_PRODUIT_OFFICIEL.md` | Maintenir avec `DECISIONS_PRODUIT_LOG.md` |
| UX / produit | `UX_PRODUIT_OFFICIEL.md` | + `UI_SCREENS`, `COPY_UX_COMPLET_V1`, `ux-copy.ts` implémenté |
| Marketing | `MARKETING_OFFICIEL.md` | **Tous** slogans / axes — ne pas éparpiller ailleurs |
| Légal (structure) | `LEGAL_STRUCTURE_OFFICIEL.md` | + pages app `/legal/*` **brouillon** — **avocat** avant scale |
| Brand | `BRAND_OFFICIEL.md` | + `IDENTITE_VISUELLE_COMPLETE`, `DESIGN_SYSTEM` |

**Rien n’est perdu** : idées non retenues en **produit shipped** restent dans **ANNEXE** + specs modules §4 index.

---

## 7. Recommandations prioritaires

| Priorité | Action | Owner typique |
|----------|--------|---------------|
| **P0** | CGU + confidentialité **avocat** ; RLS **checklist** réelle | Juridique + tech |
| **P0** | SMTP / rappels repas **ou** honnêteté « pas encore » en comm | Produit |
| **P1** | Admin signalements **minimal** ou procédure SQL + rôle | Ops |
| **P1** | E2E parcours critique sur URL préprod | QA |
| **P2** | Deck pitch **hors** ou **dans** repo + funnel instrumenté | Fondateurs |

---

## 8. Conclusion

Le projet est **déjà** une **version structurée** crédible : officiels + annexes + blueprint + code. Ce rapport **ne remplace pas** les documents existants ; il **certifie** l’architecture documentaire, **localise** les écarts code/doc, et **ordonne** les prochaines mises en risque zéro pour une **levée de fonds ou une bêta sérieuse**.

*À archiver avec les comités investisseurs / advisory.*
