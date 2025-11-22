'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { ArrowLeft, Construction } from 'lucide-react'
import Link from 'next/link'
import { ThemedHeader } from '@/components/layout/themed-header'

export default function ComingSoonPage() {
    const { colors } = useTheme()

    return (
        <div className={cn("min-h-screen flex flex-col", colors.bg)}>
            <ThemedHeader />
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className={cn("max-w-md w-full p-8 text-center border-2", colors.card, colors.cardBorder)}>
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Construction className="w-10 h-10 text-orange-500" />
                    </div>
                    <h1 className={cn("text-3xl font-black mb-4 font-heading uppercase", colors.text)}>
                        Coming Soon
                    </h1>
                    <p className={cn("text-lg mb-8 leading-relaxed", colors.textMuted)}>
                        We're still drawing up this play! Check back later for updates.
                    </p>
                    <Button asChild className="w-full h-12 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href="/">
                            <ArrowLeft className="mr-2 w-5 h-5" />
                            Back to Home
                        </Link>
                    </Button>
                </Card>
            </main>
        </div>
    )
}
