param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"

Set-Location $RepoRoot

Write-Host "Full automation is not recommended for the first run. Use this after validating each subscript."

& ".\scripts\00_prepare_autorun.ps1" -RepoRoot $RepoRoot
& ".\scripts\10_create_worktrees.ps1" -RepoRoot $RepoRoot
& ".\scripts\20_launch_wave1_core.ps1"

Write-Host "Wave 1 launched. Wait for Agent 01 to finish and merge it before running Wave 2."
