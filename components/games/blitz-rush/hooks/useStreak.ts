'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/database/supabase'

const STORAGE_KEY = 'blitz-rush-streak'

interface StreakState {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
}

// Streak milestone rewards (coins)
const STREAK_MILESTONES: Record<number, number> = {
  3: 50,
  7: 150,
  14: 300,
  30: 1000,
}

function loadLocal(): StreakState {
  if (typeof window === 'undefined') return { currentStreak: 0, longestStreak: 0, lastActivityDate: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { currentStreak: 0, longestStreak: 0, lastActivityDate: null }
}

function saveLocal(state: StreakState) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayStr(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function useStreak() {
  const [state, setState] = useState<StreakState>(loadLocal)
  const [milestoneReached, setMilestoneReached] = useState<{ days: number; coins: number } | null>(null)
  const isSyncing = useRef(false)

  // Sync from Supabase on mount
  useEffect(() => {
    async function sync() {
      if (isSyncing.current) return
      isSyncing.current = true
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('user_streaks')
          .select('current_streak, longest_streak, last_activity_date')
          .eq('user_id', user.id)
          .single()

        if (data) {
          const d = data as any
          const remote: StreakState = {
            currentStreak: d.current_streak ?? 0,
            longestStreak: d.longest_streak ?? 0,
            lastActivityDate: d.last_activity_date ?? null,
          }
          // Use whichever has the higher streak
          const local = loadLocal()
          if (remote.currentStreak > local.currentStreak || remote.longestStreak > local.longestStreak) {
            setState(remote)
            saveLocal(remote)
          }
        }
      } catch { /* graceful fallback */ }
      isSyncing.current = false
    }
    sync()
  }, [])

  // Record today's play activity — call once per session
  const recordActivity = useCallback(async (): Promise<{ streakUpdated: boolean; newStreak: number; milestone?: { days: number; coins: number } }> => {
    const today = getTodayStr()
    const yesterday = getYesterdayStr()

    let updated = false
    let newStreakValue = state.currentStreak
    let milestone: { days: number; coins: number } | undefined

    if (state.lastActivityDate === today) {
      // Already recorded today
      return { streakUpdated: false, newStreak: state.currentStreak }
    }

    if (state.lastActivityDate === yesterday) {
      // Continuing streak
      newStreakValue = state.currentStreak + 1
      updated = true
    } else if (state.lastActivityDate === null || state.lastActivityDate < yesterday) {
      // Streak broken or first time — start at 1
      newStreakValue = 1
      updated = true
    }

    if (updated) {
      const newState: StreakState = {
        currentStreak: newStreakValue,
        longestStreak: Math.max(newStreakValue, state.longestStreak),
        lastActivityDate: today,
      }
      setState(newState)
      saveLocal(newState)

      // Check for milestones
      if (STREAK_MILESTONES[newStreakValue]) {
        milestone = { days: newStreakValue, coins: STREAK_MILESTONES[newStreakValue] }
        setMilestoneReached(milestone)
      }

      // Sync to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Use existing updateUserStreak pattern (upsert)
          const { data: existing } = await supabase
            .from('user_streaks')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (existing) {
            await (supabase.from('user_streaks') as any)
              .update({
                current_streak: newStreakValue,
                longest_streak: Math.max(newStreakValue, state.longestStreak),
                last_activity_date: today,
              })
              .eq('user_id', user.id)
          } else {
            await (supabase.from('user_streaks') as any)
              .insert({
                user_id: user.id,
                current_streak: newStreakValue,
                longest_streak: newStreakValue,
                last_activity_date: today,
              })
          }
        }
      } catch { /* localStorage already updated */ }
    }

    return { streakUpdated: updated, newStreak: newStreakValue, milestone }
  }, [state])

  const dismissMilestone = useCallback(() => setMilestoneReached(null), [])

  // Is streak active today?
  const isActiveToday = state.lastActivityDate === getTodayStr()

  // Is streak at risk (played yesterday but not yet today)?
  const isAtRisk = state.lastActivityDate === getYesterdayStr() && !isActiveToday

  return {
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    lastActivityDate: state.lastActivityDate,
    isActiveToday,
    isAtRisk,
    milestoneReached,

    // Actions
    recordActivity,
    dismissMilestone,

    // Constants
    STREAK_MILESTONES,
  }
}
