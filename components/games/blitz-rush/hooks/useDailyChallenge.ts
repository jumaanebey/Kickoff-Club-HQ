'use client'

import useSWR from 'swr'
import { useCallback } from 'react'

export interface DailyChallenge {
  id: string
  challenge_date: string
  challenge_type: string
  title: string
  description: string
  target_value: number
  reward_coins: number
}

export interface ChallengeProgress {
  progress: number
  completed: boolean
  reward_claimed: boolean
}

interface ChallengeResponse {
  challenge: DailyChallenge | null
  userProgress: ChallengeProgress | null
}

const fetcher = async (url: string): Promise<ChallengeResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch challenge')
  return res.json()
}

export function useDailyChallenge() {
  const { data, error, isLoading, mutate } = useSWR<ChallengeResponse>(
    '/api/games/blitz-rush/challenges',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      refreshInterval: 300000, // 5 min
    }
  )

  const updateProgress = useCallback(async (progress: number) => {
    if (!data?.challenge?.id) return
    try {
      await fetch('/api/games/blitz-rush/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: data.challenge.id, progress }),
      })
      mutate()
    } catch {
      // Silently fail — challenge progress is nice-to-have
    }
  }, [data?.challenge?.id, mutate])

  const claimReward = useCallback(async (): Promise<number> => {
    if (!data?.challenge?.id) return 0
    try {
      const res = await fetch('/api/games/blitz-rush/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: data.challenge.id, claimReward: true }),
      })
      if (!res.ok) return 0
      const result = await res.json()
      mutate()
      return result.coinsAwarded || 0
    } catch {
      return 0
    }
  }, [data?.challenge?.id, mutate])

  return {
    challenge: data?.challenge || null,
    progress: data?.userProgress || null,
    isLoading,
    error,
    updateProgress,
    claimReward,
    refresh: mutate,
  }
}
