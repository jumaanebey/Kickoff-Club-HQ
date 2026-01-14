'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemedHeader } from '@/components/layout/themed-header'
import { LayoutDashboard, BookOpen, TrendingUp, BarChart3, Award, Bookmark, CreditCard, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/my-courses', label: 'My Courses', icon: BookOpen },
  { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/certificates', label: 'Certificates', icon: Award },
  { href: '/dashboard/saved', label: 'Saved', icon: Bookmark },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-cream">
      <ThemedHeader />

      <div className="container mx-auto px-8 pt-[140px] pb-20">
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-[160px] lg:self-start">
            <div className="relative bg-white border-2 border-navy p-4">
              {/* Offset Shadow */}
              <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-navy -z-10" />

              <div className="mb-4 pb-4 border-b-2 border-retro-border">
                <h2 className="font-heading text-lg uppercase text-navy">Dashboard</h2>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 font-medium uppercase text-sm transition-colors ${
                        isActive
                          ? 'bg-navy text-white'
                          : 'text-navy hover:bg-cream'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
