# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Day 1-9 retro-pixel vertical slice: establish the `pixel_v2` production bible, generate the approved visual reference in the current Codex session, and integrate the first reviewed runtime art batch.

## Scope

- Art generation happens in the current Codex session; CLI workers do not generate images.
- Use `assets/pixel_v2/` and preserve existing manifest keys.
- Keep legacy/fallback assets available for rollback and never relabel them as final.
- Reference Bruisers only for preparation, distance, and consequence principles; copy no assets or implementation.
- Preserve starter skills, economy, save key/version, and global combat formulas.
- Keep screenshots and generation review artifacts under `outputs/` untracked.

## Current Result

- Runtime pixel rendering and manifest metadata contracts are already active.
- Tactical recipes, recipe FX metadata, Day 8 measurement, and Day 9 diary-to-training handoff are implemented and pushed.
- Added `docs/design/PIXEL_V2_STYLE_BIBLE.md` with the canonical palette, character anchors, environment direction, sizes, Day 1-9 asset list, generation order, and rejection gate.
- No legacy/fallback runtime asset has been marked final.

## Validation

- Previous runtime gate passed: `npm run check:full`, `npm run test:playtest`, `npm run test:day1-9`, and Wave 15 smoke.
- This documentation-only checkpoint requires `git diff --check`; runtime gates run after the first asset integration.

## Risks

- Day 1-9 final art is still legacy/fallback; the strict final-art gate must remain red until reviewed files exist under `assets/pixel_v2/`.
- Mobile battle standees render but their feet sit too high against the current background perspective.
- Combat FX metadata exists, but Phaser still needs to consume recipe hit-stop, shake, and palette flash.
- Image generation may require cleanup/downsampling before an output is suitable for a runtime key.
- The final release gate still needs desktop/mobile shots for Day 1, 2, 3, and 5.

## Next Step

Generate the art-direction keyframe in the current session, review it against the bible, then produce and integrate the rental-room plus Lu Xiaoxian reference batch.
