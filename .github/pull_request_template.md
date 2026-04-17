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

## Risk & Rollback

- [ ] Risques identifiés (fonctionnel, UX, perf, sécurité)
- [ ] Plan rollback court (fichier/feature flag/job concerné)
