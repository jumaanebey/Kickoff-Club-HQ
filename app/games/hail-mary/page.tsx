'use client'

import dynamic from 'next/dynamic'
import { ThemedHeader } from '@/components/layout/themed-header'

const HailMary = dynamic(() => import('@/components/games/hail-mary/HailMary'), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[600px] mx-auto rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center" style={{ aspectRatio: '600 / 760' }}>
            <span className="text-orange-400 font-heading uppercase tracking-widest animate-pulse">Loading…</span>
        </div>
    ),
})

export default function HailMaryPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col relative">
            <ThemedHeader activePage="games" />
            <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-8 flex-grow flex flex-col items-center justify-center relative z-10">
                <HailMary />
            </div>
        </div>
    )
}
