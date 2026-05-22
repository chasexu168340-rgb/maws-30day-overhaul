param(
  [string]$RepoRoot = "E:\TH比赛照片",
  [string]$WorkerRoot = "E:\maws_cli_parallel_wave7",
  [string]$BaseBranch = "staging/reforge-unlocks-v1",
  [string]$Launcher = "E:\maws_cli_parallel\Start-CodexWorker.ps1"
)

$ErrorActionPreference = "Stop"

function Invoke-Git {
  param([Parameter(Mandatory = $true)][string[]]$Args)

  git -c http.version=HTTP/1.1 @Args
  if ($LASTEXITCODE -ne 0) {
    throw "git $($Args -join ' ') failed with exit code $LASTEXITCODE"
  }
}

function Quote-Argument {
  param([Parameter(Mandatory = $true)][string]$Value)

  if ($Value -match '[\s"]') {
    return '"' + ($Value -replace '"', '\"') + '"'
  }

  return $Value
}

if (!(Test-Path -LiteralPath $RepoRoot)) {
  throw "Repo root not found: $RepoRoot"
}

if (!(Test-Path -LiteralPath $Launcher)) {
  throw "Clean Codex worker launcher not found: $Launcher"
}

$repoNodeModules = Join-Path $RepoRoot "node_modules"
if (!(Test-Path -LiteralPath $repoNodeModules)) {
  throw "Repo node_modules not found: $repoNodeModules. Run npm ci in the main repo before launching workers."
}

Set-Location $RepoRoot

Invoke-Git @("fetch", "origin")
Invoke-Git @("switch", $BaseBranch)
Invoke-Git @("pull", "--ff-only")

New-Item -ItemType Directory -Force -Path $WorkerRoot | Out-Null

$workers = @(
  @{
    Name = "Wave7-Playtest-Harness"
    Path = "$WorkerRoot\playtest-harness"
    Branch = "feat/day1-day7-playtest-harness"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE7_PLAYTEST_HARNESS.md"
  },
  @{
    Name = "Wave7-Combat-Sim"
    Path = "$WorkerRoot\combat-sim"
    Branch = "feat/day5-combat-sim-tool"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE7_DAY5_COMBAT_SIM.md"
  },
  @{
    Name = "Wave7-Rubric"
    Path = "$WorkerRoot\rubric"
    Branch = "docs/day1-day7-playtest-rubric"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE7_PLAYTEST_RUBRIC.md"
  },
  @{
    Name = "Wave7-QA"
    Path = "$WorkerRoot\qa-wave7"
    Branch = "qa/wave7-review"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE7_QA_REVIEW.md"
  }
)

foreach ($worker in $workers) {
  if (!(Test-Path -LiteralPath $worker.Path)) {
    Invoke-Git @("worktree", "add", "-B", $worker.Branch, $worker.Path, $BaseBranch)
  }

  if (!(Test-Path -LiteralPath $worker.Prompt)) {
    throw "Prompt not found: $($worker.Prompt)"
  }

  $workerNodeModules = Join-Path $worker.Path "node_modules"
  if (!(Test-Path -LiteralPath $workerNodeModules)) {
    New-Item -ItemType Junction -Path $workerNodeModules -Target $repoNodeModules | Out-Null
  }

  Start-Process pwsh -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", (Quote-Argument $Launcher),
    "-Worktree", (Quote-Argument $worker.Path),
    "-Prompt", (Quote-Argument $worker.Prompt),
    "-Title", (Quote-Argument $worker.Name),
    "-Reasoning", "medium",
    "-Hold"
  )
}
