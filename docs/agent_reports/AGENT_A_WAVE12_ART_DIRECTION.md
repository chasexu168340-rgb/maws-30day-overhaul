# Agent A Report: Wave12 Art Direction Shotlist

## Role

AGENT_A_PRODUCER_INTEGRATOR + AGENT_E_UI_PRESENTATION

## Result

Created a documentation-only Wave12 visual acceptance shotlist. No runtime code, assets, package files, save files, balance data, or task-plan files were changed.

## Files

- `docs/ui/WAVE12_VISUAL_SHOTLIST.md`
- `docs/workers/wave12_art_direction_shotlist.md`
- `docs/agent_reports/AGENT_A_WAVE12_ART_DIRECTION.md`

## Coverage

- Map page acceptance at `1536x864`.
- Battle page acceptance at `1536x864`.
- Small event result acceptance.
- NPC click feedback acceptance.
- Skill page acceptance.
- Time investment modal acceptance.
- Mobile acceptance at `390x844`.

## Acceptance Axes

- First eye target.
- Game-screen feel versus debug-panel feel.
- Information repetition.
- Character integration with background.
- CTA clarity and reachability.

## Hard Fail Criteria

- Large red, yellow, or gray backing panels cover characters.
- Cards or panels obscure more than one third of the stage.
- Reward chips use long sentences instead of compact deltas.
- NPC click feedback is only a toast.
- Important actions are blocked by the bottom bar.

## Validation

- Required command: `git diff --check`.
- Build and browser smoke are skipped because this task changes documentation only.

## Follow-Up

QA should use `docs/ui/WAVE12_VISUAL_SHOTLIST.md` when reviewing Wave12 screenshots and report pass/fail per screenshot with the first visual target, any hard fail, and the highest-priority fix.
