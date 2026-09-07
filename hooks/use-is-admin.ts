'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/database/supabase/client'

/** True when the signed-in user's profile row has role = 'admin'. Same check as app/admin/layout.tsx. */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClientComponentClient()
    if (!supabase) return
    let cancelled = false

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (!cancelled) setIsAdmin(false); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (!cancelled) setIsAdmin(data?.role === 'admin')
    }
    check()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { check() })
    return () => { cancelled = true; subscription.unsubscribe() }
  }, [])

  return isAdmin
}
