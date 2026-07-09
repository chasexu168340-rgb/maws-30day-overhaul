# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Day 1-9 retro-pixel vertical slice: complete the Day 8 measurement and Day 9 diary/training handoff.

## Scope

- Day 8 is a three-window measurement, not a KO requirement or humiliation scene.
- Day 9 is a paged emotional pause that leads clearly to boxing bag training.
- Preserve E10 stats, starter skills, economy, save key/version, and global combat formulas.
- Keep screenshots under `outputs/` untracked.

## Current Result

- Day 8 now exposes three visible goals: read one tell, use guard/retreat, and complete one effective tactical recipe.
- The first-wind script runs for three windows unless combat ends naturally; it no longer force-finishes after one window.
- Mainline belief/misread effects now land after the measurement rather than when the battle starts.
- Day 8 has three non-humiliating result tiers: `被量出差距`, `稳住了`, and `让对方重新估量`.
- Measurement results are recorded as `measure_*` memories and do not inflate ordinary wins or losses.
- The compact Day 8 objective strip sits in the upper stage safe area and does not cover the command dock.
- Day 9 diary now presents one page at a time, with previous/next navigation and the full diary kept behind disclosure.
- The final diary page opens a real route to the boxing gym; completing `沙包连击` unlocks jab, straight, and the boxing one-two recipe source.
- Added `npm run test:day1-9` with Day 8 objective/tier coverage, Day 9 diary-to-training coverage, mobile overflow, screenshot pixel sampling, and save-safe state checks.

## Validation

- Passed:
  - `npm run check:full` (build, asset verification, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` (9 passed)
- Visual artifacts:
  - `outputs/day8-combat-desktop.png`
  - `outputs/day8-combat-mobile.png`
  - `outputs/day9-diary-desktop.png`
  - `outputs/day9-diary-mobile.png`

## Risks

- Day 1-9 final art is still legacy/fallback; the strict final-art gate must remain red until reviewed files exist under `assets/pixel_v2/`.
- Mobile battle standees render but their feet sit too high against the current background perspective.
- Combat FX metadata exists, but Phaser still needs to consume recipe hit-stop, shake, and palette flash.
- Screenshot coverage currently targets Day 8/9 for this batch; the final release gate still needs desktop/mobile shots for Day 1, 2, 3, and 5.

## Next Step

Commit and push this batch, then generate and integrate the first Day 1-9 `pixel_v2` art set in the current Codex session.
