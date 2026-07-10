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
- No legacy/fallback runtime asset has been marked final.

## Validation

- Passed after the combat presentation batch:
  - `npm run check:full` (build, asset verification, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - `git diff --check`
- Reviewed screenshots: `outputs/day8-combat-desktop.png` and `outputs/day8-combat-mobile.png`.

## Risks

- Day 1-9 final art is still legacy/fallback; the strict final-art gate must remain red until reviewed files exist under `assets/pixel_v2/`.
- The legacy park background places exercise equipment through the enemy staging lane; the background needs a clean `pixel_v2` replacement rather than more positioning offsets.
- Current VFX textures remain legacy and will be replaced after the first background/standee batch.
- Image generation may require cleanup/downsampling before an output is suitable for a runtime key.
- The final release gate still needs desktop/mobile shots for Day 1, 2, 3, and 5.

## Next Step

Generate a clean park background candidate and Lu/E10 character reference in the current session. Review at 1x, then integrate only approved files under `assets/pixel_v2/` while preserving existing manifest keys.
