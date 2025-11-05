# 💳 Stripe Integration - Complete Setup Guide

Your Stripe integration is now fully built! Here's how to set it up and start accepting payments.

---

## ✅ What's Been Built

### Complete Payment System:
- ✅ Checkout flow for Basic ($19/mo) and Premium ($49/mo)
- ✅ Subscription management portal
- ✅ Webhook handlers for all subscription events
- ✅ Automatic subscription status updates in database
- ✅ Customer portal for billing management
- ✅ Subscription page in user dashboard
- ✅ Pricing page with payment buttons

---

## 🚀 Setup Steps (30 minutes)

### Step 1: Create Stripe Account (5 minutes)

1. Go to **https://stripe.com**
2. Click **"Start now"** and sign up
3. Complete business verification:
   - Business name: Kickoff Club HQ
   - Business type: LLC / Sole Proprietor
   - Country: Your location
4. You'll start in **Test Mode** (perfect for development)

### Step 2: Create Products (10 minutes)

1. In Stripe Dashboard, go to **Products** → **Add product**

#### Create Basic Plan:
```
Product name: Basic Monthly Subscription
Description: Access to all Basic courses and features
Pricing model: Recurring
Price: $19.00 USD
Billing period: Monthly
```
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

#### Create Premium Plan:
```
Product name: Premium Monthly Subscription
Description: Full access to all courses and 1-on-1 coaching
Pricing model: Recurring
Price: $49.00 USD
Billing period: Monthly
```
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

### Step 3: Get API Keys (2 minutes)

1. Go to **Developers** → **API keys**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (click "Reveal" - starts with `sk_test_...`)
3. **Copy both keys**

### Step 4: Set Up Webhook (5 minutes)

1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - For local testing: `http://localhost:3000/api/webhooks/stripe`
   - For production: `https://kickoffclubhq.com/api/webhooks/stripe`

4. **Events to listen to**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_...`)

### Step 5: Update Environment Variables (2 minutes)

Edit `.env.local` with your actual Stripe keys:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxx...
STRIPE_SECRET_KEY=sk_test_51xxxxxx...
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx...
STRIPE_BASIC_PRICE_ID=price_xxxxxx...
STRIPE_PREMIUM_PRICE_ID=price_xxxxxx...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your domain in production
```

### Step 6: Restart Dev Server

```bash
# Kill current server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing the Integration (15 minutes)

### Test Checkout Flow:

1. **Visit Pricing Page**
   ```
   http://localhost:3000/pricing
   ```

2. **Click "Subscribe Now" on Basic or Premium**
   - You'll be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

3. **Complete Payment**
   - After payment, you'll be redirected back
   - Check `/dashboard/subscription` - should show active subscription
   - Check Supabase database - `profiles` table should show:
     - `subscription_tier`: basic or premium
     - `subscription_status`: active
     - `stripe_customer_id`: cus_xxxxx
     - `stripe_subscription_id`: sub_xxxxx

### Test Subscription Management:

1. **Go to Dashboard** → **Subscription**
   ```
   http://localhost:3000/dashboard/subscription
   ```

2. **Click "Manage Subscription"**
   - Opens Stripe Customer Portal
   - Can update payment method
   - Can cancel subscription
   - Can view invoices

3. **Test Cancellation**:
   - Click "Cancel plan"
   - Confirm cancellation
   - Check database - `subscription_end_date` should be set
   - User still has access until end date

### Test Webhooks Locally:

For local development, use Stripe CLI:

```bash
# Install Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe
# Linux: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook signing secret for local testing
# Replace STRIPE_WEBHOOK_SECRET with this value
```

Now test:
1. Make a test payment
2. Check console logs
3. Should see "✅ Subscription activated for user: xxx"
4. Check database updates

---

## 📊 Stripe Test Cards

Use these for testing different scenarios:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Declined card |
| `4000 0000 0000 0341` | Attaches and charges successfully (UK) |

---

## 🔄 Subscription Lifecycle

### What Happens When:

**1. User Subscribes:**
- Webhook: `checkout.session.completed`
- Database updates:
  - `subscription_tier` → basic/premium
  - `subscription_status` → active
  - `stripe_customer_id` saved
  - `stripe_subscription_id` saved

**2. Monthly Renewal:**
- Webhook: `invoice.payment_succeeded`
- Subscription continues automatically
- Customer charged automatically

**3. Payment Fails:**
- Webhook: `invoice.payment_failed`
- `subscription_status` → past_due
- Stripe attempts retry (3 times by default)
- Send payment failed email (optional)

**4. User Cancels:**
- User clicks "Cancel" in portal
- Webhook: `customer.subscription.updated`
- `subscription_end_date` set to end of billing period
- User keeps access until end date

**5. Subscription Ends:**
- Webhook: `customer.subscription.deleted`
- `subscription_tier` → free
- `subscription_status` → canceled
- User loses premium access

---

## 🔐 Security Best Practices

### ✅ Already Implemented:
- ✅ Webhook signature verification
- ✅ Server-side API calls only (never expose secret key)
- ✅ Metadata attached to subscriptions (userId, plan)
- ✅ Proper error handling

### 🔒 Additional Recommendations:
- Never log full card numbers
- Use HTTPS in production (Vercel provides this)
- Set up Stripe Radar for fraud detection
- Enable email receipts in Stripe dashboard

---

## 🚀 Going to Production

### 1. Switch to Live Mode:

In Stripe Dashboard:
1. Toggle **Test mode** OFF (top right)
2. Create products again in Live mode
3. Get new Live API keys
4. Create new webhook endpoint for production URL

### 2. Update Environment Variables:

```bash
# In Vercel or your hosting platform
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # NOT pk_test_
STRIPE_SECRET_KEY=sk_live_...  # NOT sk_test_
STRIPE_WEBHOOK_SECRET=whsec_...  # From live webhook
STRIPE_BASIC_PRICE_ID=price_...  # From live product
STRIPE_PREMIUM_PRICE_ID=price_...  # From live product
NEXT_PUBLIC_APP_URL=https://kickoffclubhq.com
```

### 3. Complete Stripe Activation:

Before accepting real payments, Stripe requires:
- ✅ Business verification
- ✅ Bank account linked (for payouts)
- ✅ Business tax information
- ✅ Terms of service agreed

Go to **Settings** → **Account** to complete.

---

## 💰 Revenue & Payouts

### Stripe Fees:
- **2.9% + $0.30** per successful charge
- Example: $19 charge = $18.45 after fees
- Example: $49 charge = $47.08 after fees

### Payouts:
- Automatic to your bank account
- Default: Every 2 days
- Can change to daily, weekly, or monthly
- First payout takes 7-14 days

---

## 📈 Monitoring

### Check These Regularly:

1. **Dashboard** → **Payments**
   - View all transactions
   - Filter by status (succeeded, failed, etc.)

2. **Dashboard** → **Subscriptions**
   - See all active subscriptions
   - Monitor churn rate
   - View upcoming renewals

3. **Dashboard** → **Customers**
   - See all customers
   - View individual payment history
   - Send receipts manually if needed

4. **Developers** → **Webhooks**
   - Monitor webhook deliveries
   - Check for failed webhooks
   - Retry failed events

---

## 🐛 Troubleshooting

### Checkout not working?
- Check Stripe keys are correct in `.env.local`
- Restart dev server after changing env vars
- Check browser console for errors
- Verify Price IDs are correct

### Webhooks not firing?
- Check webhook endpoint URL is correct
- Verify signing secret matches
- Check webhook events are selected
- Use Stripe CLI for local testing

### Subscription not updating in database?
- Check webhook handler logs in terminal
- Verify database connection
- Check RLS policies allow updates
- Test webhook manually in Stripe dashboard

### Portal not opening?
- User must have `stripe_customer_id` in database
- Check they've completed at least one checkout
- Verify customer exists in Stripe

---

## 📚 Additional Resources

- **Stripe Docs**: https://stripe.com/docs
- **Testing Guide**: https://stripe.com/docs/testing
- **Webhook Events**: https://stripe.com/docs/api/events/types
- **Customer Portal**: https://stripe.com/docs/billing/subscriptions/customer-portal

---

## ✅ Setup Checklist

Before launching:

- [ ] Stripe account created and verified
- [ ] Products created (Basic $19, Premium $49)
- [ ] API keys obtained and added to `.env.local`
- [ ] Webhook endpoint configured
- [ ] Test payment completed successfully
- [ ] Database updates verified
- [ ] Customer portal tested
- [ ] Cancellation flow tested
- [ ] Ready to switch to Live mode

**Once tested, you're ready to accept real payments!** 💰🚀
