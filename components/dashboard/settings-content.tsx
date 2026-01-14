'use client'

import { ProfileForm } from "@/components/settings/profile-form"
import { PasswordForm } from "@/components/settings/password-form"
import Link from 'next/link'
import { CreditCard, User, Lock, Info, ArrowRight } from 'lucide-react'

interface SettingsContentProps {
  profile: any
}

export function SettingsContent({ profile }: SettingsContentProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="inline-block bg-gray-900 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider mb-4">
          Account
        </span>
        <h1 className="text-4xl md:text-5xl font-heading uppercase mb-2 text-gray-900">
          <span className="text-orange-500">Settings</span>
        </h1>
        <p className="text-lg text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Subscription Info Card */}
      <div className="relative bg-white border-2 border-gray-900 p-6">
        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-amber-400 -z-10" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-400 text-gray-900 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl uppercase text-gray-900">Subscription</h3>
            <p className="text-sm text-gray-500">Your current subscription plan and status</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gray-900 text-white font-heading text-sm px-3 py-1 uppercase">
                {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 uppercase ${
                profile.subscription_status === 'active'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}>
                {profile.subscription_status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {profile.subscription_tier === 'free'
                ? 'You are on the free plan. Upgrade to access premium courses.'
                : `You have access to all ${profile.subscription_tier} tier courses.`}
            </p>
          </div>
          {profile.subscription_tier === 'free' && (
            <Link
              href="/pricing"
              className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white font-bold uppercase text-sm hover:bg-orange-600 transition-colors shrink-0"
            >
              Upgrade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="relative bg-white border-2 border-gray-900 p-6">
        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500 text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl uppercase text-gray-900">Profile Information</h3>
            <p className="text-sm text-gray-500">Update your personal information and avatar</p>
          </div>
        </div>

        <ProfileForm profile={profile} />
      </div>

      {/* Account Security */}
      <div className="relative bg-white border-2 border-gray-900 p-6">
        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl uppercase text-gray-900">Account Security</h3>
            <p className="text-sm text-gray-500">Update your password and security settings</p>
          </div>
        </div>

        <PasswordForm />
      </div>

      {/* Account Information */}
      <div className="relative bg-gray-50 border-2 border-gray-900 p-6">
        <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-gray-900 -z-10" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl uppercase text-gray-900">Account Information</h3>
            <p className="text-sm text-gray-500">View your account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase font-bold text-gray-500 mb-1">Email Address</p>
            <p className="text-gray-900 font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500 mb-1">Account Created</p>
            <p className="text-gray-900 font-medium">
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500 mb-1">User ID</p>
            <p className="text-gray-500 font-mono text-xs">{profile.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
