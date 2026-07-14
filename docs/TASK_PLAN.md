# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace the text-heavy management shell with a calm Pixel V2 ledger: one scene, one daily intent, one immediate decision, and records that open only when requested.

## Scope

- Changed DOM information hierarchy and Pixel V2 CSS only.
- Updated browser contracts that intentionally depended on five persistent tabs or an always-open skill catalogue.
- Preserved actions, rewards, combat formulas, economy, story data, save contracts, assets, and runtime asset keys.

## Current Result

- The persistent navigation now contains four icon ledgers: map, profile, skills, and bag. NPCs, shop, log, sleep, and save remain reachable from the system roll.
- The scene shows only a location seal, one-line daily intent, one primary action, and a closed task roll.
- The task roll groups local actions, rumours, travel, and location lore behind four short disclosure rows.
- Non-scene pages behave as focused ledgers over the world instead of full-screen text walls.
- The skill page defaults to the equipped moves, one growth-route summary, and one closed move catalogue.
- Contextual Day 1 guidance no longer follows the player into profile, skill, bag, shop, NPC, or log ledgers.
- Mobile ledgers remove the oversized portrait header, keep 56px item art, use two-column loadout slots, and stay above the 44px navigation bar.

## Validation

- `npm run build`: passed; 162 manifest entries verified.
- Phaser smoke: 6 passed.
- Day 1-Day 7 playtest: 4 passed.
- Day 1-Day 9 vertical slice: 4 passed.
- Full `pixel_v2_visual.spec.js`: 81 passed.
- Calm-ledger mobile/tablet/wide and non-scene desktop/mobile screenshots were manually reviewed.
- `git diff --check`: passed.

## Risks

- This pass deliberately changes presentation contracts, not the amount of underlying content. Deep ledgers can still become dense after the player expands them.
- The current CSS retains archived V1-V3 compatibility rules; V4 is isolated and final in the cascade, but a later cleanup should remove superseded blocks only with screenshot parity.
- `outputs/` remains local screenshot evidence and must not be committed.

## Next Step

1. Run a five-minute player test without explanation and count how often the player opens the task roll or system roll by mistake.
2. If the four-icon navigation is still unclear, add short hover labels and a first-use pulse, not permanent text.
3. Continue enemy art replacement only after the simplified shell is accepted visually.
