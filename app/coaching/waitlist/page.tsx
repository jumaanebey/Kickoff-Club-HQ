'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Users, Video, Calendar, Trophy, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { motion } from 'framer-motion'

export default function CoachingWaitlistPage() {
  const { colors } = useTheme()

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
    <div className={cn('min-h-screen flex flex-col bg-background transition-colors duration-300', colors.bg)}>
      <ThemedHeader />

      <div className="container px-4 py-16 lg:py-24 flex-1 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-orange-500/10 to-transparent rounded-full blur-3xl -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl mb-8 shadow-xl shadow-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
              <Trophy className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className={cn('text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight', colors.text)}>
              Coaching Cohort <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Waitlist</span>
            </h1>
            <p className={cn('text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed', colors.textSecondary)}>
              Join an exclusive 6-week coaching program with live sessions, personalized feedback,
              and a community of dedicated athletes.
            </p>
          </motion.div>

          {/* Program Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div variants={itemVariants}>
              <Card className={cn('p-8 h-full backdrop-blur-xl border', colors.card, colors.cardBorder)}>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                      <Video className="w-7 h-7 text-blue-500" />
                    </div>
                    <div>
                      <h3 className={cn('text-xl font-bold mb-2', colors.text)}>Live Group Sessions</h3>
                      <p className={cn('text-base leading-relaxed', colors.textMuted)}>
                        2x per week interactive coaching sessions with real-time feedback and Q&A.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                      <Users className="w-7 h-7 text-purple-500" />
                    </div>
                    <div>
                      <h3 className={cn('text-xl font-bold mb-2', colors.text)}>Limited to 15 Athletes</h3>
                      <p className={cn('text-base leading-relaxed', colors.textMuted)}>
                        Small cohort size ensures personalized attention and meaningful connections.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-green-500/20">
                      <Calendar className="w-7 h-7 text-green-500" />
                    </div>
                    <div>
                      <h3 className={cn('text-xl font-bold mb-2', colors.text)}>6-Week Program</h3>
                      <p className={cn('text-base leading-relaxed', colors.textMuted)}>
                        Structured curriculum covering fundamentals to advanced techniques.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className={cn('p-8 h-full backdrop-blur-xl border relative overflow-hidden', colors.card, colors.cardBorder)}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <h3 className={cn('text-2xl font-bold mb-8 flex items-center gap-3', colors.text)}>
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  What's Included
                </h3>
                <div className="space-y-5">
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
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <span className={cn("text-lg", colors.textSecondary)}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Investment & CTA */}
          <motion.div variants={itemVariants}>
            <Card className={cn('p-10 text-center backdrop-blur-xl border relative overflow-hidden', colors.card, colors.cardBorder)}>
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />

              <div className="max-w-3xl mx-auto relative z-10">
                <h2 className={cn('text-3xl md:text-4xl font-bold mb-6', colors.text)}>
                  Reserve Your Spot
                </h2>
                <p className={cn('text-xl mb-10 max-w-2xl mx-auto leading-relaxed', colors.textSecondary)}>
                  Pay <span className="text-orange-500 font-bold">$99</span> now to secure your spot on the waitlist. This deposit will be fully credited
                  toward your $499 cohort payment when you join.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
                  <div className={cn('text-center p-8 rounded-2xl w-full md:w-64 transition-transform hover:scale-105', 'bg-orange-500/10 border border-orange-500/20')}>
                    <div className="text-5xl font-black text-orange-500 mb-2">$99</div>
                    <div className={cn('text-sm font-medium uppercase tracking-wider', colors.textMuted)}>Deposit to reserve</div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-orange-500/50 hidden md:block" />
                  <div className={cn('text-center p-8 rounded-2xl w-full md:w-64 transition-transform hover:scale-105', 'bg-card border border-border')}>
                    <div className="text-5xl font-black text-muted-foreground mb-2">$400</div>
                    <div className={cn('text-sm font-medium uppercase tracking-wider', colors.textMuted)}>Due at cohort start</div>
                  </div>
                </div>

                <Button asChild size="lg" className="text-lg px-12 h-16 bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                  <Link href="/coaching/waitlist/checkout">
                    Reserve My Spot
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <p className={cn('text-sm mt-8 font-medium', colors.textMuted)}>
                  100% refundable if you change your mind • Next cohort starts in 4 weeks
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
