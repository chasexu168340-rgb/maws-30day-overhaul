# AGENT_C_DAY5_COMBAT_SIM

## Result

- Added `maws_src/tools/sim_day5_park_check.mjs`.
- Added Day5 combat sim worker notes.
- The sim runs three origins through a fixed Day5/E01 park check smoke using existing `GameStore` dispatch APIs.

## Files

- `maws_src/tools/sim_day5_park_check.mjs`
- `docs/workers/day5_combat_sim.md`
- `docs/agent_reports/AGENT_C_DAY5_COMBAT_SIM.md`

## Validation

Completed:

```powershell
npm run build
node maws_src/tools/sim_day5_park_check.mjs
git diff --check
```

Script output:

```text
origin=worker | windowCount=1 | hp=110/146 | sp=100/122 | posture=84/89 | objective=4/4 | done=撑过第一个窗口、抱架降压一次、后撤拉开距离、士气没有崩盘 | result=pass | reason=park_check_pass
origin=fan | windowCount=1 | hp=97/133 | sp=100/111 | posture=70/86 | objective=4/4 | done=撑过第一个窗口、抱架降压一次、后撤拉开距离、士气没有崩盘 | result=pass | reason=park_check_pass
origin=student | windowCount=1 | hp=97/143 | sp=100/126 | posture=67/95 | objective=4/4 | done=撑过第一个窗口、抱架降压一次、后撤拉开距离、士气没有崩盘 | result=pass | reason=park_check_pass
```

## Notes

- No game logic, combat values, data, UI, assets, or package scripts were modified.
- Browserless setup still needs direct test-state positioning for Day 5 because no dedicated exported route runner exists.
- The sim uses a local seeded RNG wrapper for reproducible CLI output.
