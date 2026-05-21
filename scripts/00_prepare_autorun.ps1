param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"

Set-Location $RepoRoot

Write-Host "== MAWS Codex Autorun Prepare =="

if (!(Test-Path ".git")) {
  throw "RepoRoot is not a Git repository: $RepoRoot"
}

New-Item -ItemType Directory -Force -Path "docs\codex_tasks" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\agent_reports" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\content_proposals" | Out-Null
New-Item -ItemType Directory -Force -Path ".codex" | Out-Null

git status --short
npm run build

Write-Host "Prepare complete. Next: scripts\10_create_worktrees.ps1"
