# WAVE11_UI_READABLE_REWARD_PASS

你是 AGENT_E_UI_PRESENTATION。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：把 UI 从“折叠太多 + 奖励不够爽 + 对话弹窗不顺眼”改成“有用信息默认可见，细节可折叠，收益数字爽快弹出”。

## 允许修改

- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/ui_readable_reward_pass.md
- docs/agent_reports/AGENT_E_UI_READABLE_REWARD_PASS.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/simulation/events.js
- assets/
- package.json
- INITIAL_SKILLS

## 任务

1. 战斗 UI：
   - 开局只突出 1-2 张“本窗口行动卡/队列槽”。
   - 全部可用技能不要铺满主战斗面板，放进“更多动作/战术抽屉”。
   - 现有 queueLimit=2 的概念要在 UI 上更明显。
   - 未来槽位可扩，但本轮只做 UI 呈现，不实现技能树槽位解锁。

2. 收益反馈：
   - 结果 modal 中收益要用大号数字 chips 或短暂 gain-pop。
   - 例如 现金 +20、冷静 +2、关系 +1、学会：野路挥拳。
   - 详细结算仍可折叠，但主要收益默认可见。
   - 事件反馈 chips 要更松，不要挤。

3. 弹窗尺寸：
   - 小内容用 compact modal，不要全屏大窗口。
   - 对话不要强行靠右侧，不要把主台词挤到角落。
   - 对话框默认居中/下方 RPG 样式，当前台词优先。

4. 折叠策略修正：
   - 不要把有用信息全缩进 details。
   - 行动卡默认显示：时间、体力/钱、主要收益一句话。
   - 技能卡默认显示：用途、熟练度/来源一句话。
   - details 只放长描述、完整数值、完整结算。

## 验证

npm run check:full
npm run test:playtest
git diff --check

## 输出

- docs/workers/ui_readable_reward_pass.md
- docs/agent_reports/AGENT_E_UI_READABLE_REWARD_PASS.md
