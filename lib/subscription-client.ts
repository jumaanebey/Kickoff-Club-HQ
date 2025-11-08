import { createClientComponentClient } from '@/lib/db/supabase-client'
import { SubscriptionTier } from '@/types/database.types'

export interface UserSubscription {
  tier: SubscriptionTier
  status: string
  canAccessCourse: (requiredTier: SubscriptionTier) => boolean
}

/**
 * Get the current user's subscription information (client-side)
 * @returns User subscription details or null if not found
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const supabase = createClientComponentClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return null
    }

    const { hasAccessToTier } = await import('@/lib/access-control')

    return {
      tier: profile.subscription_tier,
      status: profile.subscription_status,
      canAccessCourse: (requiredTier: SubscriptionTier) => {
        return hasAccessToTier(profile.subscription_tier, requiredTier)
      }
    }
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}

/**
 * Check if a user can access a specific course (client-side)
 * @param userId - The user's ID
 * @param courseId - The course ID
 * @returns Object with access status and message
 */
export async function checkCourseAccess(
  userId: string,
  courseId: string
): Promise<{ hasAccess: boolean; message?: string; requiredTier?: SubscriptionTier }> {
  try {
    const supabase = createClientComponentClient()

    // Get course tier requirement
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('tier_required')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return { hasAccess: false, message: 'Course not found' }
    }

    // Get user subscription
    const subscription = await getUserSubscription(userId)

    if (!subscription) {
      return { hasAccess: false, message: 'User profile not found' }
    }

    const hasAccess = subscription.canAccessCourse(course.tier_required)

    if (!hasAccess) {
      const { getAccessDeniedMessage } = await import('@/lib/access-control')
      return {
        hasAccess: false,
        message: getAccessDeniedMessage(course.tier_required),
        requiredTier: course.tier_required
      }
    }

    // Check subscription status for paid tiers
    if (subscription.tier !== 'free' && subscription.status !== 'active') {
      return {
        hasAccess: false,
        message: 'Your subscription is not active'
      }
    }

    return { hasAccess: true }
  } catch (error) {
    console.error('Error checking course access:', error)
    return { hasAccess: false, message: 'Error checking access' }
  }
}
