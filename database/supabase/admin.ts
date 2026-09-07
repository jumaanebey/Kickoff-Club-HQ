import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * Service-role client for trusted server code only (webhooks, cron). Bypasses RLS.
 * Never import from a client component or anything that ships to the browser.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') throw new Error('createAdminClient is server-only')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
