param(
  [string]$RepoRoot = "E:\TH比赛照片",
  [string]$Spec = "scripts\wave9_scene_pipeline.json"
)

$ErrorActionPreference = "Stop"

$pipelineScript = Join-Path $RepoRoot "scripts\Invoke-MawsMultiCliPipeline.ps1"
$specPath = Join-Path $RepoRoot $Spec

pwsh -NoProfile -ExecutionPolicy Bypass -File $pipelineScript -Spec $specPath -RepoRoot $RepoRoot
