# Worker Note: Wave 13 Visual Shotlist

## Worker

AGENT_A_ART_DIRECTION

## Scope

Allowed files only:

- `docs/ui/WAVE13_FIRST_LOOK_SHOTLIST.md`
- `docs/workers/wave13_visual_shotlist.md`
- `docs/agent_reports/AGENT_A_WAVE13_VISUAL_SHOTLIST.md`

No runtime source, asset, or package changes were made.

## Deliverable

Created a first-look visual QA shotlist for five required screens:

1. 出租屋主界面
2. 点击 NPC/角色
3. 普通事件收益反馈
4. 时间投入弹窗
5. Day 5 战斗 HUD

Each screen includes:

- 通过标准
- 不通过标准
- 截图角度
- 手机/桌面注意点

## Validation

Required validation:

```powershell
git diff --check
```

Build was intentionally skipped because this task only changes documentation.

## Notes For Reviewers

- The shotlist is written for manual acceptance, not automated screenshot testing.
- It focuses on first-look readability, click feedback, structured rewards, modal ergonomics, responsive safety, and battle HUD framing.
- It does not define new gameplay values, combat rules, assets, storage behavior, or UI implementation details.
