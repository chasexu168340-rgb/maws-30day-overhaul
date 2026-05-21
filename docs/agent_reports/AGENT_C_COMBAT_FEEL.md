# AGENT_C_COMBAT_FEEL

## Summary

Implemented Day 5 / E01 as an objective-style park check instead of a KO requirement.

## Files Changed

- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/workers/combat_kindness.md`
- `docs/agent_reports/AGENT_C_COMBAT_FEEL.md`

## Notes

- No change to `INITIAL_SKILLS`.
- No jab/advance grant.
- No change to `data.js`, E01 stats, E01 skill list, economy, save key/version, UI, or assets.
- E01 remains the same opponent; the change is only pass/fail interpretation and settlement copy for Day 5.

## Validation

- `npm run check:full`: build passed; asset verification passed; smoke failed because the environment cannot find `playwright`.
- `git diff --check`: passed.
- Direct Node simulation passed: Day 5 / park / E01 using `guard` reaches `park_check_pass`.
