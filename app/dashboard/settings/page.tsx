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
        <h1 className="text-3xl font-bold mb-2 text-white">Settings</h1>
        <p className="text-white/70">Manage your account settings and preferences</p>
      </div>

      {/* Subscription Info Card */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Subscription</CardTitle>
          <CardDescription className="text-white/60">Your current subscription plan and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-white/10 border-white/20 text-white">
                  {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
                </Badge>
                <Badge
                  className={profile.subscription_status === 'active' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}
                >
                  {profile.subscription_status}
                </Badge>
              </div>
              <p className="text-sm text-white/70">
                {profile.subscription_tier === 'free'
                  ? 'You are on the free plan. Upgrade to access premium courses.'
                  : `You have access to all ${profile.subscription_tier} tier courses.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-white/60">Update your personal information and avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Account Security</CardTitle>
          <CardDescription className="text-white/60">Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
          <CardDescription className="text-white/60">View your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Email Address</p>
            <p className="text-sm text-white/70">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Account Created</p>
            <p className="text-sm text-white/70">
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">User ID</p>
            <p className="text-sm text-white/70 font-mono text-xs">{profile.id}</p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
