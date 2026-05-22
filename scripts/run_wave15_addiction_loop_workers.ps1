param(
  [string]$RepoRoot = "E:\TH比赛照片"
)

$ErrorActionPreference = "Stop"

$pipeline = Join-Path $RepoRoot "scripts\wave15_addiction_loop_pipeline.json"
$runner = Join-Path $RepoRoot "scripts\Invoke-MawsMultiCliPipeline.ps1"

if (!(Test-Path -LiteralPath $pipeline)) {
  throw "Wave15 pipeline spec not found: $pipeline"
}

if (!(Test-Path -LiteralPath $runner)) {
  throw "Pipeline runner not found: $runner"
}

pwsh -NoProfile -ExecutionPolicy Bypass -File $runner -RepoRoot $RepoRoot -Spec $pipeline
