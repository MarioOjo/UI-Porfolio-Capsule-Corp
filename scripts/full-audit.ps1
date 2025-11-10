#!/usr/bin/env pwsh

Write-Host ""
Write-Host "🔍 RUNNING FULL SYSTEM AUDIT" -ForegroundColor Cyan
Write-Host ("=" * 70)
Write-Host ""
Write-Host "This will check both backend and frontend for issues before deployment" -ForegroundColor Yellow
Write-Host ""

# Run backend audit
Write-Host ""
Write-Host "📦 BACKEND AUDIT" -ForegroundColor Blue
Write-Host ("=" * 70)
Set-Location backend
node scripts/full_audit.js
$backendExitCode = $LASTEXITCODE
Set-Location ..

Write-Host ""
Write-Host ""

# Run frontend audit
Write-Host "🎨 FRONTEND AUDIT" -ForegroundColor Blue
Write-Host ("=" * 70)
Set-Location frontend
node scripts/full_audit.js
$frontendExitCode = $LASTEXITCODE
Set-Location ..

# Final summary
Write-Host ""
Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "🎯 FINAL AUDIT RESULTS" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan

if ($backendExitCode -eq 0) {
    Write-Host "✅ Backend: PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: FAILED" -ForegroundColor Red
}

if ($frontendExitCode -eq 0) {
    Write-Host "✅ Frontend: PASSED" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: FAILED" -ForegroundColor Red
}

Write-Host ("=" * 70) -ForegroundColor Cyan

if ($backendExitCode -eq 0 -and $frontendExitCode -eq 0) {
    Write-Host ""
    Write-Host "🚀 ALL CHECKS PASSED - READY TO DEPLOY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review any warnings above" -ForegroundColor White
    Write-Host "  2. Test locally one more time" -ForegroundColor White
    Write-Host "  3. Run: git add ." -ForegroundColor White
    Write-Host "  4. Run: git commit -m 'Pre-deployment audit fixes'" -ForegroundColor White
    Write-Host "  5. Run: git push origin main" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host ""
    Write-Host "⛔ CRITICAL ISSUES FOUND - DO NOT DEPLOY!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Fix the critical issues shown above before deploying." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
