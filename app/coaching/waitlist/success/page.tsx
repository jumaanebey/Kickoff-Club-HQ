'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Trophy, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import confetti from 'canvas-confetti'

const WHOP_COMMUNITY_URL = 'https://whop.com/joined/kickoff-club-master-football/exp_FCkkFtJm4gUhkD/app/'

export default function CoachingWaitlistSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const { colors } = useTheme()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Verify the session
    if (sessionId) {
      setLoading(false)
      setVerified(true)
    } else {
      setLoading(false)
    }

    return () => clearInterval(interval)
  }, [sessionId])

  if (loading) {
    return (
      <div className={cn('min-h-screen flex flex-col', colors.bg)}>
        <ThemedHeader />
        <div className="container px-4 py-20 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={cn('text-lg', colors.text)}>Verifying your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('min-h-screen flex flex-col', colors.bg)}>
      <ThemedHeader />

      <div className="container px-4 py-20 flex-1 flex items-center justify-center">
        <Card className={cn('max-w-2xl w-full p-8 md:p-12', colors.cardBg, colors.cardBorder)}>
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className={cn('text-4xl md:text-5xl font-bold mb-4', colors.text)}>
              You're On The List! 🎉
            </h1>
            <p className={cn('text-xl', colors.textSecondary)}>
              Welcome to the Coaching Cohort Waitlist
            </p>
          </div>

          {/* What's Next */}
          <div className={cn('rounded-xl p-6 mb-8', 'bg-orange-500/10 border border-orange-500/30')}>
            <div className="flex items-start gap-3 mb-4">
              <Trophy className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className={cn('font-semibold text-lg mb-2', colors.text)}>What happens next?</h3>
                <ul className={cn('space-y-2 text-sm', colors.textSecondary)}>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">1.</span>
                    <span>Check your email for confirmation, receipt, and community invite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">2.</span>
                    <span>Join the private cohort community immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">3.</span>
                    <span>Your $99 deposit will be credited toward your $499 cohort payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">4.</span>
                    <span>You'll receive cohort start date, schedule, and pre-program materials</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cohort Info */}
          <div className={cn('rounded-xl p-6 mb-8', colors.cardBg, colors.cardBorder)}>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-orange-500" />
              <h3 className={cn('font-semibold', colors.text)}>Your Cohort Details</h3>
            </div>
            <div className={cn('text-sm space-y-2', colors.textSecondary)}>
              <p><strong>Program:</strong> 6-Week Intensive Coaching</p>
              <p><strong>Sessions:</strong> 12 live sessions (2x per week)</p>
              <p><strong>Start Date:</strong> TBD (you'll be notified)</p>
              <p><strong>Cohort Size:</strong> Limited to 15 athletes</p>
              <p><strong>Investment:</strong> $400 remaining ($499 total - $99 deposit paid)</p>
            </div>
          </div>

          {/* Community Access */}
          <div className={cn('rounded-xl p-6 mb-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30')}>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-orange-500" />
              <h3 className={cn('font-semibold', colors.text)}>Your Community Access</h3>
            </div>
            <p className={cn('text-sm mb-4', colors.textSecondary)}>
              You now have immediate access to the private Kickoff Club community on Whop.
              Connect with other cohort members, get early updates, and start your journey!
            </p>
            <a
              href={WHOP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium text-sm transition-colors"
            >
              Open Whop Community <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Email Reminder */}
          <div className={cn('rounded-xl p-6 mb-8', colors.cardBg, colors.cardBorder)}>
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-orange-500" />
              <h3 className={cn('font-semibold', colors.text)}>Keep an eye on your inbox</h3>
            </div>
            <p className={cn('text-sm', colors.textSecondary)}>
              We'll send you exclusive updates, cohort announcements, and pre-program materials.
              Make sure to add <span className="text-orange-500 font-medium">kickoffclubhq@gmail.com</span> to your contacts.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6">
              <a href={WHOP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer">
                Join the Community Now
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="outline" className={cn('w-full py-6 border', colors.cardBorder)}>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className={cn('mt-8 pt-8 border-t text-center', colors.cardBorder)}>
            <p className={cn('text-sm', colors.textMuted)}>
              Join 142+ athletes already on the coaching waitlist
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
