'use client'

import { cn } from "@/shared/utils"
import { Trophy, Star, Medal, Crown } from "lucide-react"

interface SeasonModeProps {
    progress: number // 0 to 100
    className?: string
}

export function SeasonMode({ progress, className }: SeasonModeProps) {
    // Determine current rank based on progress
    const getRank = (p: number) => {
        if (p >= 100) return { title: "Super Bowl Champ", icon: Crown, color: "text-yellow-400" }
        if (p >= 75) return { title: "Pro Bowler", icon: Trophy, color: "text-orange-500" }
        if (p >= 50) return { title: "Starter", icon: Medal, color: "text-blue-500" }
        if (p >= 25) return { title: "Rookie", icon: Star, color: "text-green-500" }
        return { title: "Training Camp", icon: Star, color: "text-gray-400" }
    }

    const rank = getRank(progress)
    const RankIcon = rank.icon

    return (
        <div className={cn("w-full space-y-2", className)}>
            <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-full bg-black/5 dark:bg-white/10", rank.color)}>
                        <RankIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Current Rank</div>
                        <div className={cn("font-heading text-xl leading-none uppercase", rank.color)}>
                            {rank.title}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold font-mono">{Math.round(progress)}%</span>
                    <span className="text-xs text-muted-foreground ml-1">SEASON COMPLETE</span>
                </div>
            </div>

            {/* Progress Bar Track */}
            <div className="relative h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-black/5">
                {/* Yard Lines (Decorations) */}
                <div className="absolute inset-0 flex justify-between px-2">
                    {[25, 50, 75].map((mark) => (
                        <div key={mark} className="h-full w-px bg-white/50 z-10"></div>
                    ))}
                </div>

                {/* Fill */}
                <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    {/* Striping effect */}
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                <span>Rookie</span>
                <span>Starter</span>
                <span>Pro</span>
                <span>Champ</span>
            </div>
        </div>
    )
}
