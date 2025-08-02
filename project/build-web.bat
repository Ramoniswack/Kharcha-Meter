@echo off
echo 🚀 Building KharchaMeter for Web Deployment
echo ============================================
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Building web version...
call npx expo export --platform web --output-dir dist

echo.
echo ✅ Build complete!
echo.
echo Your app is ready for deployment in the 'dist' folder.
echo.
echo 🌐 Next steps:
echo   1. For Vercel: npx vercel --cwd dist
echo   2. For Netlify: npx netlify deploy --prod --dir dist
echo   3. For manual upload: Upload the 'dist' folder contents to your web host
echo.
pause
