import { PlayCallerGame } from '@/components/games/play-caller'
import { Metadata } from 'next'
import Image from 'next/image'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata: Metadata = {
    title: 'Play Caller | Kickoff Club HQ',
    description: 'Read the defense and call the perfect play to beat it.',
}

export default function PlayCallerPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col relative">
            <ThemedHeader activePage="games" />

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/games/playbook-bg.png"
                    alt="Playbook Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/80 to-[#0f172a]/90" />
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Offensive Coordinator
                    </h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        The defense is showing their hand. Can you recognize the coverage and call the play that beats it?
                    </p>
                </div>

                <PlayCallerGame />
            </div>
        </div>
    )
}
