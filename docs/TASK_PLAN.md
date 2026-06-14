> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Fix second-round QA issue on branch `fix/boxing-basics-affordance`: boxing gym `bag` copy must match the next real Boxing Basics reward target after the player may already know `jab`.

## Scope

- Keep existing Day9 boxing gym unlock logic.
- Keep real skill ids: `jab` for 刺拳 and `straight` for 直拳.
- Do not change rewards, reward values, save key/version, package files, assets, combat formulas, economy curves, event weights, skill pagination, 100% completion rewards, or broader Boxing Basics systems.
- Limit changes to dynamic UI/render labels, skill-tree guide copy, focused tests, and this task plan.

## Current Result

- `bag` data name is back to the generic `沙包连击`.
- `state.js` now derives the displayed `bag` name from current learned skills:
  - no `jab`: `沙包连击（刺拳入门）`
  - has `jab` but no `straight`: `沙包连击（直拳入门）`
  - has both: `沙包连击（拳击基础）`
- The dynamic action object is used by the map action list, duration choice modal, training mini modal, training result title, and skill-tree guide.
- `bag` settlement unlock feedback now surfaces only the next target that matched the pre-action derived label: no `jab` shows `学会 刺拳`; `jab` learned but no `straight` shows `学会 直拳`.
- The Boxing Basics jab node now says `刺拳已掌握` and points to straight / continued Boxing Basics training after `jab` is already learned, instead of showing a刺拳入门 CTA.
- The boxing gym still features `bag` as the primary action while either `jab` or `straight` is missing.
- Focused coverage now includes Day9 no-jab entry guidance, jab-learned/straight-missing bag label, straight reward feedback, and jab-node CTA behavior.

## Modified Files

- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/content/data.js`
- `maws_src/tests/wave15_addiction_loop.spec.js`
- `docs/TASK_PLAN.md`

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed: 16/16.
- `npm run test:smoke` passed: 4/4.

## Risks

- `bag` rewards are intentionally unchanged, so this fix only aligns displayed labels and feedback with the player's current next missing Boxing Basics skill.
- No package files, assets, save key/version, combat formulas, economy curves, or event weights were modified.

## Next Step

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
