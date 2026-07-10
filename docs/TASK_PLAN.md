# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Deepen the Day 1-9 clean-room combat slice: readable fight rules, real distance staging, slower contact animation, visible breathing/recovery, and less text-only combat controls.

## Scope

- Do not use Steam cracks, DRM bypass, decryption, protected code extraction, or third-party asset export.
- Reference Karate Master 2 and Bruisers only through official manuals/store material, observable gameplay principles, and unencrypted package metadata.
- Keep Phaser + DOM, existing save key/version, starter skills, enemy stats, and Pixel V2 asset contract.
- Images remain generated only in the current Codex session; no CLI worker image generation.
- Keep `outputs/` local and untracked.

## Current Result

- Added data-driven fight identities: open exchange, low-risk test, park check, three-window measurement, and weapon escape.
- Day 5 now exposes `park_check` as both objective set and visible fight rule; Day 8 exposes the measurement rule; E00/weapon fights receive their own identities.
- Combat feedback shows the current rule, success language, priority, and consumed preparation without adding another large panel.
- Enemy now starts on the left facing right; the player starts on the right facing left.
- Far/mid/close/ground use distinct Phaser X spacing on desktop and mobile.
- Attacks calculate travel from the live fighter gap, move toward contact, hold impact, and return; misses also lunge into the wrong distance instead of animating in place.
- Retreat/dodge/escape and advance animate from the previous spatial band into the new distance; contact shadows move with the fighters.
- Pixel V2 attack/hurt/utility/guard/retreat playback is reduced to 7-8fps; combat steps are spaced around 300ms and impact feedback waits for contact.
- Retreat that truly reaches far range grants a small one-time SP/posture reset; empty-queue breathing uses the existing exchange recovery and now reports SP/posture explicitly.
- Combat target and plan controls use the existing bitmap choice cursor; oversized translucent card numbers are replaced by small pixel number plates.
- Expanded `docs/reference_analysis/BRUISERS_KARATE_MASTER_MECHANICS.md` with official sources, verified strengths, MAWS gap analysis, legal boundaries, and independent implementation decisions.
- Preserved the previous cooking, recovery-item, semantic animation, item-art, and UI hierarchy batch.

## Validation

- `npm run check:full`: passed (build, 142 assets, 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests, including rules, retreat breathing, empty-queue recovery, and preparation).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (33 tests).
- Animation contracts prove enemy-left/player-right facing, attack X movement over 70px, retreat X movement over 24px, and far spacing substantially larger than close spacing.
- `git diff --check`: rerun before commit.

## Risks

- The current core icon images are functional Pixel V2 art but still need a dedicated authored atlas polish pass; CSS/layout changes are not a substitute for new icon art.
- Opponents beyond E00/E01/E10 still use legacy combat art or generic semantic fallbacks.
- Audio does not yet match the slower approach/contact/recovery timing.
- Persistent injury history, opponent scouting, camp quality, and rivalry memory remain future clean-room systems; do not add all at once.
- Day 10-30 still contains explicit legacy/fallback environments and identities.

## Next Step

1. Human-play Day 3 E00, Day 5 E01, and Day 8 E10 at normal speed; record whether approach/contact/recovery timing is legible without reading logs.
2. Generate and review a replacement core icon atlas in the main session, then replace only accepted icons.
3. Implement one next gameplay slice: opponent scouting plus a pre-fight plan choice, before adding persistent injury/career simulation.
