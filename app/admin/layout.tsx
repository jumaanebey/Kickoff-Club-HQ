import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { createServerClient } from "@/database/supabase/server"

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const supabase = await createServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="text-2xl font-bold text-primary-500">
            Kickoff Club HQ
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">ADMIN</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm hover:text-primary-500">
              User Dashboard
            </Link>
            <Link href="/courses" className="text-sm hover:text-primary-500">
              View Site
            </Link>
            <div className="border-l pl-4">
              <div className="text-sm font-medium">{profile?.name || profile?.email}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📊</span>
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/courses"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📚</span>
                <span>Courses</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>👥</span>
                <span>Users</span>
              </Link>
              <Link
                href="/admin/enrollments"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📝</span>
                <span>Enrollments</span>
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>⭐</span>
                <span>Reviews</span>
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>📈</span>
                <span>Analytics</span>
              </Link>
              <Link
                href="/admin/settings"
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
