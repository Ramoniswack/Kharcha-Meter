# KharchaMeter - Expense Tracker App

A modern expense tracking application built with React Native and Expo, powered by Supabase for backend services.

## Features

- 📊 Track income and expenses
- 📈 Visual expense analytics with charts
- 🔐 User authentication
- 🌓 Dark/Light theme support
- 📱 Cross-platform (iOS, Android, Web)
- 💾 Real-time data synchronization
- 🔒 Secure data storage with Supabase

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI**: Custom components with theming
- **Charts**: Victory Native
- **Icons**: Lucide React Native

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Supabase Account](https://supabase.com/)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# or using yarn
yarn install
```

### 2. Supabase Setup

#### Create a New Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new account if you don't have one
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: KharchaMeter (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

#### Configure Database Schema

1. Wait for your project to be ready (usually takes 2-3 minutes)
2. Go to the **SQL Editor** in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` from this project
4. Paste it in the SQL Editor and click **Run**
5. This will create all necessary tables, policies, and functions

#### Get Your Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **Project API Key** (anon public key)

### 3. Environment Configuration

1. Create a `.env` file in the project root (already exists, update it):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

2. Replace the values with your actual Supabase credentials

### 4. Run the Application

```bash
# Start the development server
npm run dev

# or using yarn
yarn dev
```

This will start the Expo development server. You can then:

- Press `w` to open in web browser
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your phone

## Project Structure

```
project/
├── app/                    # App screens using Expo Router
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home/Dashboard screen
│   │   ├── add.tsx        # Add transaction screen
│   │   ├── history.tsx    # Transaction history
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   ├── signup.tsx     # Sign up screen
│   │   └── forgot-password.tsx
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   ├── DataContext.tsx   # Transaction data management
│   └── ThemeContext.tsx  # Theme management
├── lib/                  # Library configurations
│   └── supabase.ts      # Supabase client setup
├── services/            # API services
│   └── database.ts      # Database operations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── supabase-schema.sql  # Database schema
```

## Key Features Implementation

### Authentication

- User registration and login
- Password reset functionality
- Automatic session management
- Row Level Security (RLS) for data protection

### Data Management

- Real-time transaction synchronization
- Offline support with React Native AsyncStorage
- Optimistic updates for better UX
- Error handling and retry mechanisms

### UI/UX

- Responsive design for all screen sizes
- Dark/Light theme with system preference detection
- Smooth animations and transitions
- Intuitive navigation

## Database Schema

The app uses the following main tables:

- **users**: Extended user profiles linked to Supabase auth
- **transactions**: Income and expense records
- **categories**: Predefined categories for transactions

All tables have Row Level Security enabled to ensure users can only access their own data.

## Customization

### Adding New Categories

1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → **categories**
3. Add new categories with appropriate icons and colors

### Modifying Themes

Edit `contexts/ThemeContext.tsx` to customize colors and styling.

### Adding New Transaction Types

1. Update the `Transaction` type in `types/index.ts`
2. Modify the database schema if needed
3. Update the UI components accordingly

## Deployment

### Web Deployment

```bash
# Build for web
npm run build:web

# The output will be in the web-build directory
# Deploy to your preferred hosting service (Vercel, Netlify, etc.)
```

### Mobile App Deployment

1. Build for production:

```bash
# iOS
expo build:ios

# Android
expo build:android
```

2. Follow Expo's [deployment guide](https://docs.expo.dev/distribution/introduction/) for app stores

## Environment Variables

| Variable                        | Description                   | Required |
| ------------------------------- | ----------------------------- | -------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     | Yes      |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | Yes      |

## Security Notes

- Never expose your Supabase service role key in client-side code
- The anon key is safe to use in client applications
- Row Level Security policies ensure data isolation between users
- All sensitive operations are protected by authentication

## Troubleshooting

### Common Issues

1. **"Cannot connect to Supabase"**

   - Check your environment variables
   - Ensure your Supabase project is active
   - Verify your network connection

2. **"Database errors"**

   - Ensure you've run the schema SQL script
   - Check Supabase logs in the dashboard
   - Verify RLS policies are correctly set up

3. **"Authentication not working"**
   - Check if email confirmation is required
   - Verify auth settings in Supabase dashboard
   - Ensure auth providers are properly configured

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Visit [Supabase docs](https://supabase.com/docs)
- Review [React Native documentation](https://reactnative.dev/docs/getting-started)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

Happy expense tracking! 💰📊
