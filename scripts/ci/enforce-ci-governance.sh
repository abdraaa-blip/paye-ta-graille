#!/usr/bin/env bash
set -euo pipefail

EVENT_NAME="${1:-}"
BASE_REF_INPUT="${2:-}"

if [[ -z "${EVENT_NAME}" ]]; then
  echo "Usage: enforce-ci-governance.sh <event_name> [base_ref]" >&2
  exit 1
fi

if [[ "${EVENT_NAME}" == "pull_request" ]]; then
  if [[ -z "${BASE_REF_INPUT}" ]]; then
    echo "For pull_request events, base_ref is required." >&2
    exit 1
  fi
  BASE_REF="origin/${BASE_REF_INPUT}"
  git fetch --no-tags --depth=1 origin "${BASE_REF_INPUT}"
  CHANGED_FILES="$(git diff --name-only "${BASE_REF}"...HEAD)"
else
  CHANGED_FILES="$(git diff --name-only HEAD~1...HEAD || true)"
fi

CHANGED_WORKFLOWS="$(printf '%s\n' "${CHANGED_FILES}" | rg '^\.github/workflows/.*\.yml$' || true)"

if [[ -z "${CHANGED_WORKFLOWS}" ]]; then
  echo "No workflow changes detected."
  exit 0
fi

echo "Changed workflows:"
printf '%s\n' "${CHANGED_WORKFLOWS}"

DOCS_TOUCHED="$(printf '%s\n' "${CHANGED_FILES}" | rg '^(docs/CI_RUNBOOK\.md|docs/CI_WORKFLOW_COOKBOOK\.md|docs/DEPLOIEMENT_VERCEL\.md|README\.md|\.github/pull_request_template\.md)$' || true)"
if [[ -z "${DOCS_TOUCHED}" ]]; then
    echo "Workflow changes require governance docs alignment (CI runbook, cookbook, DEPLOIEMENT_VERCEL, README, PR template)." >&2
  exit 1
fi

while IFS= read -r workflow; do
  [[ -z "${workflow}" ]] && continue
  case "${workflow}" in
    ".github/workflows/ci-governance.yml"|".github/workflows/workflow-lint.yml")
      continue
      ;;
  esac

  if ! rg -q 'scripts/ci/write-gate-summary\.sh' "${workflow}"; then
    echo "Workflow ${workflow} must include standardized gate summary via scripts/ci/write-gate-summary.sh" >&2
    exit 1
  fi
done <<< "${CHANGED_WORKFLOWS}"

echo "CI governance checks passed."
