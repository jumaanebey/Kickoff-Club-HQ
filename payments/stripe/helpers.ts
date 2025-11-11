import { stripe, STRIPE_PLANS, StripePlan } from './client'
import { createServerClient } from '../../database/supabase/server'

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession({
  userId,
  email,
  plan,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  plan: StripePlan
  successUrl: string
  cancelUrl: string
}) {
  try {
    const planConfig = STRIPE_PLANS[plan]

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    })

    let customerId: string

    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          supabaseUserId: userId,
        },
      })
      customerId = customer.id

      // Save Stripe customer ID to database
      const supabase = await createServerClient()
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Prepare line items
    const lineItems: any[] = [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ]

    // Add setup fee for basic plan (makes first payment $24.99 instead of $4.99)
    if (plan === 'basic' && 'setupFee' in planConfig) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'First Month Access',
            description: 'One-time fee for first month',
          },
          unit_amount: planConfig.setupFee,
        },
        quantity: 1,
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Create checkout session error:', error)
    throw error
  }
}

/**
 * Create a portal session for subscription management
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Create portal session error:', error)
    throw error
  }
}

/**
 * Get subscription details from Stripe
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Get subscription error:', error)
    return null
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return subscription
  } catch (error) {
    console.error('Cancel subscription error:', error)
    throw error
  }
}

/**
 * Resume a subscription (un-cancel)
 */
export async function resumeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
    return subscription
  } catch (error) {
    console.error('Resume subscription error:', error)
    throw error
  }
}

/**
 * Get customer's active subscriptions
 */
export async function getCustomerSubscriptions(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 10,
    })
    return subscriptions.data
  } catch (error) {
    console.error('Get customer subscriptions error:', error)
    return []
  }
}

/**
 * Get customer's invoices
 */
export async function getCustomerInvoices(customerId: string, limit: number = 10) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    })
    return invoices.data
  } catch (error) {
    console.error('Get customer invoices error:', error)
    return []
  }
}
