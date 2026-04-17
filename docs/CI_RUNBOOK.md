# CI Runbook

Ce runbook décrit la réaction minimale et fiable quand un job CI échoue.

Pour ajouter/modifier un job CI en respectant les conventions, voir aussi `docs/CI_WORKFLOW_COOKBOOK.md`.

## Jobs obligatoires

- `workflow-lint`: validation syntaxe/bonnes pratiques des workflows GitHub Actions.
- `ci-governance`: bloque les PRs qui modifient des workflows CI sans alignement docs/garde-fous.
- `verify`: `npm run verify` (lint, types, `test:scripts`, `assert:tracked-safe`) + preflight + build + Playwright desktop.
- `mobile-consistency`: Playwright mobile (cadrage, continuité fond, stress viewport/orientation).
- `beta-seo`: build en mode bêta publique + tests SEO bêta.
- `nightly-release-gate` (non bloquant PR): exécution planifiée de `npm run verify:release` via `.github/workflows/nightly-release-gate.yml`.
- Chaque job publie aussi un résumé `GITHUB_STEP_SUMMARY` (commande, portée, artefact d’échec).
- Les résumés sont standardisés via `scripts/ci/write-gate-summary.sh` (source unique).

## Pré-check local avant push

```bash
npm run verify
npm run test:e2e:mobile
```

Si tu modifies un workflow CI, ajouter aussi:

```bash
npm run checks:ci-governance
```

Option recommandée (détection branche distante par défaut):

```bash
npm run checks:ci-governance:auto
```

`npm run verify` inclut aussi `npm run test:scripts` (garde-fous des helpers d'orchestration) et `npm run assert:tracked-safe` (aucun secret / `.env*.local` / clé PEM ne doit être suivi par git).

Important:

- Les suites Playwright lisent `PTG_E2E_BASE_URL` (et non `PTG_BASE_URL`).
- `PTG_BASE_URL` reste réservé aux scripts smoke/cron (`smoke:public`, `wait:health`, etc.).
- Si tu dois cibler un serveur déjà lancé: `PTG_PLAYWRIGHT_NO_WEBSERVER=1` + `PTG_E2E_BASE_URL=http://127.0.0.1:<port>`.

Pour simuler le gate complet:

```bash
npm run verify:ship
```

Pour simuler une release complète (desktop + mobile + bêta SEO):

```bash
npm run verify:release
```

## Si `verify` échoue

- Vérifier d'abord `npm run verify` localement.
- Si erreur Playwright desktop:
  - relancer `npm run test:e2e`,
  - ouvrir les artefacts `playwright-verify-report` dans le run GitHub.
- Corriger puis re-push.

## Si `mobile-consistency` échoue

- Reproduire localement: `npm run test:e2e:mobile`.
- Cibles critiques:
  - `object-fit` mobile des illustrations,
  - continuité visuelle `body` / `.ptg-page`,
  - stabilité viewport après scroll et rotation.
- Ouvrir les artefacts `playwright-mobile-report`.

## Si `beta-seo` échoue

- Le script `test:e2e:beta-seo` force la config bêta (`NEXT_PUBLIC_PTG_PUBLIC_BETA=1`) et rebuild avant exécution.
- Reproduire localement:

```bash
npm run test:e2e:beta-seo
```

- Vérifier aussi:
  - `robots.ts` et `sitemap.ts`,
  - metadata noindex sur pages publiques en mode bêta.

## Si `nightly-release-gate` échoue

- Ouvrir le résumé du workflow (section "Nightly release gate") pour confirmer la branche et le trigger.
- Rejouer localement:

```bash
npm run verify:release
```

- Si échec Playwright, récupérer l’artefact `playwright-nightly-release-report`.

## Si `ci-governance` échoue

- Relire le message du job: workflow modifié sans doc alignée, ou workflow sans résumé standard `scripts/ci/write-gate-summary.sh`.
- Pré-valider en local:

```bash
npm run checks:ci-governance:auto
```

- Mettre à jour au besoin: `docs/CI_RUNBOOK.md`, `docs/CI_WORKFLOW_COOKBOOK.md`, `README.md`, `.github/pull_request_template.md`.
- Les workflows exemptés du résumé standard sont listés dans `scripts/ci/enforce-ci-governance.sh` (ex. `ci-governance.yml`).

## Politique de merge

- Ne pas merger si un job requis est rouge.
- Favoriser de petits PRs pour réduire le temps de diagnostic.

## Branch protection

Sur ce dépôt, la branche par défaut est **`master`** (`origin/HEAD` → `origin/master`). Les checks suivants sont typiquement **requis au merge** (à confirmer dans GitHub : Settings → Branches → règle sur `master` / `main`) :

- `workflow-lint`
- `ci-governance`
- `verify`
- `mobile-consistency`
- `beta-seo`

Si tu utilises aussi une branche `main`, réplique la même règle ou fusionne vers une seule branche par défaut pour éviter des merges sans gate.

### GitHub CLI sous Windows

Si `gh` n’est pas reconnu dans PowerShell, utiliser le binaire explicite ou ajouter au `PATH` :

`C:\Program Files\GitHub CLI\`

Exemple : `& "C:\Program Files\GitHub CLI\gh.exe" auth status`

## Troubleshooting rapide

### Symptôme A: beaucoup de `500` d’un coup en Playwright

Cause probable: mauvaise base URL (ou serveur non prêt).

```bash
# Vérifier la variable E2E dédiée
echo $PTG_E2E_BASE_URL

# Vérifier le endpoint santé sur la même base
curl -i "$PTG_E2E_BASE_URL/api/health"
```

Actions:
- si vide, laisser la valeur par défaut (`http://127.0.0.1:4010`);
- si serveur externe, définir `PTG_PLAYWRIGHT_NO_WEBSERVER=1` + `PTG_E2E_BASE_URL` correct.

### Symptôme B: échec "address already in use" / port occupé

```bash
# PowerShell
Get-NetTCPConnection -LocalPort 4010 -State Listen
```

Actions:
- libérer le port, ou
- exécuter avec un port dédié:
  - `PTG_E2E_BASE_URL=http://127.0.0.1:4020 npm run test:e2e`

### Symptôme C: tests verts local mais rouges en CI

```bash
npm run build:clean
npm run test:e2e
npm run test:e2e:mobile
```

Actions:
- repartir d’un build propre (`build:clean`);
- vérifier les artefacts Playwright du job en échec (`playwright-*-report`).

### Symptôme D: `gh` introuvable (branch protection, API)

Voir la section **GitHub CLI sous Windows** plus haut.
