# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Add a paired-body takedown presentation so E06 throws visibly affect the defender instead of playing two disconnected animations.

## Scope

- Generated player reaction imagery only in the current Codex session.
- Extended the existing player strip without replacing its first 28 frames.
- Added presentation semantics and spatial tweens only; combat success, damage, economy, story, and save contracts remain unchanged.
- External games remain clean-room principle references; no protected code or assets were extracted or copied.

## Current Result

- The player sprite strip now contains 36 frames while preserving all existing idle, movement, attack, guard, hurt, and retreat ranges.
- Frames 28-31 form a takedown fall: broken stance, airborne rotation, side/back landing, and grounded defense.
- Frames 32-35 form a technical recovery: post, hip lift, knee under, and guarded stand.
- Successful E06 takedowns now play the grappler's dedicated takedown row, delay impact to the 380ms contact point, move the defender laterally, and hold the player on the grounded frame.
- Player ground escape maps to `recover`; ordinary retreat and all existing strike semantics remain compatible.
- Fighters without fall/recover ranges safely fall back to hurt/retreat.
- Browser sampling proves frames 28-35 play and that the defender moves more than 40px across the ground.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (142 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (39 tests).
- Takedown-contact and technical-recovery screenshots were reviewed after the impact flash cleared.
- `git diff --check`: passed.

## Risks

- The paired reaction is coordinated at runtime rather than a baked two-character animation, so limb-to-limb contact remains approximate.
- Ground control still has one persistent defender pose rather than a full scramble loop.
- E07 weapon and E18 boss still use legacy motion strips.

## Next Step

1. Generate the E07 weapon-threat motion contract with readable weapon line, retreat pressure, miss, hurt, and disengage rows.
2. Add a short grounded scramble loop only if E06 hand-play shows the held grounded frame lasting too long.
3. Record final grappling contact and mat-impact audio after paired timing is accepted.
