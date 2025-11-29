/**
 * Animation Utilities - FarmVille-style animation presets
 * Use these for consistent, polished animations throughout the app
 */

import { Easing } from 'react-native-reanimated';

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
 */
export const TimingPresets = {
  // Quick fade (100ms)
  quickFade: {
    duration: 100,
    easing: Easing.ease,
  },

  // Standard transition (300ms)
  standard: {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  },

  // Smooth slide (400ms)
  smooth: {
    duration: 400,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  // Bounce in (500ms)
  bounceIn: {
    duration: 500,
    easing: Easing.out(Easing.back(1.5)),
  },
};

/**
 * Easing presets
 */
export const EasingPresets = {
  // Ease in out (default smooth)
  easeInOut: Easing.inOut(Easing.ease),

  // Ease out (natural deceleration)
  easeOut: Easing.out(Easing.quad),

  // Ease in (natural acceleration)
  easeIn: Easing.in(Easing.quad),

  // Bounce (overshoot effect)
  bounce: Easing.out(Easing.back(2)),

  // Elastic (spring effect)
  elastic: Easing.elastic(2),
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
