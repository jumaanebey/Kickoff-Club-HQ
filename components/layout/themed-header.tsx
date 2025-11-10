'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'

interface ThemedHeaderProps {
  activePage?: 'home' | 'courses' | 'podcast' | 'pricing' | 'contact'
}

export function ThemedHeader({ activePage }: ThemedHeaderProps = {}) {
  const { colors } = useTheme()

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-md",
      colors.headerBg,
      colors.headerBorder
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl group-hover:bg-orange-600 transition-colors">
            K
          </div>
          <div className="flex flex-col">
            <span className={cn("text-lg font-bold leading-tight", colors.headerLogo)}>KICKOFF CLUB</span>
            <span className={cn("text-sm font-semibold tracking-wide", colors.headerLogo)}>HQ</span>
          </div>
        </Link>
        <div className="flex items-center gap-10">
          <nav className={cn("flex items-center gap-6", colors.headerText)}>
            <Link
              href="/"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'home' && "text-orange-500 font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/waitlist"
              className={cn(
                "hover:text-orange-500 transition-colors flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30",
                activePage === 'courses' && "text-orange-500 font-medium"
              )}
            >
              <span className="text-lg">⚡</span>
              Join Waitlist
            </Link>
            <Link
              href="/podcast"
              className={cn(
                "hover:text-orange-500 transition-colors flex items-center gap-2",
                activePage === 'podcast' && "text-orange-500 font-medium"
              )}
            >
              <span className="text-lg">🎙️</span>
              Podcast
            </Link>
            <Link
              href="/contact"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'contact' && "text-orange-500 font-medium"
              )}
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
