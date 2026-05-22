# WAVE9_SCENE_STAGE_SCALE

你是 AGENT_G_ASSET_WORLD + AGENT_E_UI_PRESENTATION。

本轮目标：把地图页的角色从“贴在背景上的小卡片”改成“真的站在场景里的人”。

## 允许修改

- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/scene_stage_scale.md
- docs/agent_reports/AGENT_G_SCENE_STAGE_SCALE.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/simulation/events.js
- maws_src/assets/manifest.js
- assets/
- package.json
- INITIAL_SKILLS

## 任务

1. 调整场景角色比例：
   - 桌面主角高度约占场景高度 58%-72%。
   - NPC 高度约占 45%-62%。
   - 手机端只保留主要角色或压缩显示，不要挤满屏。
2. 角色脚底要贴地，不能漂浮。
3. 去掉红黄灰大色块背板，改为柔和轮廓光、接触阴影、轻描边。
4. NPC/主角要能看起来属于当前背景。
5. 场景角色应可点击：
   - 如果角色有关联 NPC/action，点击触发对应对话或 toast。
   - 不新增状态系统，只复用现有 data-action。
6. 不新增图片，不改 manifest，不改资产文件。
7. 不做对话框重做，那是 Dialogue Worker 的任务。

## 验证

npm run check:full
git diff --check

## 输出

- docs/workers/scene_stage_scale.md
- docs/agent_reports/AGENT_G_SCENE_STAGE_SCALE.md

## Skill Guidance

- Game UI Frontend: protect the playfield, reduce persistent UI density, keep text-heavy UI in DOM, and make the first playable view read as a scene.
- UI/UX: make the correct interaction obvious, provide immediate feedback, preserve mobile responsiveness and focus states.

## Completion Rules

Before final response:

1. Run the validation commands above.
2. `git diff --check`.
3. Commit only allowed files with message: `feat: scale scene stage characters`.
4. Do not push; Manager will push and merge after all implementation workers finish.
