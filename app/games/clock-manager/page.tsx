<<<<<<< HEAD
import React from 'react';
import { Metadata } from 'next';
import { ClockManagerGame } from '@/components/games/clock-manager';
import { Timer } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Clock Manager | Kickoff Club HQ',
    description: 'Master the two-minute drill in this high-pressure simulation.',
};

export default function ClockManagerPage() {
    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <div className="bg-slate-900 border-b border-slate-800 p-4 mb-8">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Timer className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Clock Manager</h1>
                        <p className="text-sm text-slate-400">Master the two-minute drill. Manage the clock, call the plays, and lead the drive.</p>
                    </div>
                </div>
            </div>

            <ClockManagerGame />
        </div>
    );
=======
import { ClockManagerGame } from '@/components/games/clock-manager'
import { Metadata } from 'next'
import Image from 'next/image'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata: Metadata = {
    title: 'Clock Manager | Kickoff Club HQ',
    description: 'Master the two-minute drill. Make the right call when time is running out.',
}

export default function ClockManagerPage() {
    return (
        <div className="min-h-screen bg-[#7f1d1d] flex flex-col relative">
            <ThemedHeader activePage="games" />

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/games/scoreboard-bg.png"
                    alt="Scoreboard Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#7f1d1d]/90 via-[#7f1d1d]/80 to-[#7f1d1d]/90" />
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Game Flow
                    </h1>
                    <p className="text-red-200 text-lg max-w-2xl mx-auto">
                        From Kickoff to the final whistle. Do you know how the game works?
                    </p>
                </div>

                <ClockManagerGame />
            </div>
        </div>
    )
>>>>>>> origin/main
}
