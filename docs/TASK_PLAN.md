# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 9：Scene Presentation 多 CLI。先复制任务包并用两阶段 pipeline 启动：实现 A-D 并行，Manager 合并并推送 staging 后才启动 QA。

## Scope

- 新增/更新 Wave 9 worker prompts：`docs/codex_tasks/WAVE9_*.md`。
- 新增 Wave 9 pipeline spec：`scripts/wave9_scene_pipeline.json`。
- 新增安全启动 wrapper：`scripts/run_wave9_scene_workers.ps1`。
- 不采用包内旧 launcher 的 QA 并跑逻辑。
- 不直接改游戏运行代码；实现由 worker 分支负责。

## Plan

- [x] 解压 `MAWS_Wave9_Scene_Presentation_MultiCLI_v0.2.zip`。
- [x] 复制 Wave 9 prompts。
- [x] 给 prompts 补充 skill 指导和 commit/Manager 交接规则。
- [x] 生成两阶段 pipeline spec：A-D 实现先跑，QA 延后。
- [x] 生成安全 wrapper。
- [x] 验证 prompt/spec/script。
- [ ] 提交并推送 Wave 9 启动配置。
- [ ] 运行 Wave 9 pipeline。

## Validation

- [x] PowerShell scriptblock parse：通过。
- [x] Wave 9 JSON spec parse：通过。
- [x] `git diff --check`：通过。

## Result

- Wave 9 prompts 已复制并补充 skill/交接规则。
- 旧的 QA 并跑 launcher 已被安全 wrapper 替代。
- Wave 9 pipeline 将先跑 A-D，再由 Manager 合并，最后启动 QA。

## Risks

- A/B/C 都会碰 UI 文件，并行实现后合并可能冲突；Manager 需要按 A -> B -> C 顺序处理。
- QA 必须等 staging 集成后才跑。

## Next Step

提交推送 Wave 9 配置，然后运行 `scripts/run_wave9_scene_workers.ps1`。
