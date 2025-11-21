import { SignalCallerGame } from '@/components/games/signal-caller'
import { Metadata } from 'next'
import Image from 'next/image'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata: Metadata = {
    title: 'Signal Caller | Kickoff Club HQ',
    description: 'Learn the language of the game. Identify referee signals instantly.',
}

export default function SignalCallerPage() {
    return (
        <div className="min-h-screen bg-[#171717] flex flex-col relative">
            <ThemedHeader activePage="games" />

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/games/ref-stripes-bg.png"
                    alt="Referee Stripes Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/90 via-[#171717]/80 to-[#171717]/90" />
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Signal Caller
                    </h1>
                    <p className="text-yellow-200 text-lg max-w-2xl mx-auto">
                        The ref throws the flag and makes the signal. Do you know what it means?
                    </p>
                </div>

                <SignalCallerGame />
            </div>
        </div>
    )
}
