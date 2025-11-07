'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'

interface ThemedHeaderProps {
  activePage?: 'home' | 'courses' | 'podcast'
}

export function ThemedHeader({ activePage }: ThemedHeaderProps = {}) {
  const { colors } = useTheme()

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b",
      colors.headerBg,
      colors.headerBorder
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className={cn("text-2xl font-bold", colors.headerLogo)}>
          Kickoff Club HQ
        </Link>
        <div className="flex items-center gap-6">
          <nav className={cn("flex items-center gap-6", colors.headerText)}>
            <Link
              href="/"
              className={cn(
                "hover:text-white transition-colors",
                activePage === 'home' && "text-white font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={cn(
                "hover:text-white transition-colors",
                activePage === 'courses' && "text-white font-medium"
              )}
            >
              Courses
            </Link>
            <Link
              href="/podcast"
              className={cn(
                "hover:text-white transition-colors",
                activePage === 'podcast' && "text-white font-medium"
              )}
            >
              Podcast
            </Link>
            <Link href="/auth/sign-in" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
