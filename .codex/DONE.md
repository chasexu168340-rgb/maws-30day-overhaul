# DONE

## AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS

Status: implemented by parent Codex on `feat/skill-unlocks-data`.

Completed:
- Added `SKILL_UNLOCKS` data for existing skill-gain actions.
- Added `model.skillUnlocks` to the render model.
- Added first-time skill learn settlement lines for normal actions and training minigames.

Validation:
- `npm run build`: passed.
- Custom Node smoke: passed.
- `npm run test:smoke`: passed, 4 Chromium tests.
- `git diff --check`: passed; only Git CRLF working-copy warnings.

Next:
- Review `feat/skill-unlocks-data`; next implementation step is `AGENT_E_UI_PRESENTATION`.

## Previous

Agent: AGENT_F_TECH_QA_TOOLS

Status: implemented by parent Codex after external `codex exec` failed on local CLI authentication.

Completed:
- Added Playwright test dependency.
- Installed Chromium browser cache locally.
- Added `npm run test:smoke`.
- Added real-browser smoke coverage for location locks, metro station flow, skills page, and combat page across 390x844, 900x700, and 1365x768.
