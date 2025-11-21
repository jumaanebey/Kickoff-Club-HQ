import { FormationFrenzyGame } from '@/components/games/formation-frenzy'
import { Metadata } from 'next'
import Image from 'next/image'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata: Metadata = {
    title: 'Formation Frenzy | Kickoff Club HQ',
    description: 'Identify offensive formations and personnel groupings.',
}

export default function FormationFrenzyPage() {
    return (
        <div className="min-h-screen bg-[#2e1065] flex flex-col relative">
            <ThemedHeader activePage="games" />

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/games/chalkboard-bg.png"
                    alt="Chalkboard Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2e1065]/90 via-[#2e1065]/80 to-[#2e1065]/90" />
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Formation Frenzy
                    </h1>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                        Can you identify the personnel and formation just by looking at the alignment?
                    </p>
                </div>

                <FormationFrenzyGame />
            </div>
        </div>
    )
}
