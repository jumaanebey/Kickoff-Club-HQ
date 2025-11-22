'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/database/supabase/client'

type GameProgress = {
    [gameId: string]: {
        completed: boolean
        highScore: number
        lastPlayed: string
        coins?: number
    }
}

export function useGameProgress() {
    const [progress, setProgress] = useState<GameProgress>({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClientComponentClient()

    // Load progress from localStorage and Supabase on mount
    useEffect(() => {
        const loadProgress = async () => {
            // 1. Load from localStorage first (fastest)
            const saved = localStorage.getItem('football_game_progress')
            let localProgress: GameProgress = {}
            if (saved) {
                try {
                    localProgress = JSON.parse(saved)
                    setProgress(localProgress)
                } catch (e) {
                    console.error('Failed to parse game progress', e)
                }
            }

            // 2. Check auth and load from Supabase
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setUserId(user.id)
                const { data: dbProgress, error } = await supabase
                    .from('game_progress')
                    .select('game_id, high_score, completed, coins, last_played_at')
                    .eq('user_id', user.id)

                if (dbProgress && !error) {
                    const mergedProgress = { ...localProgress }

                    dbProgress.forEach((p: any) => {
                        // Merge logic: take best of both
                        const current = mergedProgress[p.game_id]
                        mergedProgress[p.game_id] = {
                            completed: p.completed || current?.completed || false,
                            highScore: Math.max(p.high_score || 0, current?.highScore || 0),
                            lastPlayed: p.last_played_at || current?.lastPlayed || new Date().toISOString(),
                            coins: Math.max(p.coins || 0, current?.coins || 0)
                        }
                    })

                    setProgress(mergedProgress)
                    // Update localStorage with merged data
                    localStorage.setItem('football_game_progress', JSON.stringify(mergedProgress))
                }
            }

            setIsLoaded(true)
        }

        loadProgress()
    }, [])

    const markGameCompleted = async (gameId: string, score: number, coins: number = 0) => {
        const current = progress[gameId] || { completed: false, highScore: 0, lastPlayed: '', coins: 0 }
        const newHighScore = Math.max(current.highScore, score)
        const newCoins = (current.coins || 0) + coins

        const newProgress = {
            ...progress,
            [gameId]: {
                completed: true,
                highScore: newHighScore,
                lastPlayed: new Date().toISOString(),
                coins: newCoins
            }
        }

        // 1. Optimistic update to state and localStorage
        setProgress(newProgress)
        localStorage.setItem('football_game_progress', JSON.stringify(newProgress))

        // 2. Sync to Supabase if logged in
        if (userId) {
            // Upsert progress
            await supabase.from('game_progress').upsert({
                user_id: userId,
                game_id: gameId,
                high_score: newHighScore,
                completed: true,
                coins: newCoins,
                last_played_at: new Date().toISOString()
            })

            // Insert score history for leaderboard
            await supabase.from('game_scores').insert({
                user_id: userId,
                game_id: gameId,
                score: score,
                played_at: new Date().toISOString()
            })
        }
    }

    return {
        progress,
        isLoaded,
        markGameCompleted
    }
}
