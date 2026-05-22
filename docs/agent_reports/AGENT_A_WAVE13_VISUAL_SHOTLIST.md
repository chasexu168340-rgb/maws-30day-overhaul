# AGENT_A Wave 13 Visual Shotlist Report

## Summary

Produced the Wave 13 first-look shotlist for manual visual acceptance.

## Files Changed

- `docs/ui/WAVE13_FIRST_LOOK_SHOTLIST.md`
- `docs/workers/wave13_visual_shotlist.md`
- `docs/agent_reports/AGENT_A_WAVE13_VISUAL_SHOTLIST.md`

## Coverage

The shotlist covers all requested screens:

1. 出租屋主界面
2. 点击 NPC/角色
3. 普通事件收益反馈
4. 时间投入弹窗
5. Day 5 战斗 HUD

For each screen, the document specifies pass criteria, fail criteria, screenshot angle, and mobile/desktop checks.

## Validation

- `git diff --check`: passed.

## Constraints Followed

- Did not modify `maws_src/`.
- Did not modify `assets/`.
- Did not modify `package.json`.
- Did not change runtime code, gameplay rules, data values, storage keys, or asset structure.

## Residual Risk

This is a documentation-only deliverable. It can guide human review, but it does not prove the current UI already passes the listed standards.

## Next Step

Run manual review against the shotlist and attach desktop/mobile screenshots for each of the five required screens.
