# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace E09's generic fallback presentation with a final dirty mixed-fight archetype, authored close-range motion, and correct night-street routing.

## Scope

- Generated all source imagery in the current Codex session.
- Preserved E09 stats, AI, skills, rewards, combat formulas, economy, story, and save contracts.
- Used external games only as clean-room cadence/readability references; no protected code or assets were extracted or copied.

## Current Result

- E09 now uses a final 32-frame, 96x144 Pixel V2 dirty-mix strip and matching 96x144 standee instead of the generic fighter fallback.
- Motion rows cover crooked idle, pressure advance, overhand straight, low kick, grip entry, rough low trip, dirty disengage, and hurt recovery.
- Actor-specific semantics map `straight`, `lowkick`, `grip`, `takedown`, `dirtyescape`, advance, guard, and retreat to authored rows.
- Presentation timing reads the overhand at 300ms and low kick at 320ms; grip and takedown retain the shared 380ms contact cadence.
- Runtime evidence proves the overhand advances more than 30px toward the player while the contact frame is active.
- `street` now selects `bg.street.day/night` from runtime time instead of forcing the day background, so the 19:00 old-city encounter uses the final night street.
- No new stage was generated: E09 intentionally reuses the already-final old-city street environment.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (156 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (64 tests).
- Desktop/mobile E09 screenshots and the exact overhand contact screenshot were reviewed.
- `git diff --check`: passed.

## Risks

- The solo takedown row communicates a rough low trip but does not yet animate a paired defender fall.
- Dedicated shove, cloth impact, street scuffle, and dirty disengage audio are still missing.
- The post-Day9 roster still contains generic presentation fallbacks outside the specially mapped enemies.

## Next Step

1. Audit remaining E02-E17/E22+ enemies and rank fallback replacement by encounter frequency.
2. Replace the next high-frequency fallback, likely E02 push-hands or E04 brawler, without changing combat formulas.
3. Start the next UI simplification pass from the quiet-ledger baseline: reduce simultaneous prose and keep current decisions visible by default.
