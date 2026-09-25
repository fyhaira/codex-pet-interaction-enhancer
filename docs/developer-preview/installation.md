# Developer-preview installation

1. Confirm the installed source is one of the listed version/build pairs on macOS arm64. The CLI selects its exact manifest automatically and refuses unknown builds.
2. Run `npm run check`.
3. Run `npm run build:production`. The CLI verifies `/Applications/ChatGPT.app` by default; override with `--source` only for another user-owned source path.
4. Launch `./scripts/launch.sh`. It uses an ignored isolated profile under `local/profile`.

The CLI refuses output outside `local/apps/`. It does not modify the source app. This flow requires local `codesign`; it is not notarized distribution. For an eight-second lifecycle check, build with `npm run build:qa`.
