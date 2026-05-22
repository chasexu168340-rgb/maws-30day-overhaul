param(
  [string]$RepoRoot = "E:\TH比赛照片",
  [string]$WorkerRoot = "E:\maws_cli_parallel_wave12",
  [string]$BaseBranch = "staging/reforge-unlocks-v1"
)
$ErrorActionPreference = "Stop"
Set-Location $RepoRoot
git fetch origin
git switch $BaseBranch
git pull --ff-only
New-Item -ItemType Directory -Force -Path $WorkerRoot | Out-Null
$workers = @(
  @{ Name="reward-deltas"; Path="$WorkerRoot\reward-deltas"; Branch="feat/structured-reward-deltas"; Prompt="docs\codex_tasks\WAVE12_STRUCTURED_REWARD_DELTAS.md" },
  @{ Name="visual-strike"; Path="$WorkerRoot\visual-strike"; Branch="feat/visual-stage-hud-strike"; Prompt="docs\codex_tasks\WAVE12_VISUAL_STAGE_HUD_STRIKE.md" },
  @{ Name="visual-tests"; Path="$WorkerRoot\visual-tests"; Branch="test/wave12-visual-smoke"; Prompt="docs\codex_tasks\WAVE12_VISUAL_SMOKE_TESTS.md" },
  @{ Name="art-direction"; Path="$WorkerRoot\art-direction"; Branch="docs/wave12-art-direction-shotlist"; Prompt="docs\codex_tasks\WAVE12_ART_DIRECTION_SHOTLIST.md" },
  @{ Name="qa-wave12"; Path="$WorkerRoot\qa-wave12"; Branch="qa/wave12-visual-review"; Prompt="docs\codex_tasks\WAVE12_QA_VISUAL_REVIEW.md" }
)
foreach ($w in $workers) {
  if (!(Test-Path $w.Path)) { git worktree add -B $w.Branch $w.Path $BaseBranch }
  Start-Process pwsh -ArgumentList @("-NoExit","-ExecutionPolicy","Bypass","-Command","chcp 65001 > `$null; cd `"$($w.Path)`"; if (!(Test-Path node_modules)) { npm ci }; codex exec < `"$($w.Prompt)`"")
}
