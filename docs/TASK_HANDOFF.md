# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Day 1-Day 9 retro-pixel vertical slice: produce and integrate the first reviewed `pixel_v2` art batch without changing existing runtime asset keys.

## Current Staging Baseline

- Wave 15 QA merged.
- Skill-tree spend state exists with Insight costs, prerequisites, purchased state, and small runtime effects.
- Combat recipes exist for tactical plan modes.
- Wave15 smoke covers skill-tree spend, recipe controls, recipe feedback, and mobile overflow.

## Goal

Use the Microsoft SkillOpt pattern as a production workflow: run a current-state rollout/audit, select bounded high-impact patches, validate them behind gates, and keep only changes that improve the player-facing loop.

The player-facing target remains: the player clicks something, the game responds clearly, the character changes, and the next action or fight feels different.

## Current Pass

1. Pixel runtime and manifest metadata contracts are active.
2. Tactical recipes, Day 8 measurement, and Day 9 diary-to-training handoff are implemented and pushed.
3. `docs/design/PIXEL_V2_STYLE_BIBLE.md` is the canonical art source for palette, proportions, environment staging, dimensions, and final-art review.
4. Combat fighters now use bottom anchors/contact shadows, and Phaser consumes the structured hit-stop, shake, palette-flash, and pixel-VFX metadata without warnings.
5. Combat HUD presentation is square, hard-edged, and more compact on mobile; Day 8 desktop/mobile screenshots were reviewed.
6. Generate images only in the current Codex session; do not use CLI workers for image content.
7. `bg.park.day` is now a reviewed 480x270/32-color/45KB `pixel_v2` final asset and passes Day 8 desktop/mobile runtime screenshots.
8. `anim.fighter.player` is now a final 16-frame `pixel_v2` strip with real idle/attack/hurt/guard playback; browser tests read the live Phaser frame index and capture an attack-frame screenshot.
9. Day 8 now uses an independent final E10 standee/strip; browser tests prove both player and E10 attack ranges play in real combat and capture both mid-action screenshots.
10. Guard FX targeting/tinting is corrected and concise Chinese combat cues replace English debug-style labels.
11. Day 5 E01 now uses an independent final beginner-boxer standee/strip; browser tests prove its attack frames and cover desktop/mobile Day 5 screenshots.
12. E00 now uses an independent final untrained-target standee/strip; browser tests prove its attack frames and cover desktop/mobile Day 3 optional combat screenshots.
13. Lu now has final 96x144 scene standee and 96x96 portrait assets that match the approved combat sprite; the old green-fringed standee and hoodie portrait are no longer live.
14. The asset preparation tool supports chroma-key portrait cleanup.
15. Next production batch: Liu Pangzi scene standee/portrait, then Xiaoman, the worker, Coach Liang, and father memory.
16. Keep generation review images and screenshots in local `outputs/`; commit only approved runtime assets.

## Deferred Larger Work

- Day 10-Day 30 art and content coverage.
- Full skill-tree economy.
- Broad enemy or combat formula rewrites.
- Three.js or framework migration.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`
5. `docs/VALIDATION.md`
6. current worker prompt or optimization report if present

## Validation

- Asset gate:
  - `node maws_src/tools/verify_assets.mjs`
- Runtime gates:
  - `npm run check:full`
  - `npm run test:playtest`
  - `npm run test:day1-9`
  - `git diff --check`

## Do Not Do

- Do not implement full 30 days, full skill tree, more UI panels, broad enemy rewrites, or save key/version changes during this bounded pass.
- Do not give `jab` / `advance` as new starter skills.
- Do not mark legacy or fallback art as `final`; final art must be reviewed and live under `assets/pixel_v2/`.
- Do not extract, trace, or copy Bruisers assets, code, text, audio, or exact layouts.
- Do not let multiple workers edit the same UI files concurrently.
- Do not start CLI workers unless the user explicitly asks for workers.
- If CLI workers are explicitly requested, use `gpt-5.5` with high reasoning by default and keep QA after implementation branches are pushed or merged.
- Do not ask CLI workers to generate images; image generation belongs in the current Codex session only.
