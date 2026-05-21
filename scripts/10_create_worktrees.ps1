param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$BaseBranch = "staging/reforge-unlocks-v1",
  [string]$ParentDir = "E:\"
)

$ErrorActionPreference = "Stop"

Set-Location $RepoRoot

Write-Host "== Create staging branch if missing =="

$current = (git branch --show-current).Trim()
if ($current -ne $BaseBranch) {
  $exists = git branch --list $BaseBranch
  if (-not $exists) {
    git switch main
    git pull --ff-only
    git switch -c $BaseBranch
    git push -u origin $BaseBranch
  } else {
    git switch $BaseBranch
  }
}

$agents = @(
  @{ Name="maws-agent-01-core"; Branch="feat/reforge-core-unlocks" },
  @{ Name="maws-agent-02-ui"; Branch="feat/reforge-ui-locks" },
  @{ Name="maws-agent-03-metro"; Branch="feat/reforge-metro-content" },
  @{ Name="maws-agent-04-skills"; Branch="feat/reforge-skill-unlocks" },
  @{ Name="maws-agent-05-combat"; Branch="feat/reforge-early-combat" },
  @{ Name="maws-agent-06-qa"; Branch="qa/reforge-unlocks-v1" },
  @{ Name="maws-agent-07-friend"; Branch="content/reforge-friend-pack" }
)

foreach ($agent in $agents) {
  $path = Join-Path $ParentDir $agent.Name
  if (Test-Path $path) {
    Write-Host "Worktree already exists, skipping: $path"
    continue
  }
  git worktree add $path -b $agent.Branch $BaseBranch
}

Write-Host "Worktrees created."
