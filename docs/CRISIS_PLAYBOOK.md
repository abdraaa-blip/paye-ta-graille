# Paye ta graille — Gestion de crise produit (avant la casse)

**Mission** : anticiper **ce qui peut mal tourner**, renforcer **prévention + réponse**.  
**Usage interne** : équipe fondatrice + futurs modérateurs ; **ne pas diffuser** hold statements sans validation.

---

## 1) Scénarios “catastrophe” (sécurité, abus, désengagement)

### A) Sécurité IRL (gravité maximale)
| # | Scénario | Signaux précoces |
|---|----------|-------------------|
| A1 | Agression / violence lors d’un repas | signalement immédiat, mots-clés urgence |
| A2 | Harcèlement / pression sexuelle ou financière | messages post-match, plaintes répétées sur un profil |
| A3 | Rendez-vous détourné vers lieu **non public** contre règles | changements de lieu last minute, insistance |
| A4 | Intoxication / alcool forcé | (contexte bar) signalements “malaise” |
| A5 | Mineur présent / contournement âge | profil incohérent, signalement |

### B) Abus & plateforme
| # | Scénario |
|---|----------|
| B1 | Comptes mass création, spam invitations |
| B2 | Arnaque (fausse identité, demande d’argent hors cadre) |
| B3 | Doxing / fuite d’infos dans le chat |
| B4 | Bot / contenu promo sur feed |
| B5 | “Review bombing” interne ou campagne de faux signalements |

### C) Désengagement & réputation
| # | Scénario |
|---|----------|
| C1 | Vague de **no-show** → rumeur “arnaque / flakiness” |
| C2 | Expérience **gênante** viralée (même si exagérée) |
| C3 | Article / thread “**c’est une app de drague déguisée**” |
| C4 | Partenaire resto **retire** son accord après incident |
| C5 | Fuite de données / mauvaise config RLS |

### D) Légal & régulateur
| # | Scénario |
|---|----------|
| D1 | Demande d’effacement / RGPD mal gérée |
| D2 | Plainte pour **responsabilité** après incident IRL |
| D3 | Problème paiement / chargeback massif (événements) |

---

## 2) Points faibles **du concept** (honnêteté stratégique)

1. **Marketplace sociale** : sans liquidité → produit **vide** ; avec liquidité → **risques** montent.  
2. **Ambiguïté dating / social** : mal cadrée → **dérive** perçue ou réelle.  
3. **Argent + rencontre** : friction morale + **litiges** si mal conçu.  
4. **Effet réseau local** : scaling “ville par ville” est **lent** pour certains investisseurs.  
5. **Modération** : coûteuse ; sous-investie → **scandale**.  
6. **Dépendance aux lieux** : resto peut refuser après un incident médiatisé.

---

## 3) Solutions **préventives** (produit + ops)

### Produit (dès conception)
- **Lieu public** par défaut V1 ; pas de “chez moi” dans le produit.  
- **Signalement** 1 tap + **blocage** + **escalade** ; conservation **minimale** de preuves (politique écrite).  
- **Règles visibles** avant 1er repas + **rappel J-2h** (cadre).  
- **Limites** : invitations / messages (anti-spam).  
- **Vérif progressive** (téléphone → photo → identité forte seulement si nécessaire).  
- **Transparence** intention sociale (ami / ouvert / dating léger) pour réduire ambiguïté.

### Ops
- **Hôte** présent sur premières soirées (voir `LAUNCH_PLAYBOOK.md`).  
- **Partenaires** : clause “pause” si incident + numéro d’astreinte interne.  
- **Playbook médias** : 1 porte-parole, pas 5 versions différentes.

### Tech
- **RLS** testée ; pas de données utilisateur dans logs bruts.  
- **Rate limits** ; audit périodique permissions.

---

## 4) Protocoles d’**urgence** (24h / 72h / 7j)

### Niveau 0 — Signalement “gênant” (non urgent)
- SLA interne : **48h** première réponse automatisée + ticket.  
- Action : avertissement / limitation fonction / ban temporaire selon gravité.

### Niveau 1 — Risque sécurité (sans confirmation immédiate)
- **Geler** fonctionnalités sensibles si pattern (ex. nouveau compte + 50 messages).  
- Contacter utilisateur **par canal sécurisé** (email vérifié) si besoin.

### Niveau 2 — Incident IRL confirmé / urgence
- **0–2h** : fondateur alerté ; **décision** : suspension profils concernés si doute sérieux.  
- **2–24h** : collecte faits (horodatages, messages autorisés), **conseil juridique** si violence.  
- **Hold statement** interne (pas publication hâtive) : *“Nous prenons ce signalement au sérieux, enquête en cours.”*  
- **24–72h** : mesure corrective (ban, changement règles produit, comm partenaire resto).  
- **7j** : post-mortem interne + **changelog** règles utilisateurs si besoin.

### Niveau 3 — Fuite données / sécurité tech
- **Rotation clés** ; notification CNIL si applicable (à valider juridiquement) ; communication utilisateurs proportionnée.

### Niveau 4 — Crise médiatique / viral négatif
- **Ne pas** débattre en commentaires infinis.  
- **1** canal officiel (site statut ou compte certifié).  
- Faits vérifiés ; pas de fuite de détails sensibles des victimes.

---

## 5) Matrice décision rapide (qui décide quoi)

| Gravité | Décideur | Com externe |
|---------|----------|----------------|
| Faible | fondateur / modérateur | aucune ou DM individuel |
| Moyenne | fondateur + avocat si doute | courte déclaration |
| Élevée | fondateur + avocat | déclaration unique, pas de rush |

---

## 6) Métriques de “santé crise” (à suivre)

- Signalements / repas complété (tendance)  
- Temps de première réponse modération  
- Taux de récidive sur profils signalés  
- No-show % (corrélation réputation)

---

## 7) Liens internes

- `PRODUCT_SPEC.md` — règles IRL, chat conditionnel  
- `SCALE_ARCHITECTURE.md` — quand la modération explose  
- `LAUNCH_PLAYBOOK.md` — hôte terrain  
- `PROMPT_LIBRARY_EXTENDED.md` — crisis comms, E2E

---

*Document opérationnel — phrases légales et obligations à valider avec un avocat selon juridiction.*
