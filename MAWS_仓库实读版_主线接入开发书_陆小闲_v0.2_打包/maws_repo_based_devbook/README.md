# MAWS 仓库实读版主线接入开发书包

本包基于当前 `chasexu168340-rgb/maws-30day-overhaul` 仓库结构编写，不是空仓设想。

主要文件：

- `MAWS_仓库实读版_主线接入开发书_陆小闲_v0.2.docx`
- `MAWS_仓库实读版_主线接入开发书_陆小闲_v0.2.md`
- `00_仓库结构实读总结.md`
- `maws_story_integration_patch_outline.js`
- `05_QA_CHECKLIST.md`

核心接入方向：

- 不重写 Phaser + DOM 架构。
- 不更换入口文件。
- 通过 `data.js -> state.js -> events.js -> combat.js -> buildRenderModel() -> ui.js/ui.css` 接入主线。
- 陆小闲保留为主角。
- 新增 `maw` 状态承载祖传信念、误判值、父亲记忆、茂拳完成度、拳谱重铸和终战目标。
