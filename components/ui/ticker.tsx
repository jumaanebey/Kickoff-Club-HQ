import { cn } from "@/shared/utils"

interface TickerProps {
    items: string[]
    className?: string
}

export function Ticker({ items, className }: TickerProps) {
    return (
        <div className={cn("bg-yellow-400 text-black overflow-hidden py-2", className)}>
            <div className="flex whitespace-nowrap animate-marquee">
                {/* Duplicate items to create seamless loop */}
                {[...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center mx-4">
                        <span className="font-bold uppercase tracking-wider text-sm">{item}</span>
                        <span className="mx-4 text-black/30">•</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
