# Paye ta graille — Bibliothèque de prompts **étendue** (ce qu’il manque souvent)

**Usage** : chaque bloc = **un prompt maître** à coller après le préambule ADN (`PRODUCT_SPEC` + `MARKETING_POSITIONING` + `UX_COPY_SYSTEM` + `DESIGN_SYSTEM`).  
**Règle** : 1 prompt = 1 mission + **contrat de sortie** numéroté (sinon dispersion).

---

## A) Finance, investisseurs, “monter le business”

| # | Prompt (titre) | Mission en une phrase | Livrables typiques |
|---|----------------|------------------------|-------------------|
| A1 | **Pitch deck 12 slides** | Convaincre en 3 min (angel / pre-seed) | Outline slide par slide + speaker notes + “ask” |
| A2 | **Modèle financier v0** | Hypothèses sobres (ville pilote) | ARPU, CAC théorique, coûts fixes, runway, seuil de rentabilité tables |
| A3 | **Due diligence data room (liste)** | Anticiper questions investisseurs | Checklist docs (CGU, privacy, métriques, cap table placeholder) |
| A4 | **Tableau KPI North Star + vanity** | Ce qu’on mesure / ce qu’on ignore au début | North Star, 8 métriques, 5 pièges à ne pas “optimiser” |
| A5 | **Scénarios levée (SAFE vs equity FR)** | Cadrage haut niveau | Options + disclaimer juridique obligatoire |

---

## B) Go-to-market, buzz, viralité (sans dark patterns)

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| B1 | **Launch playbook ville pilote** | Densité avant scale | Calendrier 90 jours, partenaires, budget minimal, critères “ville prête” |
| B2 | **Stratégie réseaux (hooks + formats)** | Contenus reproductibles | 20 hooks, 10 scripts Reels, règles UGC, calendrier 6 semaines |
| B3 | **Programme parrainage éthique** | Croissance sans spam | Mécanique double récompense, limites, copy |
| B4 | **PR & narrative médias** | Pitch journalistes | Communiqué, FAQ presse, spokesperson Q&A, angles “société” |
| B5 | **App Store / Play Store Optimization** | Conversion store | Titre, sous-titre, mots-clés, screenshots story, politique refus Apple/Google |
| B6 | **Landing + SEO local** | “Paye ta graille + [ville]” | Structure pages, schema.org, contenus programme pilote |

---

## C) Design — au-delà des couleurs

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| C1 | **Mise en page & grille (8pt)** | Cohérence Figma → code | Grille mobile, zones safe, rythme vertical, règles densité |
| C2 | **Composants Figma + states** | Accélérer dev | Variants hover/disabled/loading/error pour chaque composant clé |
| C3 | **Illustration / iconographie** | Style unique non générique | Brief illustrateur, 12 métaphores “table/repas”, interdits |
| C4 | **Motion specs exportables** | dev implémente pareil | Durées, easing, exemples Lottie ou CSS |
| C5 | **Dark mode (oui/non + quand)** | Décision produit | Matrice contraste + charge de maintenance |
| C6 | **Branding photo (direction)** | Shooting / banque d’images | Moodboard, cadrage, diversité, authenticité |

---

## D) Produit “se mettre à la place des gens” (recherche & éthique)

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| D1 | **Plan entretiens utilisateurs (10)** | Script + sélection profils | Guide, consentement, synthèse insights |
| D2 | **Personas + anti-personas** | Éviter le biais “moi je” | 4 personas + 3 profils à risque (prédateur, fragilité sociale) |
| D3 | **Carte des peurs IRL** | Safety-by-design | 20 scénarios + mitigation produit |
| D4 | **Parcours harcèlement / abus** | Modération | Flux signalement, escalade, conservation preuves |
| D5 | **Inclusion (genre, âge, handicap, budget)** | Barrières | Checklist parcours + wording |
| D6 | **“Empty city” strategy** | Cold start | Contenu, hosts, événements bootstrap |

---

## E) Ops, scale, “comme les grandes” (sans copier bêtement)

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| E1 | **Playbook partenariats resto** | Pipeline B2B | Pitch 1 pager, SLA, package “soirée table” |
| E2 | **Ops événements (run of show)** | Expériences V2 | Checklist staff, timing, briefing staff lieu |
| E3 | **Assurance & responsabilité événements** | Réduction risque | Questions pour courtier / avocat, clauses types |
| E4 | **Support client (macros + SLA)** | CX | 15 macros, priorités, tooling |
| E5 | **Community management (règles + ton)** | Discord/IG ? | Modèle : oui/non + règles si oui |
| E6 | **Crisis comms (incident IRL)** | Protéger la marque | Arbre décision 24h / 72h, hold statement |

---

## F) Tech, qualité, sécurité (souvent oubliés avant la douleur)

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| F1 | **Menace modèle (STRIDE)** | Sécurité app + API | Liste menaces + mitigations |
| F2 | **Privacy threat model + DPIA light** | RGPD sérieux | Flux données, rétention, minimisation |
| F3 | **Perf Web Vitals budget** | Mobile réel | Budget LCP/CLS, images, fonts |
| F4 | **Plan de tests E2E critiques** | Confiance release | 15 scénarios Playwright |
| F5 | **Observabilité + alertes** | SRE | Logs, dashboards, paging |
| F6 | **Feature flags + kill switch** | Lancer sans panique | Quelles features couper en incident |
| F7 | **Offline / réseau faible** | UX réaliste | États + messaging |
| F8 | **Internationalisation (i18n)** | Passage FR→BE/CH/CA | Stratégie clés + date/heure locales |

---

## G) Légal / conformité (angles oubliés)

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| G1 | **CGU/CGV + politique confidentialité outline** | Prêt avocat | Sections obligatoires + questions ouvertes |
| G2 | **Mineurs & âge** | Verrou produit | Règles + UX |
| G3 | **Alcool & événements** | Réduction risque | Disclaimer + cadre |
| G4 | **Paiements & PSD2 (cadrage)** | Avant Stripe complexe | Quand tu es payeur / intermédiaire |
| G5 | **IP / marque “Paye ta graille”** | Dépos INPI etc. | Checklist + similarité |

---

## H) Contenu, éducation, confiance

| # | Prompt | Mission | Livrables |
|---|--------|---------|-----------|
| H1 | **Centre d’aide (30 articles)** | Réduire support | Arborescence + titres |
| H2 | **Sécurité des rencontres (guide utilisateur)** | Rassurer | 1 page + vidéo 60s script |
| H3 | **Blog “preuve sociale” pilote** | SEO + crédibilité | 5 articles “retours d’expérience” (anonymisés) |

---

## I) “Magicien” — prompt transversal (à la fin d’une session Cursor)

```text
[ADN] Paye ta graille — docs du dossier projet à respecter.

[MISSION] Audit de complétude : liste ce qui manque encore pour passer de spec → exécution investissable (produit, légal, tech, ops, marketing).

[SORTIE]
1) Top 15 trous (1 ligne chacun)
2) Top 10 risques mortels
3) 10 actions 7 jours (ordonnées)
4) Si tu proposes une idée nouvelle : pourquoi + coût + risque

[CONTRAINTE] Zéro verbosité ; ton direct ; priorise ville pilote.
```

---

## J) Synthèse : quels domaines on “oublie” le plus

1. **Crisis comms + incident IRL**  
2. **Ops événements + assurance**  
3. **ASO / stores**  
4. **Pilote ville + cold start**  
5. **DPIA / privacy engineering**  
6. **E2E + feature flags**  
7. **Support macros**  
8. **Runway / modèle financier** (même rudimentaire)  
9. **i18n + accessibilité**  
10. **Parcours abus** (pas seulement “signaler”)

---

*Complète `PROMPT_LIBRARY_EXTENDED.md` au fil des releases ; croiser avec la bibliothèque “core” déjà définie dans vos échanges (prompts 1–20 + prompt ultime).*
