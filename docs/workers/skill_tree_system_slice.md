# Skill Tree System Slice

## Scope

- Worker: `AGENT_B_GAMEPLAY_SYSTEMS`
- Task: `WAVE14_SKILL_TREE_SYSTEM_SLICE`
- Runtime files touched: `maws_src/content/data.js`, `maws_src/simulation/state.js`
- UI, combat formulas, assets, package scripts, save key/version: unchanged

## Implemented

- Added `SKILL_TREE_NODES` with three first-slice trees:
  - `Street Wild`
  - `Boxing Basics`
  - `Traditional Reforge`
- Added required node coverage:
  - `wild_swing` mastery/passive node
  - `push_away` utility node
  - `jab` unlock/boost node
  - `mystic` and `guard` traditional rewrite nodes
  - future queue slot node marked `locked`/`future`
- Added `player.insightPoints`, defaulting old saves to `0`.
- Added insight gain from review/training/mainline completion.
- Added `skillTree` to `buildRenderModel`.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `git diff --check`

## Notes

- This slice does not add purchase UI or apply node effects to combat.
- Future UI should read `renderModel.skillTree.points`, `trees`, and node `status`/`lockedReason`.
