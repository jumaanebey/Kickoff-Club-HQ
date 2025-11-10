# Waitlist Setup Guide

## Overview
Kickoff Club HQ has been converted to a waitlist model where users pay $4.99 to reserve their spot before launch.

## What Was Changed

### 1. Pages Created
- **`/waitlist`** - Main waitlist page with Stripe checkout form
- **`/waitlist/success`** - Celebration page after successful payment with confetti animation

### 2. API Routes
- **`/api/waitlist/checkout`** - Creates Stripe checkout session for $4.99 payment
- **`/api/waitlist/webhook`** - Handles Stripe webhooks to record successful signups

### 3. Navigation Updates
- Removed "Courses" link → Replaced with "⚡ Join Waitlist" (highlighted button)
- Removed "Sign In" button
- Removed "Pricing" link
- Added "Contact" link
- All homepage CTAs now point to `/waitlist`

### 4. Homepage Updates
- Hero section "Start Training" → "Join Waitlist - $4.99"
- Hero section "Watch Free Lesson" → "Explore Podcast"
- Bottom CTA "Start Learning Free" → "Join the Waitlist - $4.99"
- Bottom CTA "Browse All Courses" → "Explore Podcast"

### 5. Database Migration
Created `supabase/migrations/20250111_add_waitlist.sql` with:
- `waitlist_signups` table
- Columns: id, email, name, stripe_customer_id, stripe_payment_intent_id, amount_paid, status, metadata, created_at, updated_at
- Indexes on email and stripe_customer_id
- RLS policies for secure access

## Setup Required

### 1. Run Database Migration
Go to your Supabase dashboard → SQL Editor and run:
```sql
-- Copy the contents of: supabase/migrations/20250111_add_waitlist.sql
```

### 2. Set up Stripe Webhook (CRITICAL)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/waitlist/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `charge.refunded`
5. Copy the webhook signing secret
6. Add to Vercel environment variables:
   - `STRIPE_WAITLIST_WEBHOOK_SECRET=whsec_...`

### 3. Test Payment Flow
1. Go to `/waitlist`
2. Enter test info:
   - Email: any email
   - Name: Test User
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future date, any 3-digit CVC
5. Should redirect to `/waitlist/success` with confetti 🎉
6. Check Supabase `waitlist_signups` table for the entry

## Payment Details
- **Amount**: $4.99 (one-time)
- **Description**: "Reserve your spot on the waitlist. This fee will be credited toward your first month."
- **Refundable**: Yes (shown on waitlist page)
- **Credit applied**: When platform launches

## What Happens After Payment
1. User sees success page with confetti
2. Email confirmation sent (via Stripe)
3. Webhook stores signup in database
4. Status set to 'confirmed'
5. User receives updates via kickoffclubhq@gmail.com

## Next Steps (Post-Launch)
When you're ready to launch:
1. Convert waitlist signups to full accounts
2. Credit their $4.99 toward first month subscription
3. Grant them priority access
4. Send launch notification emails

## Removed Features
- All instructor pages (there were none)
- Course navigation from header
- Sign-in/Sign-up CTAs
- Pricing page link from navigation

## Still Available
- `/podcast` - Podcast content
- `/blog` - Blog posts
- `/contact` - Contact page (kickoffclubhq@gmail.com)
- `/courses` - Still accessible directly, but not linked
