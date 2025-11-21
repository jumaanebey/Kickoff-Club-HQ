'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

interface Track {
    id: string
    title: string
    artist?: string
    src: string
    image?: string
}

interface PlayerContextType {
    currentTrack: Track | null
    isPlaying: boolean
    playTrack: (track: Track) => void
    togglePlay: () => void
    pause: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio()

        const handleEnded = () => setIsPlaying(false)
        audioRef.current.addEventListener('ended', handleEnded)

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleEnded)
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    const playTrack = useCallback((track: Track) => {
        if (!audioRef.current) return

        if (currentTrack?.id === track.id) {
            togglePlay()
            return
        }

        setCurrentTrack(track)
        setIsPlaying(true)
        audioRef.current.src = track.src
        audioRef.current.play().catch(e => console.error("Playback error:", e))
    }, [currentTrack])

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !currentTrack) return

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.play().catch(e => console.error("Playback error:", e))
            setIsPlaying(true)
        }
    }, [currentTrack, isPlaying])

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    }, [])

    return (
        <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, pause }}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider')
    }
    return context
}
