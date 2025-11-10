'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function WaitlistSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
        <ThemedHeader />
        <div className="container px-4 py-20 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Verifying your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
      <ThemedHeader />

      <div className="container px-4 py-20 flex-1 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-xl border-slate-700 p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to the Team! 🎉
            </h1>
            <p className="text-xl text-slate-300">
              You're officially on the waitlist for Kickoff Club HQ
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">What happens next?</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">1.</span>
                    <span>Check your email for a confirmation (it should arrive within a few minutes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">2.</span>
                    <span>We'll keep you updated on our launch progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">3.</span>
                    <span>You'll get priority access when we launch, and your $4.99 will be credited to your first month</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Email Reminder */}
          <div className="bg-slate-900/50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <h3 className="text-white font-semibold">Keep an eye on your inbox</h3>
            </div>
            <p className="text-slate-400 text-sm">
              We'll send you exclusive updates, behind-the-scenes content, and early access notifications.
              Make sure to add <span className="text-orange-500 font-medium">kickoffclubhq@gmail.com</span> to your contacts.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 py-6">
              <Link href="/podcast">Explore Our Podcast</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              Join hundreds of athletes already on the waitlist
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
