# Wave15 Addiction Loop Smoke

## Scope

- Owner: `AGENT_F_TECH_QA_TOOLS`
- Task: add Playwright coverage for the first Wave15 addiction-loop slice.
- Modified files are limited to this worker note, the agent report, and `maws_src/tests/wave15_addiction_loop.spec.js`.

## Coverage

- Skills page exposes Insight points and at least one spendable tree node.
- A skill-tree purchase through the store action opens compact reward feedback and keeps the node owned after a rerender.
- Combat plan mode exposes at least three tactical recipe modes from `safe / pressure / exit / probe`.
- Day 5 combat produces readable tactical feedback instead of only a combo placeholder.
- Mobile `390x844` checks map, skill tree, and combat recipe surfaces for horizontal overflow.

## Validation

- Passed:
  - `npm run build`
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` - 5 passed
  - `git diff --check`

## Notes

- The current UI render model exposes node status, cost, and points; purchase is verified through the existing `purchaseSkillTreeNode` store action because this QA task is not allowed to edit UI business code.
