[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [ValidateSet('background', 'standee', 'combat-strip', 'portrait', 'skill-card', 'item', 'icon', 'vfx', 'custom')]
    [string]$Type,

    [int]$Width = 0,
    [int]$Height = 0,

    [int]$FrameWidth = 96,
    [int]$FrameHeight = 144,
    [int]$FrameCount = 16,
    [int]$GridColumns = 16,
    [int]$GridRows = 1,

    [string]$OutputRoot = 'assets/pixel_v2',
    [string]$OutputName = '',

    [switch]$ChromaKey,
    [string]$ChromaColor = '#00FF00',
    [ValidateRange(0, 255)]
    [int]$ChromaTolerance = 12,

    [switch]$ValidateOnly,
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-AbsolutePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PathValue
    )

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return [System.IO.Path]::GetFullPath($PathValue)
    }

    return [System.IO.Path]::GetFullPath((Join-Path -Path (Get-Location).Path -ChildPath $PathValue))
}

function Get-TargetSize {
    param(
        [Parameter(Mandatory = $true)]
        [string]$AssetType,
        [int]$RequestedWidth,
        [int]$RequestedHeight,
        [int]$RequestedFrameWidth,
        [int]$RequestedFrameHeight,
        [int]$RequestedFrameCount
    )

    $defaults = @{
        'background'   = @(480, 270)
        'standee'      = @(96, 144)
        'combat-strip' = @(($RequestedFrameWidth * $RequestedFrameCount), $RequestedFrameHeight)
        'portrait'     = @(96, 96)
        'skill-card'   = @(192, 128)
        'item'         = @(64, 64)
        'icon'         = @(32, 32)
    }

    if ($AssetType -eq 'vfx' -or $AssetType -eq 'custom') {
        if ($RequestedWidth -le 0 -or $RequestedHeight -le 0) {
            throw "Type '$AssetType' requires -Width and -Height."
        }
        return @{
            Width = $RequestedWidth
            Height = $RequestedHeight
        }
    }

    $target = $defaults[$AssetType]
    $targetWidth = $target[0]
    $targetHeight = $target[1]

    if ($RequestedWidth -gt 0) {
        $targetWidth = $RequestedWidth
    }
    if ($RequestedHeight -gt 0) {
        $targetHeight = $RequestedHeight
    }

    return @{
        Width = $targetWidth
        Height = $targetHeight
    }
}

function Get-OutputSubdirectory {
    param(
        [Parameter(Mandatory = $true)]
        [string]$AssetType
    )

    $directories = @{
        'background'   = 'backgrounds'
        'standee'      = 'characters'
        'combat-strip' = 'sprites'
        'portrait'     = 'portraits'
        'skill-card'   = 'skillCards'
        'item'         = 'items'
        'icon'         = 'icons'
        'vfx'          = 'vfx'
        'custom'       = 'custom'
    }

    return $directories[$AssetType]
}

function ConvertFrom-HexColor {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Hex
    )

    if ($Hex -notmatch '^#?[0-9A-Fa-f]{6}$') {
        throw "ChromaColor must be a 6-digit hex color such as #00FF00."
    }

    $clean = $Hex.TrimStart('#')
    return [System.Drawing.Color]::FromArgb(
        255,
        [Convert]::ToInt32($clean.Substring(0, 2), 16),
        [Convert]::ToInt32($clean.Substring(2, 2), 16),
        [Convert]::ToInt32($clean.Substring(4, 2), 16)
    )
}

function Test-ChromaMatch {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Color]$Pixel,
        [Parameter(Mandatory = $true)]
        [System.Drawing.Color]$Key,
        [int]$Tolerance
    )

    return ([Math]::Abs($Pixel.R - $Key.R) -le $Tolerance `
        -and [Math]::Abs($Pixel.G - $Key.G) -le $Tolerance `
        -and [Math]::Abs($Pixel.B - $Key.B) -le $Tolerance)
}

function Get-ImageStats {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Bitmap]$Bitmap,
        [Parameter(Mandatory = $true)]
        [string]$FilePath
    )

    $transparent = 0
    $partialAlpha = 0
    $opaque = 0

    for ($y = 0; $y -lt $Bitmap.Height; $y++) {
        for ($x = 0; $x -lt $Bitmap.Width; $x++) {
            $alpha = $Bitmap.GetPixel($x, $y).A
            if ($alpha -eq 0) {
                $transparent++
            }
            elseif ($alpha -lt 255) {
                $partialAlpha++
            }
            else {
                $opaque++
            }
        }
    }

    $fileInfo = Get-Item -LiteralPath $FilePath
    return [ordered]@{
        width = $Bitmap.Width
        height = $Bitmap.Height
        hasAlpha = (($transparent + $partialAlpha) -gt 0)
        transparentPixels = $transparent
        partialAlphaPixels = $partialAlpha
        opaquePixels = $opaque
        fileSizeBytes = $fileInfo.Length
    }
}

function Test-TransparentBorder {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Bitmap]$Bitmap
    )

    for ($x = 0; $x -lt $Bitmap.Width; $x++) {
        if ($Bitmap.GetPixel($x, 0).A -ne 0) { return $false }
        if ($Bitmap.GetPixel($x, $Bitmap.Height - 1).A -ne 0) { return $false }
    }

    for ($y = 0; $y -lt $Bitmap.Height; $y++) {
        if ($Bitmap.GetPixel(0, $y).A -ne 0) { return $false }
        if ($Bitmap.GetPixel($Bitmap.Width - 1, $y).A -ne 0) { return $false }
    }

    return $true
}

function Resize-NearestNeighbor {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Bitmap]$SourceBitmap,
        [int]$TargetWidth,
        [int]$TargetHeight
    )

    $targetBitmap = New-Object System.Drawing.Bitmap $TargetWidth, $TargetHeight, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBitmap)
    try {
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighSpeed
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
        $graphics.DrawImage(
            $SourceBitmap,
            (New-Object System.Drawing.Rectangle 0, 0, $TargetWidth, $TargetHeight),
            0,
            0,
            $SourceBitmap.Width,
            $SourceBitmap.Height,
            [System.Drawing.GraphicsUnit]::Pixel
        )
    }
    finally {
        $graphics.Dispose()
    }

    return $targetBitmap
}

function Convert-CombatGridToStrip {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Bitmap]$SourceBitmap,
        [int]$Columns,
        [int]$Rows,
        [int]$Count,
        [int]$TargetFrameWidth,
        [int]$TargetFrameHeight
    )

    if (($Columns * $Rows) -ne $Count) {
        throw "Combat grid must contain exactly FrameCount cells. Grid is ${Columns}x${Rows}; FrameCount is $Count."
    }
    if (($SourceBitmap.Width % $Columns) -ne 0 -or ($SourceBitmap.Height % $Rows) -ne 0) {
        throw "Combat grid source $($SourceBitmap.Width)x$($SourceBitmap.Height) is not evenly divisible by ${Columns}x${Rows}."
    }

    $sourceFrameWidth = [int]($SourceBitmap.Width / $Columns)
    $sourceFrameHeight = [int]($SourceBitmap.Height / $Rows)
    $targetBitmap = New-Object System.Drawing.Bitmap ($TargetFrameWidth * $Count), $TargetFrameHeight, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighSpeed
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

        for ($index = 0; $index -lt $Count; $index++) {
            $sourceColumn = $index % $Columns
            $sourceRow = [Math]::Floor($index / $Columns)
            $sourceRect = New-Object System.Drawing.Rectangle `
                ($sourceColumn * $sourceFrameWidth), `
                ($sourceRow * $sourceFrameHeight), `
                $sourceFrameWidth, `
                $sourceFrameHeight
            $targetRect = New-Object System.Drawing.Rectangle `
                ($index * $TargetFrameWidth), 0, $TargetFrameWidth, $TargetFrameHeight
            $graphics.DrawImage($SourceBitmap, $targetRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
        }
    }
    finally {
        $graphics.Dispose()
    }

    return $targetBitmap
}

function Invoke-ChromaKeyCleanup {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Bitmap]$Bitmap,
        [Parameter(Mandatory = $true)]
        [System.Drawing.Color]$KeyColor,
        [int]$Tolerance
    )

    $changed = 0
    for ($y = 0; $y -lt $Bitmap.Height; $y++) {
        for ($x = 0; $x -lt $Bitmap.Width; $x++) {
            $pixel = $Bitmap.GetPixel($x, $y)
            if (Test-ChromaMatch -Pixel $pixel -Key $KeyColor -Tolerance $Tolerance) {
                $Bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $pixel.R, $pixel.G, $pixel.B))
                $changed++
            }
        }
    }
    return $changed
}

if ($ChromaKey -and $Type -ne 'standee') {
    throw '-ChromaKey is only supported for standee assets.'
}

if ($FrameCount -le 0 -or $FrameWidth -le 0 -or $FrameHeight -le 0 -or $GridColumns -le 0 -or $GridRows -le 0) {
    throw 'FrameWidth, FrameHeight, FrameCount, GridColumns, and GridRows must be positive integers.'
}

$sourcePath = Resolve-AbsolutePath -PathValue $Source
if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Source file not found: $sourcePath"
}
if ([System.IO.Path]::GetExtension($sourcePath).ToLowerInvariant() -ne '.png') {
    throw 'Only PNG inputs are supported for pixel_v2 asset preparation.'
}

$targetSize = Get-TargetSize `
    -AssetType $Type `
    -RequestedWidth $Width `
    -RequestedHeight $Height `
    -RequestedFrameWidth $FrameWidth `
    -RequestedFrameHeight $FrameHeight `
    -RequestedFrameCount $FrameCount

$outputRootPath = Resolve-AbsolutePath -PathValue $OutputRoot
$safeOutputName = if ([string]::IsNullOrWhiteSpace($OutputName)) {
    [System.IO.Path]::GetFileNameWithoutExtension($sourcePath) + '.png'
}
else {
    [System.IO.Path]::GetFileName($OutputName)
}
if ([System.IO.Path]::GetExtension($safeOutputName).ToLowerInvariant() -ne '.png') {
    $safeOutputName = [System.IO.Path]::GetFileNameWithoutExtension($safeOutputName) + '.png'
}

$outputDir = Join-Path -Path $outputRootPath -ChildPath (Get-OutputSubdirectory -AssetType $Type)
$outputPath = [System.IO.Path]::GetFullPath((Join-Path -Path $outputDir -ChildPath $safeOutputName))

if ([string]::Equals($sourcePath, $outputPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to overwrite source file: $sourcePath"
}

if ((Test-Path -LiteralPath $outputPath) -and -not $Force -and -not $ValidateOnly) {
    throw "Output already exists. Use -Force to replace it: $outputPath"
}

Add-Type -AssemblyName System.Drawing

$sourceBitmap = $null
$preparedBitmap = $null
try {
    $sourceBitmap = [System.Drawing.Bitmap]::FromFile($sourcePath)

    $warnings = New-Object System.Collections.Generic.List[string]
    $strip = $null
    if ($Type -eq 'combat-strip') {
        if (($GridColumns * $GridRows) -ne $FrameCount) {
            throw "Combat grid must contain exactly FrameCount cells. Grid is ${GridColumns}x${GridRows}; FrameCount is $FrameCount."
        }
        if (($targetSize.Width % $FrameCount) -ne 0) {
            throw "Combat strip target width $($targetSize.Width) is not divisible by FrameCount $FrameCount."
        }
        if (($sourceBitmap.Width % $GridColumns) -ne 0 -or ($sourceBitmap.Height % $GridRows) -ne 0) {
            throw "Combat grid source $($sourceBitmap.Width)x$($sourceBitmap.Height) is not evenly divisible by ${GridColumns}x${GridRows}."
        }

        $targetFrameWidth = [int]($targetSize.Width / $FrameCount)
        if ($targetFrameWidth -ne $FrameWidth -or $targetSize.Height -ne $FrameHeight) {
            throw "Combat strip target must equal FrameCount * FrameWidth by FrameHeight. Expected $($FrameWidth * $FrameCount)x$FrameHeight."
        }

        $strip = [ordered]@{
            frameCount = $FrameCount
            frameWidth = $FrameWidth
            frameHeight = $FrameHeight
            gridColumns = $GridColumns
            gridRows = $GridRows
            sourceFrameWidth = [int]($sourceBitmap.Width / $GridColumns)
            sourceFrameHeight = [int]($sourceBitmap.Height / $GridRows)
            targetWidth = $targetSize.Width
            targetHeight = $targetSize.Height
            valid = $true
        }
    }

    $sourceStats = Get-ImageStats -Bitmap $sourceBitmap -FilePath $sourcePath

    if ($ValidateOnly) {
        $result = [ordered]@{
            mode = 'validate-only'
            source = $sourcePath
            type = $Type
            target = [ordered]@{
                width = $targetSize.Width
                height = $targetSize.Height
            }
            sourceStats = $sourceStats
            strip = $strip
            warnings = $warnings.ToArray()
        }
        $result | ConvertTo-Json -Depth 6
        return
    }

    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    $preparedBitmap = if ($Type -eq 'combat-strip') {
        Convert-CombatGridToStrip `
            -SourceBitmap $sourceBitmap `
            -Columns $GridColumns `
            -Rows $GridRows `
            -Count $FrameCount `
            -TargetFrameWidth $FrameWidth `
            -TargetFrameHeight $FrameHeight
    }
    else {
        Resize-NearestNeighbor -SourceBitmap $sourceBitmap -TargetWidth $targetSize.Width -TargetHeight $targetSize.Height
    }

    $chromaPixelsCleared = 0
    if ($ChromaKey) {
        $keyColor = ConvertFrom-HexColor -Hex $ChromaColor
        $chromaPixelsCleared = Invoke-ChromaKeyCleanup -Bitmap $preparedBitmap -KeyColor $keyColor -Tolerance $ChromaTolerance
    }

    if ($Type -eq 'standee' -and -not (Test-TransparentBorder -Bitmap $preparedBitmap)) {
        $warnings.Add('standee output does not have a fully transparent 1px border')
    }

    $preparedBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outputStats = Get-ImageStats -Bitmap $preparedBitmap -FilePath $outputPath

    $result = [ordered]@{
        mode = 'prepare'
        source = $sourcePath
        output = $outputPath
        type = $Type
        resize = [ordered]@{
            method = 'nearest-neighbor'
            sourceWidth = $sourceBitmap.Width
            sourceHeight = $sourceBitmap.Height
            targetWidth = $targetSize.Width
            targetHeight = $targetSize.Height
            exactTargetSize = ($preparedBitmap.Width -eq $targetSize.Width -and $preparedBitmap.Height -eq $targetSize.Height)
        }
        chromaKey = [ordered]@{
            enabled = [bool]$ChromaKey
            color = $ChromaColor
            tolerance = $ChromaTolerance
            pixelsCleared = $chromaPixelsCleared
        }
        sourceStats = $sourceStats
        outputStats = $outputStats
        standeeTransparentBorder = if ($Type -eq 'standee') { Test-TransparentBorder -Bitmap $preparedBitmap } else { $null }
        strip = $strip
        warnings = $warnings.ToArray()
    }

    $result | ConvertTo-Json -Depth 6
}
finally {
    if ($preparedBitmap -ne $null) {
        $preparedBitmap.Dispose()
    }
    if ($sourceBitmap -ne $null) {
        $sourceBitmap.Dispose()
    }
}
