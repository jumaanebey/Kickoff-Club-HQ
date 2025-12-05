import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payments/stripe/client'

export async function POST(request: NextRequest) {
  try {
    const { email, name, cohort } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    const isCoaching = cohort === 'coaching'

    // Create or get customer
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
        name,
        metadata: {
          waitlist: 'true',
          cohort: isCoaching ? 'coaching' : 'general',
        },
      })
      customerId = customer.id
    }

    // Create checkout session for deposit payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isCoaching ? 'Coaching Cohort - Deposit' : 'Kickoff Club HQ - Waitlist Reservation',
              description: isCoaching
                ? 'Reserve your spot in the 6-week Coaching Cohort. This $99 deposit will be credited toward your $499 cohort payment. Includes immediate access to private cohort community.'
                : 'Reserve your spot on the waitlist. This fee will be credited toward your first month.',
              images: ['https://kickoffclubhq.com/og-image.png'],
            },
            unit_amount: isCoaching ? 9900 : 499, // $99 for coaching, $4.99 for general
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/${isCoaching ? 'coaching/waitlist' : 'waitlist'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/${isCoaching ? 'coaching/waitlist/checkout' : 'waitlist'}`,
      metadata: {
        email,
        name,
        waitlist: 'true',
        cohort: isCoaching ? 'coaching' : 'general',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Waitlist checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
