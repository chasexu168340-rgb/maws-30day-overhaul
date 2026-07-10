# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace E18's legacy static boss fallback with a readable mixed boxing/grappling motion contract.

## Scope

- Generated E18 imagery only in the current Codex session.
- Preserved E18 combat values, AI decisions, story, economy, and save contracts.
- Added actor-specific motion semantics and readable contact timing without changing combat formulas.
- External games remain clean-room principle references; no protected code or assets were extracted or copied.

## Current Result

- E18 now uses a final 36-frame Pixel V2 strip with 128x144 frames and a matching standee.
- Motion rows cover idle, advance, boxing, front kick, clinch entry, takedown, sprawl, hurt, and escape.
- Actor-specific semantics keep the boss's boxing, kick, clinch, takedown, sprawl, guard, and escape visually distinct.
- Front-kick contact takes 300ms and grappling contact remains 380ms, so both reads are visible before resolution.
- The production strip is RGBA, 4608x144, and about 150KB after palette-conscious compression.
- Desktop/mobile and contact screenshots confirm left-side enemy orientation, readable scale, movement, and no horizontal overflow.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (142 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (47 tests).
- `git diff --check`: passed.

## Risks

- Grappling interaction remains coordinated at runtime rather than authored as a paired two-character sheet.
- E18 still uses synthesized generic impact audio rather than dedicated kick, clinch, and mat-contact foley.
- The generic E05 boxer and broader post-Day9 enemy set still use legacy/fallback motion contracts.

## Next Step

1. Rebuild the main UI around a restrained scene-first hierarchy with less default text.
2. Replace the generic E05 boxer motion contract after the UI pass is accepted.
3. Add dedicated kick, cloth-grab, and mat-contact audio after motion timing is accepted.
