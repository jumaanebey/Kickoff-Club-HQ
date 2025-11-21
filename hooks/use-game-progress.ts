'use client'

import { useState, useEffect } from 'react'

type GameProgress = {
    [gameId: string]: {
        completed: boolean
        highScore: number
        lastPlayed: string
    }
}

export function useGameProgress() {
    const [progress, setProgress] = useState<GameProgress>({})
    const [isLoaded, setIsLoaded] = useState(false)

    // Load progress from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('football_game_progress')
        if (saved) {
            try {
                setProgress(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse game progress', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save progress whenever it changes
    const saveProgress = (newProgress: GameProgress) => {
        localStorage.setItem('football_game_progress', JSON.stringify(newProgress))
        setProgress(newProgress)
    }

    const markGameCompleted = (gameId: string, score: number) => {
        const current = progress[gameId] || { completed: false, highScore: 0, lastPlayed: '' }

        const newProgress = {
            ...progress,
            [gameId]: {
                completed: true,
                highScore: Math.max(current.highScore, score),
                lastPlayed: new Date().toISOString()
            }
        }

        saveProgress(newProgress)
    }

    return {
        progress,
        isLoaded,
        markGameCompleted
    }
}
