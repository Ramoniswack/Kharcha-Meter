# iOS Deployment Guide for KharchaMeter

## 🍎 Prerequisites

### 1. Apple Developer Account

- **Cost:** $99/year
- **Sign up:** https://developer.apple.com/programs/
- **Required for:** TestFlight, App Store submission

### 2. Development Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
npx expo login

# Initialize EAS (if not done)
eas build:configure
```

## 📱 iOS Build Types

### Development Build

**Purpose:** Install directly on your iOS device for testing

```bash
eas build --platform ios --profile development
```

### Preview Build

**Purpose:** TestFlight distribution to beta testers

```bash
eas build --platform ios --profile preview
```

### Production Build

**Purpose:** App Store submission

```bash
eas build --platform ios --profile production
```

## 🔧 iOS Configuration

### App Icons Required

Create these icon sizes in `assets/images/`:

- **1024x1024** - App Store icon
- **180x180** - iPhone app icon
- **167x167** - iPad Pro app icon
- **152x152** - iPad app icon
- **120x120** - iPhone app icon (smaller)

### Bundle Identifier

Update in `app.json`:

```json
"ios": {
  "bundleIdentifier": "com.yourcompany.kharchameter"
}
```

**Important:** This must be unique and match your Apple Developer account.

## 📋 Step-by-Step iOS Deployment

### Step 1: Configure App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Create new app with same bundle identifier
3. Fill in app information:
   - **Name:** KharchaMeter
   - **Category:** Finance
   - **Content Rights:** Your content
   - **Age Rating:** 4+ (No objectionable content)

### Step 2: Build the App

```bash
# For TestFlight
eas build --platform ios --profile preview

# For App Store
eas build --platform ios --profile production
```

### Step 3: Upload to App Store

1. Download IPA file from Expo dashboard
2. Upload using one of these methods:
   - **Transporter app** (recommended)
   - **Xcode Organizer**
   - **eas submit** command

### Step 4: Submit for Review

1. Add app screenshots (required sizes):

   - **6.7"** iPhone 14 Pro Max: 1290x2796
   - **6.5"** iPhone 11 Pro Max: 1242x2688
   - **5.5"** iPhone 8 Plus: 1242x2208
   - **12.9"** iPad Pro: 2048x2732

2. Write app description:

   ```
   KharchaMeter - Smart Expense Tracker

   Track your expenses effortlessly with KharchaMeter, a modern and intuitive expense tracking app.

   Features:
   • Easy expense entry and categorization
   • Visual spending analytics
   • Secure data storage
   • Clean, user-friendly interface
   • Dark/Light mode support

   Perfect for personal finance management and budgeting.
   ```

3. Set app review information
4. Submit for review

## 🔒 App Privacy Information

You'll need to declare:

- **Data Types Collected:** Email, Name, Financial Info
- **Data Use:** App Functionality, Analytics
- **Data Sharing:** None (if using Supabase correctly)
- **Data Retention:** User can delete account

## 🚀 TestFlight Distribution

### Internal Testing (25 users max)

- Add team members in App Store Connect
- They'll get email invitations

### External Testing (10,000 users max)

- Submit for TestFlight review
- Share public link or add specific emails

## 🔧 Common iOS Issues

### Build Failures

```bash
# Clear cache and retry
eas build:cancel
eas build --platform ios --clear-cache
```

### Certificate Issues

- EAS automatically manages certificates
- Ensure Apple Developer account is active
- Check team membership in Expo dashboard

### Upload Issues

- Use Transporter app for reliable uploads
- Ensure IPA file isn't corrupted
- Check bundle identifier matches

## 📊 App Store Optimization

### Keywords (100 characters max)

```
expense,tracker,budget,finance,money,spending,analytics,personal,finance,budget,tracker
```

### Categories

- **Primary:** Finance
- **Secondary:** Productivity

### App Store Preview

Create a 30-second preview video showing:

1. App opening
2. Adding an expense
3. Viewing analytics
4. Dark/light mode toggle

## 📈 Post-Launch

### Analytics

- Monitor downloads in App Store Connect
- Track user retention
- Review crash reports

### Updates

```bash
# Update version in app.json
"version": "1.0.1"

# Build and submit update
eas build --platform ios --profile production
eas submit --platform ios
```

### Marketing

- Submit to app review sites
- Share on social media
- Create landing page

---

**Need help?**

- Apple Developer Documentation: https://developer.apple.com/documentation/
- Expo iOS Documentation: https://docs.expo.dev/distribution/app-stores/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
