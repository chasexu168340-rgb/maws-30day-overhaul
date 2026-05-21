param(
  [Parameter(Mandatory=$true)][string]$AgentName,
  [Parameter(Mandatory=$true)][string]$PromptFile,
  [int]$MaxRounds = 4,
  [string]$CodexExe = "codex",
  [string]$CodexSubcommand = "exec",
  [switch]$NoCommit
)

$ErrorActionPreference = "Stop"

function Invoke-CodexPrompt {
  param([string]$File)
  Write-Host "Running Codex: $File"
  $prompt = Get-Content -Raw -Encoding UTF8 $File
  $prompt | & $CodexExe $CodexSubcommand
}

New-Item -ItemType Directory -Force -Path ".codex" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\agent_reports" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\content_proposals" | Out-Null

$currentPrompt = $PromptFile

for ($round = 1; $round -le $MaxRounds; $round++) {
  Write-Host "== $AgentName Round $round / $MaxRounds =="

  Remove-Item ".codex\DONE.md" -ErrorAction SilentlyContinue
  Remove-Item ".codex\NEXT_PROMPT.md" -ErrorAction SilentlyContinue

  Invoke-CodexPrompt -File $currentPrompt

  Write-Host "== Build check =="
  npm run build

  if (Test-Path ".codex\DONE.md") {
    Write-Host "$AgentName marked done."
    break
  }

  if (Test-Path ".codex\NEXT_PROMPT.md") {
    $next = ".codex\_round_${round}_next.md"
    @"
# Continue $AgentName

Continue the previous round. First read:

- .codex/HANDOFF.md
- docs/agent_reports/$AgentName.md
- docs/TASK_PLAN.md

Then execute the next-round instructions below.

"@ | Set-Content -Encoding UTF8 $next
    Get-Content -Raw -Encoding UTF8 ".codex\NEXT_PROMPT.md" | Add-Content -Encoding UTF8 $next
    $currentPrompt = $next
    continue
  }

  Write-Host "$AgentName did not write DONE or NEXT_PROMPT. Stopping to avoid an infinite loop."
  break
}

if (-not $NoCommit) {
  $changes = git status --short
  if ($changes) {
    git add maws_src docs .codex 2>$null
    git commit -m "chore($AgentName): automated codex pass" 2>$null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "No committable changes or commit failed. Please inspect manually."
    }
  }
}

git status --short
