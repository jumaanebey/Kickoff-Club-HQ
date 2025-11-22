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
    user: {
        email: string
        user_metadata: {
            full_name?: string
            avatar_url?: string
        }
    }
}

export function Leaderboard({ gameId, limit = 10, className }: LeaderboardProps) {
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchScores = async () => {
            // Note: This assumes a join is possible or we fetch users separately.
            // Since we can't easily join auth.users in client query without a view,
            // we might need to fetch scores then fetch profiles if we had a profiles table.
            // For now, I'll assume we can't get user details easily without a public profiles table.
            // I'll just fetch scores and show "Player" if no profile.

            // Ideally we should have a 'profiles' table that is public.
            // I'll try to fetch from game_scores and hope I can get some info, 
            // but usually auth.users is not selectable.

            // Workaround: Just show scores for now, or assume a profiles table exists.
            // Given the constraints, I'll just show the score and date.

            const { data, error } = await supabase
                .from('game_scores')
                .select('*')
                .eq('game_id', gameId)
                .order('score', { ascending: false })
                .limit(limit)

            if (data) {
                // Mock user data for now since we don't have a guaranteed profiles table
                // In a real app, we'd join with a public profiles table
                const scoresWithUsers = data.map((s: any) => ({
                    ...s,
                    user: {
                        email: 'player@example.com',
                        user_metadata: {
                            full_name: `Player ${s.user_id.slice(0, 4)}`,
                            avatar_url: null
                        }
                    }
                }))
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
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                            index === 0 ? "bg-yellow-500 text-black" :
                                index === 1 ? "bg-gray-400 text-black" :
                                    index === 2 ? "bg-orange-700 text-white" :
                                        "bg-white/10 text-white"
                        )}>
                            {index + 1}
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm">
                                {score.user.user_metadata.full_name || 'Anonymous Player'}
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
