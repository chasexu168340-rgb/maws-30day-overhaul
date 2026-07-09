# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Day 1-9 retro-pixel vertical slice: establish a truthful pixel runtime and asset contract before combat recipes and final art production.

## Scope

- Keep the existing Phaser + DOM architecture.
- Use a 480x270 logical scene grid and version final art under `assets/pixel_v2/`.
- Preserve existing manifest keys so gameplay code does not need an asset-key migration.
- Treat `E:\SteamLibrary\steamapps\common\Bruisers Steam Demo 0.1` as an experience reference only; do not copy its code, text, audio, or art.
- Image generation belongs to the current Codex session. CLI workers must not generate images.

## Current Result

- Phaser now renders with antialiasing disabled, pixel-art sampling enabled, and rounded pixel positions.
- DOM-rendered game images and the Phaser canvas use nearest-neighbor image rendering.
- Every manifest entry now exposes `logicalSize`, `palette`, `bundle`, `artVersion`, and `status` metadata.
- Asset bundles distinguish core, city, location, combat, dialogue, skill, and inventory content without changing existing runtime keys.
- Asset verification now validates the pixel contract and supports an explicit `--require-final-day1-9` release gate.
- Existing assets remain honestly marked `legacy` or `fallback`; no old image is labeled as final pixel art.
- The Bruisers reference install was identified as a packaged GameMaker build. Its mechanics and presentation will be evaluated through play and visible behavior rather than asset extraction.

## Validation

- Passed:
  - `npm run build`
  - `node maws_src/tools/verify_assets.mjs`
  - `npx playwright test maws_src/tests/phaser-smoke.spec.js --browser=chromium --reporter=line` (6 passed)
  - `git diff --check`
- Expected release-gate failure:
  - `node maws_src/tools/verify_assets.mjs --require-final-day1-9`
  - Reason: Day 1-9 still uses legacy/fallback art outside `assets/pixel_v2/`.

## Risks

- Responsive Phaser sizing still uses the current resize strategy; integer-scale presentation needs screenshot validation before changing scale behavior.
- Bundle metadata is ready, but runtime lazy loading has not been switched on yet.
- The final Day 1-9 art gate cannot pass until the generated art is reviewed, normalized, integrated, and marked final.
- Generated screenshots under `outputs/` are local audit artifacts and must remain uncommitted.

## Next Step

Commit and push the pixel runtime/asset contract, audit Bruisers for transferable loop and feedback principles, then implement the data-driven 1-2 action combat recipe slice.
