# Findings

## 2026-05-21

- Current data model is compact and data-driven: `LOCS`, `ACTIONS`, `SKILLS`, `ENEMIES`, `NPCS`, `MAIN_EVENTS`.
- `state.js` supports daily main events, side opportunities, training minigames, travel, battles, skill equipment, and render model generation.
- `events.js` already provides weighted side opportunities, so net narrative can extend this instead of creating a new event engine.
- `combat.js` has its own internal `SKILLS` and `ENEMY_TEMPLATES`; adding only content data would make new skills appear in UI but fail in battle preview/resolution.
- `economy.js` owns `STYLE_KEYS`, `SKILL_STYLE`, and settlement labels; new styles need to be added there as well as in `data.js` and `state.js`.
- UI already has task cards and combat read-board. It needs choice-modal rendering and better grouping for expanded style/location density.
- `docs/TASK_PLAN.md` is newer than the old checkpoint workspace and is the active plan for Batch 19.
- `state.js` starts main events in `dispatch({ type: 'startMainEvent' })`; adding a choice network should branch there before setting `main_${day}` complete.
- `ui.js` only has generic modal, travel modal, and training modal today; story choices need a dedicated `modal.type === 'storyChoice'` renderer and a new dataset action.
- `buildRenderModel()` already decorates `mainEvent`, actions, opportunities, skills, and NPC relations; use that path instead of adding a second UI state model.
- Implemented choice completion must remain after player selection, not at main-event open time; this is now handled by `resolveStoryChoice`.
- New style IDs are now derived from `STYLE_RULES` in state migration/new-state setup, reducing future drift when adding another school.
- Browser smoke needs bundled pnpm Playwright path plus system Chrome; direct `require('playwright')` still fails in this environment.

## 2026-05-21 Batch 21-23

- `updateMawProgress()` already had enough data for Batch 21; no new save version or resource key was needed.
- `combatPlanningRead()` is the right integration point for Batch 22 because it is render-model only and does not touch combat formulas.
- Day 30 can reuse `startBattle(..., { objectives })`; adding `objectiveProgress` to combat state keeps the objective UI independent from normal battle rewards.
- Objective detection is intentionally window-level and readable, not frame-data precise: it detects survival, guarded high pressure, straight-line hits, recovery after damage, reforge skill use, and calm retention.
- Browser validation can use npx temporary `@playwright/test` packages by deriving `NODE_PATH` from npm exec; the repo itself still does not have `@playwright/test` installed.
