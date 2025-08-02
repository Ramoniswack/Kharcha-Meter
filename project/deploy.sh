#!/bin/bash

echo "🚀 KharchaMeter Deployment Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building web version..."
npx expo export --platform web

echo "✅ Web build complete! Files are in the 'dist' folder."
echo ""
echo "🌐 To deploy to Vercel:"
echo "  1. Install Vercel CLI: npm i -g vercel"
echo "  2. Run: vercel --cwd dist"
echo ""
echo "🌐 To deploy to Netlify:"
echo "  1. Install Netlify CLI: npm i -g netlify-cli"
echo "  2. Run: netlify deploy --prod --dir dist"
echo ""
echo "📱 To build mobile apps:"
echo "  1. Create Expo account: npx expo register"
echo "  2. Login: npx expo login"
echo "  3. Build Android: eas build --platform android"
echo "  4. Build iOS: eas build --platform ios"
