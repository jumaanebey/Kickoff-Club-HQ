'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { Trophy, Target, Flame } from 'lucide-react'

interface CourseProgressTrackerProps {
    courseId: string
    totalLessons: number
    completedLessons: number
    className?: string
}

export function CourseProgressTracker({
    courseId,
    totalLessons,
    completedLessons,
    className
}: CourseProgressTrackerProps) {
    const { colors } = useTheme()
    const [progress, setProgress] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    useEffect(() => {
        // Animate progress bar on mount
        const timer = setTimeout(() => {
            setProgress(progressPercentage)
        }, 100)

        return () => clearTimeout(timer)
    }, [progressPercentage])

    const getProgressStatus = () => {
        if (progressPercentage === 0) return { icon: Target, text: 'Not Started', color: 'text-gray-400' }
        if (progressPercentage < 50) return { icon: Flame, text: 'In Progress', color: 'text-orange-500' }
        if (progressPercentage < 100) return { icon: Flame, text: 'Almost There!', color: 'text-orange-500' }
        return { icon: Trophy, text: 'Completed!', color: 'text-green-500' }
    }

    const status = getProgressStatus()
    const StatusIcon = status.icon

    return (
        <div className={cn("space-y-3", className)}>
            {/* Progress Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <StatusIcon className={cn("h-4 w-4", status.color)} />
                    <span className={cn("text-sm font-semibold", status.color)}>
                        {status.text}
                    </span>
                </div>
                <span className={cn("text-sm font-mono font-bold", colors.text)}>
                    {completedLessons}/{totalLessons}
                </span>
            </div>

            {/* Progress Bar */}
            <div className={cn("relative h-2 rounded-full overflow-hidden", colors.bgSecondary)}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full",
                        progressPercentage === 100
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-orange-500 to-red-500"
                    )}
                />

                {/* Shimmer effect */}
                {progressPercentage > 0 && progressPercentage < 100 && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                            x: ['-100%', '200%']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                )}
            </div>

            {/* Milestone Indicators */}
            {totalLessons > 0 && (
                <div className="flex items-center justify-between text-xs">
                    <span className={cn(completedLessons > 0 ? "text-orange-500 font-semibold" : colors.textMuted)}>
                        Started
                    </span>
                    <span className={cn(progressPercentage >= 50 ? "text-orange-500 font-semibold" : colors.textMuted)}>
                        Halfway
                    </span>
                    <span className={cn(progressPercentage === 100 ? "text-green-500 font-semibold" : colors.textMuted)}>
                        Complete
                    </span>
                </div>
            )}

            {/* Motivational Message */}
            {progressPercentage > 0 && progressPercentage < 100 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "text-xs text-center p-2 rounded-lg",
                        "bg-gradient-to-r from-orange-500/10 to-red-500/10",
                        "border border-orange-500/20"
                    )}
                >
                    <span className={cn("font-medium", colors.text)}>
                        {progressPercentage < 25 && "Great start! Keep going! 🔥"}
                        {progressPercentage >= 25 && progressPercentage < 50 && "You're making progress! 💪"}
                        {progressPercentage >= 50 && progressPercentage < 75 && "More than halfway there! 🚀"}
                        {progressPercentage >= 75 && "Almost done! Finish strong! 🏆"}
                    </span>
                </motion.div>
            )}

            {/* Completion Celebration */}
            {progressPercentage === 100 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "text-xs text-center p-3 rounded-lg",
                        "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
                        "border border-green-500/30"
                    )}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-green-500">
                            Course Completed! 🎉
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
