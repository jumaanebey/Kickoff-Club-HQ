'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HeadStartType, UpgradeType, HEAD_STARTS, getUpgradeCost } from '../data/shop-items'

interface HeadStartState {
  shield: boolean
  magnet: boolean
  speed: boolean
  multiplier: boolean
}

interface UpgradeState {
  magnetRange: number
  powerupDuration: number
  feverBoost: number
  luckyCoins: number
}

interface ShopState {
  // Currency
  totalCoins: number

  // Selected head starts for next run
  selectedHeadStarts: HeadStartState

  // Permanent upgrade levels (0 = not purchased)
  upgrades: UpgradeState

  // Selected character
  selectedCharacter: string

  // Actions
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean

  // Head start actions
  toggleHeadStart: (type: HeadStartType) => boolean
  clearHeadStarts: () => void
  getHeadStartCost: () => number

  // Upgrade actions
  purchaseUpgrade: (type: UpgradeType) => boolean
  getUpgradeLevel: (type: UpgradeType) => number

  // Character selection
  setSelectedCharacter: (characterId: string) => void

  // Calculate bonuses based on upgrades
  getMagnetRangeMultiplier: () => number
  getPowerupDurationBonus: () => number
  getFeverBoostMultiplier: () => number
  getLuckyCoinChance: () => number
}

const initialHeadStarts: HeadStartState = {
  shield: false,
  magnet: false,
  speed: false,
  multiplier: false,
}

const initialUpgrades: UpgradeState = {
  magnetRange: 0,
  powerupDuration: 0,
  feverBoost: 0,
  luckyCoins: 0,
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      totalCoins: 0,
      selectedHeadStarts: { ...initialHeadStarts },
      upgrades: { ...initialUpgrades },
      selectedCharacter: 'rookie',

      addCoins: (amount: number) => {
        set(state => ({ totalCoins: state.totalCoins + amount }))
      },

      spendCoins: (amount: number) => {
        const { totalCoins } = get()
        if (totalCoins < amount) return false
        set({ totalCoins: totalCoins - amount })
        return true
      },

      toggleHeadStart: (type: HeadStartType) => {
        const { selectedHeadStarts, totalCoins } = get()
        const headStart = HEAD_STARTS.find(h => h.id === type)
        if (!headStart) return false

        const isSelected = selectedHeadStarts[type]

        if (isSelected) {
          // Deselect - refund not needed, just toggle off
          set({
            selectedHeadStarts: {
              ...selectedHeadStarts,
              [type]: false,
            },
          })
          return true
        } else {
          // Check if can afford
          const currentCost = get().getHeadStartCost()
          const newCost = currentCost + headStart.cost

          if (totalCoins < newCost) return false

          set({
            selectedHeadStarts: {
              ...selectedHeadStarts,
              [type]: true,
            },
          })
          return true
        }
      },

      clearHeadStarts: () => {
        set({ selectedHeadStarts: { ...initialHeadStarts } })
      },

      getHeadStartCost: () => {
        const { selectedHeadStarts } = get()
        let cost = 0

        HEAD_STARTS.forEach(headStart => {
          if (selectedHeadStarts[headStart.id]) {
            cost += headStart.cost
          }
        })

        return cost
      },

      purchaseUpgrade: (type: UpgradeType) => {
        const { upgrades, totalCoins } = get()
        const currentLevel = upgrades[type]
        const cost = getUpgradeCost(type, currentLevel)

        if (cost === null || totalCoins < cost) return false

        set({
          totalCoins: totalCoins - cost,
          upgrades: {
            ...upgrades,
            [type]: currentLevel + 1,
          },
        })
        return true
      },

      getUpgradeLevel: (type: UpgradeType) => {
        return get().upgrades[type]
      },

      setSelectedCharacter: (characterId: string) => {
        set({ selectedCharacter: characterId })
      },

      // Bonus calculations
      getMagnetRangeMultiplier: () => {
        const level = get().upgrades.magnetRange
        return 1 + (level * 0.25) // 25% per level
      },

      getPowerupDurationBonus: () => {
        const level = get().upgrades.powerupDuration
        return level * 2000 // 2 seconds per level in ms
      },

      getFeverBoostMultiplier: () => {
        const level = get().upgrades.feverBoost
        return 1 + (level * 0.10) // 10% per level
      },

      getLuckyCoinChance: () => {
        const level = get().upgrades.luckyCoins
        return level * 0.10 // 10% per level
      },
    }),
    {
      name: 'blitz-rush-shop',
      partialize: (state) => ({
        totalCoins: state.totalCoins,
        upgrades: state.upgrades,
        selectedCharacter: state.selectedCharacter,
        // Don't persist selected head starts - they're per-session
      }),
    }
  )
)

// Hook to sync coins from game to shop
export function useSyncCoins() {
  const addCoins = useShopStore(state => state.addCoins)

  return (coinsEarned: number) => {
    addCoins(coinsEarned)
  }
}
