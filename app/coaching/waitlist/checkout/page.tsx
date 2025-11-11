'use client'

import { useState } from 'react'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Lock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export default function CoachingCheckoutPage() {
  const router = useRouter()
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !name) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      // Create Stripe checkout session for coaching waitlist
      const response = await fetch('/api/waitlist/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          cohort: 'coaching' // Mark this as coaching cohort
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className={cn('min-h-screen flex flex-col', colors.bg)}>
      <ThemedHeader />

      <div className="container px-4 py-16 flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          {/* Back Button */}
          <Link
            href="/coaching/waitlist"
            className={cn('inline-flex items-center gap-2 mb-6 hover:text-orange-500 transition-colors', colors.textMuted)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Coaching Info
          </Link>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Left: Payment Form */}
            <Card className={cn('md:col-span-3 p-8', colors.cardBg, colors.cardBorder)}>
              <h1 className={cn('text-3xl font-bold mb-2', colors.text)}>
                Reserve Your Spot
              </h1>
              <p className={cn('text-sm mb-8', colors.textMuted)}>
                Complete your $4.99 waitlist reservation
              </p>

              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label htmlFor="name" className={cn('block text-sm font-medium mb-2', colors.text)}>
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={cn('bg-background border', colors.cardBorder)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className={cn('block text-sm font-medium mb-2', colors.text)}>
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={cn('bg-background border', colors.cardBorder)}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Pay $4.99 - Secure Checkout
                    </div>
                  )}
                </Button>

                <div className={cn('text-center text-xs', colors.textMuted)}>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Secure
                    </div>
                    <span>•</span>
                    <span>Stripe Protected</span>
                    <span>•</span>
                    <span>100% Refundable</span>
                  </div>
                </div>
              </form>
            </Card>

            {/* Right: Order Summary */}
            <Card className={cn('md:col-span-2 p-6 h-fit', colors.cardBg, colors.cardBorder)}>
              <h3 className={cn('font-bold text-lg mb-4', colors.text)}>Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className={cn('text-sm font-medium mb-1', colors.text)}>
                    Coaching Cohort Waitlist
                  </div>
                  <div className={cn('text-xs', colors.textMuted)}>
                    Reservation fee
                  </div>
                </div>

                <div className="border-t pt-4" style={{ borderColor: colors.cardBorder }}>
                  <div className="flex justify-between items-center">
                    <span className={cn('text-sm', colors.textMuted)}>Subtotal</span>
                    <span className={colors.text}>$4.99</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={cn('font-bold', colors.text)}>Total</span>
                    <span className={cn('font-bold text-xl', colors.text)}>$4.99</span>
                  </div>
                </div>
              </div>

              <div className={cn('bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-sm', colors.textMuted)}>
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>This fee will be fully credited toward your $299 cohort payment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>You'll be notified when the next cohort opens</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
