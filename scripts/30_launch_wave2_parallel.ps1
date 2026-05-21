param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$ParentDir = "E:\",
  [string]$PromptSource = ""
)

$ErrorActionPreference = "Stop"

$PromptSource = if ($PromptSource) { $PromptSource } else { Join-Path $RepoRoot "docs\codex_tasks" }
$script = Join-Path $RepoRoot "scripts\run_agent_loop.ps1"

$jobs = @(
  @{ Worktree="maws-agent-02-ui"; Agent="AGENT_02_UI_LOCKS"; Prompt="AGENT_02_UI_LOCKS.md"; Rounds=4 },
  @{ Worktree="maws-agent-03-metro"; Agent="AGENT_03_METRO_CONTENT"; Prompt="AGENT_03_METRO_CONTENT.md"; Rounds=2 },
  @{ Worktree="maws-agent-04-skills"; Agent="AGENT_04_SKILL_UNLOCKS"; Prompt="AGENT_04_SKILL_UNLOCKS.md"; Rounds=2 },
  @{ Worktree="maws-agent-05-combat"; Agent="AGENT_05_EARLY_COMBAT"; Prompt="AGENT_05_EARLY_COMBAT.md"; Rounds=2 },
  @{ Worktree="maws-agent-06-qa"; Agent="AGENT_06_QA"; Prompt="AGENT_06_QA.md"; Rounds=2 }
)

foreach ($job in $jobs) {
  $worktree = Join-Path $ParentDir $job.Worktree
  $prompt = Join-Path $PromptSource $job.Prompt
  if (!(Test-Path $worktree)) { throw "Missing worktree: $worktree" }
  if (!(Test-Path $prompt)) { throw "Missing prompt: $prompt" }

  New-Item -ItemType Directory -Force -Path (Join-Path $worktree "docs\codex_tasks") | Out-Null
  Copy-Item $prompt (Join-Path $worktree ("docs\codex_tasks\" + $job.Prompt)) -Force

  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command",
    "cd `"$worktree`"; & `"$script`" -AgentName $($job.Agent) -PromptFile docs\codex_tasks\$($job.Prompt) -MaxRounds $($job.Rounds)"
  )
}
