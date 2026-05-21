# combat_kindness

## Scope

- Agent: `AGENT_C_COMBAT_FEEL`
- Task: Day 5 / E01 park check should be passable with the 4-skill opening kit.
- Modified runtime file: `maws_src/simulation/state.js`
- Left unchanged: `maws_src/content/data.js`, `INITIAL_SKILLS`, E01 stats/skills, combat formulas, UI, assets, save key/version.

## Implementation

- Day 5 main battle against `E01` now receives a `park_check` objective set automatically.
- Objectives are:
  - Survive the first exchange window.
  - Use `guard` to reduce a pressure window.
  - Use `retreat` to open distance once.
  - Avoid morale collapse after the first window.
- Completing any 2 objectives ends the check as `验货通过`.
- Failure still records combat memory and shows review text that points the player toward learning jab at the boxing gym.

## Validation

- `npm run check:full`: build and asset verification passed; browser smoke failed because `playwright` is not available in the current environment PATH/dependencies.
- `git diff --check`: passed.
- Direct Node simulation: Day 5 / park / E01 with `guard` in the first window ends as `验货通过: park_check_pass`.
