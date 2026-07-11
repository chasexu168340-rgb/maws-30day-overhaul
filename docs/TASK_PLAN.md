# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace the generic E02 fighter fallback with a final Pixel V2 push-hands opponent whose stance, contact actions, timing, orientation, and real approach movement are readable in the live Phaser battle.

## Scope

- Added one final standee and one 32-frame 96x144 motion strip.
- Changed only asset metadata, E02 presentation mapping, action animation semantics, contact timing, and visual tests.
- Preserved E02 stats, AI, skills, combat formulas, economy, story, and save contracts.

## Current Result

- E02 now loads `fighter.enemy.pushhands` and `anim.fighter.enemy.pushhands` instead of the generic boxer fallback.
- The 32-frame strip provides rooted idle, measured advance, hand contact, redirect/off-balance, short palm, yielding guard, disengage, and hurt rows.
- Runtime semantics map `advance`, `grip`, `offbalance`, `palm`, `guard`, and `retreat` to authored rows.
- E02 contact timing is deliberately readable: grip 350ms, off-balance 370ms, palm 310ms.
- The enemy stands on the left, faces screen-right, keeps its feet grounded, and advances more than 30px at the palm contact frame.
- Display scale was raised from the initial 0.94 review value to 1.12 after screenshot inspection so the opponent reads as an adult older practitioner rather than a child-sized sprite.
- Existing E21 contact sampling now accepts its authored 13-15 back-kick contact interval while retaining the greater-than-30px movement requirement.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (158 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- E21 timing stability: passed 3 consecutive runs.
- Full `pixel_v2_visual.spec.js`: passed (75 tests).
- Desktop/mobile E02 idle screenshots and desktop palm-contact screenshot were manually reviewed.
- `git diff --check`: passed.

## Risks

- The push-hands sheet is a solo fighter performance; it does not yet deform both fighters into a paired hand-contact pose.
- E02 still uses shared combat audio and VFX; dedicated cloth movement, foot shuffle, palm contact, and hand-slap cues remain future polish.
- E04 and several later enemies still use generic presentation fallbacks.
- `outputs/` remains local screenshot evidence and must not be committed.

## Next Step

1. Replace E04 with a distinct brawler/worker motion identity without changing combat formulas.
2. Add a small shared push/grip/palm audio cue set after the next authored enemy batch.
3. Continue clean-room combat presentation work; do not copy protected reference assets or code.
