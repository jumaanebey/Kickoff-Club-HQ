'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/database/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Trophy, Users, Target, ArrowRight, Lock, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { colors } = useTheme()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/dashboard/my-courses')
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'github') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  return (
    <div className={cn("min-h-screen flex flex-col", colors.bg)}>
      <ThemedHeader />

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
          {/* Background Gradient Blob */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center lg:text-left">
              <h2 className={cn("text-4xl font-black tracking-tight mb-2", colors.text)}>
                Welcome Back
              </h2>
              <p className={cn("text-lg", colors.textMuted)}>
                Continue your journey to football mastery
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <div className="p-2 rounded-full bg-red-500/20 text-red-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-red-500 font-medium">{error}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className={cn("text-sm font-medium mb-1.5 block", colors.text)}>
                    Email address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className={cn("pl-10 h-12 transition-all focus:ring-2 focus:ring-orange-500/20", colors.input, colors.inputBorder, colors.inputText, colors.inputPlaceholder)}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="password" className={cn("text-sm font-medium", colors.text)}>
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className={cn("pl-10 h-12 transition-all focus:ring-2 focus:ring-orange-500/20", colors.input, colors.inputBorder, colors.inputText, colors.inputPlaceholder)}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg py-6 font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={cn("w-full border-t", colors.cardBorder)}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={cn("px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wider", colors.bg, colors.textMuted)}>Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 hover:bg-muted/50 transition-colors font-medium"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </div>

            <p className={cn("text-center text-sm", colors.textMuted)}>
              Don't have an account?{' '}
              <Link href="/auth/sign-up" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Hero Visual */}
        <div className={cn("hidden lg:flex relative p-12 items-center justify-center overflow-hidden", colors.bgSecondary)}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 max-w-lg"
          >
            <div className="space-y-12">
              <div>
                <h3 className={cn("text-5xl md:text-6xl font-black mb-6 leading-tight", colors.text)}>
                  Train Like <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">A Pro</span>
                </h3>
                <p className={cn("text-xl leading-relaxed", colors.textMuted)}>
                  Join thousands of athletes improving their game with expert-led courses and personalized training plans.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Users, value: "12.5K+", label: "Active Students" },
                  { icon: Trophy, value: "4.9★", label: "Average Rating" },
                  { icon: Target, value: "98%", label: "Completion Rate" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                      <stat.icon className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className={cn("text-2xl font-black mb-1", colors.text)}>{stat.value}</div>
                    <div className={cn("text-xs font-medium uppercase tracking-wider opacity-70", colors.textMuted)}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={cn("p-8 rounded-2xl backdrop-blur-md border", colors.card, colors.cardBorder)}
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className="text-orange-500">★</span>
                  ))}
                </div>
                <p className={cn("text-lg italic mb-6 leading-relaxed", colors.textSecondary)}>
                  "Kickoff Club transformed my game. The courses are structured perfectly and the coaches are world-class."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    MJ
                  </div>
                  <div>
                    <div className={cn("font-bold", colors.text)}>Marcus Johnson</div>
                    <div className={cn("text-sm", colors.textMuted)}>College Athlete</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
