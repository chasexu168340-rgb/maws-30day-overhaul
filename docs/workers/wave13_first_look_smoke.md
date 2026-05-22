# Wave 13 First-Look Smoke

## Scope

- Worker: `AGENT_F_TECH_QA_TOOLS`
- Branch: current worker worktree branch
- Allowed files changed:
  - `maws_src/tests/wave13_first_look.spec.js`
  - `docs/workers/wave13_first_look_smoke.md`
  - `docs/agent_reports/AGENT_F_WAVE13_FIRST_LOOK_SMOKE.md`

## Checks Added

1. Rental home first look opens at `390x844`, has no horizontal overflow, and the main CTA remains above bottom nav.
2. Scene character click exposes `.maws-npc-menu` or another visible feedback surface.
3. Ordinary duration action result renders compact `.maws-reward-chip` feedback without duplicated long prose.
4. Time investment modal fits at `390x844`; duration buttons remain enabled and clickable.
5. Day 5 combat HUD exposes 4-6 compact command/action items in the command bar, keeps queue slots to 1-2, and `confirmBattle` can be clicked.

## Artifacts

- Screenshots: `test-results/wave13/`

## Validation

- Pass: `npm run build`
- Pass: `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Risks

- This worker only adds smoke coverage. Runtime fixes, UI fixes, data changes, and asset changes are intentionally out of scope.
- `docs/TASK_PLAN.md` was not modified because the task prompt restricts allowed edits to the three files listed above.
