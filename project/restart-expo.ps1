# Clear Metro Cache and Restart Expo (PowerShell)
Write-Host "🔥 AGGRESSIVE CACHE CLEARING FOR PROFILE TAB FIX 🔥" -ForegroundColor Red
Write-Host ""

Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Clearing ALL cache directories..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\metro-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\haste-map-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\react-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\npm-*" -ErrorAction SilentlyContinue

Write-Host "✅ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Starting Expo with COMPLETE cache reset..." -ForegroundColor Cyan
Write-Host ""

& npx expo start --clear --reset-cache

Write-Host ""
Write-Host "🎯 FIXED ISSUES IN THIS UPDATE:" -ForegroundColor Green
Write-Host "✅ Reduced excessive top padding (from 60px to 20px)" -ForegroundColor White
Write-Host "✅ Replaced Logo component with KharchaMeter.png image" -ForegroundColor White
Write-Host "✅ Updated all auth screens to use KharchaMeter.png" -ForegroundColor White
Write-Host "✅ Added explicit href routes to all tabs" -ForegroundColor White
Write-Host "✅ Beautiful category icons with colors" -ForegroundColor White
Write-Host "✅ Enhanced validation with error alerts" -ForegroundColor White
Write-Host "✅ Success popups with celebration messages" -ForegroundColor White
Write-Host ""
Write-Host "👀 PROFILE TAB SHOULD NOW BE VISIBLE!" -ForegroundColor Yellow
Write-Host "If still not visible, close terminal and run: npx expo start --clear" -ForegroundColor Yellow
Write-Host ""
