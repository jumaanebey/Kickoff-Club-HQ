/**
 * Animation Utilities - FarmVille-style animation presets
 * Use these for consistent, polished animations throughout the app
 *
 * NOTE: Easing functions are lazy-loaded to avoid calling Reanimated
 * before the runtime is ready. Easing is imported lazily inside getters.
 */

/**
 * Spring configs for different use cases
 */
export const SpringPresets = {
  // Gentle bounce (buttons, cards)
  gentle: {
    damping: 15,
    stiffness: 200,
  },

  // Bouncy (coins, rewards)
  bouncy: {
    damping: 8,
    stiffness: 300,
  },

  // Snappy (quick interactions)
  snappy: {
    damping: 20,
    stiffness: 400,
  },

  // Wobbly (celebrations, upgrades)
  wobbly: {
    damping: 6,
    stiffness: 150,
  },
};

/**
 * Timing configs for different animations
 * Using getters to lazy-load Easing functions
 */
export const TimingPresets = {
  // Quick fade (100ms)
  get quickFade() {
    const { Easing } = require('react-native-reanimated');
    return {
      duration: 100,
      easing: Easing.ease,
    };
  },

  // Standard transition (300ms)
  get standard() {
    const { Easing } = require('react-native-reanimated');
    return {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    };
  },

  // Smooth slide (400ms)
  get smooth() {
    const { Easing } = require('react-native-reanimated');
    return {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };
  },

  // Bounce in (500ms)
  get bounceIn() {
    const { Easing } = require('react-native-reanimated');
    return {
      duration: 500,
      easing: Easing.out(Easing.back(1.5)),
    };
  },
};

/**
 * Easing presets - using getters to lazy-load
 */
export const EasingPresets = {
  // Ease in out (default smooth)
  get easeInOut() {
    const { Easing } = require('react-native-reanimated');
    return Easing.inOut(Easing.ease);
  },

  // Ease out (natural deceleration)
  get easeOut() {
    const { Easing } = require('react-native-reanimated');
    return Easing.out(Easing.quad);
  },

  // Ease in (natural acceleration)
  get easeIn() {
    const { Easing } = require('react-native-reanimated');
    return Easing.in(Easing.quad);
  },

  // Bounce (overshoot effect)
  get bounce() {
    const { Easing } = require('react-native-reanimated');
    return Easing.out(Easing.back(2));
  },

  // Elastic (spring effect)
  get elastic() {
    const { Easing } = require('react-native-reanimated');
    return Easing.elastic(2);
  },
};

/**
 * Animation duration constants (ms)
 */
export const AnimationDuration = {
  instant: 0,
  veryFast: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

/**
 * Common animation sequences
 */
export const AnimationSequences = {
  /**
   * Pop in effect (scale 0 -> 1 with bounce)
   */
  popIn: {
    from: 0,
    to: 1,
    config: SpringPresets.bouncy,
  },

  /**
   * Pulse effect (scale 1 -> 1.1 -> 1)
   */
  pulse: {
    scale: [1, 1.1, 1],
    duration: AnimationDuration.normal,
  },

  /**
   * Shake effect (rotate left-right-left)
   */
  shake: {
    rotation: ['0deg', '-5deg', '5deg', '-5deg', '0deg'],
    duration: AnimationDuration.fast,
  },
};
