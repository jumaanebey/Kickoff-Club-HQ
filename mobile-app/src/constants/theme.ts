// Dark theme colors (default)
const DARK_COLORS = {
  primary: '#FF6A00', // Orange - main energy color (matches website)
  primaryDark: '#E65F00',
  primaryLight: '#FF8533',

  secondary: '#1F6A3E', // Forest green (matches website)
  secondaryDark: '#164D2E',
  secondaryLight: '#2A8050',

  accent: '#FFB84D', // Gold for coins
  accentDark: '#FF9500',

  background: '#0A0A0A', // Almost black for drama
  backgroundLight: '#1A1A1A',
  backgroundCard: '#252525',

  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#6B7280',

  success: '#2A8050',
  error: '#EF4444',
  warning: '#FF6A00',

  border: '#333333',

  white: '#FFFFFF',
  black: '#000000',
};

// Light theme colors
const LIGHT_COLORS = {
  primary: '#FF6A00', // Orange - main energy color (matches website)
  primaryDark: '#E65F00',
  primaryLight: '#FF8533',

  secondary: '#1F6A3E', // Forest green (matches website)
  secondaryDark: '#164D2E',
  secondaryLight: '#2A8050',

  accent: '#FFB84D', // Gold for coins
  accentDark: '#FF9500',

  background: '#F5F5F5', // Light gray background
  backgroundLight: '#FFFFFF',
  backgroundCard: '#FFFFFF',

  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  success: '#2A8050',
  error: '#EF4444',
  warning: '#FF6A00',

  border: '#E5E7EB',

  white: '#FFFFFF',
  black: '#000000',
};

// Default to dark theme (exported for backwards compatibility)
export const COLORS = DARK_COLORS;

// Theme getter function for dynamic theming
export const getColors = (isDarkMode: boolean) => isDarkMode ? DARK_COLORS : LIGHT_COLORS;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 28,
    xxxl: 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadow presets for depth
export const SHADOWS = {
  sm: {
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};
