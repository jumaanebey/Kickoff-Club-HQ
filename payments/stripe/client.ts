import Stripe from 'stripe'

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
})

// Stripe price IDs - You'll get these after creating products in Stripe dashboard
export const STRIPE_PLANS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_1SRuo9LDni76ZzdRN9AwNkUR',
    name: 'All-Access',
    price: 499, // $4.99/month in cents
    setupFee: 2000, // $20 setup fee (makes first payment $24.99)
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
