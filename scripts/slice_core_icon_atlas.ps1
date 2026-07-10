param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,
  [Parameter(Mandatory = $true)]
  [string]$OutputDir,
  [int]$IconSize = 32,
  [int]$Padding = 2
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$names = @(
  'icon_money.png', 'icon_sp.png', 'icon_hp.png', 'icon_posture.png',
  'icon_fame.png', 'icon_auth.png', 'icon_heat.png', 'icon_fitxp.png',
  'icon_nav_map.png', 'icon_nav_profile.png', 'icon_nav_skills.png', 'icon_nav_bag.png',
  'icon_nav_shop.png', 'icon_nav_npc.png', 'icon_nav_log.png', 'icon_nav_check.png'
)

$palette = @(
  '#08090B', '#17191E', '#343840', '#5A3B27',
  '#8F5A2A', '#C98A4A', '#EFB57A', '#F4E7C6',
  '#FFF8DC', '#F2C94C', '#D18C24', '#E53A45',
  '#962C36', '#4DAAA8', '#236B73', '#6F8748'
) | ForEach-Object { [System.Drawing.ColorTranslator]::FromHtml($_) }

function Find-AlphaBounds([System.Drawing.Bitmap]$Bitmap, [int]$Threshold = 128) {
  $minX = $Bitmap.Width
  $minY = $Bitmap.Height
  $maxX = -1
  $maxY = -1
  for ($y = 0; $y -lt $Bitmap.Height; $y++) {
    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
      if ($Bitmap.GetPixel($x, $y).A -lt $Threshold) { continue }
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
  if ($maxX -lt $minX -or $maxY -lt $minY) {
    return [System.Drawing.Rectangle]::new(0, 0, $Bitmap.Width, $Bitmap.Height)
  }
  return [System.Drawing.Rectangle]::new($minX, $minY, $maxX - $minX + 1, $maxY - $minY + 1)
}

function Nearest-PaletteColor([System.Drawing.Color]$Color) {
  $best = $palette[0]
  $bestDistance = [double]::MaxValue
  foreach ($candidate in $palette) {
    $dr = [int]$Color.R - [int]$candidate.R
    $dg = [int]$Color.G - [int]$candidate.G
    $db = [int]$Color.B - [int]$candidate.B
    $distance = $dr * $dr + $dg * $dg + $db * $db
    if ($distance -ge $bestDistance) { continue }
    $bestDistance = $distance
    $best = $candidate
  }
  return $best
}

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$source = [System.Drawing.Bitmap]::FromFile($resolvedInput)

try {
  for ($index = 0; $index -lt $names.Count; $index++) {
    $column = $index % 4
    $row = [math]::Floor($index / 4)
    $left = [math]::Round($column * $source.Width / 4)
    $top = [math]::Round($row * $source.Height / 4)
    $right = [math]::Round(($column + 1) * $source.Width / 4)
    $bottom = [math]::Round(($row + 1) * $source.Height / 4)
    $cellRect = [System.Drawing.Rectangle]::new($left, $top, $right - $left, $bottom - $top)
    $cell = $source.Clone($cellRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $bounds = Find-AlphaBounds $cell
      $usable = $IconSize - $Padding * 2
      $scale = [math]::Min($usable / $bounds.Width, $usable / $bounds.Height)
      $targetWidth = [math]::Max(1, [math]::Round($bounds.Width * $scale))
      $targetHeight = [math]::Max(1, [math]::Round($bounds.Height * $scale))
      $targetX = [math]::Floor(($IconSize - $targetWidth) / 2)
      $targetY = [math]::Floor(($IconSize - $targetHeight) / 2)
      $icon = New-Object System.Drawing.Bitmap $IconSize, $IconSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      $graphics = [System.Drawing.Graphics]::FromImage($icon)
      try {
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $destination = [System.Drawing.Rectangle]::new($targetX, $targetY, $targetWidth, $targetHeight)
        $graphics.DrawImage($cell, $destination, $bounds, [System.Drawing.GraphicsUnit]::Pixel)
      } finally {
        $graphics.Dispose()
      }

      for ($y = 0; $y -lt $IconSize; $y++) {
        for ($x = 0; $x -lt $IconSize; $x++) {
          $pixel = $icon.GetPixel($x, $y)
          if ($pixel.A -lt 128) {
            $icon.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            continue
          }
          $mapped = Nearest-PaletteColor $pixel
          $icon.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $mapped.R, $mapped.G, $mapped.B))
        }
      }

      $outputPath = Join-Path $OutputDir $names[$index]
      $icon.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      $icon.Dispose()
    } finally {
      $cell.Dispose()
    }
  }
} finally {
  $source.Dispose()
}

Write-Output "Wrote $($names.Count) icons to $OutputDir"
