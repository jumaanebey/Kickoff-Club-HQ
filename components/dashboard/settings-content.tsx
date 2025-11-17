'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileForm } from "@/components/settings/profile-form"
import { PasswordForm } from "@/components/settings/password-form"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface SettingsContentProps {
  profile: any
}

export function SettingsContent({ profile }: SettingsContentProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Settings</h1>
        <p className={colors.textSecondary}>Manage your account settings and preferences</p>
      </div>

      {/* Subscription Info Card */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Subscription</CardTitle>
          <CardDescription className={colors.textMuted}>Your current subscription plan and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className={cn("text-lg px-3 py-1", colors.badge, colors.badgeBorder, colors.badgeText)}>
                  {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
                </Badge>
                <Badge
                  className={profile.subscription_status === 'active' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}
                >
                  {profile.subscription_status}
                </Badge>
              </div>
              <p className={cn("text-sm", colors.textSecondary)}>
                {profile.subscription_tier === 'free'
                  ? 'You are on the free plan. Upgrade to access premium courses.'
                  : `You have access to all ${profile.subscription_tier} tier courses.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Profile Information</CardTitle>
          <CardDescription className={colors.textMuted}>Update your personal information and avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Account Security</CardTitle>
          <CardDescription className={colors.textMuted}>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Account Information</CardTitle>
          <CardDescription className={colors.textMuted}>View your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className={cn("text-sm font-medium", colors.text)}>Email Address</p>
            <p className={cn("text-sm", colors.textSecondary)}>{profile.email}</p>
          </div>
          <div>
            <p className={cn("text-sm font-medium", colors.text)}>Account Created</p>
            <p className={cn("text-sm", colors.textSecondary)}>
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className={cn("text-sm font-medium", colors.text)}>User ID</p>
            <p className={cn("text-sm font-mono text-xs", colors.textSecondary)}>{profile.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
