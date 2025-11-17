'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ManageSubscriptionButton } from '@/components/stripe/manage-subscription-button'
import { PlanSwitcher } from '@/components/stripe/plan-switcher'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface SubscriptionContentProps {
  profile: {
    subscription_tier: string
    subscription_status: string | null
    subscription_end_date: string | null
    stripe_customer_id: string | null
  }
  invoices: any[]
}

export function SubscriptionContent({ profile, invoices }: SubscriptionContentProps) {
  const { colors } = useTheme()
  const isSubscribed = profile.subscription_tier !== 'free' && profile.subscription_status === 'active'
  const isCanceling = profile.subscription_end_date !== null

  return (
    <div className="space-y-8">
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>Subscription</h1>
        <p className={colors.textMuted}>Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Current Plan</CardTitle>
          <CardDescription className={colors.textMuted}>Your active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  className={`text-lg py-1 px-3 capitalize ${
                    profile.subscription_tier === 'premium'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500'
                      : profile.subscription_tier === 'basic'
                      ? cn(colors.badge, colors.badgeBorder)
                      : cn(colors.badge, colors.badgeBorder, 'opacity-60')
                  }`}
                >
                  {profile.subscription_tier}
                </Badge>
                {profile.subscription_status && (
                  <Badge className={profile.subscription_status === 'active' ? 'bg-green-500/20 border-green-500/30 text-green-400' : cn(colors.badge, colors.badgeBorder, 'opacity-60')}>
                    {profile.subscription_status}
                  </Badge>
                )}
              </div>

              {profile.subscription_tier === 'free' && (
                <p className={cn("mb-4", colors.textMuted)}>
                  You're currently on the free plan. Upgrade to access premium courses and features.
                </p>
              )}

              {profile.subscription_tier === 'basic' && (
                <p className={cn("mb-4", colors.textMuted)}>
                  Access to all Basic courses, priority support, and downloadable resources.
                </p>
              )}

              {profile.subscription_tier === 'premium' && (
                <p className={cn("mb-4", colors.textMuted)}>
                  Full access to all courses, 1-on-1 coaching, and exclusive content.
                </p>
              )}

              {isCanceling && profile.subscription_end_date && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-200">
                    Your subscription will end on{' '}
                    {new Date(profile.subscription_end_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    . You'll still have access until then.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {profile.subscription_tier === 'free' ? (
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/pricing">Upgrade Plan</Link>
                  </Button>
                ) : (
                  <>
                    {profile.stripe_customer_id && (
                      <ManageSubscriptionButton />
                    )}
                    {profile.subscription_tier === 'basic' && (
                      <Button variant="outline" asChild className={cn(colors.badge, colors.badgeBorder, colors.badgeText)}>
                        <Link href="/pricing">Upgrade to Premium</Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {profile.subscription_tier !== 'free' && (
              <div className="text-right">
                <div className={cn("text-3xl font-bold", colors.text)}>
                  ${profile.subscription_tier === 'basic' ? '19' : '49'}
                </div>
                <div className={cn("text-sm", colors.textMuted)}>per month</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Switcher */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>{profile.subscription_tier === 'free' ? 'Choose Your Plan' : 'Change Plan'}</CardTitle>
          <CardDescription className={colors.textMuted}>
            {profile.subscription_tier === 'free'
              ? 'Upgrade to access all courses and features'
              : 'Switch between monthly and annual billing'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlanSwitcher currentTier={profile.subscription_tier as 'free' | 'monthly' | 'annual'} />
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className={cn(colors.card, colors.cardBorder)}>
        <CardHeader>
          <CardTitle className={colors.text}>Plan Features</CardTitle>
          <CardDescription className={colors.textMuted}>What's included in your plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.subscription_tier === 'free' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Access to free courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Community access</span>
                </div>
              </>
            )}

            {profile.subscription_tier === 'basic' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>All free features</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Access to Basic courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Downloadable resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Course certificates</span>
                </div>
              </>
            )}

            {profile.subscription_tier === 'premium' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>All Basic features</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>All Premium courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>1-on-1 coaching sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Exclusive content</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className={colors.textMuted}>Early access to new courses</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      {isSubscribed && profile.stripe_customer_id && (
        <Card className={cn(colors.card, colors.cardBorder)}>
          <CardHeader>
            <CardTitle className={colors.text}>Billing Information</CardTitle>
            <CardDescription className={colors.textMuted}>Manage your payment methods and billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={cn("mb-4", colors.textMuted)}>
              View and update your payment methods, billing address, and download invoices
              through the Stripe Customer Portal.
            </p>
            <ManageSubscriptionButton text="Manage Billing" />
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {invoices.length > 0 && (
        <Card className={cn(colors.card, colors.cardBorder)}>
          <CardHeader>
            <CardTitle className={colors.text}>Payment History</CardTitle>
            <CardDescription className={colors.textMuted}>View and download your recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => {
                const statusIcon = invoice.status === 'paid'
                  ? <CheckCircle className="h-4 w-4 text-green-400" />
                  : invoice.status === 'open'
                  ? <Clock className="h-4 w-4 text-yellow-400" />
                  : <XCircle className="h-4 w-4 text-red-400" />

                const statusColor = invoice.status === 'paid'
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : invoice.status === 'open'
                  ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                  : 'bg-red-500/20 text-red-600 dark:text-red-400'

                return (
                  <div
                    key={invoice.id}
                    className={cn("flex items-center justify-between p-4 border rounded-lg transition-colors", colors.cardBorder, colors.cardHover)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg", colors.bgTertiary)}>
                        <FileText className={cn("h-5 w-5", colors.textMuted)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium", colors.text)}>
                            {invoice.created
                              ? new Date(invoice.created * 1000).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </span>
                          <Badge variant="outline" className={`text-xs ${statusColor} border-current`}>
                            <span className="flex items-center gap-1">
                              {statusIcon}
                              {invoice.status}
                            </span>
                          </Badge>
                        </div>
                        <p className={cn("text-sm", colors.textMuted)}>
                          Invoice #{invoice.number || invoice.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn("font-semibold text-lg", colors.text)}>
                        ${(invoice.amount_paid / 100).toFixed(2)}
                      </span>
                      {invoice.invoice_pdf && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className={cn(colors.badge, colors.badgeBorder, colors.badgeText)}
                        >
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {invoices.length >= 5 && (
              <div className="mt-4 text-center">
                <ManageSubscriptionButton text="View All Invoices" variant="outline" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
