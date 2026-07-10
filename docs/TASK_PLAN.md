# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace E05's legacy generic boxer with a final, readable full-motion Pixel V2 sparring partner.

## Scope

- Generated E05 imagery only in the current Codex session.
- Preserved E05 stats, AI, rewards, story role, combat formulas, economy, and save contracts.
- Added presentation-only action semantics and contact timing for E05.
- External games remain clean-room principle references; no protected code or assets were extracted or copied.

## Current Result

- E05 now uses a final 32-frame, 96x144 Pixel V2 strip and matching standee.
- Rows cover idle, cautious advance, jab, rear straight, low kick, boxing guard, short dodge, hurt, and balanced recovery.
- Actor-specific semantics keep jab, straight, low kick, guard, and dodge visually distinct instead of sharing one generic attack row.
- E05 presentation uses 240ms jab, 280ms straight, and 310ms low-kick contact reads without changing hit chance or damage.
- Runtime display scale is 1.2 so the adult sparring partner reads near player height rather than as a child-sized opponent.
- Desktop/mobile screenshots confirm E05 stands on the left, faces right, remains grounded, and does not collide with the HUD.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (142 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (50 tests).
- `git diff --check`: passed.

## Risks

- E05's low kick is retained because it exists in the current data contract; this pass does not decide whether that move belongs in the final boxing-only design.
- Hit timing is readable, but dedicated glove, shoe, and body-pad foley is still missing.
- Enemies beyond the specially mapped E00/E01/E05/E06/E07/E10/E18 set still fall back to this boxer presentation and need distinct silhouettes/actions.

## Next Step

1. Audit E08/E09 and other reachable post-Day9 enemies by archetype, then replace the highest-frequency fallback with one distinct motion contract.
2. Add dedicated jab, straight, low-kick, and guarded-contact foley after animation timing is human-played.
3. Human-play E05 to confirm the patient counter-fighter reads differently from E01 without changing balance.
