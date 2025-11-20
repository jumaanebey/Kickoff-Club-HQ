'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckoutButton } from '@/components/stripe/checkout-button'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { useEffect, useState } from 'react'
import { TicketPricingCard } from '@/components/pricing/ticket-pricing-card'

export default function PricingPage() {
  const { colors } = useTheme()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadUser() {
      const { getUser } = await import('@/app/actions/auth')
      const userData = await getUser()
      setUser(userData)
    }
    loadUser()
  }, [])

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      {/* Header */}
      <ThemedHeader />

      {/* Pricing Section */}
      <section className={cn('py-24 lg:py-32', colors.bg)}>
        <div className="container px-4">
          <div className="text-center mb-20">
            <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight", colors.text)}>
              Choose Your Plan
            </h1>
            <p className={cn("text-lg md:text-xl leading-relaxed", colors.textMuted)}>
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Pack */}
            <TicketPricingCard
              title="Starter Pack"
              price="Free"
              period="forever"
              description="Casual fan? This is all you need to know."
              features={[
                '3 essential podcast episodes',
                'Public community forum',
                'Progress tracking',
                'Mobile & desktop access'
              ]}
              ctaText={user ? "Browse Free Courses" : "Get Started Free"}
              ctaLink={user ? "/courses" : "/auth/sign-up"}
              variant="outline"
            />

            {/* All-Access */}
            <TicketPricingCard
              title="All-Access"
              price="$24.99"
              period="season"
              description="One-time payment • 2 months access"
              features={[
                'All video courses',
                'Private community access',
                'Progress tracking',
                '$24.99 first month',
                'Then $4.99/month after',
                'Cancel anytime'
              ]}
              ctaText="Get All Access"
              ctaLink="/checkout/basic"
              popular={true}
              variant="premium"
            />

            {/* Coaching Cohort */}
            <TicketPricingCard
              title="Coaching Cohort"
              price="$299"
              period="program"
              description="One-time payment • 6 weeks"
              features={[
                'Everything in All-Access, plus:',
                '6-week coaching program',
                'Limited to 15 athletes',
                'Live group sessions (2x/week)',
                'Film review + Q&A',
                'Personalized training plan',
                'Private cohort community'
              ]}
              ctaText="Join Waitlist"
              ctaLink="/coaching/waitlist"
              variant="default"
            />
          </div>

          {/* FAQ Section */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", colors.text)}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className={cn("p-6 rounded-2xl backdrop-blur-xl border", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("font-semibold text-lg mb-2", colors.text)}>Can I change plans later?</h3>
                <p className={cn("leading-relaxed", colors.textMuted)}>
                  Yes! You can upgrade or downgrade your plan at any time from your dashboard.
                  Changes take effect immediately, and we'll prorate any differences.
                </p>
              </div>

              <div className={cn("p-6 rounded-2xl backdrop-blur-xl border", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("font-semibold text-lg mb-2", colors.text)}>Can I cancel anytime?</h3>
                <p className={cn("leading-relaxed", colors.textMuted)}>
                  Absolutely. You can cancel your subscription at any time with no penalties.
                  You'll continue to have access until the end of your billing period.
                </p>
              </div>

              <div className={cn("p-6 rounded-2xl backdrop-blur-xl border", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("font-semibold text-lg mb-2", colors.text)}>What payment methods do you accept?</h3>
                <p className={cn("leading-relaxed", colors.textMuted)}>
                  We accept all major credit cards (Visa, Mastercard, American Express) through
                  our secure payment processor, Stripe.
                </p>
              </div>

              <div className={cn("p-6 rounded-2xl backdrop-blur-xl border", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("font-semibold text-lg mb-2", colors.text)}>Do you offer refunds?</h3>
                <p className={cn("leading-relaxed", colors.textMuted)}>
                  All sales are final. Due to the digital nature of our content with immediate access,
                  we do not offer refunds. However, you can cancel anytime and keep access until the end of your billing period.
                </p>
              </div>

              <div className={cn("p-6 rounded-2xl backdrop-blur-xl border", colors.bgSecondary, colors.cardBorder)}>
                <h3 className={cn("font-semibold text-lg mb-2", colors.text)}>Is my payment information secure?</h3>
                <p className={cn("leading-relaxed", colors.textMuted)}>
                  Yes. We use Stripe for payment processing, which is PCI compliant and trusted
                  by millions of businesses worldwide. We never store your payment information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
