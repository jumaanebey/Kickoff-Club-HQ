'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createSubscriptionCheckout } from '@/app/actions/stripe'
import { StripePlan } from '@/payments/stripe/client'
import type { User } from '@supabase/supabase-js'

interface CheckoutButtonProps {
  plan: StripePlan
  user: User | null
}

export function CheckoutButton({ plan, user }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/sign-in?redirect=/pricing')
      return
    }

    setLoading(true)

    try {
      const result = await createSubscriptionCheckout(plan)

      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url
      } else {
        alert(result.error || 'Failed to start checkout. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Processing...' : user ? 'Subscribe Now' : 'Sign In to Subscribe'}
    </Button>
  )
}
