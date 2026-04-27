#!/usr/bin/env bash

set -euo pipefail

DEPLOY_PATH="${1:-}"
DEPLOY_BRANCH="${2:-main}"

if [[ -z "$DEPLOY_PATH" ]]; then
  echo "Usage: $0 <deploy_path> [branch]"
  exit 1
fi

if [[ ! -d "$DEPLOY_PATH/.git" ]]; then
  echo "Directory is not a git repository: $DEPLOY_PATH"
  exit 1
fi

cd "$DEPLOY_PATH"

echo "Deploy path: $DEPLOY_PATH"
echo "Deploy branch: $DEPLOY_BRANCH"

git fetch origin "$DEPLOY_BRANCH"
git checkout "$DEPLOY_BRANCH"
git pull --ff-only origin "$DEPLOY_BRANCH"

docker compose up -d --build --remove-orphans

echo "Deploy complete."
