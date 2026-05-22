# AGENT_G_SCENE_STAGE_SCALE

## Result

Implemented the scene-stage scale pass for the map page.

## What Changed

- Scaled player and NPC standees against the scene height instead of viewport-only sizing.
- Bottom-aligned the cast layer and added contact shadows so characters read as grounded.
- Replaced the old hard player color-block backplate with softer rim light, outline, and shadow treatment.
- Made scene characters keyboard/click accessible through existing `data-action` dispatch.
- Added mobile compression rules: player remains primary, extra characters are reduced or hidden on narrow screens.

## Files Modified

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/scene_stage_scale.md`
- `docs/agent_reports/AGENT_G_SCENE_STAGE_SCALE.md`

## Validation

- Passed: `npm run check:full`
- Passed: `git diff --check`

## Notes

- No data, state, combat, manifest, asset, package, or skill files were modified.
- No new image assets were added.
