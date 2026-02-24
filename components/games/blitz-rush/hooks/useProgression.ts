'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/database/supabase'
import { ACHIEVEMENTS, type AchievementDef } from '../data/achievements'

// ─── Level Thresholds (mirrors DB level_thresholds table) ───
// Kept client-side for instant XP bar rendering without network round-trip
const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Rookie' },
  { level: 2, xp: 100, title: 'Bench Warmer' },
  { level: 3, xp: 250, title: 'Practice Squad' },
  { level: 4, xp: 500, title: 'Third String' },
  { level: 5, xp: 1000, title: 'Backup' },
  { level: 6, xp: 1750, title: 'Starter' },
  { level: 7, xp: 2750, title: 'Key Player' },
  { level: 8, xp: 4000, title: 'All-Conference' },
  { level: 9, xp: 5500, title: 'All-American' },
  { level: 10, xp: 7500, title: 'Draft Pick' },
  { level: 11, xp: 10000, title: 'Pro Bowler' },
  { level: 12, xp: 13000, title: 'All-Pro' },
  { level: 13, xp: 17000, title: 'MVP Candidate' },
  { level: 14, xp: 22000, title: 'League MVP' },
  { level: 15, xp: 30000, title: 'Hall of Famer' },
]

// ─── localStorage keys ───
const STORAGE_KEY = 'blitz-rush-progression'
const UNLOCKED_KEY = 'blitz-rush-unlocked-achievements'
const GAMES_PLAYED_KEY = 'blitz-rush-games-played'

interface ProgressionState {
  xp: number
  level: number
  title: string
  gamesPlayed: number
}

export interface LevelUpEvent {
  oldLevel: number
  newLevel: number
  title: string
  coinsRewarded: number
}

export interface AchievementUnlock {
  achievement: AchievementDef
  xpAwarded: number
}

function getLevelForXP(xp: number): { level: number; title: string } {
  let result = LEVEL_THRESHOLDS[0]
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xp) result = t
    else break
  }
  return { level: result.level, title: result.title }
}

function getXPForNextLevel(level: number): number {
  const next = LEVEL_THRESHOLDS.find(t => t.level === level + 1)
  return next?.xp ?? Infinity
}

function getXPForCurrentLevel(level: number): number {
  const current = LEVEL_THRESHOLDS.find(t => t.level === level)
  return current?.xp ?? 0
}

function loadLocal(): ProgressionState {
  if (typeof window === 'undefined') return { xp: 0, level: 1, title: 'Rookie', gamesPlayed: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { xp: 0, level: 1, title: 'Rookie', gamesPlayed: 0 }
}

function saveLocal(state: ProgressionState) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

function loadUnlockedAchievements(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch { /* ignore */ }
  return new Set()
}

function saveUnlockedAchievements(set: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    const arr: string[] = []
    set.forEach(id => arr.push(id))
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(arr))
  } catch { /* ignore */ }
}

export function useProgression() {
  const [state, setState] = useState<ProgressionState>(loadLocal)
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(loadUnlockedAchievements)
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpEvent | null>(null)
  const [pendingAchievement, setPendingAchievement] = useState<AchievementUnlock | null>(null)
  const isSyncing = useRef(false)

  // Sync from Supabase on mount (if authenticated)
  useEffect(() => {
    async function sync() {
      if (isSyncing.current) return
      isSyncing.current = true
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('xp, level')
          .eq('id', user.id)
          .single()

        if (profile) {
          const p = profile as any
          const xp = p.xp ?? 0
          const level = p.level ?? 1
          const { title } = getLevelForXP(xp)
          const local = loadLocal()
          // Use whichever is higher (cloud may have XP from other sources)
          if (xp > local.xp) {
            const updated = { ...local, xp, level, title }
            setState(updated)
            saveLocal(updated)
          }
        }

        // Sync unlocked achievements
        const { data: userAch } = await supabase
          .from('user_achievements')
          .select('achievements(achievement_type)')
          .eq('user_id', user.id)

        if (userAch) {
          const ids = new Set(unlockedIds)
          for (const ua of userAch) {
            const achType = (ua as any).achievements?.achievement_type
            if (achType) ids.add(achType)
          }
          setUnlockedIds(ids)
          saveUnlockedAchievements(ids)
        }
      } catch { /* graceful fallback to localStorage */ }
      isSyncing.current = false
    }
    sync()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Award XP — updates local state immediately, syncs to Supabase
  const awardXP = useCallback(async (amount: number, source: string, details?: Record<string, unknown>) => {
    setState(prev => {
      const newXP = prev.xp + amount
      const { level: newLevel, title } = getLevelForXP(newXP)

      if (newLevel > prev.level) {
        setPendingLevelUp({
          oldLevel: prev.level,
          newLevel,
          title,
          coinsRewarded: 0, // Will be set by server RPC
        })
      }

      const updated = { ...prev, xp: newXP, level: newLevel, title }
      saveLocal(updated)
      return updated
    })

    // Sync to Supabase via award_xp RPC
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await (supabase as any).rpc('award_xp', {
          p_user_id: user.id,
          p_amount: amount,
          p_source: source,
          p_details: details ? JSON.stringify(details) : null,
        })

        if (data?.leveled_up && data.coins_rewarded > 0) {
          setPendingLevelUp(prev => prev ? { ...prev, coinsRewarded: data.coins_rewarded } : null)
        }
      }
    } catch { /* localStorage already updated */ }
  }, [])

  // Record a game completion + check achievements
  const recordGameEnd = useCallback(async (stats: {
    score: number
    distance: number
    coins: number
    nearMissChain: number
    feverActivations: number
    shared?: boolean
  }) => {
    // Increment games played
    setState(prev => {
      const updated = { ...prev, gamesPlayed: prev.gamesPlayed + 1 }
      saveLocal(updated)
      return updated
    })

    // Award XP: +10 per 100 score
    const scoreXP = Math.floor(stats.score / 100) * 10
    if (scoreXP > 0) {
      await awardXP(scoreXP, 'game_blitz_rush', { score: stats.score, distance: stats.distance })
    }

    // Check achievements
    const newUnlocks: AchievementUnlock[] = []
    const currentUnlocked = loadUnlockedAchievements()
    const gamesPlayed = loadLocal().gamesPlayed

    const checks: { id: string; value: number }[] = [
      // Score
      ...ACHIEVEMENTS.filter(a => a.category === 'score').map(a => ({ id: a.id, value: stats.score })),
      // Distance
      ...ACHIEVEMENTS.filter(a => a.category === 'distance').map(a => ({ id: a.id, value: stats.distance })),
      // Coins
      ...ACHIEVEMENTS.filter(a => a.category === 'coins').map(a => ({ id: a.id, value: stats.coins })),
      // Near miss
      ...ACHIEVEMENTS.filter(a => a.category === 'near_miss').map(a => ({ id: a.id, value: stats.nearMissChain })),
      // Fever
      ...ACHIEVEMENTS.filter(a => a.category === 'fever').map(a => ({ id: a.id, value: stats.feverActivations })),
      // Special: game counts
      { id: 'first_game', value: gamesPlayed },
      { id: 'ten_games', value: gamesPlayed },
      { id: 'fifty_games', value: gamesPlayed },
      { id: 'hundred_games', value: gamesPlayed },
    ]

    if (stats.shared) {
      checks.push({ id: 'first_share', value: 1 })
    }

    for (const check of checks) {
      if (currentUnlocked.has(check.id)) continue
      const def = ACHIEVEMENTS.find(a => a.id === check.id)
      if (!def) continue
      if (check.value >= def.threshold) {
        currentUnlocked.add(check.id)
        newUnlocks.push({ achievement: def, xpAwarded: def.xpReward })
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedIds(new Set(currentUnlocked))
      saveUnlockedAchievements(currentUnlocked)

      // Award XP for each unlock, show first one as pending
      for (const unlock of newUnlocks) {
        await awardXP(unlock.xpAwarded, 'achievement', { achievement_id: unlock.achievement.id })
      }
      setPendingAchievement(newUnlocks[0])
    }

    return newUnlocks
  }, [awardXP])

  // Check education achievements (called from useFootballIQ integration)
  const checkEducationAchievements = useCallback((triviaCorrect: number, termsDiscovered: number) => {
    const currentUnlocked = loadUnlockedAchievements()
    const newUnlocks: AchievementUnlock[] = []

    const educationChecks = [
      { id: 'trivia_beginner', value: triviaCorrect },
      { id: 'trivia_scholar', value: triviaCorrect },
      { id: 'trivia_master', value: triviaCorrect },
      { id: 'term_explorer', value: termsDiscovered },
      { id: 'term_collector', value: termsDiscovered },
      { id: 'football_encyclopedia', value: termsDiscovered },
    ]

    for (const check of educationChecks) {
      if (currentUnlocked.has(check.id)) continue
      const def = ACHIEVEMENTS.find(a => a.id === check.id)
      if (!def) continue
      if (check.value >= def.threshold) {
        currentUnlocked.add(check.id)
        newUnlocks.push({ achievement: def, xpAwarded: def.xpReward })
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedIds(new Set(currentUnlocked))
      saveUnlockedAchievements(currentUnlocked)
      for (const unlock of newUnlocks) {
        awardXP(unlock.xpAwarded, 'achievement', { achievement_id: unlock.achievement.id })
      }
      if (!pendingAchievement) {
        setPendingAchievement(newUnlocks[0])
      }
    }

    return newUnlocks
  }, [awardXP, pendingAchievement])

  // Check streak achievements
  const checkStreakAchievements = useCallback((currentStreak: number) => {
    const currentUnlocked = loadUnlockedAchievements()
    const streakChecks = [
      { id: 'streak_3', value: currentStreak },
      { id: 'streak_7', value: currentStreak },
      { id: 'streak_14', value: currentStreak },
      { id: 'streak_30', value: currentStreak },
    ]

    for (const check of streakChecks) {
      if (currentUnlocked.has(check.id)) continue
      const def = ACHIEVEMENTS.find(a => a.id === check.id)
      if (!def) continue
      if (check.value >= def.threshold) {
        currentUnlocked.add(check.id)
        setUnlockedIds(new Set(currentUnlocked))
        saveUnlockedAchievements(currentUnlocked)
        awardXP(def.xpReward, 'achievement', { achievement_id: def.id })
        if (!pendingAchievement) {
          setPendingAchievement({ achievement: def, xpAwarded: def.xpReward })
        }
      }
    }
  }, [awardXP, pendingAchievement])

  // Dismiss level-up / achievement notifications
  const dismissLevelUp = useCallback(() => setPendingLevelUp(null), [])
  const dismissAchievement = useCallback(() => setPendingAchievement(null), [])

  // XP bar progress for current level
  const currentLevelXP = getXPForCurrentLevel(state.level)
  const nextLevelXP = getXPForNextLevel(state.level)
  const levelProgress = nextLevelXP === Infinity ? 1 : (state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)

  return {
    xp: state.xp,
    level: state.level,
    title: state.title,
    gamesPlayed: state.gamesPlayed,
    levelProgress: Math.min(1, Math.max(0, levelProgress)),
    nextLevelXP,
    currentLevelXP,
    unlockedAchievementIds: unlockedIds,
    unlockedCount: unlockedIds.size,
    totalAchievements: ACHIEVEMENTS.length,

    // Actions
    awardXP,
    recordGameEnd,
    checkEducationAchievements,
    checkStreakAchievements,
    dismissLevelUp,
    dismissAchievement,

    // Notifications
    pendingLevelUp,
    pendingAchievement,
  }
}
