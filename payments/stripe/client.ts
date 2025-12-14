import Stripe from 'stripe'

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
})

// Stripe price IDs - Configure these in Stripe dashboard
export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    name: 'Pro',
    price: 1499, // $14.99/month in cents
    tier: 'basic',
  },
  'all-pro': {
    priceId: process.env.STRIPE_ALL_PRO_PRICE_ID || 'price_all_pro_monthly',
    name: 'All-Pro',
    price: 2900, // $29/month in cents
    tier: 'premium',
  },
}

export type StripePlan = keyof typeof STRIPE_PLANS
