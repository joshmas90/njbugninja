$ErrorActionPreference = "Stop"

Write-Host "NJ Bug Ninja V13 image patch" -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (!(Test-Path ".git")) {
    throw "This patch must be extracted into the root of your njbugninja-live Git repository (the folder containing .git)."
}

if (!(Test-Path "index.html")) {
    throw "index.html was not found in the current repository."
}

if (!(Test-Path "mosquito-ninja-v12.css")) {
    throw "mosquito-ninja-v12.css was not found in the current repository."
}

# Verify bundled assets.
if (!(Test-Path "assets\hero-v13.webp")) {
    throw "assets\hero-v13.webp is missing."
}
if (!(Test-Path "assets\backyard-v13.webp")) {
    throw "assets\backyard-v13.webp is missing."
}

# Update the hero artwork reference in CSS.
$cssPath = "mosquito-ninja-v12.css"
$css = Get-Content $cssPath -Raw
$css = $css.Replace("/assets/hero-v12.webp", "/assets/hero-v13.webp")
Set-Content -Path $cssPath -Value $css -NoNewline -Encoding UTF8

# Update homepage image references.
$indexPath = "index.html"
$html = Get-Content $indexPath -Raw
$html = $html.Replace("/assets/backyard-v12.webp", "/assets/backyard-v13.webp")
$html = $html.Replace("/assets/south-jersey-v12.png", "/assets/south-jersey-v11.webp")

# Cache-bust CSS/JS references without renaming those files.
$html = $html.Replace("mosquito-ninja-v12.css?v=12.0.0", "mosquito-ninja-v12.css?v=13.0.0")
$html = $html.Replace("mosquito-ninja-v12.js?v=12.0.0", "mosquito-ninja-v12.js?v=13.0.0")
Set-Content -Path $indexPath -Value $html -NoNewline -Encoding UTF8

Write-Host ""
Write-Host "Updated:" -ForegroundColor Green
Write-Host "  Hero -> assets/hero-v13.webp"
Write-Host "  Backyard -> assets/backyard-v13.webp"
Write-Host "  Service map -> restored assets/south-jersey-v11.webp"
Write-Host "  Cache version -> 13.0.0"
Write-Host ""

git status
Write-Host ""

git add -A
git commit -m "V13 high resolution hero and backyard assets"
git push

Write-Host ""
Write-Host "V13 pushed to GitHub main. Redeploy in Hostinger if it does not auto-deploy." -ForegroundColor Green
