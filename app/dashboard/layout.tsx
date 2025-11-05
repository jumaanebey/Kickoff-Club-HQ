import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary-500">
            Kickoff Club HQ
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-sm hover:text-primary-500">
              Browse Courses
            </Link>
            <Button variant="ghost" size="sm">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium"
              >
                <span>📊</span>
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/my-courses"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📚</span>
                <span>My Courses</span>
              </Link>
              <Link
                href="/dashboard/progress"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📈</span>
                <span>Progress</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📊</span>
                <span>Analytics</span>
              </Link>
              <Link
                href="/dashboard/certificates"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>🎓</span>
                <span>Certificates</span>
              </Link>
              <Link
                href="/dashboard/saved"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>💾</span>
                <span>Saved</span>
              </Link>
              <Link
                href="/dashboard/subscription"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>💳</span>
                <span>Subscription</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
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
