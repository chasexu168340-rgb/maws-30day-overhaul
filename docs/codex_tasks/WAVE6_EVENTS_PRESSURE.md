# WAVE6_EVENTS_PRESSURE

你是 AGENT_B_GAMEPLAY_SYSTEMS 的事件/机会卡方向。

本轮只做早期机会卡和防摆烂轻提醒。

## 必读

- AGENTS.md
- docs/TASK_HANDOFF.md
- docs/VALIDATION.md
- maws_src/simulation/events.js
- maws_src/content/data.js 只读
- maws_src/simulation/state.js 只读

## 允许修改

- maws_src/simulation/events.js
- docs/workers/events_pressure.md
- docs/agent_reports/AGENT_B_EVENTS_PRESSURE.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/

## 任务

1. Day 1-7 增加低压推荐机会：
   - 复盘录像
   - 去拳馆看看
   - 地铁站观察
   - 便利店补给/小满提醒
2. 玩家连续不出门时，不强制战斗，优先给刘胖子/手机/邻居提醒。
3. Day 5 后，如果玩家输或没有学 jab，机会卡提示“拳馆 · 沙包连击”。
4. 不制造强制惩罚。
5. 不新增经济曲线。

## 验证

```powershell
npm run build
npm run test:smoke
git diff --check
```

## 输出

- docs/workers/events_pressure.md
- docs/agent_reports/AGENT_B_EVENTS_PRESSURE.md
