'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { themes, ThemeColors } from '@/shared/themes'

interface ThemeContextType {
  theme: 'light'
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode}) {
  // Always use light theme
  const colors = useMemo(() => themes.light, [])

  const value = useMemo(() => ({ theme: 'light' as const, colors }), [colors])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
