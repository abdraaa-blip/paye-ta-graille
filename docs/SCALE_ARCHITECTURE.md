# Paye ta graille — Anticipation croissance (1k → 10k → 100k)

**Rôle** : architecture produit + contraintes techniques.  
**Objectif** : savoir **ce qui casse** et **quand investir**, pour ne pas “scaler la dette” (modération, perf, données, org).

**Hypothèse** : “utilisateurs” = comptes ; la métrique critique est plutôt **utilisateurs actifs ayant complété ≥1 repas / mois** et **tables complétées / semaine / ville**.

---

## 1) Paliers — **problèmes** typiques

### ~1 000 utilisateurs (souvent 1–2 villes)
| Domaine | Problème |
|---------|----------|
| Produit | Features “fourre-tout” sans liquidité → **effet vide** |
| Modération | Volume de signalements **manuel** encore OK ; erreurs humaines |
| Perf | Postgres simple + RLS suffit ; pics sur **soirées** |
| Support | Boîte mail / Notion ; délais variables |
| Données | Requêtes geo naïves (rayon) → lenteur si mal indexé |
| Org | Décisions “dans la tête du fondateur” |

### ~10 000 utilisateurs (plusieurs zones / villes)
| Domaine | Problème |
|---------|----------|
| Liquidité | **Cold start** par quartier ; mauvaise expérience “personne autour” |
| Modération | **Queues** de signalements ; besoin **playbooks** + rôles |
| Abus | Fake accounts, spam invitations, harcèlement cross-messages |
| Temps réel | Chat / présence → coût et complexité **Supabase Realtime** / quotas |
| Notifs | Email/SMS bruts → **délivrabilité**, coûts, plaintes “spam” |
| Produit | Règles **permission chat** mal testées → incidents |
| Tech | **Migrations** sans downtime ; besoin de **feature flags** |
| Légal | Pression sur **CGU**, conservation données, demandes autorités |

### ~100 000 utilisateurs (multi-pays ou grandes métropoles)
| Domaine | Problème |
|---------|----------|
| Trust | Modération **24/7**, escalades médias, “incident IRL” |
| Fraude | Paiements, événements, chargebacks, comptes mass création |
| Infra | **Hotspots** DB (writes sur `messages`, `matches`) ; besoin **sharding** ou services dédiés |
| Geo | Requêtes complexes → **PostGIS** ou service geo + cache |
| Observabilité | Sans **tracing**, debug impossible à cette échelle |
| Produit | Complexité UX → **fragmentation** (dating vs social vs events) |
| Org | PM + Trust lead + SRE minimum |

---

## 2) Solutions techniques (par thème, évolutif)

### Données & perf
- **Dès V1** : index sur `(city, meal_intent, status)`, `geohash` ou `lat/lng` + index btree partiel ; éviter N+1 sur discover.  
- **~10k** : PostGIS ou **Redis** cache pour “top profils dans rayon K”.  
- **~100k** : read replicas, partitionnement **messages** par temps ou par `city_id`, queues (jobs async).

### Temps réel (chat)
- **V1** : messages simples, polling court acceptable si MVP très petit ; Realtime si besoin UX.  
- **~10k** : Realtime avec **rate limits** + **modération async** (scan basique).  
- **~100k** : service messages dédié ou vendor si besoin SLA.

### Modération & sécurité
- **V1** : outil admin interne + logs.  
- **~10k** : **file d’attente** signalements, règles auto (ban email domain, velocity signup), **device fingerprint** léger (privacy).  
- **~100k** : tooling type **case management**, intégrations légales, équipe rotative.

### Multi-ville
- **Modèle** : `city_id` ou `region` sur toutes entités sociales ; **feature flags** par ville.  
- **~10k** : éviter “une seule config globale” pour règles (ex. événements activés seulement ville X).

### Paiements / événements
- **V2+** : Stripe Connect ou modèle billet — anticiper **KYC**, **refunds**, **fraude**.

---

## 3) Limites du **système actuel** (spec MVP type Next + Supabase)

| Limite | Symptôme |
|--------|----------|
| Monolith Next + API routes | goulot si **tout** passe par un seul deploy sans cache |
| RLS complexe | bugs **fuite de données** si règles mal testées |
| Supabase Realtime | quotas, coût, **backpressure** si rooms nombreuses |
| Pas de file d’jobs | envois email/SMS/notifs **bloquent** requêtes |
| Pas de CDN / image pipeline | photos lentes, coûts storage |
| Pas de search dédié | discover devient **lent** sans index/geo service |

---

## 4) Évolutions **nécessaires** (roadmap technique produit)

### Avant 1k (qualité > scope)
- Tests **E2E** sur flux repas + RLS ; **feature flags** ; métriques tables/show-up.  
- Pipeline images (resize, WebP).  
- Rate limiting endpoints sensibles.

### Avant 10k
- **Queues** (notifications, modération, emails) — ex. Supabase Edge + queue externe ou Inngest/QStash.  
- **Admin modération** minimal viable.  
- **PostGIS** ou cache geo.  
- Runbooks incident (voir `PROMPT_LIBRARY_EXTENDED`).

### Avant 100k
- Équipe **Trust** + **SRE** ; **observabilité** complète (logs, traces, métriques).  
- Éventuelle **extraction** du service messaging ou matching si mesuré en hotspot.  
- **Multi-région** ou au minimum **backup/DR** testé.

---

## 5) Évolutions **produit** (éviter la casse “expérience”)

- **Geler** la promesse : “repas réel, cadre clair” — ne pas empiler 20 features.  
- **Séparer** clairement : duo / ouvert / événements (navigation + règles).  
- **Instrumentation** : entonnoir inscription → 1er repas complété (le vrai “activation”).  
- **Politique ville** : ouverture contrôlée avec **seuil** de liquidité avant marketing massif.

---

## 6) Indicateurs “early warning” (avant la casse)

- Show-up **< 65%** sur 2 semaines  
- Temps médian **1er repas** qui augmente  
- Signalements / repas complété qui **explose**  
- Latence p95 discover > **800ms**  
- Coût infra / repas complété qui **grimpe** sans revenu

---

## 7) Documents liés

- `PRODUCT_SPEC.md` — fondations  
- `LAUNCH_PLAYBOOK.md` — densité locale  
- `RESTAURANT_PARTNERSHIPS.md` — B2B  
- `PROMPT_LIBRARY_EXTENDED.md` — SRE, perf, sécurité

---

*v0 — chiffrer les seuils exacts après 8 semaines de données réelles par ville pilote.*
