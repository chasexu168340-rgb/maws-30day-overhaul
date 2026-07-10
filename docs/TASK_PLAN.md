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
- No legacy/fallback asset has been relabeled as final; every other unfinished key remains explicitly legacy/fallback.

## Validation

- Passed after the combat presentation batch:
  - `npm run check:full` (build, asset verification, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - `git diff --check`
- Re-ran `node maws_src/tools/verify_assets.mjs` and `npm run test:day1-9` after switching `bg.park.day`; both passed.
- Reviewed updated screenshots: `outputs/day8-combat-desktop.png` and `outputs/day8-combat-mobile.png`.

## Risks

- Most Day 1-9 art is still legacy/fallback; the strict final-art gate must remain red until every reachable key has a reviewed file under `assets/pixel_v2/`.
- Legacy fighter strips contain inconsistent transparent bottom margins; E10 still appears slightly above his contact shadow even on the corrected park ground plane.
- Current VFX textures remain legacy and will be replaced after the first background/standee batch.
- Image generation may require cleanup/downsampling before an output is suitable for a runtime key.
- The final release gate still needs desktop/mobile shots for Day 1, 2, 3, and 5.

## Next Step

Generate and review Lu Xiaoxian's 16-frame action master in the current session, then use the same reference contract for E00/E01/E10 and switch the existing fighter sprite keys to exact 96x144 frames.
