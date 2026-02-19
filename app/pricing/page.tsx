'use client'

import Link from 'next/link'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Footer } from '@/components/layout/footer'
import { cn } from '@/shared/utils'
import { useEffect, useState } from 'react'

const faqs = [
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes! You can cancel your Pro subscription at any time. You'll keep access until the end of your billing period, and you can always re-subscribe later."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and PayPal. All payments are processed securely through Stripe."
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Our free Rookie plan gives you a great taste of what Kickoff Club offers. You can upgrade to Pro anytime and get immediate access to all premium content."
  },
  {
    q: "Do I need any football knowledge to start?",
    a: "Not at all! Kickoff Club is designed for complete beginners. Our Getting Started course assumes zero knowledge and builds from there."
  },
  {
    q: "When will the mobile app be available?",
    a: "We're working hard on our iOS and Android apps! Pro members will get early access when they launch. Sign up for updates on our homepage."
  }
]

const rookieFeatures = [
  'Getting Started course (12 lessons)',
  'Blitz Rush game - basic mode',
  'Weekly podcast episodes',
  'Basic community access',
  'Progress tracking'
]

const proFeatures = [
  'All video courses (50+ lessons)',
  'Premium Blitz Rush game modes',
  'Exclusive podcast content',
  'Pro community + Discord access',
  'Mobile app access (coming soon)',
  'Downloadable resources',
  'Badges and certificates'
]

const coachingFeatures = [
  'Personal Coach Assignment',
  'Weekly Video Calls',
  'Custom Learning Plan',
  'Film Review Sessions',
  'Direct Message Access',
  'Priority Q&A'
]

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { getUser } = await import('@/app/actions/auth')
      const userData = await getUser()
      setUser(userData)
    }
    loadUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader activePage="pricing" />

      {/* Pricing Hero */}
      <section className="pt-24 sm:pt-32 md:pt-[140px] pb-12 sm:pb-16 md:pb-20 bg-white border-b border-gray-200 text-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 uppercase tracking-wider rounded-full mb-4 sm:mb-5">
            Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase mb-3 sm:mb-4 text-gray-900">
            Simple, Friendly Pricing
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
            Start free and upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-[1200px] mx-auto">
            {/* Rookie Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-sm">
              <h3 className="font-heading text-xl sm:text-2xl uppercase text-gray-900 mb-2">Rookie</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">Perfect for getting started with football</p>

              <div className="mb-6 sm:mb-8">
                <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-gray-900">Free</span>
                <span className="text-gray-500 ml-2 text-sm sm:text-base">forever</span>
              </div>

              <ul className="space-y-4 mb-8">
                {rookieFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={user ? "/dashboard" : "/auth/sign-up"}
                className="block w-full py-4 text-center font-bold uppercase rounded-lg bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                {user ? "Current Plan" : "Get Started Free"}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-5 py-2 uppercase tracking-wide rounded-full z-10">
                Most Popular
              </div>

              <div className="bg-white rounded-2xl border-2 border-orange-500 p-6 sm:p-8 md:p-10 shadow-lg">
                <h3 className="font-heading text-xl sm:text-2xl uppercase text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">Full access to everything Kickoff Club offers</p>

                <div className="mb-6 sm:mb-8">
                  <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-gray-900">$9</span>
                  <span className="text-gray-500 ml-2 text-sm sm:text-base">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {proFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      <span className="text-emerald-500 font-bold text-lg">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/checkout/pro"
                  className="block w-full py-4 text-center font-bold uppercase rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>

            {/* Coaching Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-sm sm:col-span-2 lg:col-span-1">
              <h3 className="font-heading text-xl sm:text-2xl uppercase text-gray-900 mb-2">Coaching</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">1-on-1 coaching with football experts</p>

              <div className="mb-6 sm:mb-8">
                <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-gray-900">$699</span>
                <span className="text-gray-500 ml-2 text-sm sm:text-base">/program</span>
              </div>

              <ul className="space-y-4 mb-8">
                {coachingFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <span className="text-emerald-500 font-bold text-lg">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/waitlist"
                className="block w-full py-4 text-center font-bold uppercase rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Join Waitlist ($99)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[800px]">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 uppercase tracking-wider rounded-full mb-4 sm:mb-5">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading uppercase text-gray-900">
              Questions? We Got You.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl border border-gray-200 cursor-pointer overflow-hidden"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
                  <span className={cn(
                    "font-bold text-lg sm:text-xl text-orange-500 transition-transform flex-shrink-0",
                    expandedFaq === i && "rotate-45"
                  )}>
                    +
                  </span>
                </div>
                {expandedFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 leading-relaxed text-sm sm:text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
