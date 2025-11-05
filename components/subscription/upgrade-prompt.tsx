'use client'

import { SubscriptionTier } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface UpgradePromptProps {
  requiredTier: SubscriptionTier
  currentTier: SubscriptionTier
  courseName?: string
}

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    'Access to free courses',
    'Basic progress tracking',
    'Community access'
  ],
  basic: [
    'Everything in Free',
    'Access to Basic tier courses',
    'Priority support',
    'Downloadable resources'
  ],
  premium: [
    'Everything in Basic',
    'Access to all Premium courses',
    'Live coaching sessions',
    '1-on-1 consultations',
    'Exclusive content',
    'Certificate of completion'
  ]
}

const TIER_PRICES: Record<Exclude<SubscriptionTier, 'free'>, string> = {
  basic: '$19.99/month',
  premium: '$49.99/month'
}

export function UpgradePrompt({ requiredTier, currentTier, courseName }: UpgradePromptProps) {
  const tierName = requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)

  return (
    <Card className="border-2 border-primary-200">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <CardTitle className="text-2xl">
          Upgrade to {tierName}
        </CardTitle>
        <CardDescription>
          {courseName
            ? `"${courseName}" requires a ${tierName} subscription`
            : `This content requires a ${tierName} subscription`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current subscription badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600">Current plan:</span>
          <Badge variant="outline">
            {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
          </Badge>
        </div>

        {/* Features */}
        {requiredTier !== 'free' && (
          <div>
            <h3 className="font-semibold mb-3 text-center">{tierName} includes:</h3>
            <ul className="space-y-2">
              {TIER_FEATURES[requiredTier].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing */}
        {requiredTier !== 'free' && (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">
              {TIER_PRICES[requiredTier]}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Cancel anytime
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-2">
          <Button className="w-full" size="lg">
            Upgrade to {tierName}
          </Button>
          <Button variant="outline" className="w-full">
            Compare all plans
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>✓ 30-day money-back guarantee</p>
          <p>✓ Secure payment processing</p>
          <p>✓ Cancel anytime, no questions asked</p>
        </div>
      </CardContent>
    </Card>
  )
}
