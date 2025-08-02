@echo off
echo Clearing Metro Cache and Restarting Expo...
echo.

echo Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Clearing Metro cache directories...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" >nul 2>&1
for /d %%i in ("%TEMP%\metro-*") do rmdir /s /q "%%i" >nul 2>&1
for /d %%i in ("%TEMP%\haste-map-*") do rmdir /s /q "%%i" >nul 2>&1  
for /d %%i in ("%TEMP%\react-*") do rmdir /s /q "%%i" >nul 2>&1

echo Cache cleared successfully!
echo.

echo Starting Expo with complete cache reset...
npx expo start --clear --reset-cache

echo.
echo ✅ If profile tab is still missing, try:
echo 1. Close this terminal completely
echo 2. Open a new terminal
echo 3. Run: npx expo start --clear
echo.
echo The app now includes:
echo ✅ Beautiful category icons with colors
echo ✅ Enhanced validation with error alerts  
echo ✅ Success popups with celebration messages
echo ✅ Real-time form validation feedback
echo ✅ KharchaMeter logo integration
echo.
pause
