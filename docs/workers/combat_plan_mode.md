# Combat Plan Mode

## Scope

- Worker: `AGENT_C_COMBAT_FEEL`
- Branch target: `feat/combat-plan-mode-v1`
- Runtime files: `maws_src/simulation/combat.js`, `maws_src/simulation/state.js`

## Behavior

- Combat keeps the existing 1-2 action window rhythm.
- Plan mode is lightweight state, not full autoplay.
- Supported modes:
  - `manual`: player-driven queue, preserving the previous empty-confirm `guard` fallback.
  - `safe`: suggests `guard -> wild_swing`, falling back to `guard -> retreat` when usable.
  - `pressure`: suggests `push_away -> wild_swing`.
  - `exit`: suggests `talkdown -> retreat`.
- The suggested queue is only used when the player has selected no actions for the current window.
- Existing combo rules stay small: hit/risk/refund bonuses remain minor and no damage formula was changed.

## Future Slots

- `planSlot` is reserved on combat state for future plan-tree selection.
- `comboSlot` is reserved on combat state for future combo-tree selection.
- This worker only exposes and preserves the fields; no skill tree logic is implemented.

## Logging

- When a plan fills an empty queue, combat log records the plan id, label, suggested queue, `planSlot`, and `comboSlot`.
- Existing combo logs continue to name the combo that triggered.
