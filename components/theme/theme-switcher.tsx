'use client'

import { Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from './theme-provider'
import { cn } from '@/lib/utils'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: 'light' as const, icon: Sun, label: 'Light' },
    { id: 'dark' as const, icon: Moon, label: 'Dark' },
    { id: 'glam' as const, icon: Sparkles, label: 'Glam' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10">
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            theme === id
              ? "bg-orange-500 text-white shadow-lg"
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
