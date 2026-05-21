# Agent Workspace Archive

This folder is the reviewable archive for the local `maws-agent-*` worktrees.

The full moved worktree directories are intentionally kept out of Git because each one is a complete repository copy with a `.git` worktree pointer. This archive keeps the review-relevant task records instead: branch, commit, reports, proposals, and Codex checkpoint files.

| Workspace | Branch | Commit | Status |
|---|---|---:|---|
| `maws-agent-01-core` | `feat/reforge-core-unlocks` | `49b927c` | clean |
| `maws-agent-02-ui` | `feat/reforge-ui-locks` | `3bb0c67` | clean |
| `maws-agent-03-metro` | `feat/reforge-metro-content` | `07a3529` | clean |
| `maws-agent-04-skills` | `feat/reforge-skill-unlocks` | `3a0612b` | clean |
| `maws-agent-05-combat` | `feat/reforge-early-combat` | `3a0612b` | clean |
| `maws-agent-06-qa` | `qa/reforge-unlocks-v1` | `3a0612b` | clean |
| `maws-agent-07-friend` | `content/reforge-friend-pack` | `3a0612b` | clean |

## Review Entry Points

- `../TASK_PLAN.md`
- `../agent_reports/`
- `./maws-agent-01-core/`
- `./maws-agent-02-ui/`
- `./maws-agent-03-metro/`

## Local-Only Full Worktrees

The full folders `maws-agent-01-core/` through `maws-agent-07-friend/` remain available in the project directory for local inspection, but are ignored by Git.
