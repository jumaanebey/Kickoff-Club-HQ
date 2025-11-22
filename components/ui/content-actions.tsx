'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, Share2, Check, Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@/database/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface ContentActionsProps {
    contentId: string
    contentType: 'course' | 'podcast' | 'lesson'
    contentTitle: string
    contentUrl: string
    className?: string
    variant?: 'default' | 'minimal'
    initialSaved?: boolean
}

export function ContentActions({
    contentId,
    contentType,
    contentTitle,
    contentUrl,
    className,
    variant = 'default',
    initialSaved = false
}: ContentActionsProps) {
    const { colors } = useTheme()
    const { toast } = useToast()
    const [isSaved, setIsSaved] = useState(initialSaved)
    const [isLoading, setIsLoading] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)
    const [savedId, setSavedId] = useState<string | null>(null)

    // Check if content is already saved on mount
    useEffect(() => {
        checkIfSaved()
    }, [contentId])

    const checkIfSaved = async () => {
        try {
            const supabase = createClientComponentClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            const { data, error } = await supabase
                .from('saved_content')
                .select('id')
                .eq('user_id', user.id)
                .eq('content_id', contentId)
                .eq('content_type', contentType)
                .maybeSingle()

            if (error) throw error

            if (data) {
                setIsSaved(true)
                setSavedId(data.id)
            }
        } catch (error) {
            console.error('Error checking saved status:', error)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)

        try {
            const supabase = createClientComponentClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast({
                    title: "Sign in required",
                    description: "Please sign in to save content for later",
                    variant: "destructive"
                })
                setIsLoading(false)
                return
            }

            if (isSaved && savedId) {
                // Unsave
                const { error } = await supabase
                    .from('saved_content')
                    .delete()
                    .eq('id', savedId)

                if (error) throw error

                setIsSaved(false)
                setSavedId(null)

                toast({
                    title: "Removed from saved",
                    description: `${contentTitle} has been removed from your saved items`,
                })
            } else {
                // Save
                const { data, error } = await supabase
                    .from('saved_content')
                    .insert({
                        user_id: user.id,
                        content_id: contentId,
                        content_type: contentType,
                        content_title: contentTitle,
                        content_url: contentUrl
                    })
                    .select('id')
                    .single()

                if (error) throw error

                setIsSaved(true)
                setSavedId(data.id)

                toast({
                    title: "Saved for later",
                    description: `${contentTitle} has been added to your saved items`,
                })
            }
        } catch (error: any) {
            console.error('Error saving content:', error)
            toast({
                title: "Error",
                description: error.message || "Failed to save content",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleShare = async (platform?: string) => {
        const url = typeof window !== 'undefined' ? window.location.origin + contentUrl : contentUrl
        const text = `Check out this ${contentType}: ${contentTitle}`

        // Use native share API on mobile if available
        if (!platform && typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: contentTitle,
                    text: text,
                    url: url
                })
                return
            } catch (err) {
                // User cancelled or share failed, fall back to menu
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err)
                }
            }
        }

        if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(url)
                setCopySuccess(true)
                toast({
                    title: "Link copied!",
                    description: "Share link has been copied to clipboard",
                })
                setTimeout(() => {
                    setCopySuccess(false)
                    setShowShareMenu(false)
                }, 2000)
            } catch (err) {
                console.error('Failed to copy:', err)
                toast({
                    title: "Failed to copy",
                    description: "Please try again",
                    variant: "destructive"
                })
            }
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
            setShowShareMenu(false)
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
            setShowShareMenu(false)
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
            setShowShareMenu(false)
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
            setShowShareMenu(false)
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
                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                            colors.text,
                                            "hover:bg-orange-500/10"
                                        )}
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        <span>Share on LinkedIn</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('whatsapp')}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                            colors.text,
                                            "hover:bg-orange-500/10"
                                        )}
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        <span>Share on WhatsApp</span>
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
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                        colors.text,
                                        "hover:bg-orange-500/10"
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    <span>Share on LinkedIn</span>
                                </button>
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                        colors.text,
                                        "hover:bg-orange-500/10"
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    <span>Share on WhatsApp</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
