param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$ParentDir = "E:\"
)

$ErrorActionPreference = "Stop"

$reportRoot = Join-Path $RepoRoot "docs\agent_reports"
$proposalRoot = Join-Path $RepoRoot "docs\content_proposals"
New-Item -ItemType Directory -Force -Path $reportRoot | Out-Null
New-Item -ItemType Directory -Force -Path $proposalRoot | Out-Null

$worktrees = @(
  "maws-agent-01-core",
  "maws-agent-02-ui",
  "maws-agent-03-metro",
  "maws-agent-04-skills",
  "maws-agent-05-combat",
  "maws-agent-06-qa",
  "maws-agent-07-friend"
)

foreach ($wt in $worktrees) {
  $path = Join-Path $ParentDir $wt
  if (!(Test-Path $path)) { continue }

  $reports = Join-Path $path "docs\agent_reports"
  if (Test-Path $reports) {
    Copy-Item "$reports\*.md" $reportRoot -Force -ErrorAction SilentlyContinue
  }

  $proposals = Join-Path $path "docs\content_proposals"
  if (Test-Path $proposals) {
    Copy-Item "$proposals\*.md" $proposalRoot -Force -ErrorAction SilentlyContinue
  }
}

Set-Location $RepoRoot
git status --short
Write-Host "Report collection complete."
