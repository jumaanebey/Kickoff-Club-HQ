'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/db/supabase-server'

/**
 * Server action to update user profile
 */
export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in'
      }
    }

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        name: name || null,
        bio: bio || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      throw error
    }

    // Revalidate to show updated profile
    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'Profile updated successfully'
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
