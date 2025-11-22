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
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, ChevronDown, CreditCard, Shield, RefreshCw, Lock, HelpCircle } from 'lucide-react'

const faqs = [
  {
    icon: RefreshCw,
    q: "Can I change plans later?",
    a: "Yes! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately, and we'll prorate any differences."
  },
  {
    icon: Shield,
    q: "Can I cancel anytime?",
    a: "Absolutely. You can cancel your subscription at any time with no penalties. You'll continue to have access until the end of your billing period."
  },
  {
    icon: CreditCard,
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe."
  },
  {
    icon: HelpCircle,
    q: "Do you offer refunds?",
    a: "All sales are final. Due to the digital nature of our content with immediate access, we do not offer refunds. However, you can cancel anytime and keep access until the end of your billing period."
  },
  {
    icon: Lock,
    q: "Is my payment information secure?",
    a: "Yes. We use Stripe for payment processing, which is PCI compliant and trusted by millions of businesses worldwide. We never store your payment information."
  }
]

function FAQAccordion() {
  const { colors } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const Icon = faq.icon
        const isOpen = openIndex === i

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className={cn(
                "rounded-2xl backdrop-blur-xl border transition-all cursor-pointer overflow-hidden group",
                colors.bgSecondary,
                isOpen ? "border-orange-500/50 shadow-lg shadow-orange-500/10" : colors.cardBorder + " hover:border-orange-500/30"
              )}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {/* Question Header */}
              <div className="p-6 flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                  isOpen ? "bg-orange-500 text-white" : "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={cn("font-bold text-lg flex-1", colors.text)}>
                  {faq.q}
                </h3>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform flex-shrink-0",
                    isOpen ? "rotate-180 text-orange-500" : colors.textMuted
                  )}
                />
              </div>

              {/* Answer - Animated */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className={cn("px-6 pb-6 pl-20 leading-relaxed", colors.textMuted)}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}


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
            {/* Rookie (Free) */}
            <motion.div variants={itemVariants}>
              <TicketPricingCard
                title="Rookie"
                price="$0"
                period="month"
                description="Get in the game. Perfect for casual fans."
                features={[
                  'Access to Blitz Rush Game',
                  'Introductory Course',
                  'Podcast Access',
                  'Community Forum'
                ]}
                ctaText={user ? "Current Plan" : "Join for Free"}
                ctaLink={user ? "/dashboard" : "/auth/sign-up"}
                variant="outline"
              />
            </motion.div>

            {/* Pro (Starter) */}
            <motion.div variants={itemVariants} className="relative z-10 md:-mt-8">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
                <Sparkles className="w-4 h-4" /> Most Popular
              </div>
              <TicketPricingCard
                title="Pro"
                price="$9"
                period="month"
                description="Level up your skills. For serious players."
                features={[
                  'All Arcade Games',
                  'Core Course Library',
                  'Save Progress & Stats',
                  'Ad-Free Experience',
                  'Priority Support'
                ]}
                ctaText="Go Pro"
                ctaLink="/checkout/pro"
                popular={true}
                variant="premium"
              />
            </motion.div>

            {/* All-Pro (Elite) */}
            <motion.div variants={itemVariants}>
              <TicketPricingCard
                title="All-Pro"
                price="$29"
                period="month"
                description="Elite training. For future champions."
                features={[
                  'Everything in Pro, plus:',
                  'Advanced Clinics',
                  '1-on-1 Coach Q&A',
                  'Downloadable Playbooks',
                  'Film Review Sessions',
                  'Exclusive Merch Drops'
                ]}
                ctaText="Get All-Pro"
                ctaLink="/checkout/all-pro"
                variant="default"
              />
            </motion.div>
          </motion.div>

          {/* FAQ Section - Interactive Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-32 max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-4 py-1.5 text-sm uppercase tracking-wider">
                FAQ
              </Badge>
              <h2 className={cn("text-3xl md:text-5xl font-black mb-4 tracking-tight", colors.text)}>
                Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Questions?</span>
              </h2>
              <p className={cn("text-lg", colors.textMuted)}>
                We've got answers. Click to expand.
              </p>
            </div>

            <FAQAccordion />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
