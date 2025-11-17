'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { ReactNode } from 'react'

interface LegalPageWrapperProps {
  title: string
  lastUpdated: string
  children: ReactNode
  footerLinks?: Array<{ href: string; label: string }>
}

export function LegalPageWrapper({ title, lastUpdated, children, footerLinks }: LegalPageWrapperProps) {
  const { colors } = useTheme()

  return (
    <div className={cn("min-h-screen", colors.bg)}>
      {/* Header */}
      <header className={cn("sticky top-0 z-50 w-full border-b backdrop-blur", colors.headerBg, colors.headerBorder)}>
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className={cn("text-2xl font-bold", colors.headerLogo)}>
            Kickoff Club HQ
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl py-12">
        <h1 className={cn("text-4xl font-bold mb-6", colors.text)}>{title}</h1>
        <p className={cn("mb-8", colors.textMuted)}>
          <strong>Last Updated:</strong> {lastUpdated}
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          {children}
        </div>

        {/* Footer Links */}
        {footerLinks && footerLinks.length > 0 && (
          <div className={cn("mt-12 pt-8 border-t flex gap-6", colors.cardBorder)}>
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn(colors.link, colors.linkHover, "hover:underline")}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface LegalSectionProps {
  title: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  const { colors } = useTheme()

  return (
    <section>
      <h2 className={cn("text-2xl font-bold mb-4", colors.text)}>{title}</h2>
      {children}
    </section>
  )
}

interface LegalSubSectionProps {
  title: string
  children: ReactNode
}

export function LegalSubSection({ title, children }: LegalSubSectionProps) {
  const { colors } = useTheme()

  return (
    <div>
      <h3 className={cn("text-xl font-semibold mb-3", colors.textSecondary)}>{title}</h3>
      {children}
    </div>
  )
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  const { colors } = useTheme()
  return <p className={cn("leading-relaxed", colors.textSecondary)}>{children}</p>
}

export function LegalList({ children }: { children: ReactNode }) {
  const { colors } = useTheme()
  return <ul className={cn("list-disc pl-6 mt-2 space-y-2", colors.textSecondary)}>{children}</ul>
}

export function LegalOrderedList({ children }: { children: ReactNode }) {
  const { colors } = useTheme()
  return <ol className={cn("list-decimal pl-6 mt-2 space-y-2", colors.textSecondary)}>{children}</ol>
}

export function LegalInfoBox({ children }: { children: ReactNode }) {
  const { colors } = useTheme()
  return (
    <div className={cn("mt-4 p-4 rounded-lg", colors.bgTertiary)}>
      {children}
    </div>
  )
}
