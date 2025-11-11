'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Users, Video, Calendar, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

export default function CoachingWaitlistPage() {
  const { colors } = useTheme()

  return (
    <div className={cn('min-h-screen flex flex-col', colors.bg)}>
      <ThemedHeader />

      <div className="container px-4 py-16 flex-1">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className={cn('text-5xl md:text-6xl font-bold mb-6', colors.text)}>
              Coaching Cohort Waitlist
            </h1>
            <p className={cn('text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed', colors.textSecondary)}>
              Join an exclusive 6-week coaching program with live sessions, personalized feedback,
              and a community of dedicated athletes.
            </p>
          </div>

          {/* Program Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className={cn('p-8', colors.cardBg, colors.cardBorder)}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className={cn('text-xl font-bold mb-2', colors.text)}>Live Group Sessions</h3>
                  <p className={cn('text-sm', colors.textMuted)}>
                    2x per week interactive coaching sessions with real-time feedback and Q&A
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className={cn('text-xl font-bold mb-2', colors.text)}>Limited to 15 Athletes</h3>
                  <p className={cn('text-sm', colors.textMuted)}>
                    Small cohort size ensures personalized attention and meaningful connections
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className={cn('text-xl font-bold mb-2', colors.text)}>6-Week Program</h3>
                  <p className={cn('text-sm', colors.textMuted)}>
                    Structured curriculum covering fundamentals to advanced techniques
                  </p>
                </div>
              </div>
            </Card>

            <Card className={cn('p-8', colors.cardBg, colors.cardBorder)}>
              <h3 className={cn('text-2xl font-bold mb-6', colors.text)}>What's Included</h3>
              <div className="space-y-4">
                {[
                  'Everything in All-Access plan',
                  '12 live coaching sessions (2x/week)',
                  'Film review & analysis',
                  'Personalized training plan',
                  'Private cohort community',
                  'Direct coach access',
                  'Certificate of completion',
                  'Lifetime access to recordings'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={colors.textSecondary}>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Investment & CTA */}
          <Card className={cn('p-10 text-center', colors.cardBg, colors.cardBorder)}>
            <div className="max-w-2xl mx-auto">
              <h2 className={cn('text-3xl font-bold mb-4', colors.text)}>
                Reserve Your Spot
              </h2>
              <p className={cn('text-lg mb-8', colors.textSecondary)}>
                Pay $4.99 now to secure your spot on the waitlist. This fee will be fully credited
                toward your $299 cohort payment when you join.
              </p>

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className={cn('text-center p-6 rounded-xl', 'bg-orange-500/10 border border-orange-500/30')}>
                  <div className="text-4xl font-bold text-orange-500 mb-2">$4.99</div>
                  <div className={cn('text-sm', colors.textMuted)}>Waitlist reservation</div>
                </div>
                <ArrowRight className="w-6 h-6 text-orange-500" />
                <div className={cn('text-center p-6 rounded-xl', 'bg-orange-500/10 border border-orange-500/30')}>
                  <div className="text-4xl font-bold text-orange-500 mb-2">$294.01</div>
                  <div className={cn('text-sm', colors.textMuted)}>Due at cohort start</div>
                </div>
              </div>

              <Button asChild size="lg" className="text-lg px-12 h-16 bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/coaching/waitlist/checkout">
                  Reserve My Spot
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <p className={cn('text-sm mt-6', colors.textMuted)}>
                100% refundable if you change your mind • Next cohort starts in 4 weeks
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
