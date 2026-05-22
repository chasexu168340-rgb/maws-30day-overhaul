# Worker Handoff: Visual Direction Scene UI

## Scope

This handoff covers documentation-only visual direction for MAWS scene UI. It does not authorize runtime code, data, asset, package, task handoff, or task plan changes.

## Output Files

- `docs/ui/VISUAL_DIRECTION_SCENE_UI.md`
- `docs/workers/visual_direction_scene_ui.md`
- `docs/agent_reports/AGENT_A_VISUAL_DIRECTION_SCENE_UI.md`

## Required Direction

- Protect the playfield: scene UI should not become a generic dashboard.
- Use color semantically: red for danger/mainline pressure, gold for key reward/mainline emphasis, gray for secondary detail.
- Keep the core loop visible: scene, role, click, choice, result, next step.
- Privilege the current story beat over exposition, history, or settlement details.

## Implementation Guidance For Later Workers

- Treat `docs/ui/VISUAL_DIRECTION_SCENE_UI.md` as the source of truth.
- Do not add new gameplay systems to satisfy this direction.
- When implementing, update only the smallest relevant UI/Phaser files and validate responsive layout.
- Keep dialogue history, long text, and reward detail collapsible by default.
- Ensure every click event produces visible feedback before asking the player for the next choice.

## Validation

- Documentation validation for this handoff: `git diff --check`.
- Runtime validation is intentionally out of scope for this documentation-only task.

## Risks

- Overusing P5-style color and motion could make ordinary events feel like mainline emergencies.
- Copying BG3-style consequence UI too literally could add unnecessary system breadth.
- Moving too much interaction into DOM panels could weaken DOS2-style scene clicking and character interaction.
