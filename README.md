# KharchaMeter

Smart expense tracker built with React Native and Expo.

## Features

- Track income and expenses with categorization
- Visual analytics and spending insights
- Secure authentication with Google OAuth
- Real-time data synchronization
- Dark/Light theme support
- Cross-platform (Web, iOS, Android)

## Tech Stack

**Frontend:**

- React Native with Expo
- TypeScript
- Expo Router for navigation
- Lucide React Native for icons

**Backend:**

- Supabase (Database, Authentication, Real-time)
- PostgreSQL database
- Row Level Security (RLS)

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ramoniswack/Kharcha-Meter.git
   cd Kharcha-Meter/project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Supabase credentials:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Development

### Available Scripts

```bash
npm start          # Start development server
npm run web        # Run in web browser
npm run android    # Run on Android
npm run ios        # Run on iOS

npm run build:web     # Build for web deployment
npm run build:android # Build Android APK
npm run build:ios     # Build iOS app
```

### Testing

- Web: Open http://localhost:8081
- Mobile: Scan QR code with Expo Go app

## Deployment

### Web Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Mobile Deployment

- Android: Build APK with `eas build --platform android`
- iOS: Build with `eas build --platform ios` (requires Apple Developer account)

## Database Schema

### Users Table

- id (UUID, Primary Key)
- email (Text, Unique)
- name (Text)
- avatar_url (Text, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

### Transactions Table

- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (Text)
- amount (Numeric)
- type (income/expense)
- category (Text)
- date (Date)
- notes (Text, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- Create an issue on GitHub
- Check the documentation in the `/docs` folder

## Roadmap

- Receipt scanning with OCR
- Budget planning and alerts
- Export to CSV/PDF
- Multi-currency support
- Recurring transactions
- Advanced analytics and reports
