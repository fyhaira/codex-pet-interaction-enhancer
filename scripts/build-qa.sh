#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
exec node src/cli/build.mjs --config config/toolkit.qa.json "$@"
