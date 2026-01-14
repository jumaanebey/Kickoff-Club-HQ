'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/database/supabase/client'
import { ThemedHeader } from '@/components/layout/themed-header'
import { Lock, Mail, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        if (data.session) {
          router.push('/dashboard')
        } else {
          setSuccess(true)
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'apple' | 'github') => {
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
      setError(error.message || `Failed to sign up with ${provider}`)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ThemedHeader />
        <main className="pt-[140px] pb-20">
          <div className="container mx-auto px-8">
            <div className="max-w-md mx-auto">
              <div className="relative bg-white border border-gray-300 p-8 text-center rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 rounded-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-heading uppercase text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-500 mb-6">
                  We've sent you a confirmation link. Click it to activate your account.
                </p>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500 mb-6 rounded-xl">
                  <p className="text-sm text-emerald-500 font-medium">
                    Check your inbox (and spam folder) for the confirmation email.
                  </p>
                </div>

                <Link
                  href="/auth/sign-in"
                  className="text-orange-500 hover:underline font-bold"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader />

      <main className="pt-[140px] pb-20">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left Side - Form */}
            <div>
              <div className="mb-8">
                <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider mb-4 rounded-lg">
                  Join Free
                </span>
                <h1 className="text-4xl md:text-5xl font-heading uppercase mb-4 text-gray-900">
                  Create <span className="text-orange-500">Account</span>
                </h1>
                <p className="text-lg text-gray-600">
                  Start learning football today - no experience needed
                </p>
              </div>

              <div className="relative bg-white border border-gray-300 p-8 rounded-2xl shadow-sm">
                <form onSubmit={handleSignUp} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500 rounded-xl flex items-center gap-3">
                      <Lock className="w-5 h-5 text-orange-500 shrink-0" />
                      <p className="text-sm text-orange-500 font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 uppercase mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-orange-500 disabled:opacity-50 rounded-xl"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 uppercase mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-orange-500 disabled:opacity-50 rounded-xl"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-900 uppercase mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-orange-500 disabled:opacity-50 rounded-xl"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-orange-500 text-white font-bold uppercase hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm text-gray-500 uppercase">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignUp('google')}
                    disabled={loading}
                    className="w-full mt-6 py-3 bg-white border border-gray-300 text-gray-900 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 rounded-xl"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <p className="mt-8 text-center text-gray-500">
                  Already have an account?{' '}
                  <Link href="/auth/sign-in" className="text-orange-500 hover:underline font-bold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - What You Get */}
            <div className="hidden lg:block">
              <div className="relative bg-gray-900 p-8 rounded-2xl">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-heading uppercase text-white mb-4">
                      What You <span className="text-amber-400">Get</span>
                    </h3>
                    <p className="text-white/70">
                      Start free, upgrade when you're ready.
                    </p>
                  </div>

                  {/* Free Features */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 uppercase rounded">Free</span>
                      <span className="text-white/60 text-sm">Included in signup</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        'Introductory course',
                        'All podcast episodes',
                        'Arcade games (Blitz Rush)',
                        'Community forum access',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-white/80">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Features */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-amber-400 text-gray-900 text-xs font-bold px-2 py-1 uppercase rounded">Pro</span>
                      <span className="text-white/60 text-sm">$14.99/month</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        'Full course library',
                        'Leaderboard rankings',
                        'Advanced game stats',
                        'Ad-free experience',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-white/60">
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* No CC Required */}
                  <div className="p-4 bg-white/5 border border-white/10 text-center rounded-xl">
                    <p className="text-white/80 text-sm">
                      <span className="text-amber-400 font-bold">No credit card required</span> to get started
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
