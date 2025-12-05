'use client'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { cn } from "@/shared/utils"

interface CoachsCornerProps {
    term: string
    definition: string
    children: React.ReactNode
    videoUrl?: string
}

export function CoachsCorner({ term, definition, children, videoUrl }: CoachsCornerProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b-2 border-dashed border-yellow-400 decoration-none hover:bg-yellow-400/20 transition-colors rounded px-1 -mx-1">
                        {children}
                        <span className="sr-only"> (Definition available)</span>
                    </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-0 overflow-hidden border-2 border-black/10 shadow-xl bg-white dark:bg-gray-900">
                    <div className="bg-[#004d25] p-3 flex items-center gap-2">
                        <div className="bg-yellow-400 rounded-full p-1">
                            <Info className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-heading text-white uppercase tracking-wider font-bold">Coach's Corner</span>
                    </div>

                    {videoUrl && (
                        <div className="aspect-video w-full bg-black">
                            {/* Placeholder for video/gif - using a colored div for now if no URL provided, or iframe if provided */}
                            <iframe
                                src={videoUrl}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <div className="p-4">
                        <h4 className="font-bold text-lg mb-1 text-orange-600 dark:text-orange-400">{term}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {definition}
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
