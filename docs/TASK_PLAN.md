# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Calm Ledger V5: replace the text-heavy management shell with a scene-first Pixel V2 interface inspired by the restraint of a martial-arts chronicle, without copying another game's layout.

## Scope

- Changed `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, and the browser contracts that exercised the old drawer hierarchy.
- Preserved gameplay actions, rewards, combat formulas, economy, story data, save contracts, manifest keys, and assets.
- Kept the existing E11 combat-art work intact and verified it with the same full visual suite.

## Current Result

- The default scene now contains only a compact day/resource HUD, location seal, one-line daily intent, one immediate action, and a closed `策` drawer.
- Four 40px Pixel V2 navigation icons and one system-roll button share a single horizontal dock; labels remain accessible but are not persistent screen text.
- The `策` drawer shows at most three local actions. Remaining actions, rumours, travel, and location lore are opt-in.
- Closed system/task drawers no longer expose invisible lazy-loaded images or click layers.
- Character art is lifted above the mobile and desktop decision docks, so feet are not hidden by UI.
- Profile, skills, and bag are focused ledgers over the world. Profile depth, skill tree/catalogue, and inventory depth are closed by default.
- The HUD shows icon plus current value; full resource ratios remain available through native titles.
- All controls retain hard Pixel V2 bitmap frames, square geometry, and 44px-or-larger mobile targets.

## Validation

- `npm run check:full`: passed; build, 164-entry asset verification, and 6 Chromium smoke tests passed.
- `npm run test:playtest`: 4 passed.
- `npm run test:day1-9`: 4 passed.
- V5 targeted browser contracts: 8 passed.
- Full `pixel_v2_visual.spec.js`: 84 passed.
- Desktop, tablet, mobile, action drawer, profile, skills, and bag screenshots were manually reviewed.
- `git diff --check`: passed.

## Risks

- `ui.css` still contains archived V1-V4 compatibility layers. V5 owns the final cascade, but a later cleanup should remove superseded blocks only with screenshot parity.
- Deep ledgers remain information-dense after the player explicitly opens them; this is intentional progressive disclosure, not permanent scene clutter.
- `outputs/` is local screenshot evidence and must not be committed.
- E11 assets/runtime changes are still part of the current uncommitted worktree and should be committed separately from V5 if history separation is required.

## Next Step

1. Run a five-minute no-explanation playtest and record whether players find `策` and `录` without prompting.
2. If discoverability is weak, add a one-time pulse or tooltip; do not restore permanent labels.
3. Commit V5 UI and E11 combat presentation as separate commits after reviewing the final diff.
