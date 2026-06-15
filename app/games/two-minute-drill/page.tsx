import { TwoMinuteDrillGame } from '@/components/games/two-minute-drill'
import { Metadata } from 'next'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata: Metadata = {
    title: 'Two-Minute Drill | Kickoff Club HQ',
    description: 'Beat the clock. Read each situation, call the smart play, and march down the field before time runs out.',
}

export default function TwoMinuteDrillPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col relative">
            <ThemedHeader activePage="games" />

            <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-12 flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Two-Minute Drill
                    </h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        The clock is ticking. Can you call the right plays, manage the clock, and score before time expires?
                    </p>
                </div>

                <TwoMinuteDrillGame />
            </div>
        </div>
    )
}
