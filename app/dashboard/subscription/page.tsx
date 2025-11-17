import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { createServerClient } from '@/database/supabase/server'
import { getCustomerInvoices } from '@/payments/stripe/helpers'
import { SubscriptionContent } from '@/components/dashboard/subscription-content'

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

  // Get invoices if user has a Stripe customer ID
  const invoices = profile.stripe_customer_id
    ? await getCustomerInvoices(profile.stripe_customer_id, 5)
    : []

  return <SubscriptionContent profile={profile} invoices={invoices} />
}
