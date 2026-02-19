'use client'

import Link from 'next/link'
import { WaitlistForm } from '@/components/forms/waitlist-form'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">

          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl border-2 border-orange-500">
                🏈
              </div>
              <div className="font-heading text-lg uppercase leading-tight text-white">
                Kickoff Club
                <span className="block font-body text-[0.65rem] font-semibold text-white/50 tracking-[0.15em]">Est. 2024</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-[280px] text-white/60">
              Making football accessible to everyone. No gatekeeping, no judgment - just learning.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Stay in the loop</p>
              <WaitlistForm
                source="footer"
                placeholder="Your email"
                buttonText="Join"
                variant="dark"
                successMessage="You're in!"
              />
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              <a
                href="https://twitter.com/kickoffclubhq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-orange-500 hover:text-white transition-colors text-sm"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="https://www.youtube.com/@KickoffClubHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-orange-500 hover:text-white transition-colors text-sm"
                aria-label="YouTube"
              >
                ▶
              </a>
              <a
                href="https://www.instagram.com/kickoffclubhq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-orange-500 hover:text-white transition-colors text-sm"
                aria-label="Instagram"
              >
                ig
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Learn */}
            <div>
              <h4 className="font-heading text-sm uppercase mb-4 text-orange-400">Learn</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Courses', href: '/courses' },
                  { label: 'Podcast', href: '/podcast' },
                  { label: 'Games', href: '/games' },
                  { label: 'Pricing', href: '/pricing' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/60 text-sm hover:text-orange-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-heading text-sm uppercase mb-4 text-orange-400">Account</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Sign In', href: '/auth/sign-in' },
                  { label: 'Sign Up', href: '/auth/sign-up' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Settings', href: '/dashboard/settings' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/60 text-sm hover:text-orange-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading text-sm uppercase mb-4 text-orange-400">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Contact', href: 'mailto:hello@kickoffclubhq.com' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/60 text-sm hover:text-orange-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <span>© {new Date().getFullYear()} Kickoff Club HQ. All rights reserved.</span>
          <span className="text-xs">Made with 🏈 for football fans everywhere</span>
        </div>
      </div>
    </footer>
  )
}
