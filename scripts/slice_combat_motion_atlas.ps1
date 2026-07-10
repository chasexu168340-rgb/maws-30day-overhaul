[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Source,
    [Parameter(Mandatory = $true)]
    [string]$Output,
    [int]$Columns = 4,
    [int]$Rows = 7,
    [int]$FrameWidth = 96,
    [int]$FrameHeight = 144,
    [int]$RowOverlap = 38,
    [int]$AlphaThreshold = 8
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function Resolve-FullPath([string]$PathValue) {
    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return [System.IO.Path]::GetFullPath($PathValue)
    }
    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location).Path $PathValue))
}

function Get-LargestAlphaComponent {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [System.Drawing.Rectangle]$Region,
        [int]$Threshold
    )

    $width = $Region.Width
    $height = $Region.Height
    $visited = New-Object 'bool[]' ($width * $height)
    $largest = $null

    for ($localY = 0; $localY -lt $height; $localY++) {
        for ($localX = 0; $localX -lt $width; $localX++) {
            $start = $localY * $width + $localX
            if ($visited[$start]) { continue }
            $visited[$start] = $true
            if ($Bitmap.GetPixel($Region.X + $localX, $Region.Y + $localY).A -le $Threshold) { continue }

            $queue = [System.Collections.Generic.Queue[int]]::new()
            $component = [System.Collections.Generic.List[System.Drawing.Point]]::new()
            $queue.Enqueue($start)
            while ($queue.Count -gt 0) {
                $index = $queue.Dequeue()
                $x = $index % $width
                $y = [Math]::Floor($index / $width)
                $component.Add([System.Drawing.Point]::new($Region.X + $x, $Region.Y + $y))
                for ($dy = -1; $dy -le 1; $dy++) {
                    for ($dx = -1; $dx -le 1; $dx++) {
                        if ($dx -eq 0 -and $dy -eq 0) { continue }
                        $nextX = $x + $dx
                        $nextY = $y + $dy
                        if ($nextX -lt 0 -or $nextX -ge $width -or $nextY -lt 0 -or $nextY -ge $height) { continue }
                        $next = $nextY * $width + $nextX
                        if ($visited[$next]) { continue }
                        $visited[$next] = $true
                        if ($Bitmap.GetPixel($Region.X + $nextX, $Region.Y + $nextY).A -gt $Threshold) {
                            $queue.Enqueue($next)
                        }
                    }
                }
            }

            if ($null -eq $largest -or $component.Count -gt $largest.Count) {
                $largest = $component
            }
        }
    }

    if ($null -eq $largest -or $largest.Count -eq 0) {
        throw "No character pixels found in region $Region"
    }

    $minX = [int]::MaxValue
    $minY = [int]::MaxValue
    $maxX = -1
    $maxY = -1
    foreach ($point in $largest) {
        $minX = [Math]::Min($minX, $point.X)
        $minY = [Math]::Min($minY, $point.Y)
        $maxX = [Math]::Max($maxX, $point.X)
        $maxY = [Math]::Max($maxY, $point.Y)
    }

    return [pscustomobject]@{
        Pixels = $largest
        Bounds = [System.Drawing.Rectangle]::new($minX, $minY, $maxX - $minX + 1, $maxY - $minY + 1)
    }
}

$sourcePath = Resolve-FullPath $Source
$outputPath = Resolve-FullPath $Output
if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Source file not found: $sourcePath"
}
if ($Columns -le 0 -or $Rows -le 0 -or $FrameWidth -le 0 -or $FrameHeight -le 0) {
    throw 'Grid and frame dimensions must be positive.'
}

$loaded = [System.Drawing.Bitmap]::FromFile($sourcePath)
$sourceBitmap = $loaded.Clone(
    [System.Drawing.Rectangle]::new(0, 0, $loaded.Width, $loaded.Height),
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)
$loaded.Dispose()

try {
    $cellWidth = [Math]::Floor($sourceBitmap.Width / $Columns)
    $cellHeight = [Math]::Floor($sourceBitmap.Height / $Rows)
    $components = [System.Collections.Generic.List[object]]::new()
    $maxWidth = 1
    $maxHeight = 1

    for ($row = 0; $row -lt $Rows; $row++) {
        for ($column = 0; $column -lt $Columns; $column++) {
            $x = $column * $cellWidth
            $baseY = $row * $cellHeight
            $top = [Math]::Max(0, $baseY - $RowOverlap)
            $bottom = [Math]::Min($sourceBitmap.Height, $baseY + $cellHeight + $RowOverlap)
            $region = [System.Drawing.Rectangle]::new($x, $top, $cellWidth, $bottom - $top)
            $component = Get-LargestAlphaComponent -Bitmap $sourceBitmap -Region $region -Threshold $AlphaThreshold
            $components.Add($component)
            $maxWidth = [Math]::Max($maxWidth, $component.Bounds.Width)
            $maxHeight = [Math]::Max($maxHeight, $component.Bounds.Height)
        }
    }

    $frameCount = $Columns * $Rows
    $scale = [Math]::Min(($FrameWidth - 4) / $maxWidth, ($FrameHeight - 4) / $maxHeight)
    $strip = New-Object System.Drawing.Bitmap ($FrameWidth * $frameCount), $FrameHeight, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($strip)
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

        for ($index = 0; $index -lt $components.Count; $index++) {
            $component = $components[$index]
            $bounds = $component.Bounds
            $isolated = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
            try {
                foreach ($point in $component.Pixels) {
                    $isolated.SetPixel($point.X - $bounds.X, $point.Y - $bounds.Y, $sourceBitmap.GetPixel($point.X, $point.Y))
                }
                $drawWidth = [Math]::Max(1, [Math]::Round($bounds.Width * $scale))
                $drawHeight = [Math]::Max(1, [Math]::Round($bounds.Height * $scale))
                $targetX = $index * $FrameWidth + [Math]::Floor(($FrameWidth - $drawWidth) / 2)
                $targetY = $FrameHeight - $drawHeight - 2
                $target = [System.Drawing.Rectangle]::new($targetX, $targetY, $drawWidth, $drawHeight)
                $graphics.DrawImage($isolated, $target, 0, 0, $bounds.Width, $bounds.Height, [System.Drawing.GraphicsUnit]::Pixel)
            }
            finally {
                $isolated.Dispose()
            }
        }
    }
    finally {
        $graphics.Dispose()
    }

    try {
        $outputDir = Split-Path -Parent $outputPath
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
        $strip.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $strip.Dispose()
    }

    [pscustomobject]@{
        source = $sourcePath
        output = $outputPath
        frames = $frameCount
        frameWidth = $FrameWidth
        frameHeight = $FrameHeight
        rowOverlap = $RowOverlap
        sourceCell = "${cellWidth}x${cellHeight}"
        scale = [Math]::Round($scale, 4)
    } | ConvertTo-Json
}
finally {
    $sourceBitmap.Dispose()
}
