# content_day4_7

## Scope

- Worker: `AGENT_D_NARRATIVE_CONTENT`
- Task: 接入 Day 4、Day 6、Day 7 主线事件。
- Modified data file: `maws_src/content/data.js`
- No event engine changes.
- No Day 8/9 changes.

## Implemented

- Day 4 `工棚里的第一拳`
  - Location: `worksite`
  - Focus: 第一拳不是抢先动手，而是在工棚压力里判断该不该出现。
  - Rewards: light `calm` / `jud` / `auth`, plus `maw` memory/misread notes.

- Day 6 `旧城区夜行`
  - Location: `metro_station`
  - Focus: 夜路风险识别、出口判断、少误读影子。
  - Rewards: light `calm` / `jud` / `auth`, with misread pressure.

- Day 7 `镜子里的人`
  - Location: `home`
  - Focus: 在镜子前把招名信仰转成自检，承接父亲记忆线。
  - Rewards: light `calm` / `jud` / `auth`, plus `maw.fatherMemory`.

## Constraints Kept

- Only existing `MAIN_EVENTS` fields were used: `title`, `loc`, `npc`, `desc`, `kind`, `dialogue`, `eventNotebook`, `maw`, `choices`.
- No new event engine, state, combat, UI, asset, save key, or `INITIAL_SKILLS` change.
- Rewards stay light and narrative-facing; no large attribute injection.

## Validation

- `npm run build`: passed.
- `npm run test:smoke`: blocked because `playwright` is not available in this workspace command environment.
- `git diff --check`: passed after fixing a trailing blank line in the agent report.
