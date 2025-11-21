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
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <div className={cn('min-h-screen bg-background transition-colors duration-300', colors.bg)}>
      {/* Header */}
      <ThemedHeader />

      {/* Pricing Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-orange-500/10 to-transparent rounded-full blur-3xl -z-10" />

        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-4 py-1.5 text-sm uppercase tracking-wider">
              Pricing
            </Badge>
            <h1 className={cn("text-5xl md:text-7xl font-black mb-6 tracking-tight", colors.text)}>
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Path</span>
            </h1>
            <p className={cn("text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto", colors.textMuted)}>
              Whether you're just starting out or aiming for the pros, we have a plan for you.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {/* Starter Pack */}
            <motion.div variants={itemVariants}>
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
            </motion.div>

            {/* All-Access */}
            <motion.div variants={itemVariants} className="relative z-10 md:-mt-8">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="w-4 h-4" /> Most Popular
              </div>
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
            </motion.div>

            {/* Coaching Cohort */}
            <motion.div variants={itemVariants}>
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
            </motion.div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-32 max-w-3xl mx-auto"
          >
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", colors.text)}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans later?",
                  a: "Yes! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately, and we'll prorate any differences."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Absolutely. You can cancel your subscription at any time with no penalties. You'll continue to have access until the end of your billing period."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe."
                },
                {
                  q: "Do you offer refunds?",
                  a: "All sales are final. Due to the digital nature of our content with immediate access, we do not offer refunds. However, you can cancel anytime and keep access until the end of your billing period."
                },
                {
                  q: "Is my payment information secure?",
                  a: "Yes. We use Stripe for payment processing, which is PCI compliant and trusted by millions of businesses worldwide. We never store your payment information."
                }
              ].map((faq, i) => (
                <div key={i} className={cn("p-6 rounded-2xl backdrop-blur-xl border transition-all hover:border-orange-500/30", colors.bgSecondary, colors.cardBorder)}>
                  <h3 className={cn("font-bold text-lg mb-2 flex items-start gap-3", colors.text)}>
                    <div className="mt-1 w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 text-xs font-black">Q</span>
                    </div>
                    {faq.q}
                  </h3>
                  <p className={cn("leading-relaxed pl-8", colors.textMuted)}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
