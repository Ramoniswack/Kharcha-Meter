# KharchaMeter Deployment Guide

## 🚀 Quick Start Deployment

### Web Deployment (Recommended for testing)

1. **Build the web version:**

   ```powershell
   npm run build:web
   ```

2. **Deploy to Vercel (Free):**

   ```powershell
   npm install -g vercel
   vercel --cwd dist
   ```

3. **Deploy to Netlify (Free):**
   ```powershell
   npm install -g netlify-cli
   netlify deploy --prod --dir dist
   ```

### Mobile App Deployment

#### Prerequisites

1. Create an Expo account at https://expo.dev
2. Install EAS CLI: `npm install -g eas-cli`
3. Login: `npx expo login`
4. **For iOS:** Apple Developer Account ($99/year) - https://developer.apple.com

#### iOS Deployment Steps

**Step 1: Configure iOS settings**

```powershell
# Initialize EAS configuration
eas build:configure
```

**Step 2: Update app.json for iOS**

- Set unique bundle identifier
- Configure app icons and splash screens
- Set up URL schemes for deep linking

**Step 3: Build for iOS**

```powershell
# Development build (for testing on device)
eas build --platform ios --profile development

# Preview build (for TestFlight)
eas build --platform ios --profile preview

# Production build (for App Store)
eas build --platform ios --profile production
```

**Step 4: iOS Certificates & Provisioning**
EAS will automatically handle:

- Development certificates
- Distribution certificates
- Provisioning profiles
- Push notification certificates

#### Android APK Build

```powershell
eas build --platform android --profile preview
```

#### iOS Build (requires Apple Developer account)

```powershell
eas build --platform ios --profile preview
```

#### Production Builds

```powershell
# For Google Play Store
eas build --platform android --profile production

# For Apple App Store
eas build --platform ios --profile production
```

## 📱 App Store Deployment

### Google Play Store

1. Build production Android app: `eas build --platform android --profile production`
2. Download the AAB file from Expo dashboard
3. Upload to Google Play Console
4. Fill out store listing details
5. Submit for review

### Apple App Store

1. Build production iOS app: `eas build --platform ios --profile production`
2. Download the IPA file from Expo dashboard
3. Upload using Xcode or Transporter
4. Submit through App Store Connect

## 🌐 Web Hosting Options

### 1. Vercel (Recommended)

- Free tier available
- Automatic deployments from Git
- Custom domains
- Built-in analytics

### 2. Netlify

- Free tier available
- Form handling
- Serverless functions
- Custom domains

### 3. GitHub Pages

- Free for public repos
- Custom domains
- Automatic deployments

## 🔧 Environment Variables

Before deploying, make sure to set up environment variables:

### For Vercel:

```powershell
vercel env add EXPO_PUBLIC_SUPABASE_URL
vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### For Netlify:

Add in Netlify dashboard under Site settings > Environment variables

## 📋 Pre-deployment Checklist

- [ ] Test app thoroughly on all platforms
- [ ] Update app version in app.json
- [ ] Set up proper environment variables
- [ ] Configure OAuth redirect URLs in Supabase
- [ ] Update app store listings (icons, descriptions)
- [ ] Test OAuth flows with production URLs

## 🔗 Important URLs to Update

After deployment, update these URLs in your Supabase project:

1. **Authentication > URL Configuration:**

   - Site URL: `https://your-app-domain.com`
   - Redirect URLs: `https://your-app-domain.com/auth/callback`

2. **For mobile apps, add deep link URLs:**
   - `com.yourname.kharchameter://auth/callback`

## 🐛 Common Issues

1. **OAuth not working:** Check redirect URLs in Supabase
2. **Build fails:** Ensure all dependencies are installed
3. **Environment variables:** Make sure they're set correctly
4. **Deep linking:** Configure URL schemes properly

## 📊 Monitoring

After deployment, monitor:

- App crashes (Expo Dashboard)
- User analytics
- API performance (Supabase Dashboard)
- Error logs

---

**Need help?** Check the Expo documentation or create an issue in the repository.
