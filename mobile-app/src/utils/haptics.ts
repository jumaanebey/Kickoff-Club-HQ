import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback utility for consistent tactile responses
 */
export const haptics = {
  /**
   * Light tap feedback - for simple button presses
   */
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Medium tap feedback - for standard interactions
   */
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Heavy tap feedback - for important actions
   */
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /**
   * Success feedback - for successful actions (collecting coins, completing tasks)
   */
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Warning feedback - for cautionary actions
   */
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  /**
   * Error feedback - for failed actions
   */
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  /**
   * Selection feedback - for selecting items or navigating
   */
  selection: () => {
    Haptics.selectionAsync();
  },

  /**
   * Coin collect feedback - combination for satisfying collection feel
   */
  coinCollect: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 50);
  },

  /**
   * Building tap feedback - responsive building interaction
   */
  buildingTap: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Upgrade complete feedback - celebratory upgrade
   */
  upgradeComplete: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 100);
  },

  /**
   * Long press feedback - for starting long press actions
   */
  longPress: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
};
