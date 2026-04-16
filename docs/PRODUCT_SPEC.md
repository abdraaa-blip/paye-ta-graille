# Paye ta graille — Spécification produit & technique (v0)

**Statut** : document de conception — à valider juridiquement / produit avant exécution commerciale.  
**Stack cible** : Next.js (App Router) · Vercel · Supabase (Auth + Postgres + RLS) · (option) Stripe phase paiements.

---

## 0) Améliorations obligatoires (incohérences détectées + élévation)

1. **Périmètre “tout en V1” impossible** : livrer en **vagues** (V1 duo resto → V1.5 feed/repas ouvert → V2 événements + graphe social avancé). Sinon risque mortel : confiance, modération, vide réseau.
2. **“Pas une app de dating”** : le marché l’utilisera partiellement ainsi → ajouter **intention sociale** explicite (ami / ouvert / dating léger) **sans** en faire le marketing principal.
3. **Paiement** : distinguer **intention repas** (invite/partage/invité) de **flux monétaire** (resto, ticket événement). Éviter la dette affective monétisée.
4. **Allergènes / santé** : l’app **signale des besoins** ; l’**information obligatoire** sur plats relève des **exploitants** (cadre UE FIC 1169/2011 — information aux consommateurs). Pas de promesses nutritionnelles / médicales dans le produit.
5. **Nudges** : transparence, opt-out, plafonds de fréquence, zéro culpabilité (littérature éthique sur nudges de santé).
6. **Jauge relationnelle** : **privée**, par paire, jamais classement public ; reflète surtout **récurrence de repas complétés** + signaux discrets post-repas.
7. **Repas croisé / amis d’amis** : **double opt-in** + **graphe invisible** (pas d’exploration du réseau d’autrui).
8. **“Qui ramène quoi”** : **uniquement** formats potluck / maison / pique-nique — **pas** par défaut pour duo resto.

---

## 1) ADN & positionnement

- **Nom** : Paye ta graille  
- **Promesse** : *Ne mange plus seul.* — réseau social **IRL** du repas.  
- **Non-positionnement** : pas “app dating”, pas “app paiement”, pas “app resto pure”.  
- **Cœur** : 3 intentions — **J’invite** · **On partage** · **Je me fais inviter**.  
- **Règle d’or UX** : compréhension <10 s ; décisions rapides ; stress social minimal.  
- **Marketing différenciant** (slogans, angles « assumable », garde-fous pub) : `docs/MARKETING_POSITIONING.md`

---

## 2) Phasage produit

| Vague | Contenu principal | Objectif |
|-------|-------------------|----------|
| **V1** | Auth, profil+tags, intention, **repas privé duo**, suggestion/match mutuel, lieu (API Places), confirmation, chat **conditionnel**, fin de repas | promesse tenue |
| **V1.5** | **Repas ouvert** + **feed** léger (“maintenant / ce soir”), limites anti-spam | densité locale |
| **V2** | **Repas groupe** + **qui ramène quoi**, **événements** curés + billets, **contacts graille**, **zone « Mes tables »** (favoris, historique repas, raccourcis re-manger ; clin d’œil marketing *Friendzone* optionnel, voir `ZONE_AMIS_FRIENDZONE_STRATEGIE.md`), **repas croisé**, **jauge** | scale + monétisation |

---

## 3) UX — parcours & écrans (liste V1 exhaustive)

Chaque écran : **but** · **CTA primaire** · **états** (vide / erreur / refus).

### Onboarding & compte
1. **Splash / valeur** — promesse 10s — CTA : Commencer  
2. **Auth** — email magic link ou téléphone — Connexion  
3. **Profil minimal** — pseudo, photo, ville/rayon — Continuer  
4. **Intention sociale** — ami / ouvert / dating léger (micro-copy : “pour cadrer la table”)  
5. **Intention repas** — 3 boutons : J’invite / On partage / Je me fais inviter  
6. **Tags personnalité** (max N) — chips  
7. **Tags habitudes** — chips  
8. **Section Graille** — chips (gourmand, healthy, végan, etc.)  
9. **Objectif ici** — rencontrer / partager / lieux / solitude  
10. **Préférences table** — “tout le monde / profils proches / j’aime faire découvrir”  
11. **Contraintes alimentaires** — texte court + rappel légal “confirmer au lieu”  
12. **Réglages nudges** — calme / normal / off  

### Cœur V1
13. **Accueil** — prochaine action (proposer / explorer)  
14. **Explorer** — cartes profils compatibles (hard filters)  
15. **Fiche profil autre** — CTA : Proposer un repas (si permission)  
16. **Proposition repas** — créneau, zone, budget, intention confirmée — Envoyer  
17. **Réception demandes** — accepter / refuser (refus élégant)  
18. **Match** — écran “c’est oui” + règles IRL  
19. **Choix lieu** — liste Places + filtres — Proposer / voter (MVP : propose + accepte)  
20. **Confirmation mutuelle** — “J’y vais”  
21. **Chat pré-repas** — **ouvert seulement** après étape confirmation (paramétrable)  
22. **Jour J** — rappel, accès carte, bouton **Signaler un problème**  
23. **Post-repas** — feedback discret + “recontact graille” (opt-in mutuel)  

### V1.5 (feed)
24. **Feed** — posts types limités (maintenant, ce soir, idée resto)  
25. **Répondre** — ouvre thread **sous annonce** avec quota  

### V2 (référence)
26. **Créer repas groupe** · 27. **Organisation “qui ramène quoi”** · 28. **Événement** (détail + billet) · 29. **Contacts graille** · 30. **Repas croisé** (inviter B+C) · 31. **Jauge lien** (privée)

---

## 4) Logique produit clés

### Permission de chat (matrice simplifiée)
- Duo : chat ouvert si **match accepté** + (option) **lieu confirmé**.  
- Feed : chat **uniquement** entre auteur et répondant **sur le fil** de l’annonce.  
- Jamais de DM global “à froid”.

### Machine d’états — repas duo (V1)
`none` → `proposed` → `matched` → `venue_proposed` → `venue_confirmed` → `confirmed` → `completed` | `cancelled`  
Transitions avec **horodatage** + **qui a annulé** + politique no-show (phase ultérieure).

### Jauge relationnelle (V2)
- Paliers privés uniquement (texte type “compagnon de graille” au seuil).  
- Incrément : repas `completed` ; pas de décrément punitif.  
- Nudges “revoir X” : max 1/semaine/contact, backoff si ignoré.

---

## 5) Design system & DA

**Source détaillée** : `docs/DESIGN_SYSTEM.md` · identité canon `docs/IDENTITE_VISUELLE_COMPLETE.md` · synthèse DA `docs/DA_COHERENCE_VISUELLE_ET_SENSORIELLE_TOTALE.md` (palette crème / ambre / vert olive, **Inter ou Source Sans 3** + **Fraunces ou Source Serif 4** en display ponctuel, motion, son phase 2).

### Principes (rappel)
Mobile-first, chaleureux, **contraste AA** sur textes, animations **courtes** sauf jauge (plus lente), **pas de son auto** en V1.

### Composants
Button (3 variantes), Chip, Card profil, Stepper onboarding, BottomNav 3 items max, Toast, Modal signalement, EmptyState illustré léger.

---

## 6) Texte UX & voix produit

**Sources** : `docs/UX_COPY_SYSTEM.md` (ton, règles nudges) · **textes écran finaux** : `docs/COPY_UX_COMPLET_V1.md`.

### Rappels clés
- **H1 landing** : Ne mange plus seul. *(ou variante « On mange ? » sur home connectée — voir copy system)*  
- **Intention repas** : J’invite · On partage · Je me fais inviter (avec emojis validés produit)  
- **Tonalité** : tutoiement, humain, léger, jamais culpabilisant ; nudges plafonnés (cf. §0 point 5).

---

## 7) Architecture technique

### Frontend
Next.js App Router, React Server Components où pertinent, **PWA** optionnelle, géoloc navigateur avec permission.

### Backend
Supabase : **Auth**, **Postgres**, **RLS** par `user_id`, **Storage** photos, **Edge Functions** pour webhooks Stripe (phase billet).

### Intégrations
- Google Places (ou équivalent) — clés env Vercel  
- Stripe — **phase V2** événements / empreinte no-show  
- Email (Resend) / SMS — selon auth choisie  

### Observabilité
Logs structurés sans PII inutiles ; rate limiting sur endpoints sociaux.

---

## 8) Base de données (tables principales)

**Utilisateurs & profil**  
- `profiles` (id = auth.uid, display_name, photo_url, city, radius_km, bio_short, social_intent enum, meal_intent enum, created_at)  
- `profile_tags` (profile_id, tag_key, category) — normalisé  
- `user_settings` (nudge_level, locale, …)

**Repas duo**  
- `meals` (id, type='duo', host_user_id, guest_user_id nullable, status, window_start, window_end, budget_band, created_at)  
- `meal_participants` (meal_id, user_id, role, RSVP_status)  
- `venues` (meal_id, place_id, name, address, lat, lng, chosen_by)  
- `threads` + `messages` (meal_id, …) avec RLS strict  

**V1.5+**  
- `open_posts` (author_id, kind, body, geo, expires_at)  
- `open_replies` …

**V2**  
- `groups`, `group_meals`, `potluck_slots`  
- `events`, `event_tickets`  
- `contacts` (pair unique, status mutual)  
- `relationship_stats` (user_a, user_b, meals_count, tier, private)

Indexes géo (PostGIS extension optionnelle) ou recherche par ville + rayon.

---

## 9) API (routes logiques Next.js)

`/api/profile` GET/PATCH  
`/api/discover` GET  
`/api/meals` POST (create proposal)  
`/api/meals/[id]` GET/PATCH (state transitions)  
`/api/meals/[id]/venue` POST  
`/api/meals/[id]/messages` GET/POST (guard permission)  
`/api/report` POST  
`/api/places/search` GET (proxy clé serveur)  
*(V1.5)* `/api/feed` … *(V2)* `/api/events` …

---

## 10) Légal & sécurité (outline)

- **CGU** : cadre plateforme, limitation responsabilité IRL (réalité : **à rédiger par avocat**), règles communautaires.  
- **RGPD** : minimisation, registre traitements, droits accès/suppression, DPA fournisseurs.  
- **IRL** : lieu public, signalement, blocage, escalade, conservation preuves limitée.  
- **Événements** : CGV billet, annulation, partenaire identifié.  

---

## 11) Business model

1. **Premium** : visibilité + filtres + boosts légers (sans enfermer le cœur).  
   **Garde-fous** : le premium **ne** doit **pas** acheter priorité sur la **sécurité**, le **signalement**, ni un **match** garanti. Toute monétisation « visibilité » reste **transparente** et plafonnée en tests pour éviter l’effet « pay-to-win social ».  
2. **B2B resto** : mise en avant locale quand densité.  
3. **Événements** : commission billet (V2).  
4. **Pas au début** : pub invasive, dark patterns, monétisation du graphe social.

---

## 12) MVP codable — backlog ordonné (extraits)

1. Repo Next + lint + TS strict  
2. Supabase projet + Auth email  
3. Table `profiles` + RLS  
4. Onboarding multi-étapes (état client)  
5. Tags seedés (JSON)  
6. Discover query (rayon + intention + exclusions)  
7. Création `meals` proposed + notification email (MVP)  
8. Acceptation → matched  
9. Places search server route  
10. Venue attach + confirm  
11. Chat minimal (realtime supabase) + permission guard  
12. Complete meal + optional “recontact” flags  
13. Signalement + ban field manual admin MVP  
14. Déploiement Vercel + env  

---

## 13) Métiers additionnels (hors liste initiale)

Modération trust & safety, **assurance événementielle**, **rédacteur juridique**, **local ops** (ville pilote), **formateur allergènes** pour partenaires resto, **accessibilité** (a11y), **i18n** (FR d’abord), **analyste fraude paiements**.

---

*Fin du document v0 — à itérer avec retours terrain (5–10 entretiens utilisateurs) avant build massif.*
