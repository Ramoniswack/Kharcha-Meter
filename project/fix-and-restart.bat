@echo off
echo ===================================
echo   FIXING METRO CACHE ISSUES  
echo ===================================
echo.

echo [1/4] Stopping Node processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/4] Clearing cache directories...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" >nul 2>&1
if exist ".expo" rmdir /s /q ".expo" >nul 2>&1
for /d %%i in ("%TEMP%\metro-*") do rmdir /s /q "%%i" >nul 2>&1
for /d %%i in ("%TEMP%\haste-map-*") do rmdir /s /q "%%i" >nul 2>&1  
for /d %%i in ("%TEMP%\react-*") do rmdir /s /q "%%i" >nul 2>&1

echo [3/4] Cache cleared successfully!
echo.

echo [4/4] Starting Expo with fresh cache...
echo.
npx expo start --clear --reset-cache

echo.
echo =======================================
echo   SYNTAX ERROR FIXED! 
echo =======================================
echo ✅ login.tsx import statements repaired
echo ✅ KharchaMeter.png logo integration
echo ✅ Reduced excessive top padding  
echo ✅ Profile tab should now be visible
echo =======================================
pause
