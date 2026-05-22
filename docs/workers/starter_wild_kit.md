# Starter Wild Kit Worker Notes

## Scope

- Worker: `AGENT_B_GAMEPLAY_SYSTEMS + AGENT_C_COMBAT_FEEL`.
- Allowed code touched: `maws_src/content/data.js`, `maws_src/simulation/state.js`, `maws_src/tests/phaser-smoke.spec.js`, `maws_src/tests/day1_day7_playtest.spec.js`.
- Forbidden surfaces left untouched: `combat.js`, DOM UI/CSS, events, assets, economy, save key/version.

## Implementation

- Replaced the Day 1 starter kit with six wild/old starter skills:
  - `wild_swing` / 野路挥拳
  - `push_away` / 推搡
  - `mystic` / 茂家旧招野生版
  - `guard` / 野生抱架
  - `retreat` / 本能后撤
  - `talkdown` / 嘴上降温
- Added `wild_swing` and `push_away` as low-skill, street-style actions in `SKILLS`.
- Updated `INITIAL_SKILLS`, new-game `equipSkills`, and skill unlock source text.
- Kept `jab`, `straight`, `palm`, and other formal skills behind existing training unlocks.
- Migrated only missing `equipSkills` defaults; old saves with existing skills/equipment are not stripped.
- Added starter-skill combat advice hints so early pressure/counter prompts can mention the wild tools.

## Validation Notes

- `npm run check:full`: pass.
- `npm run test:playtest`: pass.
- `git diff --check`: pass.
