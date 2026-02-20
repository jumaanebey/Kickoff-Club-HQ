// Daily missions system for Blitz Rush 3D

export type MissionType =
  | 'collect_coins'      // Collect X coins in total today
  | 'distance'           // Run X meters in a single run
  | 'dodge_obstacles'    // Dodge X obstacles in a single run
  | 'fever_time'         // Spend X seconds in fever mode (total today)
  | 'no_hit_run'         // Run X meters without getting hit
  | 'powerup_collect'    // Collect X powerups in total today
  | 'play_games'         // Play X games today
  | 'score_single'       // Score X points in a single run
  | 'combo_reach'        // Reach X combo in a single run

export type MissionDifficulty = 'easy' | 'medium' | 'hard'

export interface MissionDefinition {
  type: MissionType
  difficulty: MissionDifficulty
  targetMin: number
  targetMax: number
  description: (target: number) => string
  rewardMin: number
  rewardMax: number
}

export interface Mission {
  id: string
  type: MissionType
  target: number
  progress: number
  reward: number
  difficulty: MissionDifficulty
  description: string
  completed: boolean
}

// Mission pool by difficulty
export const MISSION_DEFINITIONS: MissionDefinition[] = [
  // Easy missions (50-100 coins)
  {
    type: 'play_games',
    difficulty: 'easy',
    targetMin: 2,
    targetMax: 3,
    description: (t) => `Play ${t} games`,
    rewardMin: 50,
    rewardMax: 75,
  },
  {
    type: 'collect_coins',
    difficulty: 'easy',
    targetMin: 30,
    targetMax: 50,
    description: (t) => `Collect ${t} coins total`,
    rewardMin: 50,
    rewardMax: 75,
  },
  {
    type: 'distance',
    difficulty: 'easy',
    targetMin: 100,
    targetMax: 200,
    description: (t) => `Run ${t}m in one run`,
    rewardMin: 60,
    rewardMax: 100,
  },
  {
    type: 'powerup_collect',
    difficulty: 'easy',
    targetMin: 3,
    targetMax: 5,
    description: (t) => `Collect ${t} powerups`,
    rewardMin: 50,
    rewardMax: 80,
  },

  // Medium missions (150-250 coins)
  {
    type: 'distance',
    difficulty: 'medium',
    targetMin: 300,
    targetMax: 500,
    description: (t) => `Run ${t}m in one run`,
    rewardMin: 150,
    rewardMax: 200,
  },
  {
    type: 'collect_coins',
    difficulty: 'medium',
    targetMin: 75,
    targetMax: 125,
    description: (t) => `Collect ${t} coins total`,
    rewardMin: 150,
    rewardMax: 200,
  },
  {
    type: 'score_single',
    difficulty: 'medium',
    targetMin: 500,
    targetMax: 1000,
    description: (t) => `Score ${t.toLocaleString()} in one run`,
    rewardMin: 175,
    rewardMax: 250,
  },
  {
    type: 'combo_reach',
    difficulty: 'medium',
    targetMin: 10,
    targetMax: 15,
    description: (t) => `Reach ${t}x combo`,
    rewardMin: 150,
    rewardMax: 225,
  },
  {
    type: 'fever_time',
    difficulty: 'medium',
    targetMin: 10,
    targetMax: 20,
    description: (t) => `Spend ${t}s in Fever mode`,
    rewardMin: 175,
    rewardMax: 250,
  },

  // Hard missions (300-500 coins)
  {
    type: 'distance',
    difficulty: 'hard',
    targetMin: 750,
    targetMax: 1000,
    description: (t) => `Run ${t}m in one run`,
    rewardMin: 300,
    rewardMax: 400,
  },
  {
    type: 'no_hit_run',
    difficulty: 'hard',
    targetMin: 200,
    targetMax: 300,
    description: (t) => `Run ${t}m without getting hit`,
    rewardMin: 350,
    rewardMax: 500,
  },
  {
    type: 'score_single',
    difficulty: 'hard',
    targetMin: 2000,
    targetMax: 3000,
    description: (t) => `Score ${t.toLocaleString()} in one run`,
    rewardMin: 350,
    rewardMax: 450,
  },
  {
    type: 'combo_reach',
    difficulty: 'hard',
    targetMin: 20,
    targetMax: 30,
    description: (t) => `Reach ${t}x combo`,
    rewardMin: 300,
    rewardMax: 450,
  },
]

// Generate a random value between min and max
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate a random mission of a specific difficulty
export function generateMission(difficulty: MissionDifficulty): Mission {
  const pool = MISSION_DEFINITIONS.filter(m => m.difficulty === difficulty)
  const def = pool[Math.floor(Math.random() * pool.length)]

  const target = randomBetween(def.targetMin, def.targetMax)
  const reward = randomBetween(def.rewardMin, def.rewardMax)

  return {
    id: `${def.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: def.type,
    target,
    progress: 0,
    reward,
    difficulty,
    description: def.description(target),
    completed: false,
  }
}

// Generate daily mission set (1 easy, 1 medium, 1 hard)
export function generateDailyMissions(): Mission[] {
  return [
    generateMission('easy'),
    generateMission('medium'),
    generateMission('hard'),
  ]
}

// Check if missions should be reset (new day)
export function shouldResetMissions(lastResetTimestamp: number): boolean {
  const now = new Date()
  const lastReset = new Date(lastResetTimestamp)

  // Reset at midnight UTC
  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const lastUTC = Date.UTC(lastReset.getUTCFullYear(), lastReset.getUTCMonth(), lastReset.getUTCDate())

  return nowUTC > lastUTC
}

// Get time until next reset
export function getTimeUntilReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0
  ))

  const diff = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { hours, minutes, seconds }
}

// All-missions-complete bonus
export const ALL_MISSIONS_BONUS = 200
