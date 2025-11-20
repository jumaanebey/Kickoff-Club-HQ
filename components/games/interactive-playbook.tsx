'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/shared/utils'

interface PlayerToken {
    id: string
    type: 'O' | 'X'
    label: string
    initialX: number
    initialY: number
}

const FORMATIONS = [
    {
        name: "Shotgun Formation",
        description: "The Quarterback (QB) stands 5-7 yards behind the Center (C). Great for passing plays.",
        setup: [
            { id: 'c', type: 'O', label: 'C', x: 50, y: 50 }, // Center
            { id: 'lg', type: 'O', label: 'LG', x: 40, y: 50 },
            { id: 'rg', type: 'O', label: 'RG', x: 60, y: 50 },
            { id: 'lt', type: 'O', label: 'LT', x: 30, y: 50 },
            { id: 'rt', type: 'O', label: 'RT', x: 70, y: 50 },
            { id: 'qb', type: 'O', label: 'QB', x: 50, y: 75 }, // QB back
            { id: 'rb', type: 'O', label: 'RB', x: 65, y: 75 }, // RB side
            { id: 'wr1', type: 'O', label: 'WR', x: 10, y: 50 },
            { id: 'wr2', type: 'O', label: 'WR', x: 90, y: 50 },
        ]
    }
]

export function InteractivePlaybook() {
    const [formation, setFormation] = useState(FORMATIONS[0])
    const [resetKey, setResetKey] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleReset = () => {
        setResetKey(prev => prev + 1)
    }

    return (
        <Card className="p-6 bg-[#004d25] border-4 border-white/10 shadow-2xl overflow-hidden relative min-h-[500px]">
            {/* Chalkboard Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                }}>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-heading text-white uppercase tracking-wider">{formation.name}</h3>
                        <p className="text-white/80 text-sm max-w-md">{formation.description}</p>
                    </div>
                    <Button onClick={handleReset} size="sm" variant="secondary" className="bg-yellow-400 text-black hover:bg-yellow-500">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset Play
                    </Button>
                </div>

                {/* Field Area */}
                <div ref={containerRef} className="flex-grow bg-white/5 rounded-xl border-2 border-dashed border-white/20 relative min-h-[300px] mx-auto w-full max-w-2xl">
                    {/* Line of Scrimmage */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400/50 w-full flex items-center justify-center">
                        <span className="bg-[#004d25] px-2 text-[10px] text-blue-300 uppercase tracking-widest">Line of Scrimmage</span>
                    </div>

                    {/* Draggable Tokens */}
                    {formation.setup.map((player, index) => (
                        <motion.div
                            key={`${player.id}-${resetKey}`}
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.1}
                            dragMomentum={false}
                            initial={{
                                x: (index * 40) + 20, // Start lined up at top for user to drag
                                y: 20
                            }}
                            whileHover={{ scale: 1.1, cursor: 'grab' }}
                            whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 50 }}
                            className={cn(
                                "absolute w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-lg",
                                player.type === 'O' ? "bg-white text-black border-gray-300" : "bg-red-500 text-white border-red-700"
                            )}
                        >
                            {player.label}
                        </motion.div>
                    ))}

                    {/* Target Hints (Ghost Tokens) - Optional, to show where they SHOULD go */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        {formation.setup.map((player) => (
                            <div
                                key={`ghost-${player.id}`}
                                className="absolute w-10 h-10 rounded-full border-2 border-dashed border-white flex items-center justify-center text-[10px] text-white"
                                style={{
                                    left: `${player.x}%`,
                                    top: `${player.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {player.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 text-center text-white/60 text-sm italic">
                    Drag the players to their correct positions (outlined).
                </div>
            </div>
        </Card>
    )
}
