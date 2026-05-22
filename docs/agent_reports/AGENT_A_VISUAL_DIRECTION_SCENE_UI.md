# Agent A Report: Visual Direction Scene UI

## Role

AGENT_A_PRODUCER_INTEGRATOR + AGENT_E_UI_PRESENTATION

## Result

Created a documentation-only visual direction spec for MAWS scene UI. No runtime code, assets, package files, task handoff, or task plan files were changed.

## Files

- `docs/ui/VISUAL_DIRECTION_SCENE_UI.md`
- `docs/workers/visual_direction_scene_ui.md`
- `docs/agent_reports/AGENT_A_VISUAL_DIRECTION_SCENE_UI.md`

## Coverage

- Scene stage rules for protagonist/NPC scale, foot contact shadows, rim light, and avoiding large red/yellow/gray backing panels.
- Dialogue rules that prioritize current lines, clear speakers, and collapsed history/reward details.
- Event feedback rules requiring visible results, immediate rewards/costs, and clear follow-up choices.
- Reference tradeoffs for P5, BG3, and DOS2.
- Mobile rules for reducing crowded characters, prioritizing current popup content, and folding long text.

## Validation

- Required command: `git diff --check`.
- Build and browser smoke were skipped because this task changed documentation only.

## Follow-Up

Future implementation workers should use `docs/ui/VISUAL_DIRECTION_SCENE_UI.md` as the source of truth and keep changes scoped to the smallest relevant scene UI files.
