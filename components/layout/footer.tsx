'use client'

import Link from 'next/link'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function Footer() {
  const { colors } = useTheme()

  return (
    <footer className={cn("border-t", colors.bg, colors.text, colors.cardBorder)}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className={cn("text-xl font-black mb-4 font-heading uppercase tracking-wide", colors.text)}>Kickoff Club HQ</h3>
            <p className={cn("text-sm leading-relaxed", colors.textMuted)}>
              The ultimate platform for football training and education.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className={cn("font-bold mb-4 font-heading uppercase tracking-wider", colors.text)}>Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/podcast" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Podcast
                </Link>
              </li>
              <li>
                <Link href="/games/guess-the-penalty" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Games
                </Link>
              </li>
              <li>
                <Link href="/blog" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-in" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className={cn("font-bold mb-4 font-heading uppercase tracking-wider", colors.text)}>Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={cn("font-bold mb-4 font-heading uppercase tracking-wider", colors.text)}>Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={cn("transition-colors", colors.textMuted, colors.linkHover)}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - FIXED: No more duplicate URLs! */}
        <div className={cn("border-t mt-8 pt-8 text-center", colors.cardBorder)}>
          <p className={cn("text-sm", colors.textMuted)}>
            © 2025 Kickoff Club HQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
