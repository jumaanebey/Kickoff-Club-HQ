import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { createServerClient } from '@/lib/db/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ManageSubscriptionButton } from '@/components/stripe/manage-subscription-button'
import { PlanSwitcher } from '@/components/stripe/plan-switcher'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCustomerInvoices } from '@/lib/stripe-helpers'
import { Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Subscription - Dashboard',
  description: 'Manage your subscription'
}

export default async function SubscriptionPage() {
  const user = await getUser()
  if (!user) redirect('/auth/sign-in')

  const supabase = await createServerClient()

  // Get subscription details
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, subscription_end_date, stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  const isSubscribed = profile.subscription_tier !== 'free' && profile.subscription_status === 'active'
  const isCanceling = profile.subscription_end_date !== null

  // Get invoices if user has a Stripe customer ID
  const invoices = profile.stripe_customer_id
    ? await getCustomerInvoices(profile.stripe_customer_id, 5)
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Subscription</h1>
        <p className="text-white/70">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Current Plan</CardTitle>
          <CardDescription className="text-white/60">Your active subscription</CardDescription>
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
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}
                >
                  {profile.subscription_tier}
                </Badge>
                {profile.subscription_status && (
                  <Badge className={profile.subscription_status === 'active' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/10 border-white/20 text-white/60'}>
                    {profile.subscription_status}
                  </Badge>
                )}
              </div>

              {profile.subscription_tier === 'free' && (
                <p className="text-white/70 mb-4">
                  You're currently on the free plan. Upgrade to access premium courses and features.
                </p>
              )}

              {profile.subscription_tier === 'basic' && (
                <p className="text-white/70 mb-4">
                  Access to all Basic courses, priority support, and downloadable resources.
                </p>
              )}

              {profile.subscription_tier === 'premium' && (
                <p className="text-white/70 mb-4">
                  Full access to all courses, 1-on-1 coaching, and exclusive content.
                </p>
              )}

              {isCanceling && profile.subscription_end_date && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-200">
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
                      <Button variant="outline" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/pricing">Upgrade to Premium</Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {profile.subscription_tier !== 'free' && (
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  ${profile.subscription_tier === 'basic' ? '19' : '49'}
                </div>
                <div className="text-sm text-white/60">per month</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Switcher */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">{profile.subscription_tier === 'free' ? 'Choose Your Plan' : 'Change Plan'}</CardTitle>
          <CardDescription className="text-white/60">
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
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Plan Features</CardTitle>
          <CardDescription className="text-white/60">What's included in your plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.subscription_tier === 'free' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Access to free courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Community access</span>
                </div>
              </>
            )}

            {profile.subscription_tier === 'basic' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">All free features</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Access to Basic courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Downloadable resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Course certificates</span>
                </div>
              </>
            )}

            {profile.subscription_tier === 'premium' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">All Basic features</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">All Premium courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">1-on-1 coaching sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Exclusive content</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white/70">Early access to new courses</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      {isSubscribed && profile.stripe_customer_id && (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Billing Information</CardTitle>
            <CardDescription className="text-white/60">Manage your payment methods and billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 mb-4">
              View and update your payment methods, billing address, and download invoices
              through the Stripe Customer Portal.
            </p>
            <ManageSubscriptionButton text="Manage Billing" />
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {invoices.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
            <CardDescription className="text-white/60">View and download your recent invoices</CardDescription>
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
                  ? 'bg-green-500/20 text-green-400'
                  : invoice.status === 'open'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'

                return (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <FileText className="h-5 w-5 text-white/70" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
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
                        <p className="text-sm text-white/70">
                          Invoice #{invoice.number || invoice.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg text-white">
                        ${(invoice.amount_paid / 100).toFixed(2)}
                      </span>
                      {invoice.invoice_pdf && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
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
