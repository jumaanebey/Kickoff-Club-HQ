'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'
import { cn } from '@/shared/utils'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className={cn(
        "p-2 rounded-lg transition-colors hover:bg-accent",
        "border border-transparent hover:border-border"
      )}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {isLight ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}
