'use client'

import { cn } from '@/shared/utils'
import { Mic, Play, BookOpen, Trophy, Star, Zap, Target, Music, Grid, Activity } from 'lucide-react'

interface VisualProps {
    title: string
    category?: string
    className?: string
    icon?: any
}

export function PodcastCover({ title, category = 'general', className }: VisualProps) {
    // Deterministic color generation based on title length
    const gradients = [
        'from-blue-600 to-indigo-900',
        'from-purple-600 to-blue-900',
        'from-orange-500 to-red-900',
        'from-emerald-500 to-teal-900',
        'from-pink-500 to-rose-900',
    ]

    const gradientIndex = title.length % gradients.length
    const gradient = gradients[gradientIndex]

    return (
        <div className={cn("relative w-full aspect-square overflow-hidden rounded-xl shadow-lg group", className)}>
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Abstract Shapes */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-2xl" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                        <Mic className="w-6 h-6 text-white" />
                    </div>
                    {category === 'premium' && (
                        <div className="bg-yellow-500/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-400 border border-yellow-500/30">
                            PRO
                        </div>
                    )}
                </div>

                <div>
                    {/* Kickoff Club HQ Branding */}
                    <div className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                        Kickoff Club HQ
                    </div>
                    <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight line-clamp-3">
                        {title}
                    </h3>
                    <div className="mt-2 h-1 w-12 bg-orange-500/70 rounded-full" />
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
    )
}

export function CourseThumbnail({ title, category = 'general', className }: VisualProps) {
    const colors = {
        quarterback: 'from-blue-500 to-blue-700',
        offense: 'from-orange-500 to-red-700',
        defense: 'from-slate-700 to-slate-900',
        general: 'from-green-500 to-emerald-700'
    }

    const bgClass = (colors as any)[category] || colors.general

    return (
        <div className={cn("relative w-full aspect-video overflow-hidden rounded-xl shadow-md group", className)}>
            {/* Background */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", bgClass)} />

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                              linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Chalkboard Effect */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                {category === 'quarterback' ? <Target className="w-32 h-32 text-white" /> :
                    category === 'offense' ? <Zap className="w-32 h-32 text-white" /> :
                        category === 'defense' ? <Activity className="w-32 h-32 text-white" /> :
                            <BookOpen className="w-32 h-32 text-white" />}
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                <div className="bg-white/20 p-4 rounded-full border border-white/40 backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-8 h-8 text-white fill-current" />
                </div>
            </div>

            {/* Badge */}
            <div className="absolute top-3 left-3">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                    {category}
                </div>
            </div>
        </div>
    )
}
