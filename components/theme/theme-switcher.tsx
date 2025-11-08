'use client'

import { Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from './theme-provider'
import { cn } from '@/lib/utils'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  const themes = [
    { id: 'light' as const, icon: Sun, label: 'Light' },
    { id: 'dark' as const, icon: Moon, label: 'Dark' },
    { id: 'glam' as const, icon: Sparkles, label: 'Glam' },
  ]

  return (
    <div className={cn(
      "flex items-center gap-1 p-1 rounded-lg backdrop-blur-xl border",
      isLight ? "bg-gray-100 border-gray-200" : "bg-white/5 border-white/10"
    )}>
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            theme === id
              ? "bg-orange-500 text-white shadow-lg"
              : isLight
                ? "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                : "text-white/70 hover:text-white hover:bg-white/10"
          )}
          aria-label={`Switch to ${label} theme`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
