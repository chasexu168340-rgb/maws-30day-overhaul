param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$ParentDir = "E:\",
  [string]$PromptSource = ""
)

$ErrorActionPreference = "Stop"

$PromptSource = if ($PromptSource) { $PromptSource } else { Join-Path $RepoRoot "docs\codex_tasks" }
$worktree = Join-Path $ParentDir "maws-agent-01-core"
$script = Join-Path $RepoRoot "scripts\run_agent_loop.ps1"
$prompt = Join-Path $PromptSource "AGENT_01_CORE_UNLOCKS.md"

if (!(Test-Path $worktree)) { throw "Missing worktree: $worktree" }
if (!(Test-Path $prompt)) { throw "Missing prompt: $prompt" }

New-Item -ItemType Directory -Force -Path (Join-Path $worktree "docs\codex_tasks") | Out-Null
Copy-Item $prompt (Join-Path $worktree "docs\codex_tasks\AGENT_01_CORE_UNLOCKS.md") -Force

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-Command",
  "cd `"$worktree`"; & `"$script`" -AgentName AGENT_01_CORE_UNLOCKS -PromptFile docs\codex_tasks\AGENT_01_CORE_UNLOCKS.md -MaxRounds 4"
)
