# Time Activity Feel Pass

## Task

Wave 13 / AGENT_B_GAMEPLAY_SYSTEMS：让 30/60/90/120 分钟投入更像“安排一段时间”，而不是继续膨胀收益倍率。

## Changes

- 调整 `TIME_DOSAGE_OPTIONS`：
  - 短练保留低收益，但进一步降低体力/疲劳压力，适合补碎片时间。
  - 标准练标为默认推荐，不附加日程压力。
  - 深练降低收益倍率，加入 `opportunityPressure: 1`，反馈为占掉一段机会窗口。
  - 硬练降低收益倍率、提高体力/疲劳和小伤风险，加入 `opportunityPressure: 2`。
- `state.js` 增加日程压力：
  - `daily.timeCommitted` 记录当天已投入分钟数。
  - 深练/硬练会写入 `daily.schedulePressure`，并在结算文本提示机会成本。
- `events.js` 增加机会成本读取：
  - 当天时间投入过多或硬练压力高时，机会卡从 2 张收窄到 1 张。
  - 日程压力会压低战斗机会排序，轻推对话、补给、恢复类机会。
- 微行动限刷：
  - 发呆、看笔记、刷短视频、打电话、拉伸仍是恢复/消息/自省/轻线索动作。
  - 当天重复同一微行动，或微行动总数过多后，只保留恢复和自省价值，不再滚额外资源。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `git diff --check`：通过。

## Risk

- 未修改 UI、combat、assets、package、存档 key/version。
- 数值是保守微调；后续可用 playtest 观察深练/硬练是否仍过强。
