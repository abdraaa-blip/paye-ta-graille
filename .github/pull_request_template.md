## Objective

- [ ] Changement clairement décrit (problème, impact utilisateur, périmètre).

## Validation

- [ ] `npm run verify`
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
- [ ] Si un workflow CI est modifié, documentation alignée (`docs/CI_RUNBOOK.md` et/ou `docs/CI_WORKFLOW_COOKBOOK.md`)

## Risk & Rollback

- [ ] Risques identifiés (fonctionnel, UX, perf, sécurité)
- [ ] Plan rollback court (fichier/feature flag/job concerné)
