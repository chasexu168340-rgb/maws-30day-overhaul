# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Day 1-9 retro-pixel vertical slice: data-driven tactical recipes and readable combat feedback.

## Scope

- Keep manual 1-2 action queues; recipe controls may fill a queue but never confirm it.
- Preserve starter skills, E01 strength, economy, save key/version, and existing combat damage formulas.
- Use Bruisers only as a loop/consequence reference; do not copy packaged assets, code, text, audio, characters, or UI.
- Keep generated screenshots under `outputs/` untracked.

## Current Result

- Added five data-driven `COMBAT_RECIPES`: wild pressure, guard counter, cool exit, pull and tag, and Day 9 boxing one-two.
- New saves equip two starter recipe shortcuts; old saves migrate to the same two-slot loadout and initialize `combatMemory.recipeFirsts`.
- Added backward-compatible `combat.activeRecipeId`, `combat.recipeProgress`, and `combatMemory.recipeFirsts` state.
- Recipe buttons fill the current two-action queue and leave the final confirm action to the player.
- First completion grants one Insight once; repeating the recipe cannot farm Insight.
- Every combat FX now exposes impact tier, VFX key, hit-stop, shake, palette flash, and optional recipe metadata.
- The combat command bar shows two compact black/red/gold recipe commands plus four common action cards; remaining actions stay in the tactical drawer.
- Added a concise Bruisers reference document that maps career consequence density to MAWS without changing MAWS into a direct-control boxing game.
- Desktop and delayed mobile screenshots confirm the combat stage remains visible; mobile character foot anchoring remains a later visual-art issue.

## Validation

- Passed:
  - `npm run check:full` (build, asset verification, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` (9 passed)
  - `node maws_src/tools/sim_day5_park_check.mjs` (worker/fan/student all 4/4 objective pass)
  - `git diff --check`
- Visual audit artifacts:
  - `outputs/combat-recipes-desktop-v2.png`
  - `outputs/combat-recipes-mobile-delayed.png`

## Risks

- Final Day 1-9 art is still legacy/fallback; `verify_assets.mjs --require-final-day1-9` must continue to fail until real `assets/pixel_v2/` replacements exist.
- Combat recipe VFX metadata is ready, but Phaser still needs to consume hit-stop, shake, and palette-flash values visually.
- Mobile battle standees load correctly after the Phaser first frame, but their feet sit too high against the current background perspective.
- Runtime bundle metadata exists, but lazy bundle loading is not yet enabled.

## Next Step

Commit and push this recipe batch, then implement Day 8 three-tier measurement and Day 9 diary/training routing before generating final pixel art.
