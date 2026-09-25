# Generic V2 debug pet

This fixture is generated deterministically by `scripts/generate-debug-fixture.mjs`. It uses only geometric shapes and labels-by-colour: eleven 192×208 rows, eight columns, and explicit indicators for all sixteen V2 gaze directions. The separate eight-frame sleep strip provides visible vertical motion and a moving `Z` marker.

It exists for contract and regression testing, not as a polished pet. Regenerate it with `npm run fixture:generate`, then verify it with `npm run fixture:verify`.
