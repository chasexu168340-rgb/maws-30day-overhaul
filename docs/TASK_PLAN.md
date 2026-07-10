# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Day 1-9 retro-pixel vertical slice: establish the `pixel_v2` production bible, generate the approved visual reference in the current Codex session, and integrate the first reviewed runtime art batch.

## Scope

- Art generation happens in the current Codex session; CLI workers do not generate images.
- Use `assets/pixel_v2/` and preserve existing manifest keys.
- Keep legacy/fallback assets available for rollback and never relabel them as final.
- Reference Bruisers only for preparation, distance, and consequence principles; copy no assets or implementation.
- Preserve starter skills, economy, save key/version, and global combat formulas.
- Keep screenshots and generation review artifacts under `outputs/` untracked.

## Current Result

- Runtime pixel rendering and manifest metadata contracts are already active.
- Tactical recipes, recipe FX metadata, Day 8 measurement, and Day 9 diary-to-training handoff are implemented and pushed.
- Added `docs/design/PIXEL_V2_STYLE_BIBLE.md` with the canonical palette, character anchors, environment direction, sizes, Day 1-9 asset list, generation order, and rejection gate.
- Combat fighters now use a bottom-center anchor, share a viewport-safe ground line, and render hard-edged contact shadows; the mobile floating-character regression is removed.
- `ShellScene` now consumes `impactTier`, `vfxKey`, `hitstopMs`, `shake`, and `paletteFlash` for hit, guard, break, and recipe feedback without changing combat formulas.
- The combat HUD now uses square pixel borders, hard shadows, restrained semantic colors, a smaller mobile command dock, and compact command cards.
- Phaser 4 tint handling uses the current `setTint + TintModes.FILL` API, so the new feedback produces no deprecation warning.
- `bg.park.day` is the first reviewed runtime replacement under `assets/pixel_v2/`: exact 480x270, 32-color indexed PNG, 45KB, clear two-fighter staging lanes, and no baked characters.
- `anim.fighter.player` is now a reviewed `pixel_v2` 16-frame strip: exact 1536x144, 96x144 frames, transparent, 92KB, shared scale, centered silhouettes, and a fixed two-pixel foot baseline.
- The player strip supplies real idle `0-3`, wild-swing attack `4-7`, hurt `8-11`, and guard/utility `12-15` animations; Phaser uses a manifest display scale without stretching individual frame content.
- Asset preparation now supports 4x4 generated action masters, small grid remainder trimming, 32-bit ARGB chroma cleanup, global silhouette normalization, and row-major repacking.
- `pixel_v2_visual.spec.js` reads the live Phaser frame index and proves a real `wild_swing` enters attack frames; it also saves `outputs/pixel_v2_visual/player-attack-desktop.png` at the observed attack frame.
- Day 8 now uses independent `fighter.enemy.silent` and `anim.fighter.enemy.silent` keys instead of falling back to E01's legacy boxer.
- E10's reviewed assets are exact 96x144 standee / 1536x144 strip, transparent, 8KB / 123KB, with live idle, compact straight, hurt, and guard playback.
- Pixel V2 tests also wait for E10 attack frames and save `outputs/pixel_v2_visual/silent-boxer-attack-desktop.png` at the observed punch frame.
- Day 5 E01 now uses independent final `fighter.enemy.beginner` and `anim.fighter.enemy.beginner` assets instead of the shared legacy boxer.
- E01's reviewed gray-shirt/red-glove set is exact 96x144 / 1536x144, with idle, jab/straight, hurt, and guard rows; the strip stays under the 500KB fighter budget.
- Pixel V2 tests prove E01 attack-frame playback and cover Day 5 desktop/mobile combat geometry and screenshots.
- Guard FX now targets the actual guarding actor, normal guard/hit feedback no longer hides the whole sprite behind a white silhouette, and combat cues use concise Chinese labels.
- No legacy/fallback asset has been relabeled as final; every other unfinished key remains explicitly legacy/fallback.

## Validation

- Passed after the combat presentation batch:
  - `npm run check:full` (build, asset verification, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - `git diff --check`
- Re-ran `node maws_src/tools/verify_assets.mjs` and `npm run test:day1-9` after switching `bg.park.day`; both passed.
- Passed after the player animation integration:
  - `npm run check:full` (build, verifier, 6 Chromium smoke tests)
  - Pixel V2 candidate visual gate (6 passed, including live frame playback)
- Passed after the independent E10 integration:
  - `npm run check:full` (97 manifest entries, 6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (7 passed, including player and E10 live attack frames)
- Passed after the independent E01 integration:
  - `npm run check:full` (99 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (10 passed, including E01 live attack frames and Day 5 desktop/mobile screenshots)
  - `git diff --check`
- Reviewed updated screenshots: `outputs/day8-combat-desktop.png` and `outputs/day8-combat-mobile.png`.

## Risks

- Most Day 1-9 art is still legacy/fallback; the strict final-art gate must remain red until every reachable key has a reviewed file under `assets/pixel_v2/`.
- E00 still has no independent runtime standee/strip, so the early low-risk fun target is the next combat-art gap.
- The separate scene standee key `fighter.player` remains legacy; the combat strip does not falsely satisfy that strict requirement.
- Current VFX textures remain legacy and will be replaced after the first background/standee batch.
- Image generation may require cleanup/downsampling before an output is suitable for a runtime key.
- The final release gate still needs final-art desktop/mobile shots for Day 1, 2, and 3; Day 5 coverage is now active.

## Next Step

Generate and review E00's independent action master. After the early combat set is independent, generate full-size Lu/NPC scene standees and portraits before the broad UI skin replacement.
