# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace E06's static boxing-like fallback with the first production grappling motion contract.

## Scope

- Generated imagery only in the current Codex session.
- Replaced the E06 standee and sprite strip while preserving existing runtime asset keys.
- Added animation semantics and contact timing only; combat formulas, stats, economy, story, and save contracts remain unchanged.
- Reference games remain clean-room principle references; no protected code or assets were extracted or copied.

## Current Result

- E06 now uses a final 28-frame 96x144 Pixel V2 strip and matching standee.
- Authored rows cover wrestling idle, entry/level change, shot, takedown/control, sprawl, hurt, and technical escape.
- E06 stands on the left and faces screen-right; the player remains on the right and faces screen-left.
- Grappling actions map to dedicated `entry`, `shot`, `takedown`, `control`, `sprawl`, and `escape` semantics.
- Fighters without those aliases fall back to their existing generic advance/attack/heavy/guard/retreat ranges.
- Grappling contact now takes 380ms versus 260ms for ordinary strikes, and impact audio/VFX remain aligned to contact.
- Browser sampling proves the authored E06 frame ranges play and the sprite travels more than 70px into contact.
- The atlas slicer supports optional per-frame target heights, keeping standing and grounded grappling poses at believable relative scale.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (142 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (38 tests).
- E06 desktop/mobile screenshots were reviewed for scale, alpha edges, stage placement, orientation, and overflow.
- `git diff --check`: passed.

## Risks

- E06 ground control still represents the acting grappler only; paired-body throw animation is not yet implemented.
- E07 weapon and E18 boss still use legacy motion strips.
- Grappling uses synthesized prototype contact audio rather than final recorded mat/body foley.

## Next Step

1. Add a paired-contact takedown presentation so the defender reacts spatially to successful E06 throws.
2. Generate the E07 weapon-threat motion contract with distance-first retreat and disarm-avoidance reads.
3. Add final grappling contact, mat impact, and scramble audio after the paired-body timing is stable.
