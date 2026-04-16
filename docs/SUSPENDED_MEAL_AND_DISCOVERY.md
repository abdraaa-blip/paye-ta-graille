# Paye ta graille — « Repas suspendu » & découverte lieux (v0)

**Spec détaillée du module** (UX, attribution, copy, risques) : **`MODULE_REPAS_SUSPENDU.md`**.

**Objectif** : introduire **l’altruisme** et l’**émerveillement** sans **stigmatiser**, sans **gamification visible** qui casse la magie, et sans transformer l’app en **ONG** du jour au lendemain.

**Rappel éthique** : cibler des receveurs par signaux type « mange peu / paraît discret » = **risque majeur** de **honte**, d’**erreur**, et de **discrimination**. La version **digne** passe par **l’opt-in**, la **loterie parmi volontaires**, ou des **partenaires** (asso / maraude) pour publics vulnérables — **pas** par un score « méritant ».

---

## 1) Nom du système (marque + clarté)

| Nom public | Usage |
|------------|--------|
| **Repas suspendu** | concept fort, ancré culturellement (café suspendu) — **à valider** (pas marque déposée ici) |
| **Offrir une table** | bouton / action simple |
| **Table offerte** | statut côté receveur |

**À éviter en tête** : « charité », « don aux pauvres », « tu mérites ».

---

## 2) Mécanique produit (V1 — **entre utilisateurs**, digne)

### Côté donneur
- Entrée : **« Offrir une table »** (hors flux principal au début : section **« + »** ou profil pour ne pas polluer le cœur).  
- Choix : **montant** (ex. 10 / 15 / 20 €) ou **formule** partenaire (plus tard).  
- Option : **message court** ou **anonyme**.  
- Paiement : **in-app** (Stripe ou équivalent) — traçabilité comptable **à valider** avec expert.

### Attribution du repas (règles **sans** stigmatisation)

**Piste A (recommandée V1)** : parmi les utilisateurs ayant activé **« Je peux recevoir une table offerte cette semaine »** (opt-in), tirage **pondéré par équité** (ex. max 1 fois / 30 jours par personne) — **pas** de label public « receveur ».

**Piste B** : **nouveaux inscrits** ayant coché **« bienvenue : j’accepte une surprise table »** (opt-in explicite).

**Piste C (à éviter en V1)** : ciblage algorithmique « paraît seul / mange peu » → **trop risqué** émotionnellement et légalement.

### Moment receveur (copy)
- « **Quelqu’un t’invite à manger.** »  
- « **Une table t’attend** » + détails lieu / créneau (comme un repas normal).

### Boucle de clôture
- Après repas : **« Remercier »** (optionnel) → message **agrégé** ou anonymisé au donneur : *« Quelqu’un t’a dit merci. »* (sans forcément révéler l’identité selon réglages).

### Fidélité donneur (discret)
- **Pas** de bannière « +50 points ».  
- Option : **reconnaissance privée** (« Merci d’avoir offert 3 tables ») ou **badge** visible seulement sur **son** profil — ou **points silencieux** utilisés pour **priorité soft** (ex. file d’attente événement) avec **transparence** si impact concret.

**Règle** : si récompense il y a, elle doit rester **digne** ou être **explicite** — le flou total + avantage réel = **malhonnête** ; le « tu ne sais pas » + avantage caché = **dark pattern**.

---

## 3) Feuille de route impact social (sans devenir une ONG)

| Phase | Périmètre |
|-------|-----------|
| **V1** | Repas suspendu **entre utilisateurs** de l’app, opt-in, traçabilité, remerciement optionnel. |
| **V2** | Partenariat **restos** (crédit table, menu solidaire encadré). |
| **V3** | **Partenaires associatifs** (maraude, asso) pour publics en grande précarité — **hors algo de “profil fragile”** ; cadre **terrain** + **personnes référentes**. |

**Pour SDF / précarité extrême** : ne **pas** “router” via une app grand public sans **cadre humain** (risque : infantilisation, erreur d’attribution, sécurité). La voie **pro** : association + resto + **vouchers** traçables.

---

## 4) Découverte restaurants — au-delà du « proche »

### Besoin utilisateur
Voir **ailleurs** que le rayon immédiat : envie de **s’évader**, fins gourmets, **spécialités**, **nouveautés**.

### Produit (évolutions)
- **Onglet / filtres** : **Près de moi** | **Plus loin** (slider km / ville) | **Carte**.  
- **Collections éditoriales** (léger au début) :  
  - **Nouveautés**  
  - **Coup de cœur clients** (agrégat consenti / partenaires)  
  - **Spécialités France** (régions / plats — contenu éditorial, pas exhaustif jour 1)  
  - **Pour fins gourmets** (tag + lieux partenaires qualité)  
- **Humour doux** en sous-collection possible (« **Amateurs de pommes** » etc.) — **sans** moquer l’utilisateur.

### Technique
- API Places + **override** éditorial (curated lists) ; cache par ville.

---

## 5) Risques & conformité (à traiter avant scale)

- **Fiscalité / reçu** du don (France) : **à valider** avec comptable / avocat selon montage (don vs achat de bon).  
- **RGPD** : données sur « vulnérabilité » **interdites** en profiling automatique.  
- **Réputation** : un incident mal géré sur « repas solidaire » **détruit** la marque — playbooks dans `CRISIS_PLAYBOOK.md`.

---

## 6) Lien avec docs existants

- Émotion / remerciement : `HUMAN_EXPERIENCE.md`  
- Pas de gamification toxique : `RETENTION_ETHICAL.md` · `METRICS_PRODUCT.md`  
- Partenaires resto : `RESTAURANT_PARTNERSHIPS.md`  
- Viralité : `VIRAL_GROWTH.md` (histoire « on m’a invité » — **consentement**)

---

## 7) Prompt maître (Cursor / produit) — **Repas suspendu + lieux**

```text
[ADN] Paye ta graille — repas réel, dignité, pas de stigmatisation.

[MISSION] Concevoir la feature « Repas suspendu / Offrir une table » (V1) + roadmap V2–V3 + extension découverte lieux (distance, collections éditoriales).

[CONTRAINTES]
- Jamais de ciblage « méritant / pauvre / mange peu » par inférence. Opt-in receveur + règles d’équité.
- Remerciement optionnel au donneur ; anonymat configurable.
- Fidélité donneur : soit totalement discrète + transparente si avantage réel, soit absente en V1.
- V3 impact social uniquement avec partenaires associatifs + vouchers, pas routing automatique vers SDF.

[SORTIE]
1) User stories + états (donneur / receveur / admin)
2) Wireframes texte (3 écrans clés)
3) Modèle de données minimal (transactions, attributions, consentements)
4) Liste risques juridiques / réputation (à valider experts)
5) Collections lieux (MVP : 3 collections + slider distance)

[ÉLÉVATION] Si tu vois un angle plus fort que « repas suspendu », propose-le avec trade-offs.
```

---

*v0 — prioriser dignity & opt-in avant toute “intelligence” de ciblage.*
