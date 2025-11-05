import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/lib/db/supabase-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileForm } from "@/components/settings/profile-form"
import { PasswordForm } from "@/components/settings/password-form"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const supabase = await createServerClient()

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="p-8">
        <p>Error loading profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Subscription Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current subscription plan and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
                </Badge>
                <Badge
                  variant={profile.subscription_status === 'active' ? 'default' : 'destructive'}
                >
                  {profile.subscription_status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {profile.subscription_tier === 'free'
                  ? 'You are on the free plan. Upgrade to access premium courses.'
                  : `You have access to all ${profile.subscription_tier} tier courses.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Email Address</p>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Account Created</p>
            <p className="text-sm text-gray-600">
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">User ID</p>
            <p className="text-sm text-gray-600 font-mono text-xs">{profile.id}</p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
