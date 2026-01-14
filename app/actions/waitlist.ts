'use server'

import { createServerClient } from '@/database/supabase/server'

export type WaitlistSource = 'homepage' | 'podcast' | 'footer' | 'mobile_app'

interface WaitlistResult {
  success: boolean
  message: string
}

export async function joinWaitlist(
  email: string,
  source: WaitlistSource = 'homepage'
): Promise<WaitlistResult> {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address' }
  }

  try {
    const supabase = await createServerClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return { success: true, message: "You're already on the list!" }
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('email_subscribers')
      .insert({
        email: email.toLowerCase(),
        source,
        subscribed_at: new Date().toISOString()
      })

    if (error) {
      console.error('Waitlist signup error:', error)
      // Check for unique constraint violation
      if (error.code === '23505') {
        return { success: true, message: "You're already on the list!" }
      }
      return { success: false, message: 'Something went wrong. Please try again.' }
    }

    return { success: true, message: 'Welcome to the club! Check your inbox.' }
  } catch (error) {
    console.error('Waitlist signup error:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}
