# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

P0-BATTLE-SURRENDER-RESULT on `fix/battle-surrender-result`.

## Scope

- Fix combat surrender so it cannot resolve as win/pass.
- Keep rewards, battle result modal, logs, event log, and combat memory consistent with surrender as failure/retreat.
- Add one minimal regression test in the existing Wave 15 smoke file.
- Do not modify UI blocker CSS, package files, assets, save key/version, enemy data, or broad economy systems.

## Current Result

- `maws_src/simulation/state.js` now treats `reason === 'surrender'` as a hard non-win in ordinary battle resolution.
- Ordinary battle surrender shows `认输/撤退`, records failure/retreat language, does not pay enemy money/fame rewards, and records combat memory as a loss.
- Special result branches have surrender guards so `finishParkCheckBattle()` and `finishObjectiveBattle()` cannot pass/win from completed objectives or HP checks after surrender; `finishFirstWindBattle()` records surrender as a loss-style result.
- `maws_src/tests/wave15_addiction_loop.spec.js` includes a regression test for surrender modal text, rewards, logs, and combat memory.

## Validation

- `npm run build`: passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`: passed, 6 Chromium tests.
- `npm run test:smoke`: passed, 4 Chromium tests.
- `git diff --check`: passed with CRLF working-copy warnings only.

## Risks

- Special story battles still keep their existing progression side effects after surrender; this task only prevents surrender from becoming win/pass or paying opponent rewards.
- Combat memory has no separate surrender counter in the current structure, so surrender is recorded through the existing loss path.

## Next Step

- Manual QA can recheck in-battle surrender if desired.
- If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
