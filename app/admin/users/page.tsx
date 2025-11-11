import { createServerClient } from '@/database/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manage Users - Admin',
  description: 'View and manage user accounts'
}

export default async function AdminUsersPage() {
  const supabase = await createServerClient()

  // Get all users with enrollment stats
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      *,
      enrollments (id, completed_at)
    `)
    .order('created_at', { ascending: false })

  const usersWithStats = profiles?.map(profile => {
    const enrollments = profile.enrollments || []
    return {
      ...profile,
      totalEnrollments: enrollments.length,
      completedCourses: enrollments.filter((e: any) => e.completed_at).length
    }
  })

  // Calculate stats
  const totalUsers = usersWithStats?.length || 0
  const activeSubscribers = usersWithStats?.filter(u => u.subscription_status === 'active').length || 0
  const freeUsers = usersWithStats?.filter(u => u.subscription_tier === 'free').length || 0
  const basicUsers = usersWithStats?.filter(u => u.subscription_tier === 'basic').length || 0
  const premiumUsers = usersWithStats?.filter(u => u.subscription_tier === 'premium').length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      {/* User Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Subs</CardDescription>
            <CardTitle className="text-3xl">{activeSubscribers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Free</CardDescription>
            <CardTitle className="text-3xl">{freeUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Basic</CardDescription>
            <CardTitle className="text-3xl">{basicUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Premium</CardDescription>
            <CardTitle className="text-3xl">{premiumUsers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Registered users and their subscription status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Subscription</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Enrollments</th>
                  <th className="text-left py-3 px-4">Completed</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersWithStats && usersWithStats.length > 0 ? (
                  usersWithStats.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{user.name || 'No name'}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            user.subscription_tier === 'premium'
                              ? 'default'
                              : user.subscription_tier === 'basic'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="capitalize"
                        >
                          {user.subscription_tier}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.subscription_status === 'active' ? 'default' : 'outline'}
                          className="capitalize"
                        >
                          {user.subscription_status || 'inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.totalEnrollments}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.completedCourses}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
