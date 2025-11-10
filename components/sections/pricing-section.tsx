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
    name: "Immediate Access",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with free content",
    features: [
      "3 free podcast episodes",
      "Public community forum",
      "Progress tracking",
      "Mobile & desktop access"
    ],
    cta: "Start Free",
    ctaLink: "/auth/sign-up"
  },
  {
    name: "All-Access",
    monthlyPrice: 24.99,
    annualPrice: 299.88,
    description: "Everything you need to learn football",
    features: [
      "All video courses",
      "Private community access",
      "Progress tracking",
      "$24.99 first month",
      "Then $4.99/month after",
      "Cancel anytime"
    ],
    popular: true,
    cta: "Get Full Access",
    ctaLink: "/auth/sign-up?plan=basic"
  },
  {
    name: "Coaching Cohort",
    monthlyPrice: 299,
    annualPrice: 299,
    description: "6-week intensive coaching program",
    features: [
      "Everything in All-Access, plus:",
      "6-week coaching program",
      "Limited to 15 athletes per cohort",
      "Live group sessions (2x/week)",
      "Film review + Q&A",
      "Personalized training plan",
      "Private cohort community"
    ],
    cta: "Join Waitlist",
    ctaLink: "/contact?subject=coaching-cohort"
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
    <section id="pricing" className={cn("py-24", colors.bg)}>
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>
            Simple, Transparent Pricing
          </h2>
          <p className={cn("text-xl mb-8", colors.textMuted)}>
            Choose the perfect plan for your football journey. Cancel anytime.
          </p>
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
                        {price === 0 ? "Included" : `$${displayPrice}`}
                      </span>
                      {price > 0 && plan.name === "Immediate Access" && (
                        <span className={cn("text-lg", colors.textMuted)}>
                          /month
                        </span>
                      )}
                    </div>
                    {plan.name === "All-Access" ? (
                      <p className={cn("text-sm mt-2", colors.textMuted)}>
                        One-time payment • 2 months access
                      </p>
                    ) : plan.name === "Coaching Cohort" ? (
                      <p className={cn("text-sm mt-2", colors.textMuted)}>
                        One-time payment • 6 weeks
                      </p>
                    ) : (
                      <>
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
                      </>
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

      </div>
    </section>
  )
}
