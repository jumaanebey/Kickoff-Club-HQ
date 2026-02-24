// All magic numbers consolidated in one place

// ── Physics ──────────────────────────────────────────────
export const GRAVITY = 50
export const JUMP_FORCE = 20
export const BASE_SPEED = 22
export const FIRST_RUN_SPEED = 14
export const MAX_SPEED = 85
export const LANE_WIDTH = 3
export const LANE_SWITCH_SPEED = 25 // units/sec for lerp
export const SLIDE_DURATION = 800 // ms
export const FAST_FALL_MULTIPLIER = 1.5

// ── Spawning ─────────────────────────────────────────────
export const SPAWN_DISTANCE = 80
export const DESPAWN_DISTANCE = -10
export const MIN_OBSTACLE_SPACING = 15
export const FIRST_RUN_OBSTACLE_SPACING = 28
export const COLLISION_THRESHOLD_Z = 2
export const NEAR_MISS_THRESHOLD = 1.5

// ── Scoring ──────────────────────────────────────────────
export const NEAR_MISS_BASE_SCORE = 50
export const DODGE_BASE_SCORE = 100
export const SMASH_SCORE_FEVER = 200
export const SMASH_SCORE_SPEED = 150
export const SHIELD_BREAK_SCORE = 50
export const COIN_SCORE = 10
export const MEGA_COIN_SCORE = 100

// ── Combo / Fever ────────────────────────────────────────
export const FEVER_FILL_PER_DODGE = 8
export const FEVER_DECAY_RATE = 8 // per second
export const FEVER_SPEED_BOOST = 15
export const FEVER_THRESHOLD = 100
export const FEVER_MULTIPLIER = 5

// ── Near-Miss Chain ──────────────────────────────────────
export const NEAR_MISS_CHAIN_WINDOW = 3 // seconds
export const NEAR_MISS_TIERS = [
  { minChain: 8, multiplier: 3.0, label: 'UNTOUCHABLE!', audioRate: 2.0 },
  { minChain: 5, multiplier: 2.0, label: 'IN THE ZONE!', audioRate: 1.6 },
  { minChain: 3, multiplier: 1.5, label: 'THREADING IT!', audioRate: 1.3 },
  { minChain: 0, multiplier: 1.0, label: 'NEAR MISS!', audioRate: 1.0 },
] as const

export function getNearMissTier(chain: number) {
  for (const tier of NEAR_MISS_TIERS) {
    if (chain >= tier.minChain) return tier
  }
  return NEAR_MISS_TIERS[NEAR_MISS_TIERS.length - 1]
}

// ── Powerup Durations (ms) ───────────────────────────────
export const POWERUP_DURATIONS = {
  magnet: 8000,
  shield: 10000,
  speed: 5000,
  multiplier: 10000,
} as const

export const MAGNET_RADIUS = 15
export const MAGNET_PULL_SPEED = 25

// ── Camera ───────────────────────────────────────────────
export const CAMERA_BASE_POSITION = { x: 0, y: 8, z: 12 } as const
export const CAMERA_FOV = 60
export const CAMERA_SHAKE_DECAY = 30 // per second
export const SLOW_MOTION_TIMESCALE = 0.3

// ── Collectibles ─────────────────────────────────────────
export const COIN_SPAWN_CHANCE = 0.4
export const POWERUP_SPAWN_CHANCE = 0.08
export const COIN_LINE_LENGTH = 5
export const COIN_ARC_COUNT = 7

// ── Object Pool Sizes ────────────────────────────────────
export const POOL_OBSTACLES = 30
export const POOL_COINS = 100
export const POOL_PARTICLES = 500

// ── Renderer ─────────────────────────────────────────────
export const MAX_DPR = 2
export const FOG_NEAR = 50
export const FOG_FAR = 150
export const BG_COLOR = 0x0f172a

// ── Track ────────────────────────────────────────────────
export const TRACK_SEGMENT_LENGTH = 40
export const TRACK_SEGMENTS_VISIBLE = 5
export const FIELD_WIDTH = 16

// ── Tutorial Pattern ─────────────────────────────────────
export const FIRST_RUN_PATTERN = [
  { type: 'barrier' as const, lane: -1 as const },
  { type: 'barrier' as const, lane: 0 as const },
  { type: 'hurdle' as const, lane: 0 as const },
  { type: 'tackledummy' as const, lane: 0 as const },
  { type: 'hurdle' as const, lane: 1 as const },
  { type: 'defender' as const, lane: -1 as const },
]

// ── Audio Paths ──────────────────────────────────────────
export const SOUND_PATHS = {
  footstep: '/sounds/blitz-rush/footstep.ogg',
  jump: '/sounds/blitz-rush/jump.ogg',
  land: '/sounds/blitz-rush/land.ogg',
  slide: '/sounds/blitz-rush/slide.ogg',
  laneSwitch: '/sounds/blitz-rush/lane-switch.ogg',
  coin: '/sounds/blitz-rush/coin.ogg',
  powerup: '/sounds/blitz-rush/powerup.ogg',
  megaCoin: '/sounds/blitz-rush/mega-coin.ogg',
  shieldActivate: '/sounds/blitz-rush/shield-activate.ogg',
  shieldBreak: '/sounds/blitz-rush/shield-break.ogg',
  speedBoost: '/sounds/blitz-rush/speed-boost.ogg',
  magnetActivate: '/sounds/blitz-rush/magnet.ogg',
  nearMiss: '/sounds/blitz-rush/near-miss.ogg',
  collision: '/sounds/blitz-rush/collision.ogg',
  gameStart: '/sounds/blitz-rush/game-start.ogg',
  gameOver: '/sounds/blitz-rush/game-over.ogg',
  highScore: '/sounds/blitz-rush/high-score.ogg',
  milestone: '/sounds/blitz-rush/milestone.ogg',
  combo: '/sounds/blitz-rush/combo.ogg',
  buttonClick: '/sounds/blitz-rush/button-click.ogg',
} as const

export const MUSIC_PATHS = {
  menu: '/sounds/blitz-rush/music-menu.ogg',
  gameplay: '/sounds/blitz-rush/music-gameplay.ogg',
  gameOver: '/sounds/blitz-rush/music-gameover.ogg',
} as const

export const AMBIENT_PATHS = {
  crowdAmbience: '/sounds/blitz-rush/crowd-ambience.mp3',
} as const

export type SoundName = keyof typeof SOUND_PATHS
export type MusicName = keyof typeof MUSIC_PATHS

// ── Obstacle Hitboxes ────────────────────────────────────
export type ObstacleType =
  | 'hurdle'
  | 'defender'
  | 'barrier'
  | 'tackledummy'
  | 'doublehurdle'
  | 'rollingbarrel'
  | 'twolanewall'
  | 'sprintzone'

export const HITBOXES: Record<
  ObstacleType,
  { width: number; height: number; jumpable: boolean; slideable: boolean }
> = {
  hurdle: { width: 1.8, height: 1.2, jumpable: true, slideable: false },
  defender: { width: 1.6, height: 2.5, jumpable: true, slideable: true },
  barrier: { width: 2.5, height: 3, jumpable: false, slideable: false },
  tackledummy: { width: 1.2, height: 3.2, jumpable: false, slideable: true },
  doublehurdle: { width: 1.8, height: 2.2, jumpable: true, slideable: false },
  rollingbarrel: { width: 1.4, height: 1.2, jumpable: true, slideable: false },
  twolanewall: { width: 5.8, height: 3, jumpable: false, slideable: false },
  sprintzone: { width: 0.4, height: 3, jumpable: false, slideable: false },
}

// ── Distance-Gated Obstacle Unlocks ──────────────────────
export const OBSTACLE_SPAWN_TABLE = [
  { type: 'hurdle' as ObstacleType, weight: 0.3, minDistance: 0 },
  { type: 'defender' as ObstacleType, weight: 0.3, minDistance: 0 },
  { type: 'barrier' as ObstacleType, weight: 0.12, minDistance: 0 },
  { type: 'tackledummy' as ObstacleType, weight: 0.12, minDistance: 0 },
  { type: 'doublehurdle' as ObstacleType, weight: 0.08, minDistance: 500 },
  { type: 'rollingbarrel' as ObstacleType, weight: 0.1, minDistance: 800 },
  { type: 'twolanewall' as ObstacleType, weight: 0.08, minDistance: 1200 },
  { type: 'sprintzone' as ObstacleType, weight: 0.06, minDistance: 1500 },
]

// ── Combo Multipliers ────────────────────────────────────
export function getComboMultiplier(combo: number): number {
  if (combo >= 20) return 4
  if (combo >= 10) return 3
  if (combo >= 5) return 2
  return 1
}

export const COMBO_MILESTONES = [5, 10, 20] as const
export type Lane = -1 | 0 | 1

export type PowerupType = keyof typeof POWERUP_DURATIONS
export type DeathCause = ObstacleType
