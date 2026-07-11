# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace dialogue, event, duration, result, NPC, and diary information walls with compact pixel overlays that preserve the scene and expose only the current beat.

## Scope

- Preserved all modal actions, dialogue progression, rewards, durations, combat formulas, economy, story, and save contracts.
- Limited implementation ownership to modal DOM presentation, CSS, and Pixel V2 visual contracts.
- Used external games only as clean-room hierarchy/cadence references; no protected code, layouts, or assets were extracted or copied.

## Current Result

- Dialogue is now a bottom subtitle stage with one portrait, one speaker name, one current line, and one advance/choice layer; desktop/mobile preserve at least half the scene.
- Dialogue, story, and event choices now use the actual choice label as the button instead of a separate text card plus generic `选择/确认` button.
- NPC interaction menus sit above the scene decision dock, enclose all three actions, and keep the background characters visible.
- Duration choices are a four-column desktop schedule strip and two-column mobile grid with immediate time/cost/gain comparison; no reward appears before commitment.
- Settlement results use up to five immediate 96-112px structured reward blocks with explicit skill/relation/cost borders and no delayed animation ambiguity.
- Result surfaces expose at most three immediate follow-up actions; remaining utility actions live inside the closed detailed settlement.
- Father diary focuses exactly one readable page, keeps full history closed, and stays below 68% desktop / 62% mobile viewport height.
- Click VFX remains in runtime but visual baselines wait for it to finish so screenshots are stable and button labels remain readable.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (156 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (69 tests).
- Day 1/Day 4 dialogue, NPC menu, duration, settlement result, and diary desktop/mobile screenshots were reviewed.
- `git diff --check`: passed.

## Risks

- The stylesheet still contains historical override layers; V2 is isolated at the end until screenshot parity supports deleting superseded rules.
- Event-notebook choice styling shares the V2 contract but still lacks a dedicated screenshot fixture.
- The post-Day9 roster still contains generic presentation fallbacks outside the specially mapped enemies.

## Next Step

1. Add a dedicated event-notebook visual fixture and verify 2-3 consequential choices without exposing its full beat list.
2. Replace the next high-frequency enemy fallback, likely E02 push-hands or E04 brawler, without changing combat formulas.
3. Audit Day1-9 text length against the new dialogue/choice limits, then tighten only lines that still wrap badly.
