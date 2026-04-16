# Alignement — identité Paye ta graille (verrouillée) & packs Cursor → repo

**Cadre complet (10 prompts)** : **`SYSTEME_COMPLET_PAYE_TA_GRAILLE.md`** — ADN, psychologie, onboarding, matching, groupe, feed, UX, business, légal, MVP tech.  
**Prompts externes longs (« master » Cursor, coalitions, etc.)** : les intégrer comme **matière première** ; la **checklist d’alignement** et la **source de vérité** sont en fin de `SYSTEME_COMPLET_PAYE_TA_GRAILLE.md` (*Alignement prompt maître*). En cas de conflit : ADN Paye ta graille + garde-fous du présent fichier.

**Marketing & contournement du « dating »** (angle « pas une app de rencontre, une table ») : `docs/MARKETING_POSITIONING.md` + slogans / axes centralisés dans `src/lib/marketing-copy.ts` (landing, meta, campagnes).

**Stratégie « niveau investisseur / growth / ops »** : prompts prêts à coller (lancement, viralité, pitch, engagement sain, restos, scale, crise, personas, UI, métriques, branding, émotion, **générosité / repas suspendu**) + liens vers les docs du repo → **`PROMPTS_AVANCES_STRATEGIE_COMPLETE.md`**. Module altruisme : **`MODULE_REPAS_SUSPENDU.md`**. Table surprise & seconde graille : **`MODULE_TABLE_SURPRISE_SPEC.md`**, **`TABLE_SURPRISE_SECOND_GRAILLE.md`**.

**Objectif** : réutiliser des idées de cadrage **sans** diluer l’ADN. Référence **`VISION_PRODUIT_OFFICIEL.md`**, **`BLUEPRINT_PRODUIT_FINAL_MVP.md`**, **`COPY_UX_COMPLET_V1.md`**, avec **surfaces utilisateur** alignées sur l’identité ci-dessous.

**Identité finale (verrouillée)** :
- **Nom** : **Paye ta graille** — immédiat, familier, bouche-à-oreille ; design pro pour équilibrer le ton « street / fun ».
- **ADN** : app **sociale** où des inconnus partagent un **repas** ; système simple : **inviter · partager (50/50) · se laisser inviter**.
- **Promesse** : **« Tu manges, tu rencontres, tu partages. »** ; formulation plus forte : **« Ne mange plus seul. »**
- **Positionnement** : **expériences sociales autour du repas réel** (individuel · groupe · événements organisés) — pas une app de dating, pas une marketplace d’événements générique, pas une appli résa seule.
- **Vision** : **réseau social IRL du repas** — une habitude, pas « encore une app ».
- **UX** : décision en **moins de 10 secondes** ; pas de complexité excessive (faim, solitude, curiosité sociale).
- **Repo / npm** : `paye-ta-graille` ; surfaces utilisateur = **Paye ta graille**.

---

## Écosystème — repas vivants (vision nettoyée)

**Ce que le produit devient** : pas « une app » au sens gadget — une **mécanique sociale réelle** et un **réseau IRL du repas**, articulé en **trois mondes** sur une seule plateforme (ne pas tout afficher au même endroit : risque de diffusion).

### Les 3 mondes

| Monde | Logique | Exemples | Statut code (indicatif) |
|-------|---------|----------|-------------------------|
| **Repas privés** | Intime, direct, intentions claires | 1 à 1 ou petit groupe ; j’invite · 50/50 · je me laisse inviter | **MVP** — profil, discover, repas duo |
| **Repas ouverts** | Spontanéité, mini-communauté, effet réseau | « Qui est chaud maintenant ? », raclette vendredi, resto à tester | **Phase suivante** — fil / posts (pas de faux feed) |
| **Expériences alimentaires** | Organisé, « je rejoins » | Immersif, nature, monde, social food, participatif — voir **`/experiences`** | **Doc + page hub** ; résa / tickets / partenaires = phase suivante |

### Cœur du système (non négociable)

- Ce n’est **pas du dating**. Le pivot conceptuel : **l’intention de manger** (état social + déclencheur), pas la séduction comme moteur.
- **Pilier 1 — Intention** : j’invite / on partage / je me laisse inviter (déjà en base).
- **Pilier 2 — Déclencheur** (à intégrer progressivement) : *maintenant* / *plus tard* / *rejoindre un groupe* — crée des opportunités **réelles**, pas un swipe vide.
- **Pilier 3 — Match / groupe** : **individuel** (1 à 1) **et** **collectif** (table ouverte, événement nourriture).
- **Pilier 4 — Lieux** : restos proches, expériences, événements créés par les utilisateurs (carte simple = post-MVP dense).

### Ce qui peut tuer le produit (garde-fous)

Mélanger dans un seul écran ou une seule logique sans hiérarchie : **dating**, **forum**, **events génériques**, **booking resto seul**, **paiement in-app**, **gamification** → perte de l’utilisateur. Règle : **une promesse par écran**, décision en **moins de 10 secondes**.

### MVP écran par écran (cible vs repo)

| Écran | Rôle | Repo |
|-------|------|------|
| 1 Ton intention | invite / partage / laisse inviter | `/onboarding`, `/profil` |
| 2 Qui mange ? | **Repas privé** vs **repas ouvert** | **`/accueil`** (choix explicite) |
| 3 Feed repas ouverts | Qui mange où, quand, envie du moment | **`/repas-ouverts`** (placeholder honnête jusqu’au back) |
| 3b Expériences organisées | Catégories, vision, rejoindre (futur) | **`/experiences`** (hub — pas de billetterie V1) |
| 4 Lieux | Carte / restos / atypiques | **`/lieux`** + aujourd’hui choix lieu dans le détail repas + `GET /api/places/search` |
| 5 Match / join | Accepter, refuser, groupe qui se forme | `/repas/[id]`, flux invitation |
| 6 Réseau graille | Contacts table, repas croisé, graphe light | **`/reseau-graille`** ; persistance **à faire** |

### Direction future (si traction)

Restaurants partenaires, événements sponsorisés, expériences urbaines, **communauté locale** — sans casser la confiance ni la lisibilité du cœur « intention de manger ».

### Social Food Graph — réseau graille

**Trois couches** : **rencontre** (table) → **lien** (contact graille optionnel, sans pression) → **réseau indirect** (**repas croisé** : une personne invite deux contacts qui ne se connaissent pas). Noms : *réseau graille*, *cercles de table*, *Social Food Graph*. **Privacy** : pas d’exposition du graphe complet entre inconnus — seulement le contexte du repas.

**Lien par fréquence** : le lien **grandit** avec le nombre de **repas réels complétés** ensemble (mémoire sociale IRL, pas le chat). Indicateur **privé** : *Lien de table* / *Barre de graille*, sommet **Compagnon de graille**. **Interdit** : score public, compétition, gamification toxique, culpabilité. Nudges **doux** et **réglables**. Voir `SYSTEME_COMPLET_PAYE_TA_GRAILLE.md` (sous-section mémoire de table).

**État** : **`/reseau-graille`** + teaser sur repas `completed` ; `graille_contacts`, compteur repas par paire, barre UX = **à faire**.

### Coordination « qui ramène quoi » (repas groupe uniquement)

- **Ce n’est pas** un gadget : c’est un **mécanisme de coordination sociale** (rôles clairs, moins de malaise « qui fait quoi »).
- **Où** : **uniquement** si `meals.format = 'group'` — **pas** sur les repas `duo` simples (évite la friction partout).
- **MVP** : quatre rôles — entrée, plat, dessert, boissons — + **« je ne ramène rien »** ; bouton **suggestion équilibrée** (pas de menus infinis, pas de gamification).
- **Futur** (hors MVP) : suggestion par profil, budget, liste de courses — **pas maintenant**.

---

## Prompt 0 — Vision psychologique

| Thème externe | Position Paye ta graille | Référence doc |
|---------------|---------------------------|----------------|
| Motivations / freins / confiance | Table d’abord, intentions visibles, pic émotionnel hors app | `HUMAN_EXPERIENCE.md`, `VISION_PRODUIT_OFFICIEL.md` |
| Anti-manipulation | Pas de culpabilité, nudges réglables, pas de score public cruel | `RETENTION_ETHICAL.md`, `SYSTEME_ENGAGEMENT_NATUREL.md` |

**Implémentation** : copy repas + onboarding + profil ; pas de « scoring caché » en V1.

---

## Prompt 1 — Légal & éthique

| Thème externe | Position Paye ta graille | Référence doc |
|---------------|---------------------------|----------------|
| Paiement entre inconnus | **Hors MVP code** ; intentions repas = cadre social, pas wallet | `BLUEPRINT`, `LEGAL_STRUCTURE_OFFICIEL.md` |
| RGPD / responsabilité | Inventaire + plans ; rédaction avocat avant pub ouverte | idem |

**Implémentation** : pages légales + signalement ; pas de Stripe en V1.

---

## Prompt 2 — Architecture produit

| Module externe | Équivalent repo | Statut (indicatif) |
|-----------------|-----------------|-------------------|
| Front Next.js | `src/app/*` | En cours |
| Back API routes | `src/app/api/*` | En cours |
| Données Supabase | `supabase/migrations/*` | MVP |
| Matching | Intentions + ville (+ filtres client liste) | Partiel vs blueprint géo |
| Paiement | **Non** V1 | Conforme gel |
| Scoring comportemental | **Non** V1 (éthique) | Refus explicite gamification toxique |
| Lieu / géo | Places server + saisie manuelle | Fait |
| Repas ouverts (fil) | Modèle + API + modération | **À faire** — page `/repas-ouverts` = placeholder |
| Expériences (événements) | `experiences` table + join + partenaires | **À faire** — hub `/experiences` seulement |
| Contacts graille + repas croisé | `graille_contacts`, flux invitation3 pers. | **À faire** — hub `/reseau-graille` + teaser UI |
| Déclencheurs (maintenant / plus tard / groupe) | Profil ou repas | **À cadrer** — éviter surcharge |
| Expériences (pilier 3) | Hors MVP code | Doc / phase ultérieure |
| Potluck / rôles (groupe) | `meals.format` + `meals.potluck` + `MealPotluckPanel` | **MVP** — après match, 2 pers. ; plus de participants = phase suivante |
| Identité forte | Email magic link ; KYC fort = post-traction | Blueprint |

---

## Prompt 3 — UX émotionnelle

| Thème | Source canon |
|-------|--------------|
| Parcours, écrans, ton | `COPY_UX_COMPLET_V1.md`, `UI_SCREENS.md`, `UX_COPY_SYSTEM.md` |
| DA | `IDENTITE_VISUELLE_COMPLETE.md`, `globals.css` |
| Son adaptatif | Phase 2 (`DESIGN_SYSTEM.md`) |

---

## Prompt 4 — Modèle économique

| Levier externe | Position |
|----------------|----------|
| Commission / abo / resto | Post traction (`PRODUCT_SPEC.md`) |
| Crédits sociaux visibles | **Risque** transaction humain ; si jamais : privé, non monétisable |

---

## Prompt 5 — Matching « type Tinder »

**À refuser en l’état** : score opaque, red flags bloquants non expliqués.

**À adopter** : matching **transparent** = ville + intentions sociale/repas + tags ; signalement + modération ; géo fine = phase 2 (`SCALE_ARCHITECTURE.md`).

---

## Prompt 6 — Restaurants

| Exigence externe | Repo |
|------------------|------|
| API géo | `GET /api/places/search` |
| Sélection | `MealDetailClient` + `POST /api/meals/[id]/venue` |
| Carte / dispo / filtres prix | **V1.5+** (complexité) |

---

## Prompt 7 — Sécurité & anti-abus

| Sujet | Repo / doc |
|-------|------------|
| RLS, auth | Supabase + `SECURITE_CHECKLIST_CODE.md` |
| Signalements | `/signaler`, `POST /api/report` |
| Réputation | Pas de leaderboard ; jauge privée = V2 doc |
| KYC fort | Avec monétisation / risque |

---

## Prompt 8 — MVP Cursor / Vercel

Checklist alignée **Paye ta graille** (repo `paye-ta-graille`) :

- [x] Next.js App Router, TS, mobile-first  
- [x] Auth Supabase, profil, discover, repas + états, lieu Places, chat borné  
- [x] Intentions repas (= « qui paie quoi » **social**, pas simulation bancaire)  
- [x] Entrée **privé / ouvert / expériences** + **repas ouverts** (stub), **lieux**, **`/experiences`**, **`/reseau-graille`** (hub graphe social food)  
- [x] **Potluck** (`format=group`) : migration + API + panneau détail repas (MVP 2 pers.)  
- [ ] Fil repas ouverts (données + modération), déclencheurs, expériences atypiques  
- [ ] Emails (Resend), métriques funnel, post-repas micro-UX, tests E2E/RLS systématiques  
- [ ] CGU / confidentialité rédigées (juridique)

**Prompt unique Cursor** : reprendre le paragraphe synthétique déjà proposé en conversation (gel V1, pas de wallet, pas de score caché, table d’abord) et pointer vers ce fichier + le blueprint.

---

*v1 — à mettre à jour si de nouveaux prompts externes entrent dans le workflow.*
