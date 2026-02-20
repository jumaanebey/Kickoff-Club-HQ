'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Mission,
  MissionType,
  generateDailyMissions,
  shouldResetMissions,
  ALL_MISSIONS_BONUS,
} from '../data/missions'
import { useShopStore } from './useShopStore'

interface MissionState {
  missions: Mission[]
  lastResetTimestamp: number
  allCompletedBonusClaimed: boolean

  // Tracking for aggregate missions
  todayStats: {
    coinsCollected: number
    gamesPlayed: number
    powerupsCollected: number
    feverTimeSeconds: number
  }

  // Actions
  initializeMissions: () => void
  updateMissionProgress: (type: MissionType, value: number, isTotal?: boolean) => void
  claimMissionReward: (missionId: string) => boolean
  claimAllCompletedBonus: () => boolean

  // Stats tracking
  trackGameEnd: (stats: {
    coinsCollected: number
    distance: number
    score: number
    maxCombo: number
    feverTimeSeconds: number
    powerupsCollected: number
    hitsTaken: number
  }) => void
}

export const useMissionsStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions: [],
      lastResetTimestamp: 0,
      allCompletedBonusClaimed: false,
      todayStats: {
        coinsCollected: 0,
        gamesPlayed: 0,
        powerupsCollected: 0,
        feverTimeSeconds: 0,
      },

      initializeMissions: () => {
        const { lastResetTimestamp, missions } = get()

        // Check if we need to generate new missions
        if (missions.length === 0 || shouldResetMissions(lastResetTimestamp)) {
          set({
            missions: generateDailyMissions(),
            lastResetTimestamp: Date.now(),
            allCompletedBonusClaimed: false,
            todayStats: {
              coinsCollected: 0,
              gamesPlayed: 0,
              powerupsCollected: 0,
              feverTimeSeconds: 0,
            },
          })
        }
      },

      updateMissionProgress: (type: MissionType, value: number, isTotal = false) => {
        const { missions } = get()

        const updatedMissions = missions.map(mission => {
          if (mission.type !== type || mission.completed) return mission

          const newProgress = isTotal ? value : mission.progress + value
          const completed = newProgress >= mission.target

          return {
            ...mission,
            progress: Math.min(newProgress, mission.target),
            completed,
          }
        })

        set({ missions: updatedMissions })
      },

      claimMissionReward: (missionId: string) => {
        const { missions } = get()
        const mission = missions.find(m => m.id === missionId)

        if (!mission || !mission.completed) return false

        // Add reward to shop store
        useShopStore.getState().addCoins(mission.reward)

        // Remove from missions (or mark as claimed)
        set({
          missions: missions.filter(m => m.id !== missionId),
        })

        return true
      },

      claimAllCompletedBonus: () => {
        const { missions, allCompletedBonusClaimed } = get()

        if (allCompletedBonusClaimed) return false

        const allCompleted = missions.every(m => m.completed)
        if (!allCompleted) return false

        // Add bonus to shop store
        useShopStore.getState().addCoins(ALL_MISSIONS_BONUS)

        set({ allCompletedBonusClaimed: true })
        return true
      },

      trackGameEnd: (stats) => {
        const { todayStats, updateMissionProgress } = get()

        // Update aggregate stats
        const newStats = {
          coinsCollected: todayStats.coinsCollected + stats.coinsCollected,
          gamesPlayed: todayStats.gamesPlayed + 1,
          powerupsCollected: todayStats.powerupsCollected + stats.powerupsCollected,
          feverTimeSeconds: todayStats.feverTimeSeconds + stats.feverTimeSeconds,
        }

        set({ todayStats: newStats })

        // Update mission progress for aggregate types
        updateMissionProgress('collect_coins', newStats.coinsCollected, true)
        updateMissionProgress('play_games', newStats.gamesPlayed, true)
        updateMissionProgress('powerup_collect', newStats.powerupsCollected, true)
        updateMissionProgress('fever_time', Math.floor(newStats.feverTimeSeconds), true)

        // Update mission progress for single-run types (use max value)
        updateMissionProgress('distance', stats.distance, true)
        updateMissionProgress('score_single', stats.score, true)
        updateMissionProgress('combo_reach', stats.maxCombo, true)

        // No-hit run: only update if no hits were taken
        if (stats.hitsTaken === 0) {
          updateMissionProgress('no_hit_run', stats.distance, true)
        }
      },
    }),
    {
      name: 'blitz-rush-missions',
      partialize: (state) => ({
        missions: state.missions,
        lastResetTimestamp: state.lastResetTimestamp,
        allCompletedBonusClaimed: state.allCompletedBonusClaimed,
        todayStats: state.todayStats,
      }),
    }
  )
)

// Hook to initialize missions on mount
export function useMissions() {
  const store = useMissionsStore()

  // Initialize on first access
  if (typeof window !== 'undefined') {
    store.initializeMissions()
  }

  return store
}
