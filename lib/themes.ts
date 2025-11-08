export type Theme = 'light' | 'dark'

export interface ThemeColors {
  // Backgrounds
  bg: string
  bgSecondary: string
  bgTertiary: string

  // Cards
  card: string
  cardHover: string
  cardBorder: string

  // Text
  text: string
  textSecondary: string
  textMuted: string

  // Primary/Accent colors
  primary: string
  primaryHover: string
  primaryText: string

  // Inputs
  input: string
  inputBorder: string
  inputText: string
  inputPlaceholder: string

  // Badges
  badge: string
  badgeBorder: string
  badgeText: string

  // Links
  link: string
  linkHover: string

  // Header
  headerBg: string
  headerBorder: string
  headerText: string
  headerLogo: string
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    // Backgrounds
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-gray-100',

    // Cards
    card: 'bg-white border-gray-200 shadow-sm',
    cardHover: 'hover:bg-gray-50 hover:shadow-md',
    cardBorder: 'border-gray-200',

    // Text
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',

    // Primary/Accent
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryText: 'text-white',

    // Inputs
    input: 'bg-white border',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-900',
    inputPlaceholder: 'placeholder:text-gray-400',

    // Badges
    badge: 'bg-orange-50 border',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',

    // Links
    link: 'text-orange-600',
    linkHover: 'hover:text-orange-700',

    // Header
    headerBg: 'bg-white/95 backdrop-blur-sm',
    headerBorder: 'border-gray-200',
    headerText: 'text-gray-700',
    headerLogo: 'text-orange-600',
  },

  dark: {
    // Backgrounds
    bg: 'bg-[#0A0A0A]',
    bgSecondary: 'bg-white/5',
    bgTertiary: 'bg-white/10',

    // Cards
    card: 'bg-white/5 backdrop-blur-xl border-white/10',
    cardHover: 'hover:bg-white/10',
    cardBorder: 'border-white/10',

    // Text
    text: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/60',

    // Primary/Accent
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryText: 'text-white',

    // Inputs
    input: 'bg-white/10 backdrop-blur-xl',
    inputBorder: 'border-white/20',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder:text-white/50',

    // Badges
    badge: 'bg-white/10',
    badgeBorder: 'border-white/20',
    badgeText: 'text-white',

    // Links
    link: 'text-orange-400',
    linkHover: 'hover:text-orange-500',

    // Header
    headerBg: 'bg-[#0A0A0A]/80 backdrop-blur-xl',
    headerBorder: 'border-white/10',
    headerText: 'text-white/80',
    headerLogo: 'text-white',
  },

}
