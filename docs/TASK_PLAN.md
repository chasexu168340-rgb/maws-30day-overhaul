# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Upgrade the first combat-animation slice from generic playback to readable semantic motion for player, Day 3 E00, and Day 5 E01.

## Scope

- Generated images only in the current Codex session.
- Added versioned Pixel V2 sprite strips and updated manifest/runtime animation mapping.
- Kept combat formulas, enemy stats, economy, story, save key/version, and starter skills unchanged.
- Used Karate Master 2 and Bruisers only as clean-room principles; no protected code/assets were extracted or copied.
- Generation sources and review renders remain local under untracked `outputs/`.

## Current Result

- Added reviewed 28-frame 96x144 strips for Lu Xiaoxian, E00, and E01.
- All three now expose authored idle, advance, straight attack, heavy attack, guard, hurt, and retreat ranges.
- Wild swing, mystic, push-away, palm, and takedown map to the heavy silhouette; formal strikes map to straight attack.
- Advance no longer reuses the attack strip, and defense no longer falls back to generic VFX frames for E00/E01.
- Player remains on the right facing left; enemies remain on the left facing right.
- Attack approach, contact, hit-stop, and return now use a slower 260ms approach; queued actions are spaced 540-620ms apart.
- Retreat/advance travel uses 320ms footwork and moves the contact shadow with the fighter.
- Removed the redundant post-hit actor `vfx` animation that interrupted recovery poses.
- Added `scripts/slice_combat_motion_atlas.ps1`, which tolerates AI row drift, isolates the largest character component, and normalizes scale/baseline.

## Validation

- `npm run check:full`: passed (build, 142 assets, 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (34 tests).
- Browser sampling proves heavy, advance, guard, retreat, E00 attack, and E01 straight frame ranges play in live Phaser.
- Browser sampling still proves real X travel, enemy-left/player-right facing, uniform scale, and distance spacing.
- Desktop/mobile Day 3, Day 5, and Day 8 screenshots render without blank fighters or overflow.
- `git diff --check`: passed.

## Risks

- Day 8 E10 still uses the earlier 16-frame strip and should be upgraded only after this 28-frame contract survives human play.
- Opponents after Day 9 still use legacy/generic combat art.
- Audio timing has not yet been aligned with the slower approach/contact/recovery timeline.

## Next Step

1. Human-play E00 and E01 at normal speed and check whether contact is readable without watching the log.
2. Add impact/guard/whiff audio cues aligned to the new 260ms contact point.
3. Upgrade E10 and the first grappler only after the early trio passes the same live-scale review.
