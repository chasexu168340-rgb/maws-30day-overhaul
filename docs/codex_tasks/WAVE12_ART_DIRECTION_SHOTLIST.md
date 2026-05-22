# WAVE12_ART_DIRECTION_SHOTLIST

你是 AGENT_A_PRODUCER_INTEGRATOR + AGENT_E_UI_PRESENTATION。本轮只写视觉验收规范，不改运行代码。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

本地 skill：开工前读取 `C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\technical-writer\SKILL.md`、`C:\Users\Administrator\.codex\skills\visual-media\SKILL.md`，不存在则跳过并继续。

允许修改：docs/ui/WAVE12_VISUAL_SHOTLIST.md、docs/workers/wave12_art_direction_shotlist.md、docs/agent_reports/AGENT_A_WAVE12_ART_DIRECTION.md。

任务：写 Wave12 视觉验收 shotlist，包含地图页 1536x864、战斗页 1536x864、小事件结果、NPC 点击反馈、技能页、时间投入弹窗、手机 390x844。每张截图判断第一眼看哪里、是否像游戏而不是调试面板、信息是否重复、角色是否融入背景、CTA 是否明确。

硬性不合格：大面积红黄灰背板盖住角色；卡牌/面板遮挡舞台超过三分之一；reward chip 是长句不是数值；NPC 点击只有 toast；重要行动被底栏遮挡。

验证：git diff --check。
