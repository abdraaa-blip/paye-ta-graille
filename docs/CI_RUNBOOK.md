# CI Runbook

Ce runbook décrit la réaction minimale et fiable quand un job CI échoue.

## Jobs obligatoires

- `workflow-lint`: validation syntaxe/bonnes pratiques des workflows GitHub Actions.
- `verify`: lint + typecheck + build + Playwright desktop.
- `mobile-consistency`: Playwright mobile (cadrage, continuité fond, stress viewport/orientation).
- `beta-seo`: build en mode bêta publique + tests SEO bêta.

## Pré-check local avant push

```bash
npm run verify
npm run test:e2e:mobile
```

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

- Vérifier la config bêta: `NEXT_PUBLIC_PTG_PUBLIC_BETA=1`.
- Reproduire localement:

```bash
npm run test:e2e:beta-seo
```

- Vérifier aussi:
  - `robots.ts` et `sitemap.ts`,
  - metadata noindex sur pages publiques en mode bêta.

## Politique de merge

- Ne pas merger si un job requis est rouge.
- Favoriser de petits PRs pour réduire le temps de diagnostic.

## Branch protection (recommandé)

Configurer GitHub branch protection sur `main`/`master` avec checks requis:

- `workflow-lint`
- `verify`
- `mobile-consistency`
- `beta-seo`

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
