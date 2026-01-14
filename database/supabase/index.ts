import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Lazy initialization to avoid build-time errors
let _supabase: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient(): ReturnType<typeof createClient<Database>> | null {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials not configured. Running in demo mode.')
      return null
    }

    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

// Create a mock supabase client for demo mode
const mockSupabaseClient = {
  from: () => ({
    select: () => ({ data: [], error: null, eq: () => ({ data: [], error: null, order: () => ({ data: [], error: null, limit: () => ({ data: [], error: null }) }) }) }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - auth disabled' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Demo mode - auth disabled' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
}

// Export as a getter so it's only initialized when accessed
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop) {
    const client = getSupabaseClient()
    if (!client) {
      return (mockSupabaseClient as any)[prop]
    }
    return client[prop as keyof ReturnType<typeof createClient<Database>>]
  }
})

// Server-side client with service role key (for admin operations)
export function createServerClientAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase service credentials not configured.')
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
