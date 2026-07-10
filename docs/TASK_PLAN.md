# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace E07's static weapon fallback with a readable, distance-first weapon-threat motion contract.

## Scope

- Generated E07 imagery only in the current Codex session.
- Preserved existing E07 identity, wooden-baton threat, combat values, AI decisions, story, economy, and save contracts.
- Added actor-specific animation mapping so boxing `straight` remains boxing while E07's `straight` becomes a weapon swing.
- External games remain clean-room principle references; no protected code or assets were extracted or copied.

## Current Result

- E07 now uses a final 28-frame Pixel V2 strip and matching standee.
- Weapon rows cover idle read, threatening advance, horizontal swing, diagonal strike, miss recovery, hurt while retaining the baton, and guarded disengage.
- E07 uses 128x144 frames so the full wooden-baton line remains readable without shrinking the body; other fighters keep their existing frame sizes.
- Runtime sprite sizing and contact spacing read the manifest frame width instead of assuming 96px.
- E07-specific semantics map advance to `threat`, weapon strike to `swing/smash`, miss follow-through to `recover`, and retreat to `disengage`.
- Weapon contact takes 340ms versus 260ms for ordinary punches, keeping the threat readable without changing hit chance or damage.
- Miss playback now respects actor-specific animation semantics before entering recovery.
- Browser sampling proves authored threat, strike, recovery, and disengage ranges play and that the weapon attack moves more than 60px.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (142 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (43 tests).
- E07 desktop/mobile idle and mid-strike screenshots were reviewed for scale, weapon continuity, orientation, distance, and overflow.
- `git diff --check`: passed.

## Risks

- The wooden baton uses one shared high-risk strike skill internally; horizontal and diagonal variations are presentation aliases, not separate balance entries.
- E07 still uses synthesized generic impact audio rather than wood-specific swing/contact foley.
- E18 boss remains on a legacy motion strip.

## Next Step

1. Generate E18's mixed boxing/grappling boss contract without making him visually omnipotent.
2. Add wood swing, hard-surface contact, and miss-whoosh audio after the motion timing is accepted.
3. Human-play the Day 18 choice so the new animation reinforces withdrawal and de-escalation rather than making armed combat look like the optimal reward path.
