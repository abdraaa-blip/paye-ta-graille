# Paye ta graille — Document légal (structure officielle v1)

**Statut** : **cadre** pour avocat et équipe. **Aucune** clause ci-dessous ne constitue un **conseil juridique** ni un contrat. Les sections marquées **[À rédiger par avocat]** doivent être complétées avant ouverture au public.

**Objectif** : lister **tous les documents** et **mentions** nécessaires pour investisseurs (due diligence), développeurs (exigences conformité) et partenaires (cadre de responsabilité).

---

## 1. Principes directeurs (produit)

1. **Transparence** sur le rôle de la plateforme : **mise en relation** et **outils**, pas remplacement des obligations des **restaurateurs** ou des **organisateurs** d’événements.  
2. **IRL** : encouragement au **lieu public**, **signalement**, **modération** et **conservation limitée** des preuves si procédure.  
3. **Données** : minimisation, finalités claires, droits utilisateurs, registre traitements, DPA fournisseurs.  
4. **Mineurs** : politique d’**âge** et de **vérification** à définir avec avocat (souvent **interdiction** ou **cadre strict**).  
5. **Paiements** (V2 billetterie, dons repas suspendu) : séparation des **flux** et **transparence** légale spécifique.

---

## 2. Inventaire des documents à produire

| Document | Objectif | Public | Statut |
|----------|----------|--------|--------|
| **Mentions légales** | Éditeur, hébergeur, contact, RC | Site, app | **[À rédiger]** |
| **Conditions générales d’utilisation (CGU)** | Droits et devoirs utilisateurs, limitation responsabilité **encadrée**, résiliation | Utilisateurs | **[À rédiger]** |
| **Politique de confidentialité** | RGPD, finalités, bases légales, durées, sous-traitants, droits | Utilisateurs | **[À rédiger]** |
| **Politique cookies / traceurs** | Si UE, consentement, liste cookies | Web | **[À rédiger]** |
| **Charte de modération** | Règles communauté, sanctions, appels | Interne + extrait public | **[À rédiger]** |
| **Procédure signalement** | Signalement in-app et IRL, délais de traitement | Utilisateurs + équipe | **[À rédiger]** |
| **Politique mineurs** | Âge minimum, vérifications | Utilisateurs + stores | **[À rédiger]** |
| **Conditions partenaires restaurants** | Mise en avant, données, responsabilité offre | B2B | **[À rédiger]** |
| **CGV billetterie** (V2) | Annulation, remboursement, litiges | Acheteurs | **[À rédiger]** |
| **Mentions dons / repas suspendu** | Transparence, fiscalité, information | Donateurs | **[À rédiger]** |
| **DPA** (sous-traitance) | Fournisseurs (hébergeur, email, analytics) | Juridique / ops | **[À rédiger]** |
| **Registre des traitements** | RGPD interne | DPO / fondateur | **[À rédiger]** |
| **Politique conservation des preuves** | Signalements, durées, accès | Trust / juridique | **[À rédiger]** |

---

## 3. Structure type — CGU (plan)

**[À rédiger par avocat]** — Titre indicatif des sections :

1. Objet et acceptation  
2. Description du service (inclure **ce que le service n’est pas**)  
3. Compte, sécurité, âge  
4. Contenus utilisateurs et licence limitée à l’hébergeur  
5. Comportements interdits (harcèlement, discrimination, fraude)  
6. Repas **IRL** : **précautions**, **lieux**, **responsabilité** des participants  
7. Signalement, sanctions, résiliation  
8. Propriété intellectuelle  
9. Limitation de responsabilité (**droit applicable**, clauses **valides** localement)  
10. Données personnelles (renvoi politique confidentialité)  
11. Modification des CGU  
12. Droit applicable et juridiction

---

## 4. Structure type — Politique de confidentialité (plan)

**[À rédiger par avocat]**

1. Responsable du traitement  
2. Données collectées (profil, géoloc, messages, logs techniques)  
3. Finalités et bases légales  
4. Durées de conservation  
5. Destinataires et sous-traitants  
6. Transferts hors UE si applicable  
7. Droits (accès, rectification, effacement, opposition, portabilité, réclamation CNIL)  
8. Cookies et traceurs  
9. Sécurité  
10. Mineurs  
11. Contact DPO ou référent

---

## 5. Sécurité et protection utilisateur (exigences produit + légal)

### 5.1 À couvrir dans les documents et dans le produit

- **Signalement** accessible **Jour J** et depuis profils / chat.  
- **Blocage** utilisateur (selon roadmap).  
- **Modération** avec **traces** proportionnées.  
- **Rappel** lieu **public** et conduite attendue (sans promesse de sécurité absolue).  
- **Allergènes** : rappel conformité **exploitants** (FIC 1169/2011 UE, information consommateurs).

### 5.2 Paiement et dons

- Distinction **intention repas** / **paiement resto** / **billet** / **don** (repas suspendu).  
- **Stripe** ou équivalent : conditions **KYC**, **refunds**, **chargebacks** (V2).

### 5.3 Table surprise et repas suspendu

- **Table surprise** : cadre **consentement**, **sécurité**, **mineurs**, **identité** (voir `MODULE_TABLE_SURPRISE_SPEC.md` pour exigences UX, à refléter en **CGU** / **annexe**).  
- **Repas suspendu** : **transparence** des fonds, **mentions obligatoires** (voir `MODULE_REPAS_SUSPENDU.md`).

---

## 6. Stores (Apple / Google)

**[À préparer avec avocat + marketing]**

- Description alignée **MARKETING_OFFICIEL.md** sans superlatifs **non prouvés**.  
- Captures d’écran cohérentes **identité**.  
- Politique confidentialité **URL** stable.  
- Gestion **âge** et contenu **social**.

---

## 7. Investisseurs (due diligence)

Checklist minimale :

- [ ] CGU + politique confidentialité **publiées** avant scale marketing  
- [ ] Registre traitements à jour  
- [ ] Playbook **Trust** et **crise** (`CRISIS_PLAYBOOK.md`) relié aux **procédures** légales  
- [ ] Contrats **partenaires** si B2B actif

---

## 8. Emplacement futur des fichiers

Recommandation : dossier `docs/legal/` avec un **README** listant les versions datées de chaque document.

---

*v1 structure. Aucun engagement contractuel tant que les sections [À rédiger] ne sont pas validées par un professionnel du droit.*
