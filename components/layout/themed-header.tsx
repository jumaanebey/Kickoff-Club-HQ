'use client'

import Link from 'next/link'
import { cn } from '@/shared/utils'
import { useTheme } from '@/components/theme/theme-provider'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Ticker } from '@/components/ui/ticker'
import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { createClientComponentClient } from '@/database/supabase/client'
import { User } from '@supabase/supabase-js'
import { ChevronDown, User as UserIcon, Settings, LogOut, LayoutDashboard, Volume2, VolumeX } from 'lucide-react'

interface ThemedHeaderProps {
  activePage?: 'home' | 'courses' | 'podcast' | 'pricing' | 'contact' | 'games' | 'hq'
  showTicker?: boolean
}

const TICKER_ITEMS = [
  "🏈 Watch 3 Free Video Lessons",
  "🎙️ Kickoff Club Podcast - New Episodes Weekly",
  "🎮 Play Blitz Rush - Beat Your High Score",
  "📚 Football Fundamentals 101 - Now Available",
  "🔥 Join the Club - Start Learning Free"
]

const supabaseClient = createClientComponentClient()

export const ThemedHeader = memo(function ThemedHeader({ activePage, showTicker = true }: ThemedHeaderProps) {
  const { colors } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    setIsMuted(localStorage.getItem('game_sound_muted') === 'true')
  }, [])

  useEffect(() => {
    // Get current user
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabaseClient.auth.signOut()
    window.location.href = '/'
  }, [])

  const toggleUserMenu = useCallback(() => setShowUserMenu(prev => !prev), [])
  const closeUserMenu = useCallback(() => setShowUserMenu(false), [])

  const username = useMemo(() => user?.email?.split('@')[0], [user?.email])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-md",
      colors.headerBg,
      colors.headerBorder
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className={cn("text-2xl font-black font-heading uppercase tracking-tight", colors.headerLogo)}>
            Kickoff Club HQ
          </span>
        </Link>
        <div className="flex items-center gap-10">
          <nav className={cn("flex items-center gap-6", colors.headerText)}>
            <Link
              href="/"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'home' && "text-orange-500 font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'courses' && "text-orange-500 font-medium"
              )}
            >
              Courses
            </Link>
            <Link
              href="/podcast"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'podcast' && "text-orange-500 font-medium"
              )}
            >
              Podcast
            </Link>
            <Link
              href="/games"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'games' && "text-orange-500 font-medium"
              )}
            >
              Games
            </Link>
            <Link
              href="/hq"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'hq' && "text-orange-500 font-medium"
              )}
            >
              My HQ
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "hover:text-orange-500 transition-colors",
                activePage === 'pricing' && "text-orange-500 font-medium"
              )}
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    colors.headerText,
                    "hover:bg-white/10 dark:hover:bg-white/10"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", colors.primary)}>
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={closeUserMenu}
                    />
                    <div className={cn(
                      "absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50",
                      colors.bgSecondary,
                      colors.cardBorder
                    )}>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 transition-colors",
                            colors.text,
                            "hover:bg-orange-500/10"
                          )}
                          onClick={closeUserMenu}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/thumbnails"
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 transition-colors",
                            colors.text,
                            "hover:bg-orange-500/10"
                          )}
                          onClick={closeUserMenu}
                        >
                          <span className="w-4 h-4 flex items-center justify-center text-lg">✨</span>
                          Thumbnail Gen
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 transition-colors",
                            colors.text,
                            "hover:bg-orange-500/10"
                          )}
                          onClick={closeUserMenu}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <hr className={cn("my-2", colors.cardBorder)} />
                        <button
                          onClick={handleSignOut}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2 transition-colors text-red-500",
                            "hover:bg-red-500/10"
                          )}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  colors.headerText,
                  "hover:bg-white/10 dark:hover:bg-white/10"
                )}
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => {
                const newState = !isMuted
                setIsMuted(newState)
                localStorage.setItem('game_sound_muted', String(newState))
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                colors.headerText,
                "hover:bg-white/10 dark:hover:bg-white/10"
              )}
              title={isMuted ? "Unmute Game Sounds" : "Mute Game Sounds"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      {showTicker && <Ticker items={TICKER_ITEMS} />}
    </header>
  )
})
