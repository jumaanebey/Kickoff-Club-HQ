'use client'

import useSWR from 'swr'

export type LeaderboardPeriod = 'daily' | 'weekly' | 'alltime'

export interface LeaderboardEntry {
  rank: number
  score: number
  playedAt: string
  userId: string
  displayName: string
  avatarUrl: string | null
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  myRank: number | null
  period: LeaderboardPeriod
}

const fetcher = async (url: string): Promise<LeaderboardData> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}

export function useLeaderboard(period: LeaderboardPeriod = 'alltime', limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<LeaderboardData>(
    `/api/games/blitz-rush/scores?period=${period}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30s dedup
      refreshInterval: 60000, // Auto refresh every 60s
    }
  )

  return {
    leaderboard: data?.leaderboard || [],
    myRank: data?.myRank || null,
    period: data?.period || period,
    isLoading,
    error,
    refresh: mutate,
  }
}

// Submit score to server
export async function submitScore(score: number, coins: number, distance: number): Promise<{ rank: number | null; saved: boolean }> {
  try {
    const res = await fetch('/api/games/blitz-rush/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, coins, distance }),
    })
    if (!res.ok) return { rank: null, saved: false }
    return res.json()
  } catch {
    return { rank: null, saved: false }
  }
}
