# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace E21's generic fallback presentation with a final taekwondo fighter, authored long-range motion, and a matching day/night club stage.

## Scope

- Generated all source imagery in the current Codex session.
- Preserved E21 stats, AI, skills, rewards, combat formulas, economy, story, and save contracts.
- Used external games only as clean-room cadence/readability references; no protected code or assets were extracted or copied.

## Current Result

- E21 now uses a final 32-frame, 96x144 Pixel V2 taekwondo strip and matching 96x144 standee instead of the generic boxer fallback.
- Motion rows cover bouncing guard, slide-step advance, roundhouse kick, counter back kick, front kick, landing reset, long back-step/dodge, and hurt recovery.
- The generated atlas had one missing idle cell; frame 0 is reused as the fourth idle loop closure, leaving three distinct weight-shift poses without changing attack rows.
- Back-kick turn/chamber/contact frames were corrected so the heel extends screen-right toward the player; the recovery frame returns to the standard right-facing guard.
- Actor-specific semantics map `tkd_roundhouse`, `tkd_back_kick`, `frontkick`, guard/reset, dodge, and retreat to authored rows.
- Presentation timing reads roundhouse at 330ms, back kick at 360ms, and front kick at 310ms, then schedules an explicit landing/reset after hit or miss.
- Runtime movement evidence proves the back kick advances more than 30px toward real contact distance while the contact frame is active.
- `taekwondo_club` now uses final 480x270, 32-color day/night stages with identical mat geometry and clear long-range lanes.
- The asset preparation tool can now remove a border-connected neutral checkerboard without deleting white clothing enclosed by dark outlines.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (154 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (61 tests).
- Desktop/mobile E21 screenshots and exact back-kick pose/contact screenshots were reviewed.
- `git diff --check`: passed.

## Risks

- The idle loop contains three unique poses plus a repeated closing pose because the generated source omitted one cell.
- Dedicated foot-slide, mat impact, dobok snap, and kiai audio are still missing.
- The post-Day9 roster still contains generic presentation fallbacks outside the specially mapped enemies.

## Next Step

1. Give E09's dirty mixed-fight archetype its own unstable boxing, shove, foul-threat, and escape presentation.
2. Audit all remaining E02-E17/E22+ enemies and rank fallback replacement by how often players meet them.
3. Add shared route-specific audio only after the remaining high-priority visual archetypes are mapped.
