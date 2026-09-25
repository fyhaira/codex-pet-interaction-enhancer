# Known limitations and troubleshooting

## Unsupported version

Refusal is expected when any hash or structural gate differs. Do not edit the manifest to match without a version-port investigation.

## Copied app will not launch

Run `node src/cli/verify.mjs local/apps/Codex-Pet-Runtime-Toolkit.app`. Check ASAR integrity, deep signature output, macOS quarantine/trust prompts, and that no previous process still owns the isolated profile.

## Sleep does not appear

Confirm the runtime pet ID resolves to the canonical capability ID, the asset passes size/dimension validation, sleep is enabled, and the pet is strict idle without unread `review`, `waiting`, `failed`, or `running` state. Relaunch after configuration changes.

## Mixed-display drag instability

The issue reproduced with a built-in pet in unmodified Codex, and toolkit/primary drag code was byte-identical during diagnosis. All 13 instrumented native handoffs returned `started=true`; the clearest failure occurred later. AppKit tracking, mouse-up completion, cursor/window anchor reconciliation, and display coordinate conversion remain candidate layers. On one tested Mac, the built-in display appeared stable and the extended large display exhibited the glitch, strengthening a mixed-scale/coordinate hypothesis. This is an observation, not a platform-wide guarantee. No toolkit workaround is shipped.
