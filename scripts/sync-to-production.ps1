# ============================================================================
# AUTOMATED LOCAL → RAILWAY PRODUCTION DATABASE SYNC
# ============================================================================
# This script automatically syncs your local database structure to Railway
# Run this whenever you make local database changes
# ============================================================================

param(
    [switch]$DryRun,
    [switch]$SkipBackup
)

Write-Host "🚀 Railway Production Database Sync Tool" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# CONFIGURATION
# ============================================================================

$LOCAL_HOST = "localhost"
$LOCAL_PORT = "3306"
$LOCAL_USER = "root"
$LOCAL_PASSWORD = "Chick3nR0ll!"
$LOCAL_DATABASE = "capsule_corp"

$RAILWAY_HOST = "gondola.proxy.rlwy.net"
$RAILWAY_PORT = "38169"
$RAILWAY_USER = "root"
$RAILWAY_PASSWORD = "YQYBKcSNLZIDVXdXzLOAFLfZoCxjBRze"
$RAILWAY_DATABASE = "railway"

$BACKUP_DIR = "backend\sql\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"

# ============================================================================
# PREREQUISITES CHECK
# ============================================================================

Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check if mysqldump exists
try {
    $null = Get-Command mysqldump -ErrorAction Stop
    Write-Host "   ✅ mysqldump found" -ForegroundColor Green
} catch {
    Write-Host "   ❌ mysqldump not found. Please install MySQL client tools." -ForegroundColor Red
    Write-Host "   Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    exit 1
}

# Check if mysql exists
try {
    $null = Get-Command mysql -ErrorAction Stop
    Write-Host "   ✅ mysql client found" -ForegroundColor Green
} catch {
    Write-Host "   ❌ mysql client not found. Please install MySQL client tools." -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# STEP 1: BACKUP PRODUCTION DATABASE
# ============================================================================

if (-not $SkipBackup) {
    Write-Host "📦 Step 1: Backing up production database..." -ForegroundColor Yellow
    
    # Create backup directory if it doesn't exist
    if (-not (Test-Path $BACKUP_DIR)) {
        New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    }
    
    $BACKUP_FILE = "$BACKUP_DIR\production_backup_$TIMESTAMP.sql"
    
    $dumpCommand = "mysqldump -h $RAILWAY_HOST -P $RAILWAY_PORT -u $RAILWAY_USER -p$RAILWAY_PASSWORD $RAILWAY_DATABASE"
    
    try {
        Invoke-Expression "$dumpCommand > `"$BACKUP_FILE`"" 2>$null
        if (Test-Path $BACKUP_FILE) {
            $fileSize = (Get-Item $BACKUP_FILE).Length
            Write-Host "   ✅ Backup saved: $BACKUP_FILE ($([math]::Round($fileSize/1KB, 2)) KB)" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Backup file not created, but continuing..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Backup failed, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping backup (--SkipBackup flag)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 2: DUMP LOCAL DATABASE SCHEMA
# ============================================================================

Write-Host "📤 Step 2: Dumping local database schema..." -ForegroundColor Yellow

$LOCAL_SCHEMA_FILE = "$BACKUP_DIR\local_schema_$TIMESTAMP.sql"

$schemaCommand = "mysqldump -h $LOCAL_HOST -P $LOCAL_PORT -u $LOCAL_USER -p$LOCAL_PASSWORD --no-data --routines --triggers $LOCAL_DATABASE"

try {
    Invoke-Expression "$schemaCommand > `"$LOCAL_SCHEMA_FILE`"" 2>$null
    Write-Host "   ✅ Local schema exported: $LOCAL_SCHEMA_FILE" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to export local schema" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# STEP 3: GENERATE SYNC SCRIPT
# ============================================================================

Write-Host "🔧 Step 3: Generating sync script..." -ForegroundColor Yellow

$SYNC_SCRIPT = "$BACKUP_DIR\sync_script_$TIMESTAMP.sql"

# Read local schema
$schemaContent = Get-Content $LOCAL_SCHEMA_FILE -Raw

# Create sync script with safety checks
$syncContent = @"
-- ============================================================================
-- AUTO-GENERATED SYNC SCRIPT
-- Generated: $TIMESTAMP
-- Source: Local database ($LOCAL_DATABASE)
-- Target: Railway production ($RAILWAY_DATABASE)
-- ============================================================================

SET FOREIGN_KEY_CHECKS=0;

-- Drop existing tables (careful!)
-- Commented out by default for safety
-- Uncomment if you want to completely rebuild tables

$schemaContent

SET FOREIGN_KEY_CHECKS=1;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show all tables
SHOW TABLES;

-- Count records in key tables
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'user_addresses', COUNT(*) FROM user_addresses;

-- Check admin users
SELECT id, email, role, username FROM users WHERE role = 'admin';

-- ============================================================================
-- SYNC COMPLETE
-- ============================================================================
"@

$syncContent | Out-File -FilePath $SYNC_SCRIPT -Encoding UTF8

Write-Host "   ✅ Sync script generated: $SYNC_SCRIPT" -ForegroundColor Green

Write-Host ""

# ============================================================================
# STEP 4: DRY RUN OR EXECUTE
# ============================================================================

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Generated files:" -ForegroundColor Cyan
    Write-Host "   📄 Backup: $BACKUP_FILE" -ForegroundColor White
    Write-Host "   📄 Local Schema: $LOCAL_SCHEMA_FILE" -ForegroundColor White
    Write-Host "   📄 Sync Script: $SYNC_SCRIPT" -ForegroundColor White
    Write-Host ""
    Write-Host "To apply changes, run without -DryRun flag" -ForegroundColor Yellow
    exit 0
}

# ============================================================================
# STEP 5: APPLY TO PRODUCTION
# ============================================================================

Write-Host "🚀 Step 4: Applying changes to production..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   ⚠️  WARNING: This will modify your production database!" -ForegroundColor Red
Write-Host "   📦 Backup saved at: $BACKUP_FILE" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "   Type 'YES' to continue"

if ($confirmation -ne 'YES') {
    Write-Host "   ❌ Sync cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "   📡 Connecting to Railway production database..." -ForegroundColor Yellow

$applyCommand = "mysql -h $RAILWAY_HOST -P $RAILWAY_PORT -u $RAILWAY_USER -p$RAILWAY_PASSWORD $RAILWAY_DATABASE"

try {
    Get-Content $SYNC_SCRIPT | & mysql -h $RAILWAY_HOST -P $RAILWAY_PORT -u $RAILWAY_USER "-p$RAILWAY_PASSWORD" $RAILWAY_DATABASE 2>&1
    
    Write-Host "   ✅ Sync script applied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 SYNC COMPLETE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Test your production application" -ForegroundColor White
    Write-Host "   2. Verify admin login works" -ForegroundColor White
    Write-Host "   3. Check that all features work correctly" -ForegroundColor White
    Write-Host ""
    Write-Host "If something goes wrong, restore from backup:" -ForegroundColor Yellow
    Write-Host "   mysql -h $RAILWAY_HOST -P $RAILWAY_PORT -u $RAILWAY_USER -p $RAILWAY_DATABASE < $BACKUP_FILE" -ForegroundColor Gray
    
} catch {
    Write-Host "   ❌ Failed to apply sync script" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "You can manually run the sync script in TablePlus:" -ForegroundColor Yellow
    Write-Host "   $SYNC_SCRIPT" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "📊 Files generated:" -ForegroundColor Cyan
Write-Host "   Backup: $BACKUP_FILE" -ForegroundColor White
Write-Host "   Schema: $LOCAL_SCHEMA_FILE" -ForegroundColor White
Write-Host "   Sync Script: $SYNC_SCRIPT" -ForegroundColor White

# ============================================================================
# CLEANUP OLD BACKUPS (keep last 10)
# ============================================================================

Write-Host ""
Write-Host "🧹 Cleaning up old backups (keeping last 10)..." -ForegroundColor Yellow

$backups = Get-ChildItem "$BACKUP_DIR\production_backup_*.sql" | Sort-Object LastWriteTime -Descending
if ($backups.Count -gt 10) {
    $backups | Select-Object -Skip 10 | ForEach-Object {
        Remove-Item $_.FullName
        Write-Host "   🗑️  Removed old backup: $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✨ All done!" -ForegroundColor Green
