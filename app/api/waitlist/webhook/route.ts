import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/db/supabase-server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
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
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Only process waitlist payments
        if (session.metadata?.waitlist !== 'true') {
          return NextResponse.json({ received: true })
        }

        const email = session.metadata?.email || session.customer_email
        const name = session.metadata?.name || ''
        const customerId = session.customer as string
        const paymentIntentId = session.payment_intent as string

        if (!email) {
          console.error('No email found in session metadata')
          return NextResponse.json({ received: true })
        }

        // Store in database
        const supabase = await createServerClient()

        const { error } = await supabase
          .from('waitlist_signups')
          .insert({
            email,
            name,
            stripe_customer_id: customerId,
            stripe_payment_intent_id: paymentIntentId,
            amount_paid: 499,
            status: 'confirmed',
            metadata: {
              session_id: session.id,
              payment_status: session.payment_status,
            },
          })

        if (error) {
          console.error('Error storing waitlist signup:', error)
          // Don't return error to Stripe, we've received the webhook
        }

        console.log(`Waitlist signup confirmed: ${email}`)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        // Update waitlist status to refunded
        const supabase = await createServerClient()

        const { error } = await supabase
          .from('waitlist_signups')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent_id', charge.payment_intent as string)

        if (error) {
          console.error('Error updating refunded status:', error)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
