# QA_WAVE9_SCENE_REVIEW

QA role: AGENT_F_TECH_QA_TOOLS

Reviewed integrated Wave 9 runtime on `origin/staging/reforge-unlocks-v1` at `b68cf3a` (`merge: visual direction scene ui`). This report branch was then synced with current staging to resolve the duplicate QA-report add/add conflict.

## Result

Conditional pass.

The integrated Wave 9 scene/UI work passes required validation and meets the core functional goals: merged branch ancestry is present, no asset or combat/data boundary drift was found, RPG-style dialogue is visible, scene characters provide click feedback, event resolution now has a result modal, and 390x844 does not horizontally overflow.

## Verified Branch Integration

`origin/staging/reforge-unlocks-v1` contains all required implementation branches:

- `feat/scene-stage-scale`
- `feat/dialogue-box-rebuild`
- `feat/event-feedback-loop`
- `docs/visual-direction-scene-ui`

QA reviewed final integrated staging, not isolated worker branches.

## Boundary Review

- Changed runtime files in final Wave 9 integrated diff: `maws_src/dom/ui.css`, `maws_src/dom/ui.js`, `maws_src/simulation/state.js`.
- Added/updated Wave 9 documentation and reports.
- `feat/event-feedback-loop` also touched `docs/TASK_PLAN.md`; this is a documentation-scope warning, not a runtime risk.
- No `assets/` changes.
- No `maws_src/assets/manifest.js` changes.
- No `maws_src/content/data.js` changes; `INITIAL_SKILLS` unchanged.
- No `maws_src/simulation/combat.js` changes; combat formulas unchanged.

## Functional Review

- 人物比例: improved. Scene characters now read as larger staged figures.
- 红黄灰背板: partially improved. The crude gray backing issue is reduced, but strong red/yellow/black panel treatment remains prominent.
- NPC/scene click feedback: present. Scene character click produced toast feedback.
- RPG dialogue box: improved and visibly RPG-like with portrait/nameplate/current-line focus.
- Event result feedback: present. `metro_observe` produced `.maws-modal.result-feedback` with a concrete lead line.
- 390x844 overflow: passed. Manual metric check reported `bodyScrollWidth=390`, `docScrollWidth=390`.
- Skills page: opened in browser smoke and manual check.

## Validation

- `npm run check:full`: passed.
  - `npm run build`: passed.
  - asset verification: passed, 95 manifest entries.
  - Playwright Chromium smoke: 4 passed.
- `git diff --check`: passed.
- Browser quick check: passed for map page, mainline dialogue, event feedback, skills page.

## Findings

- Medium: Visual backing is not fully resolved. The UI still leans heavily on red/yellow/black slabs and angled panels. This is acceptable for this QA pass if the goal was improvement, but not if the acceptance bar is complete removal of the abrupt red/yellow backing style.
- Low: Event result feedback is functional, but its summary chips are visually crowded on desktop. No overflow was observed.

## Recommendation

Merge the QA report branch after Manager review. Open a focused follow-up visual polish branch for the remaining red/yellow panel dominance and result-modal readability.
