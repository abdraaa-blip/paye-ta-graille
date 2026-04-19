## Objective

- [ ] Changement clairement décrit (problème, impact utilisateur, périmètre).

## Validation

- [ ] `npm run verify`
- [ ] Optionnel avant push : `npm run ship:dry` (pré-vol `verify` + governance si workflows modifiés, sans commit/push — voir `docs/DEPLOIEMENT_VERCEL.md`)
- [ ] `npm run test:e2e:mobile` (obligatoire si UI/CSS/layout/hero/background/mobile)
- [ ] `npm run test:e2e` (si parcours desktop ou routes publiques touchées)
- [ ] Captures ou notes de preuve ajoutées si comportement visuel modifié

## Mobile-Critical Checklist

- [ ] Pas de régression portrait (`<= 640px`) sur cadrage illustration
- [ ] Continuité visuelle fond -> footer préservée
- [ ] Pas de saut visuel après scroll (viewport dynamique)
- [ ] Rotation portrait/paysage vérifiée si shell/hero modifié

## CI / Governance Checklist

- [ ] Si un workflow CI est modifié, `workflow-lint` est vert et les artefacts d’échec sont conservés
- [ ] Si un workflow CI est modifié, le résumé standard via `scripts/ci/write-gate-summary.sh` est conservé/ajouté
- [ ] Si un workflow CI est modifié, documentation alignée (`docs/CI_RUNBOOK.md`, `docs/CI_WORKFLOW_COOKBOOK.md`, et/ou `docs/DEPLOIEMENT_VERCEL.md` si déploiement)
- [ ] Si **`meal-reminders-cron`** est modifié : secrets **`CRON_MEAL_REMINDERS_BASE_URL`** + **`CRON_SECRET`** (Actions) cohérents avec la prod ; permissions **`actions: write`** conservées si l’artefact d’échec reste activé

## Risk & Rollback

- [ ] Risques identifiés (fonctionnel, UX, perf, sécurité)
- [ ] Plan rollback court (fichier/feature flag/job concerné)
