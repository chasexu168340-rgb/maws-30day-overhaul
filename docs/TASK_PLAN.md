# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace the text-heavy interface with a quieter pixel ledger hierarchy that keeps the scene, current intent, and immediate decisions dominant.

## Scope

- Preserved all actions, tabs, data-action contracts, combat formulas, economy, story, and save contracts.
- Limited implementation ownership to the DOM UI, CSS, and Pixel V2 visual contracts.
- Used external games only as clean-room hierarchy/cadence references; no protected code, layouts, or assets were extracted or copied.

## Current Result

- Root rendering now exposes `maws-ui-v2`; the scene defaults to location, one main intent, up to two immediate decisions, and an opt-in task drawer.
- HUD and navigation use larger 28-38px pixel icons with subordinate labels instead of tiny icons surrounded by oversized text.
- Ledger pages are narrow, centered indexes with 58px item/skill art, 12px row titles, one detail layer, and mobile full-screen safe insets.
- The skillbook is grouped into learned moves, up to six next learnable moves, and a closed future catalogue; the full move list no longer renders visibly by default.
- A CSS conflict that forced closed `details` content visible was removed and is covered by a dedicated regression test.
- Mobile combat now keeps target/queue, a two-column command list, and execute/surrender controls in one 230px dock while leaving the fight stage dominant.
- Desktop combat keeps six compact commands, a 1-2 move queue, and a stable right-side execution column.
- Final skill-card art now crops correctly inside the 58px index frame instead of appearing blank or microscopic.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (156 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (65 tests).
- Day 1 desktop/mobile, all ledger pages, skill hierarchy, and Day 5 desktop/mobile combat screenshots were reviewed.
- `git diff --check`: passed.

## Risks

- The stylesheet still contains historical override layers; V2 is deliberately isolated at the end to avoid breaking old contracts, but a later cleanup should remove superseded rules.
- Dialogue, event result, duration, and diary modals still need the same strict one-line/one-choice hierarchy audit.
- The post-Day9 roster still contains generic presentation fallbacks outside the specially mapped enemies.

## Next Step

1. Apply the same V2 hierarchy to dialogue, event result, duration, diary, and NPC interaction overlays.
2. Replace the next high-frequency enemy fallback, likely E02 push-hands or E04 brawler, without changing combat formulas.
3. Remove superseded CSS only after screenshot parity proves the V2 layer no longer depends on it.
