'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/database/supabase/client'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface SavedItem {
  id: string
  content_id: string
  content_type: 'course' | 'podcast' | 'lesson'
  content_title: string
  content_url: string
  created_at: string
}

interface SavedCoursesContentProps {
  savedCourses?: any[]
}

export function SavedCoursesContent({ savedCourses }: SavedCoursesContentProps) {
  const { colors } = useTheme()
  const { toast } = useToast()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedItems()
  }, [])

  const fetchSavedItems = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('saved_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setSavedItems(data || [])
    } catch (error) {
      console.error('Error fetching saved items:', error)
      toast({
        title: "Error",
        description: "Failed to load saved items",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: string, title: string) => {
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase
        .from('saved_content')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSavedItems(prev => prev.filter(item => item.id !== id))

      toast({
        title: "Removed",
        description: `${title} has been removed from your saved items`,
      })
    } catch (error) {
      console.error('Error removing item:', error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
      case 'podcast':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30'
      case 'lesson':
        return 'bg-green-500/10 text-green-500 border-green-500/30'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30'
    }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bookmark className="w-8 h-8 text-orange-500" />
          <h1 className={cn("text-3xl md:text-4xl font-black tracking-tight", colors.text)}>
            Saved Items
          </h1>
        </div>
        <p className={cn("text-base md:text-lg", colors.textSecondary)}>
          Your bookmarked courses, podcasts, and lessons
        </p>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className={cn("mt-4", colors.textMuted)}>Loading...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-card/50"
        >
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No saved items yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start saving courses, podcasts, and lessons to access them quickly later.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {savedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn("group hover:border-orange-500/50 transition-all h-full", colors.card, colors.cardBorder)}>
                  <CardContent className="p-4 md:p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={cn("uppercase text-xs border", getTypeColor(item.content_type))}>
                        {item.content_type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleRemove(item.id, item.content_title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className={cn("text-base md:text-lg font-bold mb-2 line-clamp-2 flex-grow", colors.text)}>
                      {item.content_title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>Saved {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-foreground text-background hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <Link href={item.content_url}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Stats */}
      {!loading && savedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <p className={cn("text-sm", colors.textMuted)}>
            {savedItems.length} saved item{savedItems.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}
    </div>
  )
}
