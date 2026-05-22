# Scene Stage Scale Worker

## Task

Wave 9 scene stage scale: make map-page characters read as people standing in the current scene, not small cards pasted on top of the background.

## Changed Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/scene_stage_scale.md`
- `docs/agent_reports/AGENT_G_SCENE_STAGE_SCALE.md`

## Implementation Notes

- Scene characters now receive existing `data-action` attributes directly on the figure.
- NPC/enemy characters trigger a matching current location action when one exists; otherwise they use the existing toast action.
- The stage cast layer is full-height and bottom-aligned so feet sit on the scene ground.
- Desktop player height targets roughly two-thirds of scene height; NPC standees target roughly half.
- Removed the visual impact of the old hard red/yellow/gray player backplate by overriding it with soft contact shadow, rim light, and image outline shadows.
- Mobile keeps the player dominant, shows at most one supporting character at tablet/mobile widths, and hides supporting characters on narrow phones.

## Validation

Completed before handoff:

- `npm run check:full`: passed
- `git diff --check`: passed

## Risks

- Character action matching is intentionally limited to current render-model actions and does not introduce new state or dialogue flow.
- Final visual fit depends on the aspect ratio of existing standee assets because this task was not allowed to change images or manifest entries.
