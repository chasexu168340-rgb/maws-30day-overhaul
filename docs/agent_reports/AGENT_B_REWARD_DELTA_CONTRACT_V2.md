# AGENT_B_REWARD_DELTA_CONTRACT_V2

## Summary

Completed Reward Delta Contract v2 for gameplay/system settlement output.

## Files Changed

- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/workers/reward_delta_contract_v2.md`
- `docs/agent_reports/AGENT_B_REWARD_DELTA_CONTRACT_V2.md`

## Details

- Added a normalization layer for reward deltas so generated entries consistently include required structural fields.
- Mapped reward kinds to the v2 contract: `gain`, `cost`, `relation`, `skill`, `risk`, `time`, `item`, `money`.
- Preserved backward-compatible settlement data while making UI-facing `rewardDeltas` less dependent on prose.
- Shortened skill unlock settlement text to `学会 <技能名>`.
- Added structured risk deltas for event notebook cards and shop opportunity resolution.
- Added structured item delta for consumable use.

## Validation

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- `git diff --check`: passed.

## Risk

No UI code was changed. Follow-up UI work should consume `rewardDeltas` directly and avoid parsing `body`, `gain`, `risk`, or long settlement text.
