# Android Deployment Guide for KharchaMeter

## 📱 **FREE Android Deployment Options**

### Option 1: Expo Go (100% Free - No Developer Account Needed)

**Best for:** Testing and sharing with friends/family

**Steps:**

1. Install Expo Go app on Android device from Play Store
2. Start your development server:
   ```bash
   npx expo start
   ```
3. Scan QR code with Expo Go app
4. Your app runs instantly on the device!

**Pros:** ✅ Completely free, instant testing, easy sharing
**Cons:** ❌ Requires Expo Go app, limited native features

### Option 2: APK Build (FREE - Direct Install)

**Best for:** Installing directly on Android devices without Play Store

**Steps:**

1. Build APK file:
   ```bash
   eas build --platform android --profile preview
   ```
2. Download APK from https://expo.dev
3. Install directly on Android device (enable "Unknown sources")
4. Share APK file with anyone!

**Pros:** ✅ Free, standalone app, no Play Store needed
**Cons:** ❌ Users need to enable "Unknown sources"

### Option 3: Google Play Store ($25 ONE-TIME fee)

**Best for:** Public distribution and professional deployment

**Steps:**

1. Pay $25 one-time Google Play Console fee
2. Build AAB file:
   ```bash
   eas build --platform android --profile production
   ```
3. Upload to Google Play Console
4. Submit for review (usually approved in 1-3 days)

**Pros:** ✅ Professional distribution, automatic updates, user trust
**Cons:** ❌ $25 one-time fee

## 🚀 **Recommended FREE Approach**

### For Testing (FREE):

```bash
# Start development server
npx expo start

# Or build APK for direct install
eas build --platform android --profile preview
```

### For Distribution:

- **Free:** Share APK files directly
- **Professional:** Google Play Store ($25 one-time)

## 📋 **Quick Android Setup**

### 1. Free APK Build

```bash
# Install EAS CLI (if not installed)
npm install -g eas-cli

# Login to Expo (free account)
npx expo login

# Build APK (FREE)
eas build --platform android --profile preview
```

### 2. Download & Install

1. Go to https://expo.dev
2. Download your APK file
3. Transfer to Android device
4. Enable "Install unknown apps" in Android settings
5. Install APK

### 3. Share with Others

- Send APK file via email/messaging
- Upload to cloud storage (Google Drive, Dropbox)
- Create download link

## 💰 **Cost Comparison**

| Method                 | Cost         | Best For                   |
| ---------------------- | ------------ | -------------------------- |
| **Expo Go**            | FREE         | Testing, development       |
| **APK Direct Install** | FREE         | Personal use, small groups |
| **Google Play Store**  | $25 one-time | Public distribution        |
| **iOS App Store**      | $99/year     | iOS distribution           |

## 🔧 **Android Build Profiles**

Your `eas.json` already includes:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk" // FREE APK build
      }
    },
    "production": {
      "android": {
        "buildType": "aab" // Play Store format
      }
    }
  }
}
```

## 📱 **Commands Available**

```bash
# FREE testing with Expo Go
npm start
npm run android

# FREE APK build
npm run build:android

# Play Store build ($25 fee)
eas build --platform android --profile production
```

## 🎯 **Bottom Line**

**Android deployment is essentially FREE!** You can:

- ✅ Test with Expo Go (FREE)
- ✅ Build APK files (FREE)
- ✅ Install on unlimited devices (FREE)
- ✅ Share with anyone (FREE)

Only pay $25 if you want professional Play Store distribution!

---

**Start testing now:** Just run `npx expo start` and scan the QR code with Expo Go!
