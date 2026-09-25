#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
APP="${1:-local/apps/Codex-Pet-Runtime-Toolkit.app}"
PROFILE="${CODEX_PET_TOOLKIT_PROFILE:-$PWD/local/profile}"
mkdir -p "$PROFILE"
exec open -na "$APP" --args --user-data-dir="$PROFILE"
