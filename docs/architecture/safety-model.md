# Safety model

The installed source app is read-only. Output is restricted to `local/apps/`, staging to `local/staging/`, and recoverable previous builds to `local/rollback/`. The build order is compatibility verification → disposable copy → transforms → ASAR integrity update → local ad-hoc signing → tests → atomic promotion. Failure deletes staging and leaves the previous experimental build in place.

Ad-hoc signing replaces the copied app's signature and is not Apple notarization. macOS may display trust or quarantine prompts depending on how the source and repository arrived. App updates invalidate the compatibility target; obtain and review a new manifest rather than bypassing the check.

The toolkit never needs global keyboard monitoring. Physical cursor position uses the existing application process; sleep wake events are local pet events or existing semantic state.
