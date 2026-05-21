# File Map

Use this map to pick the smallest relevant file set. Do not start with a full repository scan.

## Scenes

- Entry: `maws_30day_overhaul_v3.html`
- Boot: `maws_src/main.js`
- Phaser scenes: `maws_src/phaser/scenes/`
- Phaser UI helpers: `maws_src/phaser/ui/p5ui.js`

Read for Phaser boot issues, canvas/render problems, sprite playback, combat VFX, or scene lifecycle bugs.

## Systems

- State/store/dispatch/render model: `maws_src/simulation/state.js`
- Combat resolution and enemy responses: `maws_src/simulation/combat.js`
- Economy helpers: `maws_src/simulation/economy.js`
- Event/opportunity rules: `maws_src/simulation/events.js`

Read for combat, training, travel, save/load, equipment, settlement, mainline, event, and progression tasks.

## Data

- Main game data: `maws_src/content/data.js`

Read for locations, actions, skills, enemies, items, NPC text, story hooks, rewards, costs, and labels. Do not change values unless the task explicitly asks for balance or data changes.

## UI

- DOM structure: `maws_src/dom/ui.js`
- DOM styling: `maws_src/dom/ui.css`

Read for HUD, bottom navigation, map page, city overlay, combat cards, task board, equipment UI, training modal, responsive layout, text overlap, and button clickability.

## Assets

- Manifest: `maws_src/assets/manifest.js`
- Runtime assets: `assets/`
- Asset validation: `maws_src/tools/verify_assets.mjs`

Read for missing images, spritesheet metadata, asset keys, loading failures, or replacement art. Do not scan generated asset folders by default.

## Tools And QA

- Build check: `maws_src/tools/build_check.mjs`
- Asset check: `maws_src/tools/verify_assets.mjs`
- Playwright smoke sample: `maws_src/tests/phaser-smoke.spec.js`
- Current validation contract: `docs/VALIDATION.md`
- Current task handoff: `docs/TASK_HANDOFF.md`
- Current task plan: `docs/TASK_PLAN.md`
- Historical results stub: `docs/CURRENT_TEST_REPORT.md`

Read for validation tasks, browser smoke, build failures, or QA planning.

## Task Routing

- Battle loop/combat feel: read `state.js`, `combat.js`, `ui.js`, `ui.css`, then selected enemy/skill entries in `data.js`.
- UI/HUD/responsive bug: read `ui.js`, `ui.css`, and only the render model section in `state.js` if UI data is unclear.
- Big map/travel: read `state.js`, `ui.js`, `ui.css`, and location/travel data in `data.js`.
- Training/minigame: read `state.js`, `ui.js`, `ui.css`, and relevant action data in `data.js`.
- Events/NPC/story: read `events.js`, `state.js`, and relevant `data.js` sections.
- Items/equipment: read `data.js`, `state.js`, `ui.js`, and `ui.css`.
- Skills: read `data.js`, `combat.js`, `state.js`, and `ui.js`.
- Assets: read `manifest.js`, `verify_assets.mjs`, and only the specific asset folders needed.
- QA only: read `TASK_HANDOFF.md`, `TASK_PLAN.md`, `VALIDATION.md`, test files, and the minimum source needed to understand the failing check.
- Worker handoff: read `TASK_HANDOFF.md`, `EXECUTION_CONTRACT.md`, `SPRINT_BOARD.md`, `FILE_MAP.md`, `VALIDATION.md`, then the task prompt and smallest relevant source set.

## Current Task Routing

- Current handoff: `docs/TASK_HANDOFF.md`
- Execution contract: `docs/EXECUTION_CONTRACT.md`
- Validation gates: `docs/VALIDATION.md`
- Current board: `docs/SPRINT_BOARD.md`
- Archived legacy batches: `docs/archive/legacy_batches/`
- `docs/CURRENT_TASK.md`, `docs/CURRENT_STATUS.md`, `docs/CURRENT_TEST_REPORT.md`, and `docs/CHANGELOG.md` are historical stubs. Do not use them as current task sources.

## Default Avoid List

Avoid unless explicitly needed:

- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- `.vite/`
- `test-results/`
- `assets/imagegen*/`
- source photo/reference folders
- `*.mp4`, `*.exe`, `*.zip`, large logs and generated screenshots
