# Paye ta graille — Métriques produit (KPI, conversion, rétention)

**Objectif** : savoir si le produit **fonctionne vraiment** (IRL + répétition), pas seulement s’il **s’inscrit**.  
**Principe** : la métrique star n’est pas le **temps d’écran**, c’est le **repas complété** et sa **récurrence**.

---

## 1) North Star (recommandée)

**Tables complétées par semaine et par ville active** (ou “repas duo/groupes passés à `completed`”).

*Pourquoi* : aligne **valeur utilisateur** (ils ont mangé ensemble), **liquidité**, et **santé** (show-up inclus dans le cycle).

**Alternative** si multi-format : **“Repas IRL complétés / semaine / km²”** en zone pilote.

---

## 2) KPI principaux (tableau de bord fondateur)

| KPI | Définition | Bon signe (indicatif pilote) |
|-----|------------|------------------------------|
| **Activation** | % inscrits ayant **complété ≥1 repas** dans les 14 jours | ↑ (objectif à fixer par ville, ex. 15–35% si concierge) |
| **Taux show-up** | repas `confirmed` → présence réelle (marquée **completed** sans annulation dernière minute) | **> 70%** ; viser 80%+ |
| **Délai médian 1er repas** | inscription → 1er `completed` | **↓** (ex. <7 jours) |
| **Repas complétés / WAU** | WAU = actif sur app **ou** repas en cours | **↑** |
| **2e repas dans 28j** | parmi ceux avec 1 repas, % avec 2e `completed` sous 28j | **↑** (signal produit / confiance) |
| **Signalements / repas complété** | | **↓** ; spike = alerte crise |
| **No-show** | annulations **<24h** / repas confirmés | **↓** |
| **Temps jusqu’au match** | `proposed` → `matched` (médiane) | stable ou **↓** |

**À ne pas mettre en #1** : DAU brut, nombre de swipes, volume de messages (indicateurs secondaires / qualité UX seulement).

---

## 3) Entonnoir & taux de conversion (définitions précises)

### Funnel activation (exemple duo)

1. **Inscription complète** (profil + intention repas minimum)  
2. **1ère action valeur** : “explorer” **ou** “proposer” **ou** “publier annonce” (V1.5)  
3. **Demande envoyée** (`meal` créé en `proposed`)  
4. **Match** (`matched`)  
5. **Lieu validé** (`venue_confirmed`)  
6. **Double confirmation** (`confirmed`)  
7. **Repas complété** (`completed`)

**Conversions utiles** :

| Ratio | Formule | Usage |
|-------|-----------|--------|
| **C1** | inscrits complets → **≥1 demande envoyée** | activation “curiosité” |
| **C2** | demandes → **matched** | qualité matching / liquidité |
| **C3** | matched → **confirmed** | friction lieu + désistements |
| **C4** | confirmed → **completed** | **show-up** + expérience réelle |
| **C5** | inscrits complets → **completed** (14j) | **activation réelle** |

*Segmenter* par : ville, intention repas (invite/partage/invité), intention sociale.

---

## 4) Rétention (cohortes)

### Définition “utilisateur actif” (choisir **une** primaire)

- **A** : au moins **1 session** / semaine *(classique mais faible pour IRL)*  
- **B** (recommandé) : **intent repas** dans les 7j (ouverture app **ou** notif action) **ou** repas en état actif  
- **C** : **≥1 repas completed** sur les 28 derniers jours *(très strict, baisse volume)*

**Cohortes** : par **semaine d’inscription**, mesurer **R7, R14, R28** sur définition B ou C.

**Signaux sains** :
- R28 **plus haut** chez ceux qui ont **completed** un 1er repas vs ceux qui n’ont pas completed.  
- Si R28 élevé sans `completed` → possible **scroll addictif** (revoir `RETENTION_ETHICAL.md`).

---

## 5) Fréquence des repas (cœur “ça marche”)

| Métrique | Définition | Interprétation |
|----------|------------|------------------|
| **Repas / utilisateur / mois** | `completed` / user / mois (actifs) | ↑ = habitude |
| **Jours entre repas** (médiane) | entre deux `completed` pour un même user | ↓ = rythme |
| **Répétition avec même contact** | % 2e repas avec **au moins 1** contact déjà vu | lien social réel |
| **Taux “prochaine table”** | clic post-repas “revoir” → **2e repas booked** | efficacité boucle |

---

## 6) Qualité & confiance (garde-fous)

- **Taux de ban / suspension** / WAU (interne)  
- **Temps 1ère réponse modération** (médiane)  
- **NPS** ou **CSAT** post-repas (léger, optionnel) — **échantillon**, pas harcèlement

---

## 7) Événements analytics (noms suggérés — à implémenter côté produit)

`signup_completed` · `onboarding_completed` · `discover_view` · `meal_proposed` · `meal_matched` · `venue_chosen` · `meal_confirmed` · `meal_completed` · `meal_cancelled` (props: `timing`, `reason_bucket`) · `report_submitted` · `feed_post_created` (V1.5)

**Règles** : pas de PII dans les props ; IDs internes seulement.

---

## 8) Tableaux “est-ce que ça marche ?” (décision)

| Si… | Alors… |
|-----|---------|
| C4 bas, C3 OK | problème **jour J** / reminders / peur IRL |
| C2 bas | **liquidité** / matching trop strict / rayon |
| C5 bas, C1 OK | **friction** post-match (lieu, chat, peur) |
| R28 haut sans completed | risque **engagement écran** — recentrer produit |
| Signalements ↑ | **Trust** prioritaire sur growth |

---

## 9) Documents liés

- `RETENTION_ETHICAL.md` — ce qu’il ne faut pas optimiser  
- `SCALE_ARCHITECTURE.md` — early warnings  
- `LAUNCH_PLAYBOOK.md` — KPI pilote terrain

---

*v1 — fixer des **cibles chiffrées** après 4–8 semaines de données réelles par ville.*
