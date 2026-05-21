---
name: planning-with-files
description: 非简单任务默认使用的项目级上下文管理工作流。Use by default for non-simple Phaser project work, especially Phaser, UI, 大地图, 战斗, 训练, 事件, 物品, 技能, 资产, bugfix, QA, 多文件修改, checkpoint recovery, implementation planning, and browser-game validation tasks.
---

# Planning With Files

This project uses file-based planning to reduce Codex context waste. For any non-simple task, keep the active task state in project files instead of relying on chat history.

## Start Workflow

1. Read the planning files first:
   - `AGENTS.md`
   - `docs/CODEX_CONTEXT.md`
   - `docs/FILE_MAP.md`
   - `docs/TASK_PLAN.md`
2. Use `docs/FILE_MAP.md` to choose the smallest relevant file set for the task.
3. Read only those relevant files before editing.
4. State before editing:
   - task type
   - related files
   - avoided files/directories
   - implementation plan
   - validation commands
5. Edit only the files required by the task.
6. Update `docs/TASK_PLAN.md` after the change.
7. Run the validation commands, with `npm run build` as the default minimum check.

## Default Avoid List

Do not scan or read these unless the task explicitly needs them:

- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- `.vite/`
- `test-results/`
- generated image folders and intermediate image outputs
- large logs, videos, installers, archives, source photo folders

## Task File Rules

- `docs/CODEX_CONTEXT.md` is the project summary and constraints.
- `docs/FILE_MAP.md` decides which files to read for each task type.
- `docs/TASK_PLAN.md` records the current task, scope, files, plan, validation, risks, and next step.
- Older checkpoint files such as `docs/CURRENT_TASK.md` remain historical recovery material, not the default active task plan unless the current task asks for them.

## Non-Simple Task Definition

Use this workflow for any task that touches multiple files, changes game behavior, changes UI, changes assets, performs QA, investigates a bug, or requires more than a quick one-file edit.

Skip only for simple read-only questions, trivial text rewrites, or commands that do not need project context.
