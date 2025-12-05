# Kickoff Club HQ - Mobile App

A gamified football education app built with React Native and Expo.

## Features

- **Learn**: Video courses teaching football fundamentals
- **Predict**: Wager virtual coins on NFL game outcomes
- **Shop**: Redeem coins for real merchandise
- **Gamification**: Earn coins, XP, streaks, and achievements
- **Subscriptions**: Free, Pro ($9.99/mo), Captain ($19.99/mo) tiers

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe (subscriptions)
- **Video**: Expo AV
- **Navigation**: React Navigation

## Project Structure

```
mobile-app/
├── App.tsx                    # App entry point
├── src/
│   ├── components/            # Reusable UI components
│   ├── constants/
│   │   ├── theme.ts          # Colors, fonts, spacing
│   │   └── config.ts         # App configuration
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication state
│   ├── navigation/
│   │   └── index.tsx         # Navigation setup
│   ├── screens/
│   │   ├── Auth/             # SignIn, SignUp, ForgotPassword
│   │   └── Main/             # Home, Predict, Learn, Shop, Profile
│   ├── services/
│   │   └── supabase.ts       # Supabase client & functions
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   └── utils/                # Helper functions
└── database/
    └── schema.sql            # Supabase database schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account
- Stripe account

### Setup

1. **Install dependencies**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Configure Supabase**

   Create a Supabase project and update `src/constants/config.ts`:
   ```typescript
   export const SUPABASE_URL = 'your-project-url';
   export const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

3. **Set up database**

   Run the SQL in `database/schema.sql` in your Supabase SQL Editor.

4. **Configure Stripe**

   Update `src/constants/config.ts` with your Stripe publishable key.

5. **Start the app**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app

## Screens

### Authentication
- **SignIn**: Email/password login
- **SignUp**: Create account with welcome bonus
- **ForgotPassword**: Password reset flow

### Main App
- **Home**: Dashboard with stats, daily bonus, upcoming games
- **Predict**: NFL game predictions with coin wagers
- **Learn**: Video courses with progress tracking
- **Shop**: Merchandise store (coins to real items)
- **Profile**: User settings, subscription management

## Coin System

Users earn coins through:
- Daily login bonus (5/10/25 based on tier)
- Watching lessons (10 coins per lesson)
- Correct predictions (2x wagered amount)
- Streak bonuses (25 per day)
- Referrals (100 coins)

## Subscription Tiers

| Feature | Free | Pro ($9.99) | Captain ($19.99) |
|---------|------|-------------|------------------|
| Daily Coins | 5 | 10 | 25 |
| Courses | Limited | All | All |
| Predictions | 3/week | Unlimited | Unlimited |
| Shop Discount | 0% | 10% | 20% |

## Development

### Adding New Screens

1. Create screen in `src/screens/`
2. Add to navigation in `src/navigation/index.tsx`
3. Add types in `src/types/index.ts`

### Database Changes

1. Update `database/schema.sql`
2. Run migration in Supabase
3. Update types in `src/types/index.ts`

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Environment Variables

For production, create `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
};
```

## License

Private - Kickoff Club HQ
