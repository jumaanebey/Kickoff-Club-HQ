'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { colors } = useTheme()

  return (
    <div className={cn("min-h-screen", colors.background)}>
      {/* Header */}
      <ThemedHeader />

      <div className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg font-medium", colors.sidebarActive)}
              >
                <span>📊</span>
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/my-courses"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>📚</span>
                <span>My Courses</span>
              </Link>
              <Link
                href="/dashboard/progress"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>📈</span>
                <span>Progress</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>📊</span>
                <span>Analytics</span>
              </Link>
              <Link
                href="/dashboard/certificates"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>🎓</span>
                <span>Certificates</span>
              </Link>
              <Link
                href="/dashboard/saved"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>💾</span>
                <span>Saved</span>
              </Link>
              <Link
                href="/dashboard/subscription"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>💳</span>
                <span>Subscription</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", colors.sidebarItem)}
              >
                <span>⚙️</span>
                <span>Settings</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
