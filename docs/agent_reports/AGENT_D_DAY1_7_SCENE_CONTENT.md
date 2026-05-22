# AGENT_D_DAY1_7_SCENE_CONTENT

## Summary

Reworked Day 1-7 `MAIN_EVENTS` content into a short-summary-first structure while preserving existing runtime fields and avoiding UI/state/combat changes.

## Changed

- Added `shortDesc`, `sceneSummary`, and `hook` to Day 1-7 events.
- Shortened front-facing `dialogue` so each day has one clear emotional beat.
- Kept longer explanation and action framing inside existing `eventNotebook`.
- Reduced several early choice rewards so narrative moments stay light and do not overpay attributes or fame.

## Day Beats

- Day 1: incense, father, and the first misread.
- Day 2: metro containment instead of a ring fight.
- Day 3: convenience store false victory.
- Day 4: worksite excitement at being seen, checked by wrist pain.
- Day 5: park verification, not KO.
- Day 6: old-town night walk with father trace.
- Day 7: mirror self-check.

## Scope Guard

- Did not touch Day 8/9.
- Did not modify `state.js`, `events.js`, `ui.js`, `ui.css`, `combat.js`, assets, or `INITIAL_SKILLS`.
- Did not change save keys, asset structure, formulas, or combat logic.

## Validation

- `npm run build`: passed.
- `npm run test:smoke`: passed, 4 Chromium smoke tests.
- `git diff --check -- maws_src/content/data.js`: passed for this task's tracked runtime file.
- `git diff --check`: failed on existing/non-task diffs in `maws_src/simulation/events.js` and `maws_src/simulation/state.js`; both are outside the allowed edit scope for this task.

## Risk

The new summary fields are additive. If the current UI does not read them yet, existing `desc`, `dialogue`, and `eventNotebook` still carry the improved content.
