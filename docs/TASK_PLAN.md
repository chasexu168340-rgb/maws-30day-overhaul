# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Give the E08/E19 sanda archetype its own final fighter motion and correct day/night combat stage.

## Scope

- Generated all new imagery in the current Codex session.
- Preserved enemy stats, AI, rewards, combat formulas, economy, story, and save contracts.
- Shared one sanda visual contract between E08 and E19 while retaining their separate gameplay data.
- External games remain clean-room principle references; no protected code or assets were extracted or copied.

## Current Result

- E08 and E19 now use a final 32-frame, 96x144 Pixel V2 sanda strip and matching standee.
- Motion rows cover weight-shifting idle, measured advance, boxing sequence, whip/round kick, front kick, sprawl, lateral dodge, hurt, and recovery.
- Actor-specific semantics distinguish boxing, round kick, front kick, sprawl/catch response, and dodge.
- Presentation timing reads jab at 240ms, straight at 280ms, round/whip kick at 320ms, front kick at 310ms, and catch-throw level change at grappling timing.
- The sanda gym now has final 480x270, 32-color day and rainy night backgrounds at 41KB and 46KB.
- Generic combat backgrounds now follow the current location instead of forcing every non-special fight into the daytime park; E06/E07/E18 keep their authored story overrides.
- Desktop/mobile screenshots confirm readable fighter scale, left-side/right-facing enemy orientation, clear mat geometry, and safe HUD framing.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (146 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (53 tests).
- `git diff --check`: passed.

## Risks

- E08's `lowkick` and E19's `sanda_whip_kick` share the same authored kick row; a future balance/content pass may split low and body-height variants.
- E19's catch-throw currently uses the sprawl/level-change row rather than a paired two-character throw sheet.
- Dedicated mat, shin, glove, and sprawl foley is still missing.
- E20/E21 and other post-Day9 archetypes still fall back to generic boxer presentation.

## Next Step

1. Build E20's karate-specific straight-line entry, reverse punch, front kick, guard, and disciplined recovery contract.
2. Give `karate_dojo` a final day/night stage before claiming that route visually complete.
3. Follow with E21's long-range taekwondo movement and kick contract.
