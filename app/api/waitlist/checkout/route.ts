import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

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
        },
      })
      customerId = customer.id
    }

    // Create checkout session for $4.99 one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Kickoff Club HQ - Waitlist Reservation',
              description: 'Reserve your spot on the waitlist. This fee will be credited toward your first month.',
              images: ['https://kickoffclubhq.com/og-image.png'],
            },
            unit_amount: 499, // $4.99
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/waitlist/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/waitlist`,
      metadata: {
        email,
        name,
        waitlist: 'true',
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
