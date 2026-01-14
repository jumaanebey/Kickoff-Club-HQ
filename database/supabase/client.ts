import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

// Check if Supabase credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClientComponentClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for development without credentials
    console.warn('Supabase credentials not found. Auth features will be disabled.')
    return null as any
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Alias for backward compatibility
export const createClient = createClientComponentClient
