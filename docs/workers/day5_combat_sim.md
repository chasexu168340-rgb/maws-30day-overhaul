# Day5 Combat Sim

## Scope

- 新增 Node-only Day 5 / E01 objective-style 验货 smoke。
- 只复用 `GameStore`、`startMainEvent`、`confirmBattle` 和 render model。
- 不修改战斗公式、数据、UI、资产或 package scripts。

## Route

- Origins: `worker`, `fan`, `student`
- Setup: new game, set day/time/location to Day 5 park check context.
- Fixed queue: `guard`, `retreat`
- Expected target: trigger one Day5/E01 park check window and report objective completion/result.

## Command

```powershell
node maws_src/tools/sim_day5_park_check.mjs
```

## Current Result

```text
origin=worker | windowCount=1 | hp=110/146 | sp=100/122 | posture=84/89 | objective=4/4 | done=撑过第一个窗口、抱架降压一次、后撤拉开距离、士气没有崩盘 | result=pass | reason=park_check_pass
origin=fan | windowCount=1 | hp=97/133 | sp=100/111 | posture=70/86 | objective=4/4 | done=撑过第一个窗口、抱架降压一次、后撤拉开距离、士气没有崩盘 | result=pass | reason=park_check_pass
origin=student | windowCount=1 | hp=97/143 | sp=100/126 | posture=67/95 | objective=4/4 | done=撑过第一个窗口、抱架降压一次、后撤拉开距离、士气没有崩盘 | result=pass | reason=park_check_pass
```

## Limitations

- The tool mutates the test store into Day 5 park context because there is no exported browserless day-by-day route helper.
- It does not duplicate combat formulas; all exchange resolution remains inside existing store/combat dispatch flow.
- The tool seeds `Math.random` only around its own run so the objective smoke output is reproducible.
