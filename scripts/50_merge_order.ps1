param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$BaseBranch = "staging/reforge-unlocks-v1"
)

$ErrorActionPreference = "Stop"

Set-Location $RepoRoot
git switch $BaseBranch

$branches = @(
  "feat/reforge-core-unlocks",
  "feat/reforge-ui-locks",
  "feat/reforge-metro-content",
  "feat/reforge-skill-unlocks",
  "feat/reforge-early-combat",
  "content/reforge-friend-pack",
  "qa/reforge-unlocks-v1"
)

foreach ($branch in $branches) {
  $exists = git branch --list $branch
  if (-not $exists) {
    Write-Host "Branch not found, skipping: $branch"
    continue
  }

  Write-Host "== Merge $branch =="
  git merge --no-ff $branch
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Merge conflict: $branch"
    Write-Host "Run: codex exec < docs\codex_tasks\AGENT_00_INTEGRATOR.md"
    exit 1
  }

  npm run build
}

git push
Write-Host "Merge complete."
