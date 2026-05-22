# NPC Real Actions Day 1-7

## Scope

- Worker: `AGENT_D_NARRATIVE_CONTENT + AGENT_B_GAMEPLAY_SYSTEMS`
- Task: replace part of Wave 13 NPC menu toast feedback with real light actions.
- Runtime files touched: `maws_src/content/data.js`, `maws_src/simulation/state.js`

## Implemented

- Added Liu Pangzi actions at home:
  - `fatty_review_together`: 25m, `jud +1`, `calm +1`, `rel_fatty +1`
  - `fatty_today_advice`: 15m, `jud +1`, `rel_fatty +1`
- Added father memory actions at home:
  - `father_incense`: 20m, `calm +1`, `fatherMemory +1`
  - `father_self_check`: 15m, `jud +1`, `calm +1`, `fatherMemory +1`
- Added Xiaoman actions at the store:
  - `xiaoman_supply_hint`: 10m, `jud +1`, `rel_xiaoman +1`
  - `xiaoman_night_chat`: 20m, `calm +1`, `fatigue -2`, `rel_xiaoman +1`
- Added Liang Coach actions at boxing:
  - `coach_one_correction`: 20m, `jud +1`, `calm +1`, `rel_coach +1`
  - `coach_gym_advice`: 15m, `jud +1`, `rel_coach +1`

## System Notes

- All new actions use existing `ACTIONS`, `gain`, `flags`, and NPC-linked menu plumbing.
- Added a generic `dailyGate` mechanism in state so same-day NPC light actions cannot be repeated for rewards.
- Added `maw` reward delta support for action result modals so `fatherMemory` appears as structured `rewardDeltas`.
- Home scene now includes the father token as `旧照片和香炉` so the father actions are reachable from the NPC menu.
- The compact NPC menu can surface up to 3 related executable actions.

## Validation

- Pass: `npm run build`
- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `git diff --check`

## Risk

- Low. The change does not touch DOM UI, combat, events, assets, package scripts, save key/version, or balance formulas.
