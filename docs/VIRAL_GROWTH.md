# Paye ta graille — Viralité & growth **organique** (sans spam)

**Mission** : chaque utilisateur peut **ramener un autre** avec **peu d’effort**, parce que **l’IRL** est la preuve.  
**Interdits** : harcèlement de notifications, dark patterns, culpabilisation, promesses fausses, incitation au faux témoignage.

**Principe** : le viral vient du **récit racontable** (“on a mangé avec des inconnus, c’était ouf / cool / simple”), pas du “partage pour gagner des points”.

### Implémentation dans l’app (référence code)

- **`InviteFriendCard`** : lien `/commencer?ref=friend_<source>` + tracking `invite_share_opened` / `invite_link_copied` / `invite_native_shared` (`src/components/InviteFriendCard.tsx`).
- **Moments d’invitation** : accueil, découvrir, liste repas ; **repas détail** — après **match**, **repas confirmé** (avant « Repas fait »), **repas terminé** (`src/app/repas/[id]/MealDetailClient.tsx`). Copy dédiées dans `src/lib/growth-copy.ts` (`GROWTH_INVITE_CARD_*`).
- **Arrivée invité·e** : `/commencer?ref=friend_*` → redirection vers `/auth` ou `/onboarding` avec **`invite_ref`** ; bandeau **`InviteRefBanner`** sur auth et onboarding ; persistance **`sessionStorage`** + cookies + événement **`invite_attribution`** une fois après OTP, **magic link** (cookies posés dans `/auth/callback` à partir des query `invite_ref` / `inv` transmises via `emailRedirectTo`) ou fin onboarding (si session API OK). Émission aussi depuis **`/accueil`** et **`/profil`** une fois la session chargée pour couvrir le login par lien sans repasser par la page auth.

---

## 1) Mécaniques de partage **naturel** (sans forcer)

### A) “Carte postale de table” (après repas)
- Écran optionnel : **image générée** (lieu flouté + date + phrase) *sans visages* par défaut.  
- Boutons : **Partager** (Stories) · **Copier le lien** · **Passer**.  
- **Pas** de pop-up bloquant avant de quitter l’écran.

### B) Invitation **contextuelle** (1 tap)
Après un bon moment : **« Ramène quelqu’un à la prochaine table ? »** → lien de parrainage **pré-rempli** avec **créneau** ou **table du mercredi** (option).

### C) “+1” sur une annonce **repas ouvert**
L’auteur peut **inviter un ami** en 1 tap (SMS pré-rédigé modifiable). L’ami arrive **sur l’annonce**, pas sur une landing froide.

### D) Carte “hôte” (ambassadeurs)
Un hôte de soirée a un **QR + lien** “rejoindre ma table Paye ta graille” — viralité **événementielle**, pas spam.

### E) Watermark discret (option produit)
Sur **photos prises dans l’app** (si feature photo) : petit logo + nom — **opt-in** explicite.

---

## 2) Moments où l’utilisateur **parle** de l’app (hors push)

| Moment | Pourquoi il en parle | Produit |
|--------|----------------------|---------|
| Après 1er repas réussi | histoire à raconter | écran “raconter / partager” **optionnel** |
| Quand il organise pour des amis | statut social positif | “créer une table” + lien court |
| Quand il se sent **moins seul** | gratitude légère | microcopy + bouton partage **non intrusif** |
| Quand il découvre un resto | contenu “déjà prêt” | bouton “envoyer le lieu” |
| Quand il rate le repas mais a aimé l’idée | FOMO doux | “prochaine table jeudi ?” + partage |

**Règle** : le partage est **souvent social hors-app** (WhatsApp, bouche-à-oreille). L’app fournit **la phrase + le lien**, pas la pression.

---

## 3) Boucles virales **intégrées** au produit (éthiques)

### Boucle 1 — Parrain “table”
- **1 invitation** = accès à un **créneau prioritaire** ou **file courte** (pas monnaie “cash” au début).  
- Plafond : ex. **2 invitations actives** / semaine / user (anti-spam).

### Boucle 2 — “Deux inconnus + un hôte”
Le **3e siège** est toujours plus facile à remplir : incite à **tirer** quelqu’un du réseau proche.

### Boucle 3 — Repas ouvert + réponses limitées
La rareté est **réelle** (places), pas artificielle. Ça se raconte : “il reste 2 places”.

### Boucle 4 — Événement physique récurrent
**“Mercredi Paye ta graille”** au même lieu → habitude → **calendrier partageable**.

### Boucle 5 — Témoignage consenti → preuve sociale
Avec consentement : **citation** sur landing locale (ville pilote). Ça convertit mieux que n’importe quelle pub.

**Garde-fous** : pas de leaderboard “qui a invité le plus” (toxique + spam). Préférer **badges privés** ou **remerciements** discrets.

---

## 4) Idées contenu **TikTok / Instagram** (IRL d’abord)

### Formats courts (15–45s)
1. **“POV : tu pensais manger seul”** → cut : table, rires (accord participants).  
2. **“3 règles avant d’aller manger avec un inconnu”** (sécurité + cadre) — crédibilité.  
3. **“On a testé Paye ta graille : voici ce qui s’est passé”** — journal honnête.  
4. **“Le resto était mid, la conversation était top”** — authenticité.  
5. **“J’invite / on partage / je me fais inviter : lequel tu choisis ?”** — quiz social.  
6. **“Table du mercredi : qui vient ?”** — rendez-vous local.  
7. **“Ce que j’ai mis dans ma section Graille”** — UGC tags.  
8. **“Rencontre sans gêne : on commence par manger”** — angle marketing assumable.

### Formats carrousel (IG)
- **10 signes que tu devrais tester une table** (humour doux).  
- **Checklist sécurité** (lieu public, signalement) — utile + partageable.

### Live (quand mature)
- **Q&A** avec modération + règles — rare au début.

**Règle contenu** : **accord écrit** visages/voix ; floutage par défaut ; pas d’humiliation.

---

## 5) Déclencheurs **émotionnels** de partage (non manipulatoires)

| Déclencheur | Activation produit | Limite |
|-------------|-------------------|--------|
| Soulagement | “c’était simple” post-repas | pas de “note obligatoire” |
| fierté | “j’ai osé” | pas de shame si refus |
| appartenance | “on était une table” | pas de culte de marque |
| curiosité | “qui sera là jeudi ?” | pas de faux mystère |
| gratitude | “merci d’avoir été là” | 1 modal max, skippable |

Cadre éthique : **EAST** (easy, attractive, social, timely) sans cacher l’intention ; opt-out clair sur partages et rappels.

---

## 6) Métrique “1 ramène 1” (simple)

- **K-factor** approximatif : invitations envoyées × taux d’acceptation × taux d’activation **/ utilisateur actif / semaine**.  
- Objectif réaliste au début : **0.2–0.5** (pas 1.0) — la densité locale compte plus.

---

## 7) Check-list anti-spam (produit + ops)

- [ ] Pas de push “invite 10 amis” en boucle  
- [ ] Parrainage plafonné + cooldown  
- [ ] Signalement accessible depuis tout fil social  
- [ ] Ban évident pour abus d’invites  
- [ ] Copy jamais culpabilisante (“tu n’invites pas assez”)

---

## 8) Lien avec les autres docs

- Lancement terrain : `LAUNCH_PLAYBOOK.md`  
- Copy : `UX_COPY_SYSTEM.md`  
- Positionnement : `MARKETING_POSITIONING.md`

---

## 9) Instrumentation produit (implémenté)

Événements captés côté app/API :
- `ritual_card_seen`
- `ritual_card_click`
- `next_action_click`
- `invite_share_opened`
- `invite_link_copied`
- `invite_native_shared`
- `discover_propose_click`
- `surprise_graille_rolled` (carte « Lancer la graille », métadonnées `count`, `compatible_strict`)
- `repas_refresh_click`
- `nudge_level_updated`
- `partners_page_view` / `partners_cta_click` (page Partenaires, métadonnée `cta`: `mailto` | `graille_plus`)
- Funnel produit (complète auth → activation) : `auth_page_viewed`, `auth_otp_verified`, `auth_magic_link_exchange` (serveur, callback), `discover_viewed`, `meal_proposed`, `meal_venue_submitted`, `meal_status_updated`, `onboarding_started` / `onboarding_step_completed` / `onboarding_completed`, `accueil_viewed`

Source technique :
- table `public.growth_events`
- vue `public.growth_kpi_daily` (totaux, **funnel** auth/découverte/**surprise graille** /repas/onboarding/accueil, **attributions invitation** + **événements feedback** `feedback_submitted`, **Partenaires** : vues, CTA mailto / Graille+, actifs — migrations `20260427100000_growth_kpi_funnel.sql`, `20260502100000_growth_kpi_funnel_invite_feedback.sql`, `20260526120000_growth_kpi_surprise_graille.sql`)
- endpoint `POST /api/growth/event`
- endpoint `GET /api/growth/kpi?days=30` (session admin ou en-tête `x-ptg-growth-kpi-secret`) — voir `PTG_GROWTH_ADMIN_USER_IDS` / `PTG_GROWTH_KPI_SECRET`
- page interne noindex `/interne/croissance` (tableau agrégé)
- helper front `src/lib/growth-events.ts`

**Cross-appareil (magic link)** : au moment d’envoyer le mail, `signInWithOtp` utilise un `emailRedirectTo` qui reprend `invite_ref` / `inv` depuis le stockage local (`withInviteParamsOnAuthCallbackUrl` dans `src/lib/invite-attribution.ts`). Après échange du code, `applyInviteAttributionCookiesFromCallbackUrl` (`src/lib/invite-attribution-callback.ts`) recrée les cookies pour la suite du parcours. Vérifier que **Authentication → URL Configuration** Supabase autorise bien l’URL de callback (y compris avec paramètres de requête si ton projet l’exige).

Exemples SQL pilotage :

```sql
-- Activation hebdo des invitations
select
  date_trunc('week', created_at) as week,
  count(*) filter (where event_name in ('invite_link_copied', 'invite_native_shared')) as invites_actions
from public.growth_events
group by 1
order by 1 desc;

-- Conversion "rituel vu" -> "proposer un repas"
with seen as (
  select user_id, min(created_at) as t_seen
  from public.growth_events
  where event_name = 'ritual_card_seen'
  group by 1
),
propose as (
  select user_id, min(created_at) as t_propose
  from public.growth_events
  where event_name = 'discover_propose_click'
  group by 1
)
select
  count(*) as users_seen,
  count(*) filter (where p.user_id is not null and p.t_propose >= s.t_seen) as users_proposed_after_seen
from seen s
left join propose p on p.user_id = s.user_id;
```

---

*v1 — itérer après 20 premiers repas documentés (vrai taux de partage, canaux dominants).*
