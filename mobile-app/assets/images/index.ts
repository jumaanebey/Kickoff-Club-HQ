/**
 * Antigravity Asset Index
 *
 * Optimized PNG assets for Kickoff Club mobile app
 * All images are 512x512 max, compressed for mobile performance
 *
 * Usage:
 *   import { Buildings, Icons, Units, Decorations } from '@/assets/images-optimized';
 *   <Image source={Buildings.filmRoom[1]} />
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const Buildings = {
  filmRoom: {
    1: require('./buildings/film-room-1.png'),
    3: require('./buildings/film-room-3.png'),
    5: require('./buildings/film-room-5.png'),
    // TODO: Levels 2, 4 pending from Antigravity
  },
  headquarters: {
    1: require('./buildings/headquarters-1.png'),
    3: require('./buildings/headquarters-3.png'),
    5: require('./buildings/headquarters-5.png'),
    // TODO: Levels 2, 4 pending from Antigravity
  },
  practiceField: {
    1: require('./buildings/practice-field-1.png'),
    3: require('./buildings/practice-field-3.png'),
    5: require('./buildings/practice-field-5.png'),
    // TODO: Levels 2, 4 pending from Antigravity
  },
  stadium: {
    1: require('./buildings/stadium-1.png'),
    3: require('./buildings/stadium-3.png'),
    // TODO: Levels 2, 4, 5 pending from Antigravity
  },
  weightRoom: {
    1: require('./buildings/weight-room-1.png'),
    3: require('./buildings/weight-room-3.png'),
    5: require('./buildings/weight-room-5.png'),
    // TODO: Levels 2, 4 pending from Antigravity
  },
} as const;

// Helper to get building by type and level
export const getBuilding = (type: keyof typeof Buildings, level: number) => {
  const building = Buildings[type];
  if (level in building) {
    return building[level as keyof typeof building];
  }
  // Fallback to nearest available level
  const availableLevels = Object.keys(building).map(Number).sort((a, b) => a - b);
  const nearest = availableLevels.reduce((prev, curr) =>
    Math.abs(curr - level) < Math.abs(prev - level) ? curr : prev
  );
  return building[nearest as keyof typeof building];
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

export const Icons = {
  // Resources
  coins: require('./icons/coins.png'),
  energy: require('./icons/energy.png'),
  xp: require('./icons/xp.png'),
  level: require('./icons/level.png'),

  // Rank Badges
  ranks: {
    bronze: require('./icons/rank-bronze.png'),
    silver: require('./icons/rank-silver.png'),
    gold: require('./icons/rank-gold.png'),
    platinum: require('./icons/rank-platinum.png'),
    diamond: require('./icons/rank-diamond.png'),
  },
} as const;

// Helper to get rank icon by name
export const getRankIcon = (rank: keyof typeof Icons.ranks) => Icons.ranks[rank];

// ═══════════════════════════════════════════════════════════════════════════════
// UNITS
// ═══════════════════════════════════════════════════════════════════════════════

export type UnitState = 'idle' | 'training' | 'ready';

export const Units = {
  secondary: {
    idle: require('./units/secondary-idle.png'),
    training: require('./units/secondary-training.png'),
    ready: require('./units/secondary-ready.png'),
  },
  specialTeams: {
    idle: require('./units/special-teams-idle.png'),
    training: require('./units/special-teams-training.png'),
    ready: require('./units/special-teams-ready.png'),
  },
  // TODO: Pending from Antigravity
  // quarterback: { idle, training, ready },
  // runningBack: { idle, training, ready },
  // wideReceiver: { idle, training, ready },
} as const;

// Helper to get unit by type and state
export const getUnit = (type: keyof typeof Units, state: UnitState) => {
  return Units[type][state];
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const Decorations = {
  clubFountain: require('./decorations/club-fountain.png'),
  merchStand: require('./decorations/merch-stand.png'),
  parkingLot: require('./decorations/parking-lot.png'),
  statueLegends: require('./decorations/statue-legends.png'),
  tailgateTent: require('./decorations/tailgate-tent.png'),
  teamBus: require('./decorations/team-bus.png'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ASSET MANIFEST
// ═══════════════════════════════════════════════════════════════════════════════

export const AssetManifest = {
  buildings: {
    total: 25,       // 5 types × 5 levels
    delivered: 14,   // What Antigravity delivered
    missing: 11,     // Still needed
  },
  icons: {
    total: 9,
    delivered: 9,
    missing: 0,
  },
  units: {
    total: 15,       // 5 types × 3 states
    delivered: 6,
    missing: 9,
  },
  decorations: {
    total: 6,
    delivered: 6,
    missing: 0,
  },
} as const;

// Default export for convenience
export default {
  Buildings,
  Icons,
  Units,
  Decorations,
  getBuilding,
  getUnit,
  getRankIcon,
  AssetManifest,
};
