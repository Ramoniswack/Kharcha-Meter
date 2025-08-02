# KharchaMeter

<div align="center">
  <img src="project/assets/images/KharchaMeter.png" alt="KharchaMeter Logo" width="300"/>
  
  **Smart Expense Tracker for Modern Life**
  
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## Overview

KharchaMeter is a modern, feature-rich expense tracking application built with React Native and Expo. Take control of your finances with beautiful visualizations, secure authentication, and real-time synchronization across all your devices.

## Key Features

### Smart Financial Tracking

- Track income and expenses with intelligent categorization
- Visual analytics and spending insights
- Real-time budget monitoring
- Transaction editing and management

### Secure & Reliable

- Google OAuth authentication
- Real-time data synchronization with Supabase
- Secure cloud storage with Row Level Security
- Offline-first architecture

### Beautiful Experience

- Modern, intuitive interface
- Dark/Light theme support
- Smooth animations and transitions
- Cross-platform compatibility (Web, iOS, Android)

### Advanced Analytics

- Category-wise spending breakdown
- Monthly and yearly trends
- Visual charts and graphs
- Export capabilities

## Quick Start

### Prerequisites

- Node.js 18.0+
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ramoniswack/Kharcha-Meter.git
   cd Kharcha-Meter/project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start development**
   ```bash
   npm start
   ```

## Technology Stack

### Frontend & Mobile

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build service
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation

### Backend & Database

- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust database
- **Row Level Security** - Data protection
- **Real-time subscriptions** - Live updates

### UI & Design

- **Lucide React Native** - Beautiful icon library
- **Custom Components** - Reusable UI elements
- **Theme System** - Dark/Light mode support
- **Responsive Design** - Optimized for all screen sizes

## Available Scripts

| Command                        | Description                    |
| ------------------------------ | ------------------------------ |
| `npm start`                    | Start Expo development server  |
| `npm run web`                  | Run in web browser             |
| `npm run android`              | Run on Android device/emulator |
| `npm run ios`                  | Run on iOS device/simulator    |
| `npm run build:web`            | Build for web deployment       |
| `eas build --platform android` | Build Android APK              |
| `eas build --platform ios`     | Build iOS app                  |

## Deployment

### Web Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Automatic deployment on push to main

### Mobile Deployment

- **Android**: EAS Build for Play Store
- **iOS**: EAS Build for App Store (Apple Developer account required)

## Database Schema

### Users Table

```sql
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Transactions Table

```sql
transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Roadmap

- [ ] Receipt scanning with OCR
- [ ] Budget planning and alerts
- [ ] Export to CSV/PDF
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Advanced analytics dashboard
- [ ] Bank account integration
- [ ] Investment tracking

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

Need help? We're here for you:

- [Report bugs](https://github.com/Ramoniswack/Kharcha-Meter/issues)
- [Request features](https://github.com/Ramoniswack/Kharcha-Meter/issues)
- Check the documentation
- Join our community discussions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Made for better financial management</strong></p>
  <p><i>© 2024 KharchaMeter. All rights reserved.</i></p>
</div>
