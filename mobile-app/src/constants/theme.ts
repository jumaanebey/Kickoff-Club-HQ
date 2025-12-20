export const COLORS = {
  // Brand Colors - Cozy & Warm
  primary: '#FF8A8A', // Coral Pink (Warm, friendly energy)
  primaryDark: '#E57373',
  primaryLight: '#FFB2B2',

  secondary: '#81C784', // Soft Mint/Leaf Green (Nature, growth)
  secondaryDark: '#66BB6A',
  secondaryLight: '#A5D6A7',

  accent: '#FFD54F', // Sunny Gold/Macaroni (Coins, rewards)
  accentDark: '#FFC107',

  // Backgrounds - Light & Airy
  background: '#FFF8E1', // Cream/Warm Vanilla (Not harsh white)
  backgroundLight: '#FFFFFF', // Clean White for cards
  backgroundCard: '#FFFFFF',

  // Text - Soft Contrast
  text: '#4E342E', // Dark Brown (Softer than black)
  textSecondary: '#8D6E63', // Medium Brown
  textMuted: '#BCAAA4', // Light Brown/Beige

  // Functional
  success: '#81C784', // Mint
  error: '#E57373',   // Soft Red
  warning: '#FFD54F', // Sunny Gold

  border: '#F5E6CC',  // Sand color

  white: '#FFFFFF',
  black: '#3E2723',   // Deepest Brown
};

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
  large: {
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  xlarge: {
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Dark mode color palette
const DARK_COLORS = {
  primary: '#FF8A8A',
  primaryDark: '#E57373',
  primaryLight: '#FFB2B2',
  secondary: '#81C784',
  secondaryDark: '#66BB6A',
  secondaryLight: '#A5D6A7',
  accent: '#FFD54F',
  accentDark: '#FFC107',
  background: '#1A1A2E',
  backgroundLight: '#16213E',
  backgroundCard: '#1F2544',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
  success: '#81C784',
  error: '#E57373',
  warning: '#FFD54F',
  border: '#2A2A4A',
  white: '#FFFFFF',
  black: '#000000',
};

// Light mode color palette
const LIGHT_COLORS = {
  ...COLORS,
};

// Function to get colors based on dark mode
export const getColors = (isDarkMode: boolean = true) => {
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};
