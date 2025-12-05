import { cn } from '@/shared/utils'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

interface TicketPricingCardProps {
    title: string
    price: string
    period: string
    description: string
    features: string[]
    ctaText: string
    ctaLink: string
    popular?: boolean
    variant?: 'default' | 'premium' | 'outline'
}

export function TicketPricingCard({
    title,
    price,
    period,
    description,
    features,
    ctaText,
    ctaLink,
    popular,
    variant = 'default'
}: TicketPricingCardProps) {
    const isPremium = variant === 'premium'

    return (
        <div className={cn(
            "relative flex flex-col rounded-3xl overflow-hidden transition-transform hover:-translate-y-1 duration-300",
            isPremium ? "shadow-[0_0_40px_rgba(251,146,60,0.2)]" : "shadow-xl"
        )}>
            {/* Ticket Stub (Top/Left) */}
            <div className={cn(
                "p-8 relative z-10",
                isPremium
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                    : "bg-white dark:bg-white/10 text-slate-900 dark:text-white"
            )}>
                {popular && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider px-2 py-1 rounded-sm transform rotate-3">
                        Best Value
                    </div>
                )}

                <h3 className="text-2xl font-heading uppercase tracking-wide mb-2">{title}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black">{price}</span>
                    <span className={cn("text-sm font-medium", isPremium ? "text-orange-100" : "text-slate-500 dark:text-slate-400")}>
                        /{period}
                    </span>
                </div>
                <p className={cn("text-sm", isPremium ? "text-orange-100" : "text-slate-500 dark:text-slate-400")}>
                    {description}
                </p>

                {/* Perforation Line */}
                <div className="absolute bottom-0 left-0 right-0 h-4 translate-y-1/2 z-20 flex justify-between items-center px-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={cn(
                            "w-2 h-2 rounded-full",
                            "bg-[#0f172a]" // Matches the background color of the page (slate-900)
                        )} />
                    ))}
                </div>
            </div>

            {/* Ticket Body (Bottom/Right) */}
            <div className={cn(
                "flex-1 p-8 pt-10 relative",
                isPremium
                    ? "bg-orange-50/10 dark:bg-orange-900/10 border-x border-b border-orange-500/30"
                    : "bg-slate-50 dark:bg-white/5 border-x border-b border-white/10"
            )}>
                <ul className="space-y-4 mb-8">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            <Check className={cn(
                                "w-5 h-5 shrink-0",
                                isPremium ? "text-orange-500" : "text-green-500"
                            )} />
                            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    asChild
                    className={cn(
                        "w-full h-12 font-bold uppercase tracking-wide",
                        isPremium
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
                    )}
                >
                    <Link href={ctaLink}>{ctaText}</Link>
                </Button>

                {/* Barcode Decoration */}
                <div className="mt-6 opacity-20 flex justify-between items-end h-8">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-current w-1"
                            style={{
                                height: `${Math.random() * 100}%`,
                                width: `${Math.random() * 4 + 1}px`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
