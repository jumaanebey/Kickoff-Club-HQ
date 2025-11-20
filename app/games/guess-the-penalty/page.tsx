import { GuessThePenaltyGame } from '@/components/games/guess-the-penalty'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Guess the Penalty | Kickoff Club HQ',
    description: 'Test your football knowledge! Can you identify the correct penalty in these scenarios?',
}

export default function GuessThePenaltyPage() {
    return (
        <div className="min-h-screen bg-[#004d25] flex flex-col">
            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Referee Training Camp
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Think you know the rules? Read the scenario and throw the flag on the correct penalty.
                    </p>
                </div>

                <GuessThePenaltyGame />
            </div>
        </div>
    )
}
