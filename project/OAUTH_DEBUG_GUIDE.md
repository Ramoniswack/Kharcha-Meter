# 🔧 OAuth Debug Guide - KharchaMeter

## 🚨 Current Issues Fixed

### 1. Google OAuth Redirect Loop ✅ FIXED

**Problem**: OAuth redirects back to sign-in instead of dashboard
**Solution**: Enhanced callback handling with proper URL parameter processing

### 2. Shadow Props Deprecation Warnings ✅ FIXED

**Problem**: "'shadow\*' style props are deprecated. Use 'boxShadow'"
**Solution**: Complete elimination of all shadow props across codebase

---

## 🔍 Debugging Steps

### Check 1: OAuth URL Configuration

The OAuth redirect URL has been updated to:

- **Web**: `${window.location.origin}/auth/callback`
- **Mobile**: `myapp://auth/callback`

### Check 2: Enhanced Callback Processing

The callback page now:

- ✅ Extracts tokens from URL fragments and search params
- ✅ Sets Supabase session manually with extracted tokens
- ✅ Provides detailed console logging
- ✅ Shows debug information on screen

### Check 3: Deep Linking Configuration

Added to app.json:

- ✅ iOS associated domains for Supabase
- ✅ Android intent filters for OAuth redirects
- ✅ Proper scheme handling

---

## 🔧 Supabase Configuration Required

You need to configure these URLs in your Supabase Dashboard:

### Auth Settings → URL Configuration:

```
Site URL: http://localhost:8081
Additional Redirect URLs:
- http://localhost:8081/auth/callback
- https://localhost:8081/auth/callback
- myapp://auth/callback
- exp://localhost:19000/--/auth/callback
- exp://192.168.x.x:19000/--/auth/callback (your local IP)
```

### Google OAuth Provider Settings:

```
Authorized JavaScript origins:
- http://localhost:8081
- https://localhost:8081

Authorized redirect URIs:
- http://localhost:8081/auth/callback
- https://localhost:8081/auth/callback
- Your Supabase project URL + /auth/v1/callback
```

---

## 🔄 Testing Process

### 1. Clear Cache & Restart

```bash
npx expo start --clear
```

### 2. Check Console Output

Look for these logs:

- "Starting Google OAuth..."
- "OAuth redirect URL: ..."
- "Auth state changed: ..."
- "Found tokens in URL, setting session..."

### 3. Monitor Network Tab

- OAuth request should redirect to Google
- Google should redirect back to your callback URL
- Callback should extract tokens and set session

---

## 🐛 Common Issues & Solutions

### Issue: Still redirecting to sign-in

**Check**: Console logs in callback page
**Fix**: Ensure tokens are being extracted and session is set

### Issue: "Invalid redirect URL"

**Fix**: Add your current localhost URL to Supabase redirect URLs

### Issue: Google OAuth not configured

**Fix**: Enable Google provider in Supabase and add OAuth credentials

### Issue: Shadow props warnings persist

**Fix**: Hard refresh browser (Ctrl+Shift+R) to clear cached code

---

## 📱 Debug Information

The callback page now shows real-time debug information:

- URL parameters received
- Token extraction status
- Session setting results
- User authentication state

This will help identify exactly where the OAuth flow is failing.

---

## ✅ Success Indicators

When working correctly, you should see:

1. "Starting Google OAuth..." in console
2. Redirect to Google sign-in
3. Redirect back to your app's callback page
4. "Session set successfully!" debug message
5. Automatic redirect to dashboard after 1 second

---

## 🚀 Next Steps

1. **Start the development server**: `npx expo start --clear`
2. **Check Supabase configuration**: Ensure redirect URLs are properly set
3. **Test OAuth flow**: Try Google sign-in and monitor console logs
4. **Review callback debug info**: Check what's displayed on callback page

The enhanced callback page will show you exactly what's happening during the OAuth process!
