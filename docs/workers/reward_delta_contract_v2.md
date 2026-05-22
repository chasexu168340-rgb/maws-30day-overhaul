# Reward Delta Contract v2

## Scope

Worker: `AGENT_B_GAMEPLAY_SYSTEMS`

Branch: `feat/reward-delta-contract-v2`

Allowed code touched: `maws_src/simulation/state.js`

## Contract

Structured reward deltas now normalize to:

```js
{
  key,
  label,
  value,
  delta,
  kind,
  icon,
  tone,
  priority,
  source
}
```

Supported `kind` values in this pass:

- `gain`
- `cost`
- `relation`
- `skill`
- `risk`
- `time`
- `item`
- `money`

## Implemented

- Settlement-derived deltas now pass through one normalizer that fills missing fields.
- `sp` losses become `cost`; positive state changes become `gain`; fatigue/heat/injury become `risk`.
- Time investment is emitted as `kind: "time"` with negative minute delta.
- Money changes remain `kind: "money"` so UI can style currency separately from generic costs.
- Skill unlocks use short labels such as `学会 刺拳`.
- Event notebook cards expose structured risk deltas before resolution.
- Item use settlement includes a structured item consumption delta.

## Out Of Scope

- No UI rendering changes.
- No combat formula changes.
- No economy curve changes.
- No data/story/content edits.
- No save key/version changes.

## Validation

- `npm run check:full` passed.
- `npm run test:playtest` passed.
- `git diff --check` passed.
