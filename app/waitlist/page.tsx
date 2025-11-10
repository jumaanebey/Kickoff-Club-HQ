'use client'

import { useState } from 'react'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Lock, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WaitlistPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !name) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      // Create Stripe checkout session for waitlist
      const response = await fetch('/api/waitlist/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
      <ThemedHeader />

      <div className="container px-4 py-20 flex-1 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-xl border-slate-700 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join the Waitlist
            </h1>
            <p className="text-xl text-slate-300">
              Be the first to access elite football training content
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Priority Access</h3>
                <p className="text-slate-400 text-sm">
                  Get immediate access when we launch, before the general public
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Exclusive Content</h3>
                <p className="text-slate-400 text-sm">
                  Access to premium video courses from elite coaches
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Founding Member Benefits</h3>
                <p className="text-slate-400 text-sm">
                  Lock in special pricing and perks as a founding member
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-lg">Waitlist Reservation</span>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">$4.99</div>
                <div className="text-sm text-slate-400">one-time</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Reserve your spot now. This fee will be credited toward your first month when we launch.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoinWaitlist} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Secure Checkout - $4.99
                </div>
              )}
            </Button>
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Secure Payment
              </div>
              <div>•</div>
              <div>Powered by Stripe</div>
              <div>•</div>
              <div>100% Refundable</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
