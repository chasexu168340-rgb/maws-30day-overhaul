param(
  [string]$RepoRoot = "E:\TH比赛照片",
  [string]$Spec = "scripts\wave10_coreloop_pipeline.json"
)

$ErrorActionPreference = "Stop"

$pipeline = Join-Path $RepoRoot "scripts\Invoke-MawsMultiCliPipeline.ps1"
if (!(Test-Path -LiteralPath $pipeline)) {
  throw "Pipeline launcher not found: $pipeline"
}

& $pipeline -RepoRoot $RepoRoot -Spec $Spec
