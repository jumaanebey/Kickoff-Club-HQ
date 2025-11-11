'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/database/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { colors } = useTheme()

  useEffect(() => {
    // Check if user has a valid session (from email link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true)
      } else {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    })
  }, [supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        router.push('/auth/sign-in')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!validSession && !error) {
    return (
      <div className={cn("min-h-screen", colors.background)}>
        <ThemedHeader />
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className={cn("w-full max-w-md backdrop-blur-xl", colors.cardBg, colors.cardBorder)}>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className={cn("mt-4", colors.mutedText)}>Verifying reset link...</p>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen", colors.background)}>
      <ThemedHeader />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className={cn("w-full max-w-md backdrop-blur-xl", colors.cardBg, colors.cardBorder)}>
        <CardHeader className="space-y-1">
          <CardTitle className={cn("text-2xl font-bold text-center", colors.text)}>
            Set new password
          </CardTitle>
          <CardDescription className={cn("text-center", colors.mutedText)}>
            Enter your new password below
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
                      Password reset successful!
                    </h3>
                    <div className="mt-2 text-sm text-green-400/80">
                      <p>
                        Your password has been updated. Redirecting you to sign in...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/auth/sign-in">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : !validSession ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>

              <Link href="/auth/forgot-password">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Request new reset link
                </Button>
              </Link>

              <div className="text-center">
                <Link href="/auth/sign-in" className={cn("text-sm", colors.mutedText, "hover:opacity-100")}>
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className={colors.text}>New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                  minLength={6}
                  className={cn(colors.inputBg, colors.inputBorder, colors.text, "placeholder:opacity-50")}
                />
                <p className={cn("text-xs", colors.mutedText)}>
                  Must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={colors.text}>Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className={cn(colors.inputBg, colors.inputBorder, colors.text, "placeholder:opacity-50")}
                />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                {loading ? 'Resetting password...' : 'Reset password'}
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
