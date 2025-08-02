@echo off
echo 🍎 KharchaMeter iOS Deployment Script
echo ====================================
echo.

echo Checking prerequisites...
echo.

echo 📋 iOS Deployment Checklist:
echo   ✓ Apple Developer Account ($99/year)
echo   ✓ Expo account created
echo   ✓ EAS CLI installed
echo.

echo 📱 iOS Build Options:
echo   1. Development Build (for testing on your device)
echo   2. Preview Build (for TestFlight distribution)
echo   3. Production Build (for App Store submission)
echo.

set /p choice="Choose build type (1/2/3): "

if "%choice%"=="1" (
    echo Building iOS Development version...
    call eas build --platform ios --profile development
) else if "%choice%"=="2" (
    echo Building iOS Preview version for TestFlight...
    call eas build --platform ios --profile preview
) else if "%choice%"=="3" (
    echo Building iOS Production version for App Store...
    call eas build --platform ios --profile production
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo ✅ Build started!
echo.
echo 📱 Next steps:
echo   1. Wait for build to complete (check https://expo.dev)
echo   2. Download the IPA file from Expo dashboard
echo   3. For TestFlight: Upload using Transporter or Xcode
echo   4. For App Store: Submit through App Store Connect
echo.
echo 🔗 Useful links:
echo   - Expo Dashboard: https://expo.dev
echo   - App Store Connect: https://appstoreconnect.apple.com
echo   - Apple Transporter: https://apps.apple.com/app/transporter/id1450874784
echo.
pause
