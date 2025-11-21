'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, Share2, Check } from 'lucide-react'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { motion, AnimatePresence } from 'framer-motion'

interface ContentActionsProps {
    contentId: string
    contentType: 'course' | 'podcast'
    contentTitle: string
    contentUrl: string
    className?: string
    variant?: 'default' | 'minimal'
}

export function ContentActions({
    contentId,
    contentType,
    contentTitle,
    contentUrl,
    className,
    variant = 'default'
}: ContentActionsProps) {
    const { colors } = useTheme()
    const [isSaved, setIsSaved] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)

    const handleSave = async () => {
        // TODO: Implement actual save to database
        setIsSaved(!isSaved)

        // Show toast notification (optional)
        if (!isSaved) {
            console.log(`Saved ${contentType}: ${contentTitle}`)
        }
    }

    const handleShare = async (platform?: string) => {
        const url = typeof window !== 'undefined' ? window.location.origin + contentUrl : contentUrl
        const text = `Check out this ${contentType}: ${contentTitle}`

        if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(url)
                setCopySuccess(true)
                setTimeout(() => {
                    setCopySuccess(false)
                    setShowShareMenu(false)
                }, 2000)
            } catch (err) {
                console.error('Failed to copy:', err)
            }
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        } else {
            // Toggle share menu
            setShowShareMenu(!showShareMenu)
        }
    }

    if (variant === 'minimal') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        isSaved ? "text-orange-500 bg-orange-500/10" : "hover:bg-orange-500/10"
                    )}
                    aria-label={isSaved ? "Remove from saved" : "Save for later"}
                >
                    <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                </Button>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare()}
                        className="h-8 w-8 rounded-full hover:bg-orange-500/10"
                        aria-label="Share"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>

                    <AnimatePresence>
                        {showShareMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className={cn(
                                    "absolute right-0 top-full mt-2 p-2 rounded-lg shadow-lg border z-50 min-w-[160px]",
                                    colors.card,
                                    colors.cardBorder
                                )}
                            >
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleShare('copy')}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                            colors.text,
                                            "hover:bg-orange-500/10"
                                        )}
                                    >
                                        {copySuccess ? (
                                            <>
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Share2 className="h-4 w-4" />
                                                <span>Copy Link</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                            colors.text,
                                            "hover:bg-orange-500/10"
                                        )}
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        <span>Share on X</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                            colors.text,
                                            "hover:bg-orange-500/10"
                                        )}
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Share on Facebook</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={cn(
                    "transition-all",
                    isSaved && "border-orange-500 bg-orange-500/10 text-orange-500"
                )}
            >
                <Bookmark className={cn("mr-2 h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? 'Saved' : 'Save for Later'}
            </Button>

            <div className="relative">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare()}
                >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>

                <AnimatePresence>
                    {showShareMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className={cn(
                                "absolute right-0 top-full mt-2 p-2 rounded-lg shadow-lg border z-50 min-w-[180px]",
                                colors.card,
                                colors.cardBorder
                            )}
                        >
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => handleShare('copy')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                        colors.text,
                                        "hover:bg-orange-500/10"
                                    )}
                                >
                                    {copySuccess ? (
                                        <>
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>Link Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-4 w-4" />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                        colors.text,
                                        "hover:bg-orange-500/10"
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    <span>Share on X</span>
                                </button>
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                        colors.text,
                                        "hover:bg-orange-500/10"
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span>Share on Facebook</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
