// Logarithmic speed curve with micro-plateaus
// Speed increases fast early, slows down, then has brief flat zones

import { BASE_SPEED, MAX_SPEED, FIRST_RUN_SPEED } from './constants'

// Speed curve: logarithmic with plateaus at milestone distances
// Creates a "catch your breath" feeling before the next ramp
const PLATEAU_ZONES = [
  { start: 200, end: 250 },   // First breather
  { start: 500, end: 570 },   // Second breather
  { start: 900, end: 1000 },  // Third breather
  { start: 1400, end: 1520 }, // Fourth breather
  { start: 2000, end: 2150 }, // Fifth breather
]

export function getTargetSpeed(distance: number, isFirstRun: boolean): number {
  if (isFirstRun) return FIRST_RUN_SPEED

  // Check if we're in a plateau zone
  for (const zone of PLATEAU_ZONES) {
    if (distance >= zone.start && distance <= zone.end) {
      // Return the speed at the start of the plateau (freeze speed ramp)
      return Math.min(MAX_SPEED, getBaseSpeedCurve(zone.start))
    }
  }

  return Math.min(MAX_SPEED, getBaseSpeedCurve(distance))
}

// Logarithmic curve: fast ramp early, slows down later
function getBaseSpeedCurve(distance: number): number {
  // Ln-based curve: ramps quickly from 22 to ~50 in first 500m,
  // then slowly approaches MAX_SPEED
  const logComponent = Math.log(1 + distance * 0.01) * 12
  return BASE_SPEED + logComponent
}

// Obstacle density: inversely proportional to plateau zones
// During plateaus, spawn MORE obstacles (player is at stable speed)
// During ramps, spawn FEWER (player is adjusting to new speed)
export function getObstacleSpacing(distance: number, baseDifficulty: number): number {
  const baseSpacing = 15

  // Check plateau - tighter spacing during breathers
  for (const zone of PLATEAU_ZONES) {
    if (distance >= zone.start && distance <= zone.end) {
      return Math.max(8, baseSpacing - baseDifficulty * 2.5)
    }
  }

  // Normal spacing (slightly looser during speed ramps)
  return Math.max(9, baseSpacing - baseDifficulty * 2)
}

// Difficulty level for obstacle selection (gates harder obstacles)
export function getDifficultyLevel(distance: number): number {
  return 1 + Math.floor(distance / 400) * 0.15
}

// Spawn probability increases with difficulty
export function getSpawnProbability(distance: number, isFirstRun: boolean): number {
  if (isFirstRun) return 0.4
  const difficulty = getDifficultyLevel(distance)
  return Math.min(0.75, 0.5 + difficulty * 0.1)
}
