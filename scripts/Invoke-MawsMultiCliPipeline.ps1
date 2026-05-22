param(
  [Parameter(Mandatory = $true)]
  [string]$Spec,

  [string]$RepoRoot = "E:\TH比赛照片",

  [string]$Launcher = "E:\maws_cli_parallel\Start-CodexWorker.ps1"
)

$ErrorActionPreference = "Stop"

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Cwd,

    [Parameter(Mandatory = $true)]
    [string[]]$Args
  )

  $attempts = 4
  for ($attempt = 1; $attempt -le $attempts; $attempt++) {
    git -C $Cwd -c http.version=HTTP/1.1 -c http.postBuffer=1048576000 @Args
    if ($LASTEXITCODE -eq 0) {
      return
    }

    $exitCode = $LASTEXITCODE
    if ($attempt -ge $attempts) {
      throw "git -C $Cwd $($Args -join ' ') failed with exit code $exitCode after $attempts attempts"
    }

    $delay = 5 * $attempt
    Write-Warning "git -C $Cwd $($Args -join ' ') failed with exit code $exitCode; retrying in $delay seconds ($attempt/$attempts)."
    Start-Sleep -Seconds $delay
  }
}

function Invoke-CheckedCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Cwd,

    [Parameter(Mandatory = $true)]
    [string]$Command
  )

  Write-Host "== $Command =="
  pwsh -NoProfile -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '$Cwd'; $Command"
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $Command"
  }
}

function Ensure-NodeModulesJunction {
  param(
    [Parameter(Mandatory = $true)]
    [string]$WorkerPath,

    [Parameter(Mandatory = $true)]
    [string]$RepoNodeModules
  )

  $workerNodeModules = Join-Path $WorkerPath "node_modules"
  if (!(Test-Path -LiteralPath $workerNodeModules)) {
    New-Item -ItemType Junction -Path $workerNodeModules -Target $RepoNodeModules | Out-Null
  }
}

function Clear-WorkerGeneratedTemp {
  param(
    [Parameter(Mandatory = $true)]
    [string]$WorkerPath
  )

  Get-ChildItem -LiteralPath $WorkerPath -Force -Filter ".wave*_local_skill_preamble.md" -ErrorAction SilentlyContinue |
    Remove-Item -Force
}

function Start-CodexWorker {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Worker,

    [Parameter(Mandatory = $true)]
    [string]$Reasoning,

    [bool]$Visible = $false
  )

  if (!(Test-Path -LiteralPath $Worker.Prompt)) {
    throw "Prompt not found: $($Worker.Prompt)"
  }

  $args = @(
    "-ExecutionPolicy", "Bypass",
    "-File", $Launcher,
    "-Worktree", $Worker.Path,
    "-Prompt", $Worker.Prompt,
    "-Title", $Worker.Name,
    "-Reasoning", $Reasoning
  )

  Write-Host "Launching $($Worker.Name): $($Worker.Branch)"
  $windowStyle = if ($Visible) { "Normal" } else { "Hidden" }
  $safeName = ($Worker.Name -replace '[^A-Za-z0-9_.-]', '_')
  $stdout = Join-Path $script:LogRoot "$safeName.out.log"
  $stderr = Join-Path $script:LogRoot "$safeName.err.log"
  if ($Visible) {
    Start-Process pwsh -ArgumentList $args -WindowStyle $windowStyle -PassThru
  } else {
    Start-Process pwsh -ArgumentList $args -WindowStyle $windowStyle -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
  }
}

function Wait-WorkerGroup {
  param(
    [Parameter(Mandatory = $true)]
    [System.Diagnostics.Process[]]$Processes,

    [string]$Label = "workers"
  )

  Write-Host "Waiting for $Label to finish..."
  foreach ($process in $Processes) {
    if (!$process.HasExited) {
      $process.WaitForExit()
    }
    if ($process.ExitCode -ne 0) {
      throw "$Label process $($process.Id) failed with exit code $($process.ExitCode)"
    }
  }
}

function Prepare-Worker {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Worker,

    [Parameter(Mandatory = $true)]
    [string]$BaseBranch,

    [Parameter(Mandatory = $true)]
    [string]$RepoNodeModules
  )

  if (!(Test-Path -LiteralPath $Worker.Path)) {
    Invoke-Git $RepoRoot @("worktree", "add", "-B", $Worker.Branch, $Worker.Path, $BaseBranch)
  } else {
    Clear-WorkerGeneratedTemp $Worker.Path
    $dirty = git -C $Worker.Path status --porcelain
    if ($dirty) {
      throw "$($Worker.Name) worktree is dirty before launch. Clean it first:`n$dirty"
    }
    Invoke-Git $Worker.Path @("fetch", "origin")
    Invoke-Git $Worker.Path @("checkout", "-B", $Worker.Branch, "origin/$BaseBranch")
  }

  Invoke-Git $Worker.Path @("config", "core.autocrlf", "false")
  Ensure-NodeModulesJunction $Worker.Path $RepoNodeModules
}

function Push-CleanWorkerBranch {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Worker
  )

  $dirty = git -C $Worker.Path status --porcelain
  if ($dirty) {
    throw "$($Worker.Name) finished with uncommitted changes. Commit or fix before pipeline can continue.`n$dirty"
  }

  Invoke-Git $Worker.Path @("push", "-u", "origin", $Worker.Branch)
}

function AutoCommitQaIfNeeded {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Qa
  )

  $dirty = git -C $Qa.Path status --porcelain
  if (!$dirty) {
    return
  }

  git -C $Qa.Path add docs/workers docs/agent_reports
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to stage QA docs"
  }

  $remaining = git -C $Qa.Path status --porcelain
  $nonDocs = $remaining | Where-Object { $_ -notmatch 'docs/(workers|agent_reports)/' }
  if ($nonDocs) {
    throw "QA worker left non-report changes. Refusing to auto-commit:`n$($nonDocs -join "`n")"
  }

  git -C $Qa.Path commit -m $Qa.CommitMessage
  if ($LASTEXITCODE -ne 0) {
    throw "QA auto-commit failed"
  }
}

if (!(Test-Path -LiteralPath $RepoRoot)) {
  throw "Repo root not found: $RepoRoot"
}

if (!(Test-Path -LiteralPath $Launcher)) {
  throw "Codex worker launcher not found: $Launcher"
}

$specPath = if ([System.IO.Path]::IsPathRooted($Spec)) { $Spec } else { Join-Path $RepoRoot $Spec }
if (!(Test-Path -LiteralPath $specPath)) {
  throw "Spec not found: $specPath"
}

$pipeline = Get-Content -Raw -LiteralPath $specPath | ConvertFrom-Json
$baseBranch = $pipeline.baseBranch
$workerRoot = $pipeline.workerRoot
$reasoning = if ($pipeline.reasoning) { $pipeline.reasoning } else { "medium" }
$visibleWorkers = [bool]$pipeline.visibleWorkers
$repoNodeModules = Join-Path $RepoRoot "node_modules"
$script:LogRoot = Join-Path $workerRoot "_logs"

if (!(Test-Path -LiteralPath $repoNodeModules)) {
  throw "Repo node_modules not found: $repoNodeModules"
}

New-Item -ItemType Directory -Force -Path $workerRoot | Out-Null
New-Item -ItemType Directory -Force -Path $script:LogRoot | Out-Null

Invoke-Git $RepoRoot @("fetch", "origin")
Invoke-Git $RepoRoot @("switch", $baseBranch)
Invoke-Git $RepoRoot @("pull", "--ff-only")

$implWorkers = @($pipeline.implementationWorkers)
foreach ($worker in $implWorkers) {
  Prepare-Worker $worker $baseBranch $repoNodeModules
}

$implProcesses = @()
foreach ($worker in $implWorkers) {
  $implProcesses += Start-CodexWorker $worker $reasoning $visibleWorkers
}

Wait-WorkerGroup $implProcesses "implementation workers"

foreach ($worker in $implWorkers) {
  Push-CleanWorkerBranch $worker
}

Invoke-Git $RepoRoot @("fetch", "origin")
Invoke-Git $RepoRoot @("switch", $baseBranch)
Invoke-Git $RepoRoot @("pull", "--ff-only")

foreach ($merge in @($pipeline.mergeOrder)) {
  Write-Host "== Merge $($merge.branch) =="
  Invoke-Git $RepoRoot @("merge", "--no-ff", "origin/$($merge.branch)", "-m", "merge: $($merge.name)")
  foreach ($command in @($merge.validate)) {
    Invoke-CheckedCommand $RepoRoot $command
  }
  Invoke-Git $RepoRoot @("push")
}

$qa = $pipeline.qaWorker
Prepare-Worker $qa $baseBranch $repoNodeModules
Invoke-Git $qa.Path @("fetch", "origin")
Invoke-Git $qa.Path @("reset", "--hard", "origin/$baseBranch")
Invoke-Git $qa.Path @("checkout", "-B", $qa.Branch)

$qaProcess = Start-CodexWorker $qa $reasoning $visibleWorkers
Wait-WorkerGroup @($qaProcess) "QA worker"
AutoCommitQaIfNeeded $qa
Push-CleanWorkerBranch $qa

Invoke-Git $RepoRoot @("fetch", "origin")
Invoke-Git $RepoRoot @("switch", $baseBranch)
Invoke-Git $RepoRoot @("pull", "--ff-only")
Invoke-Git $RepoRoot @("merge", "--no-ff", "origin/$($qa.Branch)", "-m", "merge: $($qa.name)")
foreach ($command in @($pipeline.qaMergeValidate)) {
  Invoke-CheckedCommand $RepoRoot $command
}
Invoke-Git $RepoRoot @("push")

Write-Host "Pipeline complete: $($pipeline.name)"
