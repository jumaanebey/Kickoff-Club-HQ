// Shop item definitions for Blitz Rush 3D

export type HeadStartType = 'shield' | 'magnet' | 'speed' | 'multiplier'
export type UpgradeType = 'magnetRange' | 'powerupDuration' | 'feverBoost' | 'luckyCoins'

export interface HeadStartItem {
  id: HeadStartType
  name: string
  description: string
  cost: number
  icon: string
  effect: string
  duration?: number // in seconds
}

export interface UpgradeItem {
  id: UpgradeType
  name: string
  description: string
  costs: number[] // Cost per level
  maxLevel: number
  icon: string
  effectPerLevel: string
}

export interface CharacterAbility {
  id: string
  name: string
  description: string
  effect: string
}

// Head start items - one-time use per run
export const HEAD_STARTS: HeadStartItem[] = [
  {
    id: 'shield',
    name: 'Shield Start',
    description: 'Begin with protection from one hit',
    cost: 100,
    icon: '🛡️',
    effect: 'Start game with shield active',
  },
  {
    id: 'magnet',
    name: 'Magnet Start',
    description: 'Attract coins from the start',
    cost: 150,
    icon: '🧲',
    effect: 'Start with 8s coin magnet',
    duration: 8,
  },
  {
    id: 'speed',
    name: 'Speed Start',
    description: 'Burst out of the gate',
    cost: 200,
    icon: '⚡',
    effect: 'Start with 5s speed boost',
    duration: 5,
  },
  {
    id: 'multiplier',
    name: 'Double Combo',
    description: 'Double your starting multiplier',
    cost: 300,
    icon: '✨',
    effect: 'Start with 2x score multiplier',
    duration: 10,
  },
]

// Permanent upgrades - persist across runs
export const UPGRADES: UpgradeItem[] = [
  {
    id: 'magnetRange',
    name: 'Coin Magnet+',
    description: 'Increase coin attraction range',
    costs: [500, 1000, 2000],
    maxLevel: 3,
    icon: '🧲',
    effectPerLevel: '+25% magnet range per level',
  },
  {
    id: 'powerupDuration',
    name: 'Powerup Duration',
    description: 'Make powerups last longer',
    costs: [500, 1000, 2000],
    maxLevel: 3,
    icon: '⏱️',
    effectPerLevel: '+2s powerup duration per level',
  },
  {
    id: 'feverBoost',
    name: 'Fever Boost',
    description: 'Fill fever meter faster',
    costs: [750, 1500, 3000],
    maxLevel: 3,
    icon: '🔥',
    effectPerLevel: '+10% fever meter gain per level',
  },
  {
    id: 'luckyCoins',
    name: 'Lucky Coins',
    description: 'Chance for mega coin drops',
    costs: [1000, 2000],
    maxLevel: 2,
    icon: '🍀',
    effectPerLevel: '+10% chance for mega coins per level',
  },
]

// Character abilities - each character has a unique passive
export const CHARACTER_ABILITIES: Record<string, CharacterAbility> = {
  rookie: {
    id: 'rookie',
    name: "Beginner's Luck",
    description: '10% more coins from all sources',
    effect: 'coinBonus',
  },
  'blue-thunder': {
    id: 'blue-thunder',
    name: 'Lightning Reflexes',
    description: '15% wider lane switch hitbox',
    effect: 'widerHitbox',
  },
  'green-machine': {
    id: 'green-machine',
    name: 'Endurance',
    description: 'Shield lasts 25% longer',
    effect: 'shieldDuration',
  },
  'purple-reign': {
    id: 'purple-reign',
    name: 'Royal Presence',
    description: '15% faster fever meter fill',
    effect: 'feverGain',
  },
  'gold-standard': {
    id: 'gold-standard',
    name: 'Midas Touch',
    description: 'Mega coins appear 20% more often',
    effect: 'megaCoinChance',
  },
  midnight: {
    id: 'midnight',
    name: 'Shadow Step',
    description: '0.5s invincibility after lane switch',
    effect: 'laneSwitchInvuln',
  },
}

// Get the cost for a specific upgrade level
export function getUpgradeCost(upgradeId: UpgradeType, currentLevel: number): number | null {
  const upgrade = UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade || currentLevel >= upgrade.maxLevel) return null
  return upgrade.costs[currentLevel]
}

// Calculate total coins needed to max an upgrade
export function getTotalUpgradeCost(upgradeId: UpgradeType): number {
  const upgrade = UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return 0
  return upgrade.costs.reduce((sum, cost) => sum + cost, 0)
}
