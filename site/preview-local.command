#!/bin/bash
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")" && pwd)"

cd "$SITE_ROOT"

npm run safety:preflight
npm run build
python3 "$SITE_ROOT/scripts/preview_local.py"
