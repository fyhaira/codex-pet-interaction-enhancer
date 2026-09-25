# Runtime capability decisions

## Pointer gaze bridges an existing selector

Codex V2 already maps a target point to sixteen poses in rows 9–10. The missing layer was a physical cursor signal. The toolkit samples the main-process screen cursor, computes the pet visual centre, then sends the same renderer message used by the existing selector. It does not recreate direction frames. Computer Use/caret targets remain authoritative. Gaze remains active through hover because a hard-coded jump would otherwise interrupt gaze exactly near the pet; the previous priority remains available through `--codex-pet-gaze-hover-jumps`.

## Persistence belongs in the animation planner

The renderer previously appended an idle tail after three cycles even when semantic `running` or unread `review` remained active. The atlas and semantic owner were correct; the planner was not. The toolkit therefore loops only the closed allowlist `running`, `review`. `jumping`, `waving`, drag directions, `failed`, and `waiting` stay bounded. Review ends through Codex's existing unread acknowledgement lifecycle, never an invented window-click rule.

## Sleep is a presentation over strict idle

Sleep is not a standard V1/V2 semantic row. The toolkit does not hijack one. A pet opts in with a separate horizontal sleep strip and capability entry. Strict idle plus meaningful inactivity starts sleep. Passive proximity, hover, gaze, pointer movement, caret movement, and focus are ignored. Direct pet pointer-down, drag, or semantic work wakes immediately. Pets without a valid capability are unchanged.

## One toolkit, three modules

The features share a compatibility gate, transactional patch pipeline, renderer context, integrity checks, and rollback model, so separate extensions would duplicate the riskiest machinery. Feature transforms remain independent under `src/features/`. A future Codex Skill should orchestrate diagnosis, installation, verification, and rollback—not contain another copy of patch logic.

## Diagnose the owning layer

The project changes the smallest layer supported by evidence. This is why gaze bridges an existing selector, persistence edits the planner, sleep overlays idle, and the mixed-display drag issue remains documented rather than receiving a speculative workaround.
