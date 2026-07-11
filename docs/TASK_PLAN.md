# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace the generic E03 fallback with a final Pixel V2 showman whose theatrical mystic pose, practical palm, talkdown gestures, panic guard, retreat, and morale collapse are readable in live combat.

## Scope

- Added one final standee and one 32-frame 96x144 motion strip generated in the current Codex session.
- Changed asset metadata, E03 presentation mapping, action semantics, contact timing, and visual tests.
- Preserved E03 stats, skills, AI, rewards, combat formulas, story, economy, and save contracts.

## Current Result

- E03 now loads `fighter.enemy.showman` and `anim.fighter.enemy.showman` instead of the generic boxer fallback.
- The strict 4x8 source provides flamboyant idle, gliding approach, exaggerated mystic pose, practical short palm, talkdown gesture, panic guard, hurried retreat, and hurt/morale-collapse rows.
- Border-connected neutral cleanup removed generated white grid lines while preserving enclosed pale shoes and wrist details.
- A second per-frame connected-component pass removed only detached artifacts with `maxY < 65`; character bodies, shoes, hands, and palm sparks remain intact.
- Runtime semantics map `mystic`, `palm`, `talkdown`, `guard`, and `retreat` to distinct authored rows.
- Mystic and palm contact at 360/300ms. Reviewed scale is 1.24 and `contactScale: 0.16` brings the practical palm into the player's guard.
- The enemy stands on the left, faces screen-right, and reads as a narrow, overconfident performer rather than a trained boxer on desktop and mobile.

## Validation

- Alpha audit: all 32 frames are valid, foot baselines remain at 136-141, and each frame contains 1,852-2,390 opaque pixels after cleanup.
- `node maws_src/tools/verify_assets.mjs`: passed (162 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (81 tests).
- Desktop/mobile idle and desktop palm-contact screenshots were manually reviewed.
- `git diff --check`: passed.

## Risks

- Talkdown is visually distinct but still uses existing combat/social mechanics; this pass adds no new morale formula.
- The practical palm contains a small baked contact spark that may later be replaced by runtime-only VFX.
- E11 and several later enemies still use generic presentation fallbacks.
- `outputs/` remains local screenshot evidence and must not be committed.

## Next Step

1. Replace E11 short-video challenger with a distinct half-trained pressure/showboat identity rather than reusing E03.
2. Audit baked contact sparks across E03/E04 and remove them if runtime VFX stacks too heavily in motion.
3. Add shared voice/gesture and heavy-breath audio cues after the next authored enemy batch.
