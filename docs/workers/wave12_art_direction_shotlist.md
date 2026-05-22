# Worker Handoff: Wave12 Art Direction Shotlist

## Scope

This handoff covers documentation-only visual acceptance for Wave12 screenshots. It does not authorize runtime code, data, assets, package files, save schema, balance, or implementation changes.

## Output Files

- `docs/ui/WAVE12_VISUAL_SHOTLIST.md`
- `docs/workers/wave12_art_direction_shotlist.md`
- `docs/agent_reports/AGENT_A_WAVE12_ART_DIRECTION.md`

## Source Of Truth

Use `docs/ui/WAVE12_VISUAL_SHOTLIST.md` as the source of truth for Wave12 visual screenshot acceptance.

## Required Screenshots

- Map page at `1536x864`.
- Battle page at `1536x864`.
- Small event result.
- NPC click feedback.
- Skill page.
- Time investment modal.
- Mobile viewport at `390x844`.

## Required Judgement Per Screenshot

Each screenshot must answer:

- Where does the eye land first?
- Does it look like a game screen rather than a debug panel?
- Is information repeated or competing with itself?
- Do characters feel integrated into the background?
- Is the next CTA clear and reachable?

## Hard Fail Conditions

- Large red, yellow, or gray backing panels cover the characters.
- Cards or panels block more than one third of the stage.
- Reward chips are long sentences instead of compact deltas.
- NPC click feedback is only a toast.
- Important actions are covered by the bottom navigation.

## Guidance For Later Workers

- Treat the scene and characters as the primary surface; panels should support the scene rather than replace it.
- Use red, gold, and gray as semantic accents, not broad background plates.
- Keep rewards compact and numeric where possible.
- Prefer visible scene, dialogue, state, or CTA changes for click feedback.
- Preserve mobile reachability before adding extra detail.

## Validation

- Documentation validation for this handoff: `git diff --check`.
- Build and browser smoke are intentionally out of scope because this task changes documentation only.

## Risks

- A screenshot can pass automated tests while still failing first-read clarity.
- Dense UI can make MAWS look like an admin panel even when every feature is technically present.
- Toast-only feedback can hide successful interaction from the player.
