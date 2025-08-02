# Google OAuth Setup for KharchaMeter

## Current Issue

Google sign-in is not working because Google OAuth is not configured in your Supabase project.

## Steps to Fix Google OAuth:

### 1. Configure Google OAuth in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `mgqvqyujwkjcjhmxaiau`
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click **Configure**

### 2. Set up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable **Google+ API** and **Google Identity and Access Management (IAM) API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add these URLs to **Authorized redirect URIs**:
   ```
   https://mgqvqyujwkjcjhmxaiau.supabase.co/auth/v1/callback
   http://localhost:8081/auth/callback
   ```

### 3. Configure Supabase with Google Credentials

In Supabase Dashboard → Authentication → Providers → Google:

- **Enable Google provider**: ✅ ON
- **Client ID**: (from Google Cloud Console)
- **Client Secret**: (from Google Cloud Console)
- **Redirect URL**: `https://mgqvqyujwkjcjhmxaiau.supabase.co/auth/v1/callback`

### 4. Test the Integration

Once configured:

1. Restart your development server
2. Try Google sign-in
3. It should redirect to Google → back to your app

## Temporary Workaround

For now, you can test with email/password authentication while setting up Google OAuth.

## Files Fixed in This Update

✅ **Shadow Props Fixed**: Removed all deprecated shadow\* props, replaced with boxShadow
✅ **Error Handling**: Improved Google OAuth error messages
✅ **Console Logging**: Added debug logs for Google OAuth flow

## Next Steps

1. Configure Google OAuth as described above
2. Test the complete authentication flow
3. Deploy the app once authentication is working
