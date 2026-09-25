# Repository preparation record

Prepared as a clean developer-preview candidate from an accepted private runtime baseline. Selection was manual; no private directory was copied wholesale.

## Verification

- 35 tests pass in the public suite; three source-app integration checks skip when their exact supported source build is unavailable.
- Fixture: 1536×2288 V2 atlas and 1536×208 optional sleep strip validated.
- Configuration: production 180 seconds, QA 8 seconds, and 120/180/300/600-second data-only variants validated.
- Public-file allowlist: 80 intended files, including independent manifests and feature-local transform profiles for builds 8881, 9922, and 10789.
- Leakage audit: passed for private paths/identifiers, personal email, common secret forms, app bundles, ASARs, raw logs, unexpected binaries, and files over 5 MiB.
- Transform equivalence: durable and sleep outputs byte-identical to accepted transforms for identical inputs; pointer-gaze behaviour equivalent through deterministic coverage.

## Deliberate exclusions

Copied or patched applications, executables, raw vendor bundles, profiles, checkpoints, rollback apps, raw traces, screenshots, machine evidence, private creative history, private pet assets/config, caches, and credentials are absent. Local integration artifacts belong only in ignored `local/`.

## Initial publication decision

The initial Developer Preview commit was published under Apache-2.0. A later normal commit moved current and future versions to the project's Personal Use License without rewriting that history. See [licensing](../legal/licensing.md). The vendor-derived selector inventory remains available for review. Security reports use GitHub's private reporting mechanism; no private email address is published.
