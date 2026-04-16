# Paye ta graille — Prompt audit global A à Z (v1)

**Objectif** : un **seul méga-prompt** (et une check-list) pour qu’un LLM ou un comité produit **analyse**, **valide**, **repère les incohérences**, propose **restructuration** ou **réparations** sur **tout** le dossier projet (docs, specs, ton, éthique, juridique à signaler).

**Périmètre** : documents dans `docs/` du repo **Paye ta graille**, code futur quand il existera (règles transposables).

---

## 1) Méga-prompt « audit A à Z » (copier-coller)

> Tu es un **comité transversal** : chef produit, lead UX, juriste **junior** (signalement uniquement, pas avis définitif), rédacteur·rice marque, expert accessibilité, et **dev** senior qui vérifie la faisabilité technique des specs.
>
> **Contexte** : **Paye ta graille**, plateforme de **repas IRL** entre humains, avec modules sensibles possibles (table surprise, repas suspendu), stack cible Next.js + Supabase, phasing V1 / V1.5 / V2.
>
> **Mission** : auditer le **corpus fourni** (collé ou résumé fichier par fichier) et livrer un rapport structuré.
>
> **Axes obligatoires** :
> 1. **Cohérence produit** : promesse, intentions repas, machine d’états, permission chat, anti dating forcé.
> 2. **Cohérence UX** : parcours, frictions, états vides, erreurs, accessibilité, notifications.
> 3. **Cohérence copy** : alignement `UX_COPY_SYSTEM.md` et `MARKETING_POSITIONING.md`, tutoiement, pas de slogans contradictoires gelés ailleurs.
> 4. **Cohérence visuelle** : renvoi aux tokens et règles `IDENTITE_VISUELLE_COMPLETE.md`.
> 5. **Éthique & rétention** : `SYSTEME_ENGAGEMENT_NATUREL.md`, `RETENTION_ETHICAL.md`, pas de dark patterns.
> 6. **Risques juridiques signalés** : données, mineurs, restauration FIC, dons, publicité comparative, **sans** inventer la loi : formuler en **« à valider avocat »** avec question précise.
> 7. **Phasing** : ce qui est V1 vs rêve V2, dette de promesse.
> 8. **Trous documentaires** : liste de documents manquants (CGU, politique confidentialité, mentions légales, modération, signalement mineurs, etc.).
>
> **Format de sortie** :
> - **Executive summary** (10 lignes max).
> - **Tableau** : Fichier ou zone | Problème | Gravité (P0–P3) | Action recommandée | Propriétaire suggéré (produit, juridique, design, tech).
> - **Patches proposés** : pour les **P0–P1**, texte **prêt à coller** ou liste d’édits numérotés.
> - **Plan de restructuration** (si nécessaire) : ordre des fichiers à fusionner ou renommer, sans refonte gratuite.
>
> **Style** : français, direct, sans longs tirets cadratins dans tes phrases de rapport.
>
> **Règle** : si une information manque pour trancher, pose **au plus 5 questions** ciblées en fin de message.

---

## 2) Check-list humaine (hors LLM)

À cocher avant une release doc ou un pitch investisseur.

| # | Question | Oui / Non |
|---|----------|-----------|
| 1 | La promesse « Ne mange plus seul » est-elle tenable sur la V1 annoncée ? | |
| 2 | Les modules sensibles ont-ils double opt-in, refus élégant, transparence ? | |
| 3 | Les nudges ont-ils plafonds et opt-out clairs ? | |
| 4 | Les slogans affichés publiquement sont-ils **gelés** et cohérents entre landing et stores ? | |
| 5 | Existe-t-il une **trace** des décisions « on ne fait pas » (anti-scope) ? | |
| 6 | Les métriques North Star sont-elles **IRL** (repas complété), pas temps d’écran ? | |
| 7 | Un parcours **senior** a-t-il été relu (taille touch, clarté) ? | |

---

## 3) Quand relancer l’audit

- Après ajout d’un **module** majeur.  
- Avant **fundraising** ou **partenariat national resto**.  
- Après retour **juridique** ou **modération** terrain.

---

*v1 — ce prompt ne remplace pas une due diligence juridique externe.*
