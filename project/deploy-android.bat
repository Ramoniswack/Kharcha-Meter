@echo off
echo 🤖 KharchaMeter Android Deployment (FREE!)
echo ==========================================
echo.

echo 📱 FREE Android Options:
echo   1. Test with Expo Go (FREE - instant testing)
echo   2. Build APK file (FREE - direct install)
echo   3. Google Play Store ($25 one-time fee)
echo.

set /p choice="Choose option (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Starting Expo development server...
    echo 📱 Steps:
    echo   1. Install "Expo Go" app from Play Store
    echo   2. Scan the QR code that appears
    echo   3. Your app will run instantly!
    echo.
    call npx expo start
) else if "%choice%"=="2" (
    echo.
    echo 🔨 Building FREE APK file...
    echo 📱 After build completes:
    echo   1. Download APK from https://expo.dev
    echo   2. Transfer to Android device
    echo   3. Enable "Install unknown apps" in settings
    echo   4. Install the APK
    echo.
    call eas build --platform android --profile preview
) else if "%choice%"=="3" (
    echo.
    echo 🏪 Building for Google Play Store...
    echo 💰 Note: Requires $25 one-time Google Play Console fee
    echo 📱 After build completes:
    echo   1. Download AAB from https://expo.dev
    echo   2. Upload to Google Play Console
    echo   3. Submit for review
    echo.
    call eas build --platform android --profile production
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo ✅ Process started!
echo.
echo 🔗 Useful links:
echo   - Expo Dashboard: https://expo.dev
echo   - Google Play Console: https://play.google.com/console
echo   - Expo Go App: https://play.google.com/store/apps/details?id=host.exp.exponent
echo.
pause
