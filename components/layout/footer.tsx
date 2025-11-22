'use client'

import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function Footer() {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  return (
    <footer className={cn("border-t", colors.bg, colors.text, colors.cardBorder)}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <h3 className={cn("text-2xl font-black mb-4 font-heading uppercase tracking-wide", colors.text)}>Kickoff Club HQ</h3>
            <p className={cn("text-sm leading-relaxed mb-6 max-w-sm", colors.textMuted)}>
              The ultimate platform for football training and education. Master the game, one play at a time.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-sm">
              <h4 className="font-bold text-sm mb-2 uppercase tracking-wider">Join the Huddle</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className={cn("bg-background/50", colors.inputBorder)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" size="icon" className="bg-orange-500 hover:bg-orange-600 text-white shrink-0">
                  {subscribed ? <ArrowRight className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </Button>
              </div>
              {subscribed && <p className="text-green-500 text-xs mt-2 font-bold">Welcome to the team! 🏈</p>}
            </form>

            <div className="flex gap-4 mt-8">
              <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Platform */}
            <div>
              <h4 className={cn("font-bold mb-4 font-heading uppercase tracking-wider", colors.text)}>Platform</h4>
              <ul className="space-y-3 text-sm">
                {['Courses', 'Podcast', 'Games', 'Blog', 'Sign In', 'Sign Up'].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === 'Sign In' ? '/auth/sign-in' : item === 'Sign Up' ? '/auth/sign-up' : `/${item.toLowerCase()}`}
                      className={cn("transition-colors hover:translate-x-1 inline-block", colors.textMuted, colors.linkHover)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={cn("font-bold mb-4 font-heading uppercase tracking-wider", colors.text)}>Support</h4>
              <ul className="space-y-3 text-sm">
                {['Contact Us', 'Pricing', 'FAQ', 'Help Center'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className={cn("transition-colors hover:translate-x-1 inline-block", colors.textMuted, colors.linkHover)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={cn("font-bold mb-4 font-heading uppercase tracking-wider", colors.text)}>Legal</h4>
              <ul className="space-y-3 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className={cn("transition-colors hover:translate-x-1 inline-block", colors.textMuted, colors.linkHover)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={cn("border-t mt-12 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4", colors.cardBorder)}>
          <p className={cn("text-sm", colors.textMuted)}>
            © 2025 Kickoff Club HQ. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>for football fans everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
