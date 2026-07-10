# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Rebuild the DOM UI information hierarchy so the game reads as a scene-first martial-arts RPG instead of a wall of cards and explanatory text.

## Scope

- Changed DOM UI, CSS, Pixel V2 core icons, focused visual tests, and the icon slicing helper only.
- Kept Phaser + DOM, game state, combat formulas, economy, story, save key/version, and manifest keys unchanged.
- `outputs/` remains local and untracked.

## Current Result

- Removed the default left/right information rails from the map and made the scene the dominant surface.
- Added a compact daily agenda plus at most two immediate commands; all other local actions, opportunities, locations, and descriptions live under `更多行动`.
- Prevented promoted actions from being duplicated inside the disclosure drawer.
- Converted skills, skill routes, equipment, inventory, shop items, NPCs, logs, and profile sections to index-first disclosure.
- Kept health, stamina, posture, current location, daily objective, item names, prices, counts, relations, skill status, and route progress visible at a glance.
- Folded detailed combat reads and fight-rule explanation while keeping enemy intent and counters visible.
- Replaced all 16 core resource/navigation icons with a cohesive 32x32 limited-palette pixel set.
- Added `scripts/slice_core_icon_atlas.ps1` for deterministic nearest-neighbor atlas slicing and palette mapping.

## Validation

- `npm run check:full`: passed (build, 142 assets, 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Wave 11-15 focused UI/loop suite: passed (28 tests).
- Full `pixel_v2_visual.spec.js`: passed (33 tests).
- Desktop/mobile non-scene ledger visual contract rerun after the profile fold: passed (2 tests).
- Verified screenshots at 390x844, 900x700, 1365x768, and 1536x864 with no horizontal overflow.

## Risks

- Native disclosure state intentionally resets after a store rerender; the selected item is not yet persisted as UI-only state.
- Long skill-tree and profile details still contain dense design data when explicitly opened.
- Audio and transition motion have not yet been retimed to match the new menu hierarchy.

## Next Step

1. Human-play the new scene command dock and index pages for 15 minutes using mouse and touch.
2. Add short 120-180ms pixel transitions for opening a ledger entry and changing tabs, without restoring decorative noise.
3. Continue the next gameplay slice only after confirming players can find `更多行动`, skill sources, and NPC interactions without explanation.
