# Compatibility

Supported on macOS arm64:

- Codex Desktop 26.908.40834, build 8881.
- Codex Desktop 26.915.31945, build 9922.
- Codex Desktop 26.917.62051, build 10789 (automated validation and live Phase 1–3 acceptance complete).

Nothing else is claimed. The CLI selects the manifest by the source app's exact version and build, or accepts an explicit manifest. Each manifest selects a separate transform profile; no old preimage is reused against a new build.

Robust gates include platform/architecture, version/build, whole ASAR, Info.plist, executable, target-entry SHA-256 hashes, and exact occurrence counts. Fragile/update-sensitive elements include hashed asset filenames, minified local identifiers, and narrow syntax anchors. Because all apply only after exact source hashes match, drift produces refusal rather than a partial patch.

The manifest stores hashes and short structural selectors, not extracted vendor bundles. Builds 9922 and 10789 each renamed every target bundle and compiled local symbol. Build 10789 also moved the overlay notification boolean used by strict-idle gating. Each therefore has a dedicated profile while preserving the same runtime semantics. A new Codex version needs independent diagnosis, transform review, a new manifest/profile, and full regression tests. See [adding a version](development/adding-a-version.md).
