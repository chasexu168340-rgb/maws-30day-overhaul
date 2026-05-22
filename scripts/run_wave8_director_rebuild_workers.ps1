param(
  [string]$RepoRoot = "E:\TH比赛照片",
  [string]$WorkerRoot = "E:\maws_cli_parallel_wave8",
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
  throw "Repo node_modules not found: $repoNodeModules. Install dependencies in the main repo before launching workers."
}

Set-Location $RepoRoot

Invoke-Git @("fetch", "origin")
Invoke-Git @("switch", $BaseBranch)
Invoke-Git @("pull", "--ff-only")

New-Item -ItemType Directory -Force -Path $WorkerRoot | Out-Null

$workers = @(
  @{
    Name = "Wave8-UI-Shell"
    Path = "$WorkerRoot\ui-shell"
    Branch = "feat/ui-app-shell-declutter"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE8_UI_APP_SHELL_DECLUTTER.md"
  },
  @{
    Name = "Wave8-Director-Loop"
    Path = "$WorkerRoot\director-loop"
    Branch = "feat/daily-director-loop"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE8_DAILY_DIRECTOR_LOOP.md"
  },
  @{
    Name = "Wave8-Scene-Content"
    Path = "$WorkerRoot\scene-content"
    Branch = "feat/day1-7-scene-content-pass"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE8_DAY1_7_SCENE_CONTENT.md"
  },
  @{
    Name = "Wave8-Director-Tests"
    Path = "$WorkerRoot\director-tests"
    Branch = "test/director-loop-smoke"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE8_DIRECTOR_LOOP_TESTS.md"
  },
  @{
    Name = "Wave8-QA"
    Path = "$WorkerRoot\qa-wave8"
    Branch = "qa/wave8-director-review"
    Prompt = "$RepoRoot\docs\codex_tasks\WAVE8_QA_DIRECTOR_REVIEW.md"
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
