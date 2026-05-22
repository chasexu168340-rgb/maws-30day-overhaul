# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

`NPC-ACT-001`: replace part of Wave 13 NPC menu toast feedback with real Day 1-7 NPC light actions.

## Scope

- Modify only `maws_src/content/data.js`, `maws_src/simulation/state.js`, this task plan, and required worker/report docs.
- Add real short actions for Liu Pangzi, father memory, Xiaoman, and Liang Coach.
- Preserve DOM UI, combat formulas, events, assets, package scripts, save key/version, and major story scope.

## Current Result

- Added 8 NPC-linked light actions using existing `ACTIONS` and `gain` data.
- Added generic `dailyGate` support so same-day NPC light actions cannot be reward-farmed.
- Added action `flags` handling and structured `maw` reward deltas for father memory.
- Added father as a home scene token so `father_incense` and `father_self_check` are reachable from the compact NPC menu.

## Validation

- Pass: `npm run build`
- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `git diff --check`

## Risks

- Low runtime risk. The compact NPC menu now considers up to 3 related actions instead of 2, but still returns at most 3 menu entries.
- Father is represented as a home scene token for the old photo/incense interaction; this is intentional and not a new story branch.

## Next Step

Commit with `feat: add day 1-7 npc real actions`.
