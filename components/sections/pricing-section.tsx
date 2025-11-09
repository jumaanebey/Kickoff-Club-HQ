'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

interface PricingPlan {
  name: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: string[]
  popular?: boolean
  cta: string
  ctaLink: string
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for trying out our platform",
    features: [
      "3 free sample lessons",
      "Basic playbook access",
      "Community forum access",
      "Progress tracking"
    ],
    cta: "Start Free",
    ctaLink: "/auth/sign-up"
  },
  {
    name: "Basic",
    monthlyPrice: 19,
    annualPrice: 190,
    description: "Everything you need to elevate your game",
    features: [
      "Access to all 50+ courses",
      "HD video streaming",
      "Downloadable playbooks",
      "Progress tracking & certificates",
      "Priority email support",
      "New courses added monthly"
    ],
    popular: true,
    cta: "Start Training",
    ctaLink: "/auth/sign-up?plan=basic"
  },
  {
    name: "Premium",
    monthlyPrice: 39,
    annualPrice: 390,
    description: "For serious athletes who want it all",
    features: [
      "Everything in Basic, plus:",
      "Live coaching sessions (2/month)",
      "Personalized training plans",
      "1-on-1 film review sessions",
      "Private Discord community",
      "Early access to new content",
      "Custom workout programs"
    ],
    cta: "Go Premium",
    ctaLink: "/auth/sign-up?plan=premium"
  }
]

export function PricingSection() {
  const { colors } = useTheme()
  const [isAnnual, setIsAnnual] = useState(false)

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12
    const savings = monthlyCost - annual
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { savings, percentage }
  }

  return (
    <section className={cn("py-24", colors.bg)}>
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
            Simple, Transparent Pricing
          </h2>
          <p className={cn("text-xl mb-8", colors.textMuted)}>
            Choose the perfect plan for your football journey. No hidden fees, cancel anytime.
          </p>

          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="annual-toggle" className={cn("text-base", colors.text)}>
              Monthly
            </Label>
            <Switch
              id="annual-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="annual-toggle" className={cn("text-base", colors.text)}>
              Annual
            </Label>
            {isAnnual && (
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            const displayPrice = isAnnual && price > 0 ? (price / 12).toFixed(2) : price
            const { savings, percentage } = calculateSavings(plan.monthlyPrice, plan.annualPrice)

            return (
              <Card
                key={plan.name}
                className={cn(
                  "relative flex flex-col border-2 transition-all duration-300",
                  plan.popular
                    ? "border-orange-500 shadow-xl scale-105"
                    : colors.cardBorder,
                  colors.bgSecondary
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-6 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className={cn("text-2xl mb-2", colors.text)}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className={colors.textMuted}>
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={cn("text-5xl font-bold", colors.text)}>
                        ${displayPrice}
                      </span>
                      {price > 0 && (
                        <span className={cn("text-lg", colors.textMuted)}>
                          /month
                        </span>
                      )}
                    </div>
                    {isAnnual && price > 0 && (
                      <p className={cn("text-sm mt-2", colors.textMuted)}>
                        ${plan.annualPrice} billed annually
                      </p>
                    )}
                    {isAnnual && price > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                        Save ${savings}/year ({percentage}% off)
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className={cn("text-sm", colors.text)}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className={cn("pt-6 border-t", colors.cardBorder)}>
                  <Button
                    asChild
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.ctaLink}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className={cn("max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center py-12 border-t", colors.cardBorder)}>
          <div>
            <div className="text-4xl mb-2">🔒</div>
            <h3 className={cn("font-semibold mb-1", colors.text)}>Secure Payment</h3>
            <p className={cn("text-sm", colors.textMuted)}>256-bit SSL encryption</p>
          </div>
          <div>
            <div className="text-4xl mb-2">💯</div>
            <h3 className={cn("font-semibold mb-1", colors.text)}>Money-Back Guarantee</h3>
            <p className={cn("text-sm", colors.textMuted)}>30-day full refund</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🎯</div>
            <h3 className={cn("font-semibold mb-1", colors.text)}>Cancel Anytime</h3>
            <p className={cn("text-sm", colors.textMuted)}>No long-term commitment</p>
          </div>
        </div>

        {/* Team Pricing CTA */}
        <div className={cn("mt-16 text-center p-8 rounded-lg border", colors.bgSecondary, colors.cardBorder)}>
          <h3 className={cn("text-2xl font-bold mb-2", colors.text)}>Team or School?</h3>
          <p className={cn("text-lg mb-6", colors.textMuted)}>
            Get special pricing for teams of 10+ athletes
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact?subject=team-pricing">
              Contact Us for Team Pricing
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
