import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payments/stripe/client'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WAITLIST_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Check if this is a waitlist payment
    if (session.metadata?.waitlist === 'true') {
      const { email, name, cohort } = session.metadata

      try {
        // Create Supabase client at runtime
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Insert or update waitlist signup
        const { error } = await supabase
          .from('waitlist_signups')
          .upsert({
            email,
            name,
            stripe_customer_id: session.customer as string,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_paid: session.amount_total || 499,
            status: 'confirmed',
            metadata: {
              cohort: cohort || 'general',
              session_id: session.id,
              payment_status: session.payment_status,
            },
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email'
          })

        if (error) {
          console.error('Supabase insert error:', error)
          return NextResponse.json(
            { error: 'Failed to record waitlist signup' },
            { status: 500 }
          )
        }

        console.log(`Waitlist signup confirmed for ${email} (${cohort} cohort)`)
      } catch (err) {
        console.error('Error recording waitlist signup:', err)
        return NextResponse.json(
          { error: 'Failed to process waitlist signup' },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}
