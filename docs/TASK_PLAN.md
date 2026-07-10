# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Complete the Day 1-9 full-motion combat cast and align combat audio/visual feedback to real contact timing.

## Scope

- Generated E10 imagery only in the current Codex session.
- Kept combat formulas, stats, economy, story, save key/version, and starter skills unchanged.
- Used external games only as clean-room design references; no protected code/assets were extracted or copied.
- Generation sources and review renders remain local under untracked `outputs/`.

## Current Result

- E10 now uses a reviewed 28-frame 96x144 strip with idle, advance, straight, heavy, guard, hurt, and retreat ranges.
- The full Day 1-9 combat cast (player, E00, E01, E10) now shares the same semantic animation contract.
- E00 remains visibly sloppy, E01 reads as trained beginner boxing, and E10 uses shorter, calmer, more economical movement.
- Combat SFX cues now distinguish hit, heavy, break, guard, and miss with short layered WebAudio tones.
- Audio scheduling uses the actual contact timeline: hit/break at the 260ms approach point, guard/miss after a 160ms read.
- Pixel VFX and palette flashes now start on contact instead of 88ms after the fighter reaches the target.
- Sound silently skips when the browser audio context is locked, avoiding autoplay errors.

## Validation

- `npm run check:full`: passed (build, 142 assets, 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (35 tests).
- Browser sampling proves E10 authored attack frames play in live Phaser.
- Browser instrumentation proves contact SFX events are delayed at least 160ms and trigger without warnings.
- Desktop/mobile Day 8 screenshots render without blank fighters or overflow.
- `git diff --check`: passed.

## Risks

- WebAudio tones are a coherent prototype layer, not final recorded foley.
- Opponents after Day 9 still use legacy/generic combat art.
- Grappling needs a different motion contract than boxing and should not reuse these seven rows unchanged.

## Next Step

1. Human-play Day 3/5/8 with sound enabled and tune cue volume against real device speakers.
2. Design and generate the first grappling-specific motion sheet with entry, sprawl, takedown, control, hurt, and escape rows.
3. Reduce the remaining combat HUD copy after confirming the new animation and audio carry enough information without logs.
