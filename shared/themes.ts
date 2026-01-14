export type Theme = 'light'

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
    // Light Theme (White/Gray + Orange)
    // Backgrounds
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-gray-100',

    // Cards
    card: 'bg-white border-gray-200',
    cardHover: 'hover:border-orange-300 hover:shadow-lg',
    cardBorder: 'border-gray-200',

    // Text
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-400',

    // Primary/Accent (Orange)
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryText: 'text-white',

    // Inputs
    input: 'bg-white border',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-900',
    inputPlaceholder: 'placeholder:text-gray-400',

    // Badges
    badge: 'bg-orange-500',
    badgeBorder: 'border-orange-500',
    badgeText: 'text-white',

    // Links
    link: 'text-orange-500',
    linkHover: 'hover:text-orange-600',

    // Header
    headerBg: 'bg-white border-b',
    headerBorder: 'border-gray-200',
    headerText: 'text-gray-600',
    headerLogo: 'text-gray-900',
  },
}
