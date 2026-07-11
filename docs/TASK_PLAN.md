# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace the generic E04 fallback with a final Pixel V2 strongman whose explosive pressure, crude technique, fatigue opening, real contact movement, and scale are readable in Phaser combat.

## Scope

- Added one final standee and one 32-frame 96x144 motion strip generated in the current Codex session.
- Changed asset metadata, E04 presentation mapping, action semantics, recovery presentation, desktop approach range, and visual tests.
- Preserved E04 stats, skills, AI, combat formulas, economy, story, and save contracts.

## Current Result

- The first generated source was rejected because it only contained seven real rows; no invalid production file was retained.
- The accepted source has a strict 4x8 grid with idle, bull-rush advance, power straight, crude low kick, shell guard, exhausted recovery, awkward retreat, and hurt rows.
- E04 now loads `fighter.enemy.strongman` and `anim.fighter.enemy.strongman` instead of the generic boxer fallback.
- Straight and low kick contact at 340/360ms, then automatically play the fatigue row 180ms after contact so the character exposes a readable recovery opening.
- The reviewed display scale is 1.22. The enemy stands on the left, faces screen-right, and remains visibly broader than the player on desktop and mobile.
- `contactScale: 0.10` compensates for the wide transparent sprite cell so the power punch reaches the player's guard instead of stopping at the generic full-cell gap.
- Desktop attack presentation can temporarily advance up to 30% of stage width; it still yoyo-returns and does not change combat distance state or hit formulas.
- The contact test samples actual X motion, verifies the runtime contact-gap formula, and freezes authored frame 10 for screenshot review.

## Validation

- Alpha audit: all 32 frames contain full content, share foot baseline 141, and contain 1,737-2,426 opaque pixels.
- `node maws_src/tools/verify_assets.mjs`: passed (160 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (78 tests).
- Desktop/mobile idle and desktop power-straight contact screenshots were manually reviewed.
- `git diff --check`: passed.

## Risks

- The authored punch and kick contact frames contain small baked impact sparks; runtime VFX may need a later art-only cleanup if the combined effect reads too busy in motion.
- E04 fatigue is a presentation recovery, not a new mechanical debuff; combat balance remains unchanged.
- E03, E11, and several later enemies still use generic presentation fallbacks.
- `outputs/` remains local screenshot evidence and must not be committed.

## Next Step

1. Replace E03 with a distinct showman/mystic motion identity so palm, talkdown, and retreat do not reuse boxer presentation.
2. Audit E04 in a real exchange to decide whether baked impact sparks should be removed in favor of runtime-only VFX.
3. Add shared push/grip/palm and heavy-breath audio cues after the next authored enemy batch.
