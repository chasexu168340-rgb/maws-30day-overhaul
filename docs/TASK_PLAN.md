# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Close the next Day 1-9 Pixel V2 presentation batch: rebalance icon/text hierarchy, replace remaining web-like interaction surfaces, add semantic player defense motion, and connect preparation items to the next fight.

## Scope

- Art generation remains in the current Codex session; CLI workers do not generate images.
- Keep Phaser + DOM and the existing `assets/pixel_v2/` manifest contract.
- Preserve starter skills, save key/version, economy curve, enemy stats, and global combat formulas.
- Use Bruisers and Karate Master 2 only for high-level preparation/combat principles; copy no assets, code, text, or layouts.
- Keep `outputs/` local and untracked.

## Current Result

- Rebuilt compact UI hierarchy so item and command art leads while ordinary labels/descriptions step down in size.
- Bag and shop cards now use 64px/56px pixel item stages, compact metadata, and separated price/action footers.
- Dialogue now uses 120px desktop and 84px mobile portraits, 15px readable lines, bitmap frames, compact nameplates, and less empty height.
- Event, training, duration, NPC, toast, city-tooltip, and dialogue choices now use hard Pixel V2 frames/cursors instead of rounded web controls.
- Desktop HUD stays in one row after icon enlargement; navigation and resource icons remain visually stronger than labels.
- Combat commands now consume real 192x128 move art, show the art as the command face, and leave full mechanics in the focus detail.
- NPC relationships now render as a portrait-led pixel ledger instead of generic panel rows.
- Added a 24-frame player strip with distinct guard and retreat ranges; Phaser uses uniform scaling and semantic action animations.
- Normalized player and E00 foot baselines and added strict per-animation foot-range verification.
- Added egg, greens, noodles, home meal, ice pack, and pain gel Pixel V2 items.
- Home cooking consumes ingredients and creates a meal; meal/ice preparation produces one-use next-fight SP/posture/morale benefits and clears on use/sleep.
- Added `docs/reference_analysis/BRUISERS_KARATE_MASTER_MECHANICS.md` with safe engine/mechanics evidence and MAWS-specific design decisions.
- Visual contracts now reject undersized item art, oversized item titles, missing combat command art, soft scaling, horizontal overflow, and sub-44px mobile actions.

## Validation

- `npm run check:full`: passed (build, 142-entry asset verification, 6 Chromium smoke tests).
- `npm run test:playtest`: passed (3 tests, including cooking/recovery preparation).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (32 tests).
- New icon/text hierarchy contracts: passed (4 targeted desktop/mobile tests).
- `node maws_src/tools/verify_assets.mjs --require-final-day1-9`: passed (142 entries).
- `git diff --check`: passed before checkpoint update; rerun before commit.

## Risks

- Day 10-30 still contains explicit legacy/fallback locations and characters; this batch only closes the Day 1-9 release slice.
- Enemy sheets other than the player do not yet have dedicated guard/retreat ranges; runtime safely falls back to utility animation where required.
- Combat/UI audio has not received the matching impact and navigation sound pass.
- Long Chinese prose still uses a readable system fallback; no unlicensed bitmap Chinese font was introduced.

## Next Step

1. Commit and push this verified Pixel V2 hierarchy, semantic motion, and combat-preparation batch.
2. Human-play Day 1-9 once with sound on and record remaining feel issues, especially command readability and preparation timing.
3. Start the next bounded batch with audio/hit feel or Day 10-12 location art, not another broad UI rewrite.
