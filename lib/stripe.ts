import Stripe from 'stripe'

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Stripe price IDs - You'll get these after creating products in Stripe dashboard
export const STRIPE_PLANS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    name: 'Basic',
    price: 1999, // $19.99 in cents
    tier: 'basic',
  },
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    name: 'Premium',
    price: 4999, // $49.99 in cents
    tier: 'premium',
  },
}

export type StripePlan = keyof typeof STRIPE_PLANS
