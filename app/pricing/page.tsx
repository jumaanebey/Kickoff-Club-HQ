'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckoutButton } from '@/components/stripe/checkout-button'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Choose Your Plan
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
                <div>
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-white/50">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Access to free courses', 'Progress tracking', 'Community access', 'Course discussions'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              {user ? (
                <Button variant="outline" className="w-full h-12 text-base border-2 border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/courses">Browse Free Courses</Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-12 text-base border-2 border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/auth/sign-up">Get Started Free</Link>
                </Button>
              )}
            </div>

            {/* Basic Tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border-2 border-orange-500/50 relative hover:from-orange-500/30 hover:to-orange-600/30 transition-all">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 border-0">
                Most Popular
              </Badge>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Basic</h3>
                <div>
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="text-white/50">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Free', 'Access to Basic courses', 'Priority support', 'Downloadable resources', 'Course certificates'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="basic" user={user} />
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
                <div>
                  <span className="text-5xl font-black text-white">$49</span>
                  <span className="text-white/50">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Basic', 'All Premium courses', '1-on-1 coaching sessions', 'Exclusive content', 'Early access to new courses'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton plan="premium" user={user} />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="font-semibold text-lg text-white mb-2">Can I change plans later?</h3>
                <p className="text-white/60 leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time from your dashboard.
                  Changes take effect immediately, and we'll prorate any differences.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="font-semibold text-lg text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-white/60 leading-relaxed">
                  Absolutely. You can cancel your subscription at any time with no penalties.
                  You'll continue to have access until the end of your billing period.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="font-semibold text-lg text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-white/60 leading-relaxed">
                  We accept all major credit cards (Visa, Mastercard, American Express) through
                  our secure payment processor, Stripe.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="font-semibold text-lg text-white mb-2">Do you offer refunds?</h3>
                <p className="text-white/60 leading-relaxed">
                  Yes. If you're not satisfied within the first 30 days, contact us for a full
                  refund, no questions asked.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="font-semibold text-lg text-white mb-2">Is my payment information secure?</h3>
                <p className="text-white/60 leading-relaxed">
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
