# CI Workflow Cookbook

Guide rapide pour ajouter un nouveau job CI sans casser les conventions du repo.

## 1) Structure minimale d’un job

- Checkout + setup Node 20 + `npm ci`
- Exécution de la commande principale
- Upload artefacts en échec (`if: failure()`)
- Résumé standardisé (`if: always()`) via `scripts/ci/write-gate-summary.sh`

Exemple:

```yaml
my-job:
  runs-on: ubuntu-latest
  timeout-minutes: 20
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: npm
    - name: Install
      run: npm ci
    - name: Run gate
      run: npm run my:gate
    - name: Upload report on failure
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: my-gate-report
        path: |
          playwright-report
          test-results
        if-no-files-found: ignore
    - name: Gate summary
      if: always()
      run: >
        bash scripts/ci/write-gate-summary.sh
        "My gate"
        "npm run my:gate"
        "scope description"
        "my-gate-report"
```

## 2) Règles de nommage

- Job id: court et explicite (ex: `mobile-consistency`, `beta-seo`)
- Artefact: `playwright-<job>-report` si Playwright
- Titre résumé: `"<Nom> gate"`

## 3) Variables d’environnement

- Ne mettre que les variables nécessaires au job.
- Préférer des placeholders CI explicites pour les builds (`NEXT_PUBLIC_SITE_URL`, Supabase URL/anon key).
- Éviter les duplications: utiliser les scripts du repo (`build:beta`, `test:e2e:beta-seo`, etc.).

## 4) Anti-régression

- Lancer `workflow-lint` dans le pipeline principal.
- Le garde-fou `ci-governance` exige docs CI alignées si un workflow est modifié.
- Vérifier localement les scripts partagés (`npm run test:scripts`).
- Pré-check local cross-platform: `npm run checks:ci-governance`.
- Le pré-check local couvre aussi les changements non commités (staged/unstaged/untracked).
- Simulation PR contre branche cible: `npm run checks:ci-governance:main`, `npm run checks:ci-governance:master`, ou `--base <branche>`.
- Auto-détection de branche distante par défaut: `npm run checks:ci-governance:default`.
- Si un job écrit un résumé, passer obligatoirement par `scripts/ci/write-gate-summary.sh`.
- La logique du garde-fou est centralisée dans `scripts/ci/enforce-ci-governance.sh` (éviter les blocs inline longs dans les workflows).

## 5) Checklist avant merge

- Pour un push rapide après review locale : `npm run ship -- "type: description"` (voir `scripts/ship.mjs` et `docs/DEPLOIEMENT_VERCEL.md`).

- Le job a un timeout explicite.
- Les artefacts d’échec sont configurés.
- Le résumé `GITHUB_STEP_SUMMARY` est présent et standardisé.
- Le `runbook` est mis à jour si comportement opérationnel nouveau.
