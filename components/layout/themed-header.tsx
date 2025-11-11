'use client'

import Link from 'next/link'
import { cn } from '@/shared/utils'
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
        <Link href="/" className="flex items-center group">
          <span className={cn("text-2xl font-bold", colors.headerLogo)}>
            Kickoff Club HQ
          </span>
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
              href="/courses"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'courses' && "text-orange-500 font-medium"
              )}
            >
              Courses
            </Link>
            <Link
              href="/podcast"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'podcast' && "text-orange-500 font-medium"
              )}
            >
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
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
