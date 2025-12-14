'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createSubscriptionCheckout } from '@/app/actions/stripe'
import { StripePlan, STRIPE_PLANS } from '@/payments/stripe/client'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const plan = params.plan as string
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initiateCheckout() {
      // Validate plan
      if (!plan || !(plan in STRIPE_PLANS)) {
        setError('Invalid plan selected')
        setLoading(false)
        return
      }

      try {
        const result = await createSubscriptionCheckout(plan as StripePlan)

        if (result.success && result.url) {
          // Redirect to Stripe checkout
          window.location.href = result.url
        } else if (result.error?.includes('signed in')) {
          // User needs to sign in
          router.push(`/auth/sign-in?redirect=/checkout/${plan}`)
        } else {
          setError(result.error || 'Failed to start checkout')
          setLoading(false)
        }
      } catch (err) {
        console.error('Checkout error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    initiateCheckout()
  }, [plan, router])

  const planDetails = STRIPE_PLANS[plan as StripePlan]

  return (
    <div className="min-h-screen bg-background">
      <ThemedHeader />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 p-8">
          {loading && !error ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-orange-500" />
              <h1 className="text-2xl font-bold">
                Preparing your {planDetails?.name || 'subscription'}...
              </h1>
              <p className="text-muted-foreground">
                You'll be redirected to our secure checkout in a moment.
              </p>
            </>
          ) : error ? (
            <>
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-2xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-red-500">Checkout Error</h1>
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={() => router.push('/pricing')}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Back to Pricing
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
