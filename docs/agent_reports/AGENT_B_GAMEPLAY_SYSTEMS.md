# AGENT_B_GAMEPLAY_SYSTEMS

## Status

Implemented on `feat/skill-unlocks-data` after Harness Delta.

## Changes

- Added `SKILL_UNLOCKS` data for existing skill-gain actions:
  - `bag`: `jab`, `straight`
  - `pressure_test`: `palm`, `offbalance`
  - `sprawl_drill`: `sprawl`, `escape`
  - `sanda_combo_drill`: `sanda_whip_kick`, `sanda_catch_throw`
  - `karate_kihon_drill`: `karate_reverse_punch`, `karate_front_kick`
  - `tkd_kick_line`: `tkd_roundhouse`, `tkd_back_kick`
- Added `model.skillUnlocks` in `buildRenderModel()`.
- Added first-time skill learn settlement lines for normal actions and training minigames.

## Boundaries

- Did not modify UI files.
- Did not modify combat formulas.
- Did not modify economy curves.
- Did not modify save key/version.
- Did not add art assets.

## Validation

- `npm run build`: passed.
- Custom Node smoke: passed. `bag` produced `学会：刺拳 / 来源：拳馆 · 沙包连击` and `学会：直拳 / 来源：拳馆 · 沙包连击`; render model exposed `skillUnlocks`.
- `npm run test:smoke`: passed, 4 Chromium tests.
- `git diff --check`: passed; only Git CRLF working-copy warnings.

## Next

`AGENT_E_UI_PRESENTATION` should replace static skill-source mapping with `model.skillUnlocks`.
