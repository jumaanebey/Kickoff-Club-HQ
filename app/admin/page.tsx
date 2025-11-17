import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { createServerClient } from '@/database/supabase/server'
import { AdminDashboardClient } from './admin-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage courses, users, and platform settings'
}

export default async function AdminPage() {
  const user = await getUser()
  if (!user) redirect('/auth/sign-in')

  const supabase = await createServerClient()

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get platform statistics
  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalEnrollments },
    { count: activeUsers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')
  ])

  // Get recent enrollments
  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      profiles (name, email),
      courses (title, slug)
    `)
    .order('enrolled_at', { ascending: false })
    .limit(10)

  // Get course statistics
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      enrolled_count,
      is_published,
      created_at
    `)
    .order('enrolled_count', { ascending: false })
    .limit(5)

  // Get subscription breakdown
  const { data: subscriptions } = await supabase
    .from('profiles')
    .select('subscription_tier')

  const tierCounts = subscriptions?.reduce((acc, p) => {
    acc[p.subscription_tier] = (acc[p.subscription_tier] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <AdminDashboardClient
      totalUsers={totalUsers || 0}
      totalCourses={totalCourses || 0}
      totalEnrollments={totalEnrollments || 0}
      activeUsers={activeUsers || 0}
      tierCounts={tierCounts}
      courses={courses || []}
      recentEnrollments={recentEnrollments || []}
    />
  )
}
