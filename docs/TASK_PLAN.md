# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Rebuild the main DOM interface around a restrained, scene-first hierarchy so the player no longer reads a wall of equally weighted text.

## Scope

- Changed DOM presentation, responsive layout, navigation grouping, action-card density, and matching browser contracts.
- Preserved Phaser scenes, combat formulas, economy, story data, save keys, and runtime asset structure.
- Reused the existing Pixel V2 bitmap frames, buttons, tabs, icons, and item art rather than replacing them with vector/web styling.

## Current Result

- The HUD is a compact upper-left strip containing day, time, location, and four core resources.
- The persistent navigation now exposes five high-frequency destinations; shop, log, sleep, save, and debug tools live in one explicit system menu.
- The scene keeps at most two immediate commands and a single `more` drawer for local actions, opportunities, locations, and long descriptions.
- Local actions now read as icon-first rows with one short cost/reward line; full prose and numbers stay behind `details`.
- Management pages use 60px Pixel V2 item art and compact index rows with restrained 12px titles.
- Mobile keeps two immediate actions, 44px controls, a full-width bottom navigation, and a menu that opens above content without blocking modals.
- Modal, navigation, drawer, and toast layers now have explicit z-index ownership.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (142 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (47 tests).
- Desktop and 390x844 scene, bag, shop, and dialogue screenshots were reviewed.
- `git diff --check`: passed.

## Risks

- `ui.css` still contains historical Wave sections; the final focused-shell layer intentionally overrides them. A separate cleanup should only happen with screenshot parity tests in place.
- The city map and combat retain their existing specialized layouts; this pass did not redesign their information architecture.
- Desktop system-menu discoverability relies on the visible `menu` control and should be human-playtested with first-time players.

## Next Step

1. Human-play Day1-Day5 at desktop and phone sizes, measuring whether players find shop/log without instruction.
2. Consolidate obsolete historical CSS only after screenshot parity proves no visual regression.
3. Continue the remaining E05/post-Day9 motion asset replacement after the UI hierarchy is accepted.
