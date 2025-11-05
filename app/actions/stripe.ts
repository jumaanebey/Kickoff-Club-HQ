'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/db/supabase-server'
import { createCheckoutSession, createPortalSession } from '@/lib/stripe-helpers'
import { StripePlan } from '@/lib/stripe'

/**
 * Create a checkout session and redirect to Stripe
 */
export async function createSubscriptionCheckout(plan: StripePlan) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in to subscribe'
      }
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return {
        success: false,
        error: 'Profile not found'
      }
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { sessionId, url } = await createCheckoutSession({
      userId: user.id,
      email: profile.email,
      plan,
      successUrl: `${baseUrl}/dashboard/subscription?success=true`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    })

    if (!url) {
      return {
        success: false,
        error: 'Failed to create checkout session'
      }
    }

    // Return the URL for client-side redirect
    return {
      success: true,
      url
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }
  }
}

/**
 * Create a portal session for managing subscription
 */
export async function manageSubscription() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in'
      }
    }

    // Get Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return {
        success: false,
        error: 'No subscription found'
      }
    }

    // Create portal session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { url } = await createPortalSession({
      customerId: profile.stripe_customer_id,
      returnUrl: `${baseUrl}/dashboard/subscription`,
    })

    if (!url) {
      return {
        success: false,
        error: 'Failed to create portal session'
      }
    }

    // Return the URL for client-side redirect
    return {
      success: true,
      url
    }
  } catch (error) {
    console.error('Portal error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, subscription_end_date, stripe_customer_id, stripe_subscription_id')
      .eq('id', user.id)
      .single()

    return profile
  } catch (error) {
    console.error('Get subscription status error:', error)
    return null
  }
}
