import { SubscriptionTier } from '@/types/database.types'

/**
 * Define the tier hierarchy
 * Higher number = higher tier
 */
const TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 1,
  basic: 2,
  premium: 3,
}

/**
 * Check if a user's subscription tier allows access to a course
 * @param userTier - The user's current subscription tier
 * @param requiredTier - The tier required for the course
 * @returns true if user has access, false otherwise
 */
export function hasAccessToTier(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier]
}

/**
 * Get a user-friendly message for why access is denied
 * @param requiredTier - The tier required for the course
 * @returns A message explaining what tier is needed
 */
export function getAccessDeniedMessage(requiredTier: SubscriptionTier): string {
  switch (requiredTier) {
    case 'free':
      return 'This course is available to all users.'
    case 'basic':
      return 'This course requires a Basic subscription or higher.'
    case 'premium':
      return 'This course requires a Premium subscription.'
    default:
      return 'This course requires a higher subscription tier.'
  }
}

/**
 * Get the tier display name
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

/**
 * Get all tiers that are higher than the current tier
 */
export function getUpgradeTiers(currentTier: SubscriptionTier): SubscriptionTier[] {
  const currentLevel = TIER_LEVELS[currentTier]
  return Object.entries(TIER_LEVELS)
    .filter(([_, level]) => level > currentLevel)
    .map(([tier]) => tier as SubscriptionTier)
}
