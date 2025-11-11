# ============================================================================
# QUICK SYNC - Generate sync script for TablePlus
# ============================================================================
# Usage: .\scripts\quick-sync.ps1
# ============================================================================

Write-Host "🚀 Quick Sync - Generating database sync script..." -ForegroundColor Cyan
Write-Host ""

# Generate the sync script
node backend\scripts\generate-sync.js

Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Yellow
Write-Host "   1. Open TablePlus" -ForegroundColor White
Write-Host "   2. Connect to Railway database" -ForegroundColor White
Write-Host "   3. Open the generated SQL file above" -ForegroundColor White
Write-Host "   4. Execute it" -ForegroundColor White
Write-Host "   5. Check verification queries at the bottom" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: The sync script is safe to run multiple times" -ForegroundColor Cyan
