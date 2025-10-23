# Bootstrap development dependencies for this repo (PowerShell)
# Run from repository root (PowerShell)
# This script performs a clean install for frontend and backend.

$ErrorActionPreference = 'Stop'

Write-Host "Installing frontend dependencies..."
Push-Location frontend
if (Test-Path package-lock.json) {
    npm ci
} else {
    npm install
}
Pop-Location

Write-Host "Installing backend dependencies..."
Push-Location backend
if (Test-Path package-lock.json) {
    npm ci
} else {
    npm install
}
Pop-Location

Write-Host "Bootstrap complete."