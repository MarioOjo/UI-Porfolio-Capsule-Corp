# Quick Sync Aliases
# Source this file to get easy shortcuts

function Sync-Production {
    <#
    .SYNOPSIS
    Sync local database to Railway production
    
    .DESCRIPTION
    Runs the automated sync script with options
    
    .EXAMPLE
    Sync-Production
    # Full sync with backup and confirmation
    
    .EXAMPLE
    Sync-Production -DryRun
    # Preview changes without applying
    
    .EXAMPLE
    Sync-Production -Fast
    # Skip backup and confirmation (dangerous!)
    #>
    
    param(
        [switch]$DryRun,
        [switch]$Fast
    )
    
    $scriptPath = ".\scripts\sync-to-production.ps1"
    
    if ($Fast) {
        Write-Host "⚡ FAST MODE: Skipping backup and confirmation!" -ForegroundColor Yellow
        & $scriptPath -SkipBackup
    }
    elseif ($DryRun) {
        Write-Host "🔍 DRY RUN: Previewing changes only" -ForegroundColor Cyan
        & $scriptPath -DryRun
    }
    else {
        & $scriptPath
    }
}

function Test-LocalDatabase {
    <#
    .SYNOPSIS
    Run database health checks
    #>
    
    Write-Host "🏥 Running database health checks..." -ForegroundColor Cyan
    Set-Location backend
    node scripts\audit_local_database.js
    Set-Location ..
}

function Backup-Production {
    <#
    .SYNOPSIS
    Create a manual backup of production database
    #>
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "backend\sql\backups\manual_backup_$timestamp.sql"
    
    Write-Host "📦 Creating manual backup..." -ForegroundColor Cyan
    
    mysqldump -h gondola.proxy.rlwy.net -P 38169 -u root -pYQYBKcSNLZIDVXdXzLOAFLfZoCxjBRze railway > $backupFile
    
    if (Test-Path $backupFile) {
        $size = (Get-Item $backupFile).Length
        Write-Host "✅ Backup created: $backupFile ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
    }
}

# Aliases
Set-Alias -Name sync -Value Sync-Production
Set-Alias -Name dbtest -Value Test-LocalDatabase
Set-Alias -Name dbbackup -Value Backup-Production

Write-Host "🎯 Database Sync Shortcuts Loaded!" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  sync              - Sync local DB to production (with confirmation)" -ForegroundColor White
Write-Host "  sync -DryRun      - Preview changes only" -ForegroundColor White
Write-Host "  sync -Fast        - Quick sync (skip backup)" -ForegroundColor White
Write-Host "  dbtest            - Run local database health checks" -ForegroundColor White
Write-Host "  dbbackup          - Manual backup of production" -ForegroundColor White
Write-Host ""
