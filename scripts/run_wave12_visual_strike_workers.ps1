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
  @{ Name="reward-deltas"; Path="$WorkerRoot\reward-deltas"; Branch="feat/structured-reward-deltas"; Prompt="docs\codex_tasks\WAVE12_STRUCTURED_REWARD_DELTAS.md"; Skills=@("planning-with-files","game-development") },
  @{ Name="visual-strike"; Path="$WorkerRoot\visual-strike"; Branch="feat/visual-stage-hud-strike"; Prompt="docs\codex_tasks\WAVE12_VISUAL_STAGE_HUD_STRIKE.md"; Skills=@("planning-with-files","game-development","frontend","game-ui-design","ui-design") },
  @{ Name="visual-tests"; Path="$WorkerRoot\visual-tests"; Branch="test/wave12-visual-smoke"; Prompt="docs\codex_tasks\WAVE12_VISUAL_SMOKE_TESTS.md"; Skills=@("planning-with-files","testing-automation","playwright") },
  @{ Name="art-direction"; Path="$WorkerRoot\art-direction"; Branch="docs/wave12-art-direction-shotlist"; Prompt="docs\codex_tasks\WAVE12_ART_DIRECTION_SHOTLIST.md"; Skills=@("planning-with-files","technical-writer","ui-design","game-development") },
  @{ Name="qa-wave12"; Path="$WorkerRoot\qa-wave12"; Branch="qa/wave12-visual-review"; Prompt="docs\codex_tasks\WAVE12_QA_VISUAL_REVIEW.md"; Skills=@("planning-with-files","code-review","testing-automation") }
)
foreach ($w in $workers) {
  if (!(Test-Path $w.Path)) {
    git worktree add -B $w.Branch $w.Path $BaseBranch
  } else {
    $dirty = git -C $w.Path status --porcelain
    if ($dirty) {
      Write-Warning "Skip updating dirty worktree $($w.Path). Commit or stash it before relaunching this worker."
    } else {
      git -C $w.Path switch $w.Branch
      git -C $w.Path merge --ff-only $BaseBranch
    }
  }
  $skills = ($w.Skills | ForEach-Object { "C:\Users\Administrator\.codex\skills\$_\SKILL.md" }) -join "`n"
  $preamble = @"
Use local Codex skills only. Do not invoke plugin skills or marketplace skill names for this run.
Before planning or editing, read the following local skill files if they exist:
$skills

"@
  $preamblePath = Join-Path $w.Path ".wave12_local_skill_preamble.md"
  Set-Content -LiteralPath $preamblePath -Value $preamble -Encoding UTF8
  $command = "chcp 65001 > `$null; Set-Location -LiteralPath `"$($w.Path)`"; if (!(Test-Path -LiteralPath 'node_modules')) { npm ci }; `$promptText = (Get-Content -LiteralPath '.wave12_local_skill_preamble.md' -Raw) + [Environment]::NewLine + (Get-Content -LiteralPath `"$($w.Prompt)`" -Raw); `$promptText | codex exec"
  Start-Process pwsh -ArgumentList @("-NoExit","-ExecutionPolicy","Bypass","-Command",$command)
}
