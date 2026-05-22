# AGENT_B_DAILY_DIRECTOR_LOOP

## Summary

Implemented a lightweight daily director pass in `state.js` and `events.js`.

## Changed Files

- `maws_src/simulation/state.js`
- `maws_src/simulation/events.js`
- `docs/workers/daily_director_loop.md`
- `docs/agent_reports/AGENT_B_DAILY_DIRECTOR_LOOP.md`

## Result

- Render model now has optional day-period and daily-director fields.
- Recommended opportunities default to a maximum of 3.
- Same-category opportunity cards have same-day cooldown/deduping.
- Early days remain soft-guided instead of combat-forced.
- Home-only/sleep-only play surfaces gentle reminders before any punishment.
- Missing `jab` after Day 5 prioritizes `拳馆 · 沙包连击`.

## Validation

- `npm run check:full`: passed
- `git diff --check`: passed

## Risk

- Current UI does not yet display the new director fields unless a later UI task wires them in.
