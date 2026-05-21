# AGENT_B_EVENTS_PRESSURE

## Summary

Implemented early opportunity-card pressure smoothing in `maws_src/simulation/events.js`.

## Files Changed

- `maws_src/simulation/events.js`
- `docs/workers/events_pressure.md`
- `docs/agent_reports/AGENT_B_EVENTS_PRESSURE.md`
- `docs/TASK_PLAN.md`

## Behavior

- Day 1-7 now surfaces low-pressure recommendations for video review, boxing-gym reconnaissance, metro observation, and store supplies/Xiaoman reminders.
- Staying at home early in the day now favors Liu Pangzi, phone, and neighbor reminder cards instead of battle pressure.
- After Day 5, losing or not having `jab` can surface a “拳馆 · 沙包连击” reminder without forcing a fight or changing rewards.

## Validation

- `npm run build`: passed.
- `npm run test:smoke`: blocked because `playwright` is not available on PATH in this workspace.
- `git diff --check`: passed.

## Risks

- Consecutive no-outing is inferred without new save fields, using current location and daily action count only.
- The boxing hint is intentionally a home reminder because location unlock and economy/data changes were forbidden.
