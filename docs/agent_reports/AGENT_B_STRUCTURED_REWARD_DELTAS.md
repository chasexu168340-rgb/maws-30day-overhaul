# AGENT_B_STRUCTURED_REWARD_DELTAS

## Result

Implemented state-layer `rewardDeltas` for modal settlement flows without changing UI, data, combat formulas, assets, or package scripts.

## Files Changed

- `maws_src/simulation/state.js`
- `docs/workers/structured_reward_deltas.md`
- `docs/agent_reports/AGENT_B_STRUCTURED_REWARD_DELTAS.md`

## Validation

Passed:

- `npm run check:full`
- `npm run test:playtest`
- `git diff --check`

## Risk

UI still needs to consume `rewardDeltas`; compatibility fields remain in place until that branch lands.
