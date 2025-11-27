// Supabase Configuration
export const SUPABASE_URL = 'https://zejensivaohvtkzufdou.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o';

// API Configuration
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://kickoffclubhq.com';

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = 'YOUR_STRIPE_PUBLISHABLE_KEY';

// App Configuration
export const APP_CONFIG = {
  name: 'Kickoff Club HQ',
  version: '1.0.0',

  // Subscription pricing
  pricing: {
    pro: {
      id: 'kickoff_pro',
      name: 'Kickoff Pro',
      price: 9.99,
      interval: 'month',
      features: [
        'All video courses',
        'Weekly predictions',
        '10 Coins daily bonus',
        'Basic badges',
      ],
    },
    captain: {
      id: 'team_captain',
      name: 'Team Captain',
      price: 19.99,
      interval: 'month',
      features: [
        'Everything in Pro',
        'Unlimited predictions',
        '25 Coins daily bonus',
        'Exclusive merch discounts',
        'Priority support',
        'Captain badge',
      ],
    },
  },

  // Coin system
  coins: {
    dailyBonus: {
      free: 5,
      pro: 10,
      captain: 25,
    },
    watchVideo: 10,
    correctPrediction: 50,
    streakBonus: 25, // per day of streak
    referral: 100,
  },

  // Ad configuration (AdMob)
  ads: {
    bannerId: 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxx',
    interstitialId: 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxx',
    rewardedId: 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxx',
  },
};
