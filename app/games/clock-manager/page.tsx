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
                        Clock Manager
                    </h1>
                    <p className="text-red-200 text-lg max-w-2xl mx-auto">
                        The game is on the line. The clock is ticking. Do you have the situational awareness to win?
                    </p>
                </div>

                <ClockManagerGame />
            </div>
        </div>
    )
}
