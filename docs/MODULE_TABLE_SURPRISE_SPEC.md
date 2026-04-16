# Paye ta graille — **Table surprise** (spec produit complète)

**Rôle** : psychologie comportementale + UX + système de matching.  
**Voir aussi** : `TABLE_SURPRISE_SECOND_GRAILLE.md` (slogan « seconde graille », variantes de nom).  
**Copy marketing / micro-textes** : `src/lib/marketing-copy.ts` (`MARKETING_SECOND_GRAILLE_*`, `TABLE_SURPRISE_MICRO_COPY`).

**Objectif** : spontanéité **réelle** + sentiment de **contrôle** + **sécurité** — l’utilisateur doit **vouloir vivre** l’expérience, pas la subir.

---

## 0) Idée forte, produit premium — pourquoi c’est sensible

**Ce que le module fait** : rencontrer **sans** parcourir un catalogue de profils — **surprise encadrée** (cadre d’abord, personne ensuite), **double validation**, lieu public.

**Pourquoi ça peut marcher** : moins de **choix infini**, moins de **pression** et de **jugement** sur l’avatar avant le réel ; plus de **curiosité**, **spontanéité**, légère **adrénaline sociale** positive.

**Pourquoi c’est dangereux si mal exécuté** : sentiment de **perte de contrôle**, **malaise**, **comparaison** après coup, **sécurité** mal cadrée → bad buzz. D’où traitement **premium** : règles claires, refus facile, jamais de match forcé.

**Nom public recommandé** : **Table surprise** (équilibre clarté + chaleur). **À éviter en branding principal** : *aveugle* (accessibilité / perception). Alias possibles : *Repas mystère*, *Match spontané* (dosé), *Table inconnue* — voir `TABLE_SURPRISE_SECOND_GRAILLE.md`.

**Règles d’or** : ne **jamais** forcer le match ; ne **jamais** retirer le **contrôle** ; toujours **valider** (les deux côtés) ; toujours **rassurer** et **simple**.

---

## 1) Principes comportementaux (non négociables)

| Principe | Traduction produit |
|-----------|-------------------|
| **Autonomie** | refus / annulation **toujours** accessibles en 1 geste |
| **Prévisibilité** | règles **connues avant** engagement (écran pédagogique) |
| **Sortie gracieuse** | jamais de culpabilisation sur « non » |
| **Contrôle progressif** | d’abord **cadre** (où / quand / comment) → puis **personne** |
| **Sécurité par défaut** | lieu **public** ; pas de rendez-vous hors liste app |

**Éviter** : surprise totale sans issue ; pression temps **mensongère** ; révélations humiliantes.

---

## 2) UX complète — parcours écran par écran

### TS0 — Opt-in module (réglages / 1ère activation)
- Toggle **« Activer Table surprise »** + lien **« En savoir plus »**.  
- **Off par défaut** : l’utilisateur **choisit** d’entrer dans le pool.

```
┌────────────────────────────┐
│ Table surprise             │
│ [  Activer le mode    ○ ]  │
│ Sans choisir le profil…   │  2 lignes
│ [ En savoir plus ]         │
└────────────────────────────┘
```

### TS1 — Pédagogie (1ère fois **ou** si règles changent)
- 4 bullets + CTA **« J’ai compris »** (pas de skip sans scroll minimal optionnel).

### TS2 — Paramètres du cadre (avant matching)
- Rayon · créneau · intention repas (héritée ou choisie ici) · intention sociale.  
- **CTA** : **« Chercher une table »** (pas « lancer » agressif).

### TS3 — Recherche (feedback)
- Skeleton 3–6 s max ; copy **« On cherche une table dans ton cadre… »** ; bouton **« Annuler »** visible.

### TS4 — Proposition « cadre + partenaire mystère »
- Affiche : **prénom** ou « **Convive** » + **distance** + **créneau** + **intentions** (icônes) + **2–3 lieux** (noms, distance, fourchette prix).  
- **Pas** : photo HD, bio longue, Instagram.

```
┌────────────────────────────┐
│ Une table te correspond    │
│ Ce soir · ~3 km            │
│ On partage · Ouvert        │
│                            │
│ Lieux possibles :          │
│ ○ Resto A   ○ Resto B …    │
│                            │
│ [ OK pour ce cadre ]       │  PRIMARY
│ [ Pas pour moi ]           │  SECONDARY
└────────────────────────────┘
```

### TS5 — Attente binôme (miroir côté B)
- Même proposition ; si **les deux** OK cadre → **TS6**.

### TS6 — Révélation profil (post double accord cadre)
- Photo + tags + **CTA** : **« Je confirme la table »** ou **« Stop, je me retire »** (les deux doivent confirmer **ou** règle : confirmation unique après reveal — **choisir un modèle**).

**Recommandation V1** : après double **OK cadre**, **révélation** puis **un seul** bouton **« Confirmer la table »** chacun (évite 4 étapes) ; si l’un retire après reveal → **annulation douce** sans punir l’autre.

### TS7 — Flux repas standard
- Aligné `PRODUCT_SPEC.md` : lieu final, **J’y vais**, chat conditionnel, jour J, post-repas.

### Déclinaisons (phasage produit)

| Variante | Description |
|----------|-------------|
| **Table surprise solo** | 1 à 1 — parcours par défaut ci-dessus. |
| **Table surprise groupe** | Plusieurs places, mêmes garde-fous — **post-MVP**. |
| **Table surprise thème** | Filtre envie (burger, italien…) avant tirage — **V1.5+**. |

### Intrusivité
- **Pas** de push « Table surprise dispo ! » en boucle — max **1** suggestion / semaine si opt-in (réglable).

---

## 3) Logique de matching (déterministe + hasard **encadré**)

### 3.1 Pool A (demandeurs actifs)
Utilisateurs ayant :
- **Opt-in** Table surprise **ON**  
- complété **profil minimum** + **téléphone vérifié** (seuil sécurité)  
- **pas** de suspension / signalement grave ouvert  
- **cooldown** respecté (ex. pas plus d’1 active / 12 h — paramètre)

### 3.2 Pool B (compatibles avec A)
Même critères + **compatibilité** :

**Filtres durs**  
- **Rayon** mutuel (A dans rayon de B et B dans rayon de A)  
- **Chevauchement créneau** ≥ X minutes  
- **Intentions sociales** compatibles (ex. ami avec dating léger = règle produit explicite)  
- **Intentions repas** : matrice §3.3  
- **Contraintes alimentaires** : non-violation déclarative (ex. halal / végan)

### 3.3 Matrice **intention repas** (exemple — à valider produit)

| A \ B | J’invite | On partage | Je me fais inviter |
|--------|----------|------------|---------------------|
| **J’invite** | ✓ (chacun invite ? rare — **exclure** ou traiter comme “chacun paye moitié invite” — **plus simple : exclure**) | ✓ | ✓ |
| **On partage** | ✓ | ✓ | ✓ |
| **Je me fais inviter** | ✓ | ✓ | **✗** (deux invités — pas de payeur) |

*Implémentation simple V1* : **exclure** paires impossibles ; si J’invite × J’invite → **ne pas matcher** (ou produit : « un seul invite » — complexe → **exclure**).

### 3.4 Sélection parmi compatibles
1. Trier par **distance** croissante.  
2. Garder le **top K** (ex. 20) pour diversité.  
3. **Tirage pseudo-aléatoire** seedé par **fenêtre horaire** + `user_id` (reproductible debug, pas manipulable utilisateur).  
4. **Exclusions** : bloqués mutuels, déjà refusés récemment (liste courte).

**“Intelligent”** = contraintes + **équité** + **sécurité**, pas psychologie de la personne.

---

## 4) Sécurité (check-list)

### Avant proposition
- Vérif **téléphone** ; **âge** si requis juridiquement ; **signalement** / ban.  
- **Géo** cohérente (anti-spoof soft : vitesse impossible entre 2 checks).

### Pendant
- **Lieux** uniquement depuis **liste** (Places + partenaires) — pas champ libre « chez moi ».  
- **Bouton signalement** dès TS4.

### Après
- Si incident : **priorité modération** ; **désactivation** module utilisateur possible.

### Transparence
- Page **« Sécurité Table surprise »** : règles en 6 puces.

---

## 5) Messages utilisateurs (copy complète — FR)

### Micro-accroches (campagne & écran d’intro)

- **Phrase clé (produit global)** : *« Tu peux choisir… ou laisser la table te choisir. »* — `MARKETING_KEY_CHOICE_OR_SURPRISE`  
- *Et si tu laissais le hasard choisir ?*  
- *Une table. Un inconnu. Un moment.*  
- *Pas de profil complet. Juste un repas.* *(ou : « Pas de scroll infini. Juste une table. »)*  
- *Tu manges. Tu découvres.*

### Table principale

| Contexte | Texte |
|----------|--------|
| Entrée module | **Table surprise** · *Tu choisis le cadre. La personne arrive après.* · *(voir aussi phrase clé globale : choisir / laisser la table choisir)* |
| Recherche | *On cherche une table dans ton cadre…* |
| Proposition | **Une table te correspond** · *Ce soir · ~3 km* |
| OK cadre | **OK pour ce cadre** |
| Refus cadre | **Pas pour moi** · *Pas de souci. Tu peux relancer quand tu veux.* |
| Attente autre | *En attente de l’autre convive…* |
| Révélation | **Voici ton convive** · *Tu confirmes la table ?* |
| Confirmer | **Je confirme la table** |
| Retrait après reveal | **Je me retire** · *La table est annulée sans faute.* (si politique zéro blâme) |
| Expiration | *La proposition a expiré. On peut en refaire une autre.* |
| Succès | *C’est bon — à tout à l’heure à table.* |

**Interdits** : « Tu as raté ta chance » ; « L’autre t’a rejeté » (préférer neutre).

---

## 6) Refus — typologie & UX

| Type | Qui | Effet |
|------|-----|--------|
| **R1** Refus cadre (TS4) | soit user | **Aucune** pénalité ; retour TS2 ou file d’attente |
| **R2** Refus après attente binôme | un seul non | l’autre reçoit *« La table n’aura pas lieu cette fois. »* — **sans** nom |
| **R3** Retrait après révélation | un user | annulation ; **notif** neutre à l’autre |
| **R4** Refus lieu (si étape vote) | | nouveau choix lieux max **1** rotation |

**Anti-abus** : si **> N** refus cadre / semaine → **cooldown** 24h **avec** message factuel (*« Pour limiter les abus, reviens demain. »*) — pas moral.

---

## 7) Annulations (timing & politique)

| Moment | Politique recommandée V1 |
|--------|---------------------------|
| Avant double OK cadre | libre, sans trace négative |
| Après OK cadre, avant confirm reveal | libre avec **notif** neutre |
| Après **confirm** finale | fenêtre **>24h** : annulation “soft” ; **<24h** : **avertissement** + compteur interne (pas public) |
| No-show | même politique que repas standard (voir `PRODUCT_SPEC` / `METRICS_PRODUCT`) |

**Les deux** peuvent annuler si **mutuel** accepté dans l’UI (option V1.5).

---

## 8) Machine d’états (proposition)

`idle` → `framing_set` (paramètres) → `searching` → `proposal_sent` → `frame_accepted_A` / `frame_accepted_B` → `both_frames_ok` → `revealed` → `both_confirmed` → **merge** vers flux repas `venue_*` / `confirmed` / `completed`  
Branches : `cancelled_by_user` · `expired` · `reported_hold`

*(Nommer les états comme le code — à mapper avec table `meals` + `type=surprise`.)*

---

## 9) Cas limites (produit)

- **Aucun match** : message *« Personne dans ton cadre pour l’instant. Élargis le rayon ou le créneau ? »*  
- **Match asymétrique intentions** : résolu par matrice.  
- **Lieux indisponibles** : reroll lieux automatique **1** fois.  
- **Utilisateur en repas classique en parallèle** : **bloquer** 2 tables même créneau (règle simple).

---

## 10) Métriques

- **Taux** `searching` → `both_frames_ok`  
- **Taux** `both_confirmed` → `completed`  
- **Temps médian** par étape  
- **Refus** par étape (diagnostic friction)  
- **Signalements** / table surprise vs repas normal (surveillance qualité)

---

## 11) Prompt maître (implémentation)

```text
[MODULE] Table surprise — Paye ta graille.

[CONTRAINTES] Opt-in module ; cadre avant personne ; double validation ; reveal puis confirmation ; lieux liste 2–3 ; pas d’inférence sensible ; copy non culpabilisante ; anti-abus cooldown factuel.

[LIVRABLES] (1) Diagramme états (2) Matrice intentions validée (3) API events (4) Wireframes TS0–TS7 (5) Suite tests E2E refus/expiration (6) Feature flag

[ÉLÉVATION] 3 idées qui augmentent confiance sans tuer spontanéité ; 3 risques résiduels.
```

---

## 12) Prompt « coalition » — Table surprise (à coller dans Cursor)

```text
Tu es expert en psychologie comportementale, UX design et systèmes de matching.

Mission : concevoir un module "Table surprise" pour l'application "Paye ta graille".

Objectif : permettre à deux utilisateurs de se rencontrer sans se connaître à l'avance, de manière spontanée, sécurisée et fluide.

Contraintes :
- expérience simple et rassurante
- jamais intrusive
- toujours contrôlable par l'utilisateur
- éviter toute situation inconfortable

Fonctionnement attendu :
- bouton "Table surprise"
- matching automatique intelligent (contraintes + équité, pas psychologie intrusive)
- sélection du lieu et du moment
- validation obligatoire par les deux parties

Tu dois définir : UX complète, logique de matching, sécurité, messages utilisateurs, gestion des refus et annulations.

Objectif final : une expérience spontanée qui donne envie d'être vécue.

Contexte source de vérité : docs/MODULE_TABLE_SURPRISE_SPEC.md — ne pas contredire opt-in, cadre avant personne, double validation, lieux publics listés.
```

---

*v1 — valider matrice invite×invite avec décision produit explicite.*
