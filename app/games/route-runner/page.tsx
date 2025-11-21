import { RouteRunnerGame } from '@/components/games/route-runner'
import { Metadata } from 'next'
import Image from 'next/image'
import { ThemedHeader } from '@/components/layout/themed-header'

export const metadata: Metadata = {
    title: 'Route Runner | Kickoff Club HQ',
    description: 'Master the route tree. Identify the correct path for every play call.',
}

export default function RouteRunnerPage() {
    return (
        <div className="min-h-screen bg-[#431407] flex flex-col relative">
            <ThemedHeader activePage="games" />

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/games/field-turf-bg.png"
                    alt="Turf Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#431407]/90 via-[#431407]/80 to-[#431407]/90" />
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tight mb-4 drop-shadow-md">
                        Route Runner
                    </h1>
                    <p className="text-orange-200 text-lg max-w-2xl mx-auto">
                        The QB calls the route. Can you visualize the path to the endzone?
                    </p>
                </div>

                <RouteRunnerGame />
            </div>
        </div>
    )
}
