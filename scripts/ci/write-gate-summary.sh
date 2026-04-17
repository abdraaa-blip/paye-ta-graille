#!/usr/bin/env bash
set -euo pipefail

TITLE="${1:-}"
COMMAND="${2:-}"
SCOPE="${3:-}"
ARTIFACTS="${4:-}"
EXTRA="${5:-}"

if [[ -z "${GITHUB_STEP_SUMMARY:-}" ]]; then
  echo "GITHUB_STEP_SUMMARY is required." >&2
  exit 1
fi

if [[ -z "${TITLE}" || -z "${COMMAND}" || -z "${SCOPE}" || -z "${ARTIFACTS}" ]]; then
  echo "Usage: write-gate-summary.sh <title> <command> <scope> <artifacts> [extra]" >&2
  exit 1
fi

{
  echo "### ${TITLE}"
  echo "- Command: ${COMMAND}"
  echo "- Scope: ${SCOPE}"
  if [[ -n "${GITHUB_EVENT_NAME:-}" ]]; then
    echo "- Trigger: ${GITHUB_EVENT_NAME}"
  fi
  if [[ -n "${GITHUB_REF_NAME:-}" ]]; then
    echo "- Branch: ${GITHUB_REF_NAME}"
  fi
  if [[ -n "${EXTRA}" ]]; then
    echo "- ${EXTRA}"
  fi
  echo "- Failure artifacts: ${ARTIFACTS}"
} >> "${GITHUB_STEP_SUMMARY}"
