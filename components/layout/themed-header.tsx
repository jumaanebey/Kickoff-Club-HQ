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
          <span className={cn("text-xl font-bold", colors.headerLogo)}>KICKOFF CLUB</span>
        </Link>
        <div className="flex items-center gap-8">
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
              href="/courses"
              className={cn(
                "hover:text-orange-500 transition-colors flex items-center gap-2",
                activePage === 'courses' && "text-orange-500 font-medium"
              )}
            >
              <span className="text-lg">🏈</span>
              Courses
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
              href="/#pricing"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'pricing' && "text-orange-500 font-medium"
              )}
            >
              Pricing
            </Link>
            <Link href="/auth/sign-in" className="hover:text-orange-500 transition-colors">
              Sign In
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
