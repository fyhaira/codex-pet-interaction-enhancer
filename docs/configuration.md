# Configuration

`config/toolkit.production.json` is the single production entry point. `config/toolkit.qa.json` differs only in the generic fixture's sleep timeout.

- `pointerGaze.enabled`: enable the physical bridge.
- `hoverPriority`: `gaze` or `jumping`.
- `enterRadiusPx`, `exitHysteresisPx`, `sectorHysteresisDegrees`: accepted gaze controls.
- `durableStates.states`: must remain exactly `running`, `review` in this release.
- `sleep.enabled`: global optional layer.
- `petCapabilities.<canonical-id>.sleep`: opt-in asset and timing.

Runtime IDs beginning with exactly `custom:` resolve to the canonical package ID; built-in IDs remain unchanged. Malformed or unknown IDs cannot select another pet's capability.

Production inactivity is 180000 ms. The QA file uses 8000 ms. Values 120000, 180000, 300000, and 600000 ms are covered by tests. Change the one `inactivityMs` value, rebuild, and relaunch; no artwork or runtime source change is required.

Sleep assets must be relative PNG paths under repository `fixtures/` or ignored `local/`, use 192×208 cells in an eight-column 1536×208 strip, and be at most 5 MiB. Invalid/missing assets produce a warning and ordinary idle.
