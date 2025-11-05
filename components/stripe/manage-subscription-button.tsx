'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { manageSubscription } from '@/app/actions/stripe'

interface ManageSubscriptionButtonProps {
  text?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export function ManageSubscriptionButton({
  text = 'Manage Subscription',
  variant = 'default'
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleManage = async () => {
    setLoading(true)

    try {
      const result = await manageSubscription()

      if (result.success && result.url) {
        // Redirect to Stripe portal
        window.location.href = result.url
      } else {
        alert(result.error || 'Failed to open billing portal. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleManage}
      disabled={loading}
      variant={variant}
    >
      {loading ? 'Loading...' : text}
    </Button>
  )
}
