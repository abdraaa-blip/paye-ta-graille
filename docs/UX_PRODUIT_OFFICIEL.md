# Paye ta graille — Document UX / produit (officiel v1)

**Statut** : référence **fonctionnelle** pour designers, développeurs et PM.  
**Sources détaillées** : `PRODUCT_SPEC.md` · `UI_SCREENS.md` · `COPY_UX_COMPLET_V1.md` · `MATRICE_REPAS_ETATS_PERMISSIONS.md` · modules `MODULE_TABLE_SURPRISE_SPEC.md` · `MODULE_REPAS_SUSPENDU.md`.

---

## 1. Fonctionnalités par vague (périmètre officiel)

### V1 (MVP cœur)

| Domaine | Fonctionnalités |
|---------|-----------------|
| Compte | Auth email ou téléphone, profil (pseudo, photo, ville, rayon) |
| Intentions | Sociale : ami / ouvert / dating léger. Repas : **J’invite · On partage · Je me fais inviter** |
| Profil riche | Tags personnalité, habitudes, graille, objectif, préférences table, contraintes alimentaires (rappel confirmer au lieu), **réglages nudges** (calme / normal / off) |
| Découverte | Liste de profils **compatibles**, filtres (rayon, budget, intentions) |
| Repas duo | Proposition (créneau, zone, budget), demandes reçues, **accepter / refuser** (refus avec message optionnel) |
| Après accord | Écran match, choix **lieu** (API Places), confirmation **mutuelle**, **J’y vais** |
| Communication | **Chat conditionnel** (règle produit paramétrable, matrice dédiée) |
| Jour J | Rappel, ouverture **Maps**, **signaler un problème** |
| Après repas | Micro-feedback, **recontact graille** (opt-in **mutuel**) |
| Confiance | Signalement, bases pour **modération** admin MVP |

### V1.5 (densité locale)

| Fonctionnalités |
|-----------------|
| **Repas ouvert** : annonces typées (maintenant, ce soir, idée resto) |
| **Feed** léger avec **réponses sous annonce** et **quotas** anti-spam |
| Chat **uniquement** dans le fil de l’annonce (pas de DM global à froid) |

### V2 (scale et monétisation compatible)

| Fonctionnalités |
|-----------------|
| **Repas groupe**, **qui ramène quoi** (potluck / maison / pique-nique uniquement) |
| **Événements** curés, **billets** (Stripe phase prévue) |
| **Contacts graille** (liste + invitation) |
| **Zone « Mes tables »** (nom officiel recommandé) : regroupe favoris, historique de repas **completed** avec une personne, raccourcis **re-manger** ; **jauge** privée. **Clin d’œil marketing** optionnel *Friendzone* (sous-titre ou campagne), jamais seul libellé d’onglet sans contexte. Voir **`ZONE_AMIS_FRIENDZONE_STRATEGIE.md`** · **spec UX** : **`UX_SECTION_AMIS_MES_TABLES.md`**. |
| **Repas croisé** (inviter deux personnes, **double opt-in**) |
| **Jauge lien** : **privée**, paliers type « compagnon de graille », **sans** décrément punitif |

### Modules documentés (hors gel MVP initial recommandé)

Ces idées sont **spécifiées** et **conservées** ; le calendrier d’activation est **stratégique** (voir `AUDIT_PRODUIT_GLOBAL.md`).

| Module | Rôle | Document |
|--------|------|------------|
| **Table surprise** | Rencontre **cadrée**, consentements, sécurité, slogan **« seconde graille »** testable | `MODULE_TABLE_SURPRISE_SPEC.md`, `TABLE_SURPRISE_SECOND_GRAILLE.md` |
| **Repas suspendu** | Générosité, attribution, transparence dons | `MODULE_REPAS_SUSPENDU.md`, `SUSPENDED_MEAL_AND_DISCOVERY.md` |

**Rien n’est « jeté »** : ce qui n’est pas en **V1.0 code** reste **backlog priorisé** et **source de différenciation** future.

---

## 2. Parcours utilisateur (synthèse)

### 2.1 Onboarding (premier contact)

**Objectif** : compréhension **< 10 s**, confiance, peu de friction inutile.

**Étapes** (écrans 1 à 12 dans `UI_SCREENS.md`) : splash valeur → auth → profil minimal → intention sociale → intention repas → tags (personnalité, habitudes, graille) → objectif → préférences table → contraintes alimentaires → réglages nudges → **Terminer**.

**Textes** : `COPY_UX_COMPLET_V1.md`.

### 2.2 Parcours « premier repas » (happy path duo)

1. Accueil : action claire (**Explorer** ou **Proposer**).  
2. Explorer → fiche profil → **Proposer un repas**.  
3. Autre utilisateur : **Demandes reçues** → **Accepter**.  
4. **Match** → **Choisir un lieu** → validation lieu.  
5. **Rendez-vous** : double **J’y vais**.  
6. **Chat** si autorisé par les règles.  
7. **Jour J** : Maps, présence.  
8. **Post-repas** : feedback court, option suite.

### 2.3 Parcours secondaires

- **Refus** de repas : message optionnel, retour liste sans humiliation.  
- **Liste vide** discover : élargir rayon ou patienter.  
- **Annulation** : état `cancelled`, notification factuelle (détail politique no-show en évolution).  
- **Signalement** : parcours court, accusé de réception humain.

---

## 3. Logique sociale (règles officielles)

### Intentions

- **Repas** : trois intentions **mutuellement explicables** pour le **pacte économique et social** autour de la table.  
- **Sociale** : trois niveaux pour **anticiper** l’usage dating **sans** le poster en une ligne sur les stores.

### Chat

- **Pas** de messagerie globale « à froid ».  
- Duo : selon **matrice** (`MATRICE_REPAS_ETATS_PERMISSIONS.md`), ouvert après étapes définies (souvent post-lieu en V1 recommandé).  
- Feed V1.5 : conversation **ancrée** à l’annonce.

### Graphe et réputation

- **Pas** d’exploration du réseau d’autrui.  
- **Jauge** et **contacts graille** : **consentement** et **intimité** (V2).

### Engagement

- Rétention par **prochaine table réelle**, pas par scroll infini. Voir `SYSTEME_ENGAGEMENT_NATUREL.md` et `RETENTION_ETHICAL.md`.

---

## 4. Machine d’états (rappel)

`none` → `proposed` → `matched` → `venue_proposed` → `venue_confirmed` → `confirmed` → `completed` | `cancelled`

Chaque transition porte **horodatage** et traçabilité utile pour **support** et **sécurité**.

---

## 5. Pour développeurs (point d’entrée)

1. Lire `PRODUCT_SPEC.md` §7–9 (tables, routes).  
2. Croiser `MATRICE_REPAS_ETATS_PERMISSIONS.md` pour **RLS** et **permissions chat**.  
3. Implémenter les **écrans** selon `UI_SCREENS.md` + textes `COPY_UX_COMPLET_V1.md`.  
4. Instrumenter le funnel **C1 à C5** (`METRICS_PRODUCT.md`).

---

*v1 officielle. Les numéros d’écrans suivent `PRODUCT_SPEC.md` §3 et `UI_SCREENS.md`.*
