'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2 } from 'lucide-react'
import { createSubscriptionCheckout } from '@/app/actions/stripe'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface PlanSwitcherProps {
  currentTier: 'free' | 'monthly' | 'annual'
}

const PLANS = {
  monthly: {
    name: 'Monthly Premium',
    price: '$19.99',
    priceId: 'price_monthly',
    interval: 'month',
    features: [
      'Access to all courses and lessons',
      'Enhanced video player with captions',
      'Interactive quizzes',
      'Progress tracking',
      'Mobile-optimized experience',
      'Priority support',
    ],
  },
  annual: {
    name: 'Annual Premium',
    price: '$191.90',
    pricePerMonth: '$15.99',
    priceId: 'price_annual',
    interval: 'year',
    savings: 'Save 20%',
    features: [
      'All Monthly features',
      'Save 20% compared to monthly',
      'Early access to new courses',
      'Exclusive annual member content',
      'Priority support',
    ],
  },
}

export function PlanSwitcher({ currentTier }: PlanSwitcherProps) {
  const { colors } = useTheme()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePlanChange = async (plan: 'monthly' | 'annual') => {
    setLoading(plan)
    setError(null)

    try {
      // Map UI plan names to Stripe plan IDs
      const stripePlan = plan === 'monthly' ? 'basic' : 'premium'
      const result = await createSubscriptionCheckout(stripePlan)

      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        setError(result.error || 'Failed to change plan')
        setLoading(null)
      }
    } catch (err) {
      console.error('Plan change error:', err)
      setError('An error occurred. Please try again.')
      setLoading(null)
    }
  }

  if (currentTier === 'free') {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Plan */}
        <Card className={cn("border-2 border-blue-200 relative", colors.card, colors.cardBorder)}>
          <CardHeader>
            <CardTitle className={colors.text}>{PLANS.monthly.name}</CardTitle>
            <CardDescription className={colors.textMuted}>Perfect for getting started</CardDescription>
            <div className="flex items-baseline gap-1 mt-4">
              <span className={cn("text-4xl font-bold", colors.text)}>{PLANS.monthly.price}</span>
              <span className={colors.textMuted}>/{PLANS.monthly.interval}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {PLANS.monthly.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={colors.textSecondary}>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handlePlanChange('monthly')}
              disabled={loading !== null}
              className="w-full"
              size="lg"
            >
              {loading === 'monthly' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Annual Plan */}
        <Card className={cn("border-2 border-green-400 relative", colors.card, colors.cardBorder)}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {PLANS.annual.savings}
          </div>
          <CardHeader>
            <CardTitle className={colors.text}>{PLANS.annual.name}</CardTitle>
            <CardDescription className={colors.textMuted}>Best value for committed learners</CardDescription>
            <div className="flex items-baseline gap-1 mt-4">
              <span className={cn("text-4xl font-bold", colors.text)}>{PLANS.annual.price}</span>
              <span className={colors.textMuted}>/{PLANS.annual.interval}</span>
            </div>
            <p className={cn("text-sm mt-1", colors.textMuted)}>Just {PLANS.annual.pricePerMonth}/month</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {PLANS.annual.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={colors.textSecondary}>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handlePlanChange('annual')}
              disabled={loading !== null}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {loading === 'annual' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // For existing subscribers - show upgrade/downgrade options
  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-semibold", colors.text)}>Change Plan</h3>
      <p className={colors.textMuted}>
        Changes to your subscription will be prorated. Use the Manage Subscription button to make changes through Stripe&apos;s customer portal.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {currentTier === 'monthly' && (
          <Card className={cn("border-2 border-green-400", colors.card, colors.cardBorder)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={cn("text-lg", colors.text)}>Upgrade to Annual</CardTitle>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                  Save 20%
                </span>
              </div>
              <CardDescription className={colors.textMuted}>Save {PLANS.annual.pricePerMonth}/month</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => handlePlanChange('annual')}
                disabled={loading !== null}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading === 'annual' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upgrade to Annual'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentTier === 'annual' && (
          <Card className={cn(colors.card, colors.cardBorder)}>
            <CardHeader>
              <CardTitle className={cn("text-lg", colors.text)}>Switch to Monthly</CardTitle>
              <CardDescription className={colors.textMuted}>More flexibility with month-to-month billing</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => handlePlanChange('monthly')}
                disabled={loading !== null}
                variant="outline"
                className="w-full"
              >
                {loading === 'monthly' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Switch to Monthly'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
