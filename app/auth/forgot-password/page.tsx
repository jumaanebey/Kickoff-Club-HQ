'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@/database/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClientComponentClient()
  const { colors } = useTheme()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      setEmail('')
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("min-h-screen", colors.background)}>
      <ThemedHeader />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className={cn("w-full max-w-md backdrop-blur-xl", colors.cardBg, colors.cardBorder)}>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl font-bold text-center", colors.text)}>
            Reset your password
          </CardTitle>
          <CardDescription className={cn("text-center", colors.mutedText)}>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-green-500/10 border border-green-500/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-400">
                      Check your email
                    </h3>
                    <div className="mt-2 text-sm text-green-400/80">
                      <p>
                        We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className={cn("text-sm", colors.mutedText)}>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="link"
                  onClick={() => setSuccess(false)}
                  className="text-orange-400 hover:text-orange-500"
                >
                  Try another email
                </Button>
              </div>

              <div className="pt-4 border-t border-white/20">
                <Link href="/auth/sign-in">
                  <Button variant="outline" className={cn("w-full", colors.buttonSecondaryBg, colors.buttonSecondaryBorder, colors.text, colors.buttonSecondaryHover)}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className={colors.text}>Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                  className={cn(colors.inputBg, colors.inputBorder, colors.text, "placeholder:opacity-50")}
                />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>

              <div className="text-center">
                <Link href="/auth/sign-in" className={cn("text-sm", colors.mutedText, "hover:opacity-100")}>
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
