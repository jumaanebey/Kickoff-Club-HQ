'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/database/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Crown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/shared/utils'

interface LeaderboardProps {
    gameId: string
    limit?: number
    className?: string
}

interface Score {
    id: string
    score: number
    played_at: string
    user_id: string
    user: {
        name: string
        avatar_url: string | null
    }
}

export function Leaderboard({ gameId, limit = 10, className }: LeaderboardProps) {
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchScores = async () => {
            const { data: scoresData } = await supabase
                .from('game_scores')
                .select('*')
                .eq('game_id', gameId)
                .order('score', { ascending: false })
                .limit(limit)

            if (scoresData) {
                // Fetch profiles for these scores
                const userIds = Array.from(new Set(scoresData.map((s: any) => s.user_id)))

                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, name, avatar_url')
                    .in('id', userIds)

                const scoresWithUsers = scoresData.map((s: any) => {
                    const profile = profilesData?.find((p: any) => p.id === s.user_id)
                    return {
                        ...s,
                        user: {
                            name: profile?.name || 'Anonymous Player',
                            avatar_url: profile?.avatar_url || null
                        }
                    }
                })
                setScores(scoresWithUsers)
            }
            setLoading(false)
        }

        fetchScores()

        // Realtime subscription
        const channel = supabase
            .channel('leaderboard_updates')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'game_scores',
                filter: `game_id=eq.${gameId}`
            }, (payload) => {
                // Refresh scores on new insert
                fetchScores()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [gameId, limit, supabase])

    if (loading) {
        return <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-white/10 rounded-lg" />
            ))}
        </div>
    }

    if (scores.length === 0) {
        return <div className="text-center text-white/60 py-8">No scores yet. Be the first!</div>
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-2 mb-4 text-white/80 font-bold uppercase tracking-wider text-sm">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Top Commanders
            </div>

            {scores.map((score, index) => (
                <div
                    key={score.id}
                    className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        index === 0 ? "bg-yellow-500/20 border-yellow-500/50" :
                            index === 1 ? "bg-gray-400/20 border-gray-400/50" :
                                index === 2 ? "bg-orange-700/20 border-orange-700/50" :
                                    "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden",
                            index === 0 ? "bg-yellow-500 text-black" :
                                index === 1 ? "bg-gray-400 text-black" :
                                    index === 2 ? "bg-orange-700 text-white" :
                                        "bg-white/10 text-white"
                        )}>
                            {score.user.avatar_url ? (
                                <img src={score.user.avatar_url} alt={score.user.name} className="w-full h-full object-cover" />
                            ) : (
                                index + 1
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm">
                                {score.user.name}
                            </div>
                            <div className="text-xs text-white/50">
                                {formatDistanceToNow(new Date(score.played_at), { addSuffix: true })}
                            </div>
                        </div>
                    </div>

                    <div className="font-mono font-bold text-lg text-yellow-400">
                        {score.score.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    )
}
