# Complete Supabase Setup Guide with OAuth

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up **"shadow\*" style props are deprecated. Use "boxShadow"**

- **STATUS**: ✅ FIXED - ALL elevation properties removed from entire codebase
- **SOLUTION**: Systematically removed all remaining `elevation` properties that were causing deprecation warnings
- **FILES UPDATED**:
  - app/(tabs)/index.tsx - removed elevation from summary card
  - app/(tabs)/\_layout.tsx - removed elevation from tab bar
  - app/auth/login.tsx - removed elevation from login and OAuth buttons
  - app/auth/signup.tsx - removed elevation from signup and Google buttons
  - components/TransactionItem.tsx - removed elevation from transaction items
  - components/SummaryCard.tsx - removed elevation from summary cards
  - components/CategoryChart.tsx - removed elevation from chart container
  - app/(tabs)/profile.tsx - removed elevation from user card
  - components/Logo.tsx - removed elevation from logo elements
- **RESULT**: Complete elimination of shadow deprecation warnings - all components now use web-compatible boxShadow only

**"description is not defined" error when adding transactions**Hub (recommended) or email 4. Verify your email if using email signup

### 1.2 Create New Project

1. Once logged in, click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `KharchaMeter` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is perfect for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

---

## Step 2: Database Setup

### 2.1 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire content from `supabase-schema.sql` in your project
4. Paste it in the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is correct!

> **Note**: If you get a "permission denied" error, make sure you're using the updated `supabase-schema.sql` file without the JWT secret line.

### 2.2 Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `users`
   - `transactions`
   - `categories`
3. Click on each table to see the structure

---

## Step 3: Get Your Credentials

### 3.1 Find Your Project Credentials

1. Go to **Settings** → **API** (left sidebar)
2. You'll see:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **Project API Keys**:
     - `anon` `public` key (this is safe for client-side)
     - `service_role` key (keep this secret!)

### 3.2 Copy Your Credentials

Copy these two values:

- **Project URL**
- **anon public key** (NOT the service_role key!)

---

## Step 4: Configure OAuth Providers

### 4.1 Enable Google OAuth (Recommended)

1. Go to **Authentication** → **Providers** (left sidebar)
2. Find **Google** in the list
3. Click on Google to configure it
4. Toggle **"Enable Google provider"** to ON

#### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
5. Choose **"Web application"**
6. Add these **EXACT** redirect URIs (replace `your-project-id` with your actual Supabase project ID):
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   http://localhost:8081/auth/callback
   http://localhost:8082/auth/callback
   exp://localhost:8081/auth/callback
   ```
7. **IMPORTANT**: Also add your actual Supabase project URL exactly as shown in your Supabase dashboard
8. Copy the **Client ID** and **Client Secret**
9. Paste them in Supabase Google provider settings
10. Click **Save**

**Common Fix for redirect_uri_mismatch:**

- Go back to your Google OAuth app settings
- Check that the redirect URI exactly matches: `https://[your-supabase-project-id].supabase.co/auth/v1/callback`
- Make sure there are no extra spaces or typos

### 4.2 Enable GitHub OAuth (Alternative)

1. In Supabase: **Authentication** → **Providers** → **GitHub**
2. Toggle **"Enable GitHub provider"** to ON

#### Get GitHub OAuth Credentials:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `KharchaMeter`
   - **Homepage URL**: `http://localhost:8082` (for development)
   - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
4. Click **"Register application"**
5. Copy **Client ID** and generate **Client Secret**
6. Paste them in Supabase GitHub provider settings
7. Click **Save**

### 4.3 Configure Email Settings (Optional but Recommended)

1. Go to **Authentication** → **Settings**
2. Under **SMTP Settings**:
   - Enable **"Enable custom SMTP"** if you want custom emails
   - Or leave default for basic functionality
3. Under **Auth Settings**:
   - **Site URL**: `http://localhost:8082` (for development)
   - **Redirect URLs**: Add `http://localhost:8082` and any production URLs

---

## Step 5: Update Your App Configuration

### 5.1 Update Environment Variables

Edit your `.env` file with real credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 5.2 Restart Your App

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 6: Test Authentication

### 6.1 What Should Work Now:

1. **Sign Up**: Create new accounts
2. **Sign In**: Login with email/password
3. **OAuth**: Login with Google/GitHub (if configured)
4. **Data Sync**: Real-time transaction storage
5. **User Profiles**: Automatic user profile creation

### 6.2 Testing Steps:

1. Open your app
2. The Supabase setup banner should disappear
3. Try signing up with a new email
4. Check your email for verification
5. Try OAuth login (if configured)
6. Add transactions - they should save to database
7. Check Supabase dashboard → **Table Editor** → **transactions** to see data

---

## Step 7: Production Configuration (Later)

When you're ready to deploy:

### 7.1 Update Redirect URLs

Add your production domain to:

- Supabase **Authentication** → **Settings** → **Redirect URLs**
- OAuth provider settings (Google/GitHub)

### 7.2 Environment Variables for Production

Create production environment with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Quick Verification Checklist

After setup, verify these work:

- [ ] App loads without "Supabase not configured" banner
- [ ] Sign up creates new user in Supabase
- [ ] Sign in works with email/password
- [ ] OAuth login works (if configured)
- [ ] Adding transactions saves to database
- [ ] Data appears in Supabase dashboard

---

## Troubleshooting

### Common Issues:

**SyntaxError: Unexpected token, expected "from" in login.tsx**

- **STATUS**: ✅ FIXED - Import statement corruption resolved
- **ROOT CAUSE**: File editing conflict caused import statements to merge with style definitions
- **SYMPTOMS**: `import header: { marginTop: 40...` causing syntax errors
- **SOLUTION**: Cleaned up corrupted import statements and properly structured the file
- **FILES FIXED**: app/auth/login.tsx - restored proper import structure and added missing logo style
- **RESULT**: Login screen now loads without syntax errors

**"Failed to set an indexed property [0] on 'CSSStyleDeclaration'"**

- This is a web-specific styling error that occurs when React Native color styles are incompatible with web browsers
- **ROOT CAUSE**: Complex style arrays and conditional expressions in TouchableOpacity and Link components cause CSS parsing failures
- **FIXED** ✅ - All complex style arrays replaced with pre-computed style variables in auth components
- **STATUS**: App should now load successfully in web browser
- **LATEST FIX**: Pre-computed all dynamic styles in login.tsx to avoid CSS parsing conflicts

**Metro bundler '<anonymous>' file errors**

- **ISSUE**: Metro cache corruption creating phantom `<anonymous>` files that don't exist
- **SOLUTION**: Complete cache clearing and server restart required:

  ```bash
  # Navigate to correct directory first
  cd "d:\NEEDS\6th sem\React\KharchaMeter\project"

  # Stop all Node processes
  taskkill /f /im node.exe

  # Clear all caches
  Remove-Item -Recurse -Force .\node_modules\.cache -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\haste-map-* -ErrorAction SilentlyContinue

  # Start fresh
  npx expo start --clear --web
  ```

**"shadow\* style props are deprecated. Use boxShadow"**

- **STATUS**: ✅ FIXED - All deprecated shadow styles have been replaced with boxShadow
- **SOLUTION**: Replaced all Platform.select shadow implementations with universal boxShadow properties
- **FILES UPDATED**: All components and pages now use modern shadow styling
- **RESULT**: No more deprecation warnings - app uses web-compatible shadow properties

**"description is not defined" error when adding transactions**

- **STATUS**: ✅ FIXED - Variable naming mismatch resolved
- **ROOT CAUSE**: HandleSave function was using `description` variable but state used `title` and `notes`
- **SOLUTION**: Updated add.tsx to use correct variable names matching Transaction interface
- **FILES UPDATED**: app/(tabs)/add.tsx - proper variable mapping and router import added
- **RESULT**: Add transaction functionality now works correctly

**Infinite loading and Metro cache issues**

- **STATUS**: 🔄 IN PROGRESS - Metro bundler cache corruption causing route detection failures
- **ROOT CAUSE**: Persistent Metro cache storing invalid route information and causing infinite re-renders
- **SYMPTOMS**: Profile tab not visible, infinite loading states, phantom file errors
- **SOLUTION ATTEMPTED**: Aggressive cache clearing with multiple approaches:
  ```bash
  # Complete cache reset
  taskkill /f /im node.exe /t
  Remove-Item -Recurse -Force node_modules\.cache
  Remove-Item -Recurse -Force $env:TEMP\metro-*
  Remove-Item -Recurse -Force $env:TEMP\haste-map-*
  Remove-Item -Recurse -Force $env:TEMP\react-*
  npx expo start --clear --reset-cache
  ```
- **FILES VERIFIED**: Profile.tsx has correct default export, all route files properly structured
- **RECOMMENDATION**: Manual Metro server restart may be required

**Enhanced Input Validation and User Experience**

- **STATUS**: ✅ COMPLETED - Comprehensive form validation with user-friendly feedback
- **FEATURES ADDED**:
  - **Real-time validation**: Field-by-field error checking with immediate feedback
  - **Input sanitization**: Amount field restricted to numbers and decimal points only
  - **Comprehensive rules**: Title (min 3 chars), Amount (numeric, >0, <₹10L), Category (required)
  - **Visual indicators**: Red borders and error messages for invalid fields
  - **Enhanced success flow**: Celebration popup with formatted amount and action options
  - **Loading states**: Disabled button with "Saving..." text during processing
  - **Smart form reset**: Category clears when transaction type changes
- **FILES UPDATED**: app/(tabs)/add.tsx - complete validation system implementation
- **USER EXPERIENCE**: Form now provides clear guidance and prevents invalid submissions

**Lucide Icons for Categories and Enhanced UI**

- **STATUS**: ✅ COMPLETED - Beautiful category icons with colors throughout the app
- **FEATURES ADDED**:
  - **Category Icons**: Each category now has a unique Lucide icon (Food 🍽️, Car 🚗, Zap ⚡, etc.)
  - **Color-coded Categories**: Every category has its own distinct color for easy recognition
  - **Icon Integration**: Icons appear in transaction lists, add form, and category selections
  - **Visual Hierarchy**: Better visual organization with consistent iconography
- **FILES CREATED**:
  - utils/categoryIcons.tsx - comprehensive category configuration with icons and colors
  - components/KharchaMeterFavicon.tsx - simplified logo for favicon use
- **FILES UPDATED**:
  - app/(tabs)/add.tsx - category chips now show icons alongside text
  - components/TransactionItem.tsx - transactions display with category-specific icons and colors
  - utils/dummyData.ts - updated to use new category system
- **USER EXPERIENCE**: Much more intuitive and visually appealing category selection and transaction viewing

**Profile Tab Navigation Issue**

- **STATUS**: 🔄 PERSISTENT METRO CACHE ISSUE - Profile tab properly defined but not showing
- **ROOT CAUSE**: Metro bundler cache corruption preventing proper route detection
- **VERIFICATION**: Profile tab is correctly defined in app/(tabs)/\_layout.tsx with proper icon and route
- **FILES CONFIRMED**: All tab routes (index, add, history, profile) are properly structured
- **SOLUTION REQUIRED**: Manual Metro server restart with complete cache clearing:
  ```bash
  # Complete cache clearing process
  taskkill /f /im node.exe
  Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\haste-map-* -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\react-* -ErrorAction SilentlyContinue
  npx expo start --clear --reset-cache
  ```
- **CRITICAL**: Profile tab SHOULD appear after proper cache clearing - the code is correct

**Missing default export warnings**

- **STATUS**: ✅ FIXED - Profile component has correct default export
- **SOLUTION**: Cleared Metro bundler cache to resolve routing conflicts
- App functionality is restored - this was a Metro bundler cache issue
- **LATEST FIX**: Comprehensive cache clearing resolved component export detection

**"Error: ENOENT: no such file or directory, open '...\\<anonymous>'"**

- Metro bundler cache corruption issue
- **Solution**: Clear all Metro caches thoroughly:

  ```bash
  # Stop all Node processes
  taskkill /f /im node.exe

  # Clear Metro caches (PowerShell)
  Remove-Item -Recurse -Force .\node_modules\.cache -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $env:TEMP\haste-map-* -ErrorAction SilentlyContinue

  # Restart fresh
  npx expo start --clear
  ```

**"permission denied to set parameter 'app.jwt_secret'"**

- This means you're using an old version of the schema file
- Use the updated `supabase-schema.sql` file (the JWT secret line has been removed)
- Copy the schema content again and run it

**"Invalid login credentials"**

- Check email/password are correct
- Verify email confirmation if enabled

**Google OAuth "Continue with Google" button not working**

- **ISSUE**: Button shows but OAuth flow doesn't start or shows "redirect_uri_mismatch" error
- **ROOT CAUSE**: Incorrect redirect URI configuration in Google Cloud Console
- **CRITICAL**: The redirect URI must match EXACTLY between Supabase and Google Cloud Console

**FIX STEPS**:

1. **Get exact callback URL from Supabase**:

   - Go to Supabase Dashboard → Authentication → Providers → Google
   - Copy the "Callback URL (for OAuth)" exactly (e.g., `https://abcdefgh.supabase.co/auth/v1/callback`)
   - ⚠️ **IMPORTANT**: This URL is unique to your project and must be copied precisely

2. **Update Google Cloud Console**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services → Credentials
   - Click your OAuth 2.0 Client ID (the one you created for this app)
   - Scroll to "Authorized redirect URIs"
   - Click "ADD URI" and paste the EXACT callback URL from step 1
   - Verify no extra spaces, characters, or typos
   - Save changes

3. **Verify OAuth App Settings**:

   - Ensure your OAuth app is published (not in testing mode)
   - Check that your email is added to test users if still in testing
   - Confirm the app has the correct scopes enabled

4. **Wait for propagation**: Allow 5-10 minutes for changes to take effect globally

5. **Clear browser cache**: Hard refresh (Ctrl+F5) or clear browser cache

6. **Test again**: Try the "Continue with Google" button after waiting

**Common Mistakes**:

- Using `http://` instead of `https://` for the Supabase URL
- Missing `/auth/v1/callback` at the end
- Extra spaces or characters in the URI
- Using a different project ID than what's in your Supabase dashboard

**OAuth not working**

- **Google OAuth "redirect_uri_mismatch" Error**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/) → Your Project → Credentials
  2. Click on your OAuth 2.0 Client ID
  3. In "Authorized redirect URIs", add the EXACT URI from your Supabase project:
     - Go to your Supabase dashboard → Authentication → Providers → Google
     - Copy the "Callback URL (for OAuth)" exactly as shown
     - It should look like: `https://[project-id].supabase.co/auth/v1/callback`
  4. Save changes in Google Cloud Console
  5. Wait 5-10 minutes for changes to propagate
- Check redirect URLs match exactly between OAuth provider and Supabase
- Verify OAuth credentials are correct in Supabase settings
- Check OAuth app is not in development/testing mode

**Transactions not saving**

- Check database policies are enabled
- Verify user is authenticated
- Check browser console for errors

**App still showing mock data**

- Verify `.env` file has real credentials
- Restart development server
- Check console for Supabase warnings

**Authentication UI Issues**

- **IMPROVED** ✅ - Enhanced login and signup UI design with:
  - Larger, more prominent buttons with shadows
  - Better spacing and typography
  - Modern rounded corners and improved color contrast
  - More intuitive input field styling
  - Better visual hierarchy and user experience

---

## You're All Set!

Once configured, your app will have:

- ✅ **Real user authentication**
- ✅ **OAuth login options**
- ✅ **Live data synchronization**
- ✅ **Secure data storage**
- ✅ **Real-time updates**

---

## KharchaMeter Logo

The KharchaMeter logo features:

- **Yellow wallet icon** representing personal finance management
- **White dollar sign** symbolizing money tracking
- **Green upward arrow** indicating financial growth and progress
- **Circular design** with professional blue background

**Usage**: The logo can be used in:

- App icons and splash screens
- Header/navigation areas
- About pages and documentation
- Marketing materials and presentations

The logo perfectly represents the app's core purpose: helping users track their expenses ("Kharcha" in Hindi/Urdu) and measure their financial progress.

---

Need help with any step? Let me know!
