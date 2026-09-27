# Compatibility

Supported on macOS arm64:

- Codex Desktop 26.908.40834, build 8881.
- Codex Desktop 26.915.31945, build 9922.
- Codex Desktop 26.917.62051, build 10789 (automated validation and live Phase 1–3 acceptance complete).
- Codex Desktop 26.924.20706, build 11431 (automated validation and private 20/20 live behavioral acceptance complete).

Nothing else is claimed. The CLI selects the manifest by the source app's exact version and build, or accepts an explicit manifest. Each manifest selects a separate transform profile; no old preimage is reused against a new build.

Robust gates include platform/architecture, version/build, whole ASAR, Info.plist, executable, target-entry SHA-256 hashes, and exact occurrence counts. Fragile/update-sensitive elements include hashed asset filenames, minified local identifiers, and narrow syntax anchors. Because all apply only after exact source hashes match, drift produces refusal rather than a partial patch.

The manifest stores hashes and short structural selectors, not extracted vendor bundles. Builds 9922, 10789, and 11431 each renamed target bundles or compiled local symbols. Build 10789 moved the overlay notification boolean used by strict-idle gating; build 11431 retained the semantic layers but moved their compiled anchors again. Each therefore has a dedicated profile while preserving the same runtime semantics. A new Codex version needs independent diagnosis, transform review, a new manifest/profile, and full regression tests. See [adding a version](development/adding-a-version.md).

## ASAR integrity

The full-file SHA-256 of `app.asar` is an artifact/reproducibility hash. Electron's `ElectronAsarIntegrity` field instead contains the SHA-256 of the raw ASAR header returned by `getRawHeader(appAsarPath).headerString`; these values are deliberately computed and recorded separately. Build 11431 also uses Electron 41+ embedded framework integrity data. The build pipeline locates that data structurally, updates it for the staged archive, and verifies it before signing and promotion. Older builds remain on their manifest-specific path when no embedded digest is active.
