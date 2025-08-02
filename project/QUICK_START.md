# Quick Start Guide

## 🚀 Getting Started with KharchaMeter

### Prerequisites

Make sure you have Node.js installed on your system.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Install Expo CLI (if not already installed)

```bash
npm install -g @expo/cli
```

### Step 3: Set up Supabase (Required)

⚠️ **Important**: The app will run in mock mode without Supabase, but you need to set up Supabase for full functionality.

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase-schema.sql` in your Supabase SQL editor
3. Update `.env` with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To get your credentials:**

- Go to Settings → API in your Supabase dashboard
- Copy "Project URL" and "Project API Key (anon public)"

### Step 4: Start the Development Server

```bash
npm run dev
```

or

```bash
npx expo start
```

### Platform Options

- Press `w` to open in web browser
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

### Troubleshooting

#### "expo is not recognized" error

- Solution: Use `npx expo start` instead of `expo start`
- Or install Expo CLI globally: `npm install -g @expo/cli`

#### TypeScript errors

- Run `npm install` to ensure all dependencies are installed
- Check that your Node.js version is 16 or higher

#### Supabase connection issues

- Verify your `.env` file has the correct Supabase URL and key
- Check that your Supabase project is active
- Ensure you've run the database schema

### Features Available

✅ User Authentication (Sign up, Login, Password Reset)
✅ Add Income/Expense Transactions
✅ Real-time Data Sync
✅ Category-wise Expense Tracking
✅ Dark/Light Theme Support
✅ Transaction History
✅ Visual Analytics

Happy tracking! 💰📊
