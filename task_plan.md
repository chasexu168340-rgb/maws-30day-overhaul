# MAWS Long Task Plan

Last updated: 2026-05-21

## Goal

执行 Batch 21-23：让茂家拳重铸进度可见，让战斗选择更可读，并把 Day 30 从普通胜负改为目标战收束。

## Current Batch

- Batch: 21-23
- Status: complete
- Type: state/combat/UI/final-battle implementation

## Files In Scope

- `maws_src/simulation/state.js`
- `maws_src/simulation/combat.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/TASK_PLAN.md`
- `docs/CURRENT_TEST_REPORT.md`

## Files Out Of Scope

- `assets/`
- `maws_src/assets/manifest.js`
- Phaser Scene rewrites
- save key/version changes
- whole-project refactors

## Phases

- [x] Read constraints, current checkpoints, Batch 18 replan, and relevant skills.
- [x] Inspect current data/state/combat/UI structure.
- [x] Add visible MAW reforge module model and profile UI.
- [x] Add combat read-board advice metadata and DOM rendering.
- [x] Add Day 30 objective battle tracking and tiered ending.
- [x] Run build, Node smoke, browser smoke, and diff whitespace check.
- [x] Update checkpoints with results and risks.

## Validation Results

- `node --check` for `state.js`, `combat.js`, `ui.js`: passed.
- `npm run build`: passed; checked 20 JS/MJS files and verified 93 manifest entries.
- Node smoke: passed; Day 9 reveals reforge modules, Day 30 objective battle starts and advances.
- Browser smoke with system Chrome: passed; desktop and 390x844 show reforge/objectives/read-board with no horizontal overflow.
- `git diff --check`: passed with existing LF/CRLF warnings only.

## Errors Encountered

| Time | Error | Resolution |
| --- | --- | --- |
| 2026-05-21 | `session-catchup.py` failed because `python` is not installed on PATH. | Continued from project checkpoint files. |
| 2026-05-21 | First local Node `-e` static server exited before binding. | Switched to hidden `npx http-server` on port 5199. |
| 2026-05-21 | Existing Playwright spec could not run because `@playwright/test` is not installed in the repo. | Used npx temporary package plus `NODE_PATH` and a direct browser smoke script with system Chrome. |

## Notes

- Reforge score now uses existing data, not a new save version.
- Day 30 objectives are stored under existing `state.maw.objectives` and combat `objectiveProgress`.
- No asset manifest, economy curve, enemy stat, save key, or Phaser Scene changes were made.
