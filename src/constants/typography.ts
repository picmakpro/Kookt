export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
  
  // Text styles presets
  styles: {
    h1: {
      fontSize: 36,
      fontWeight: 'bold' as const,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: 30,
      fontWeight: 'bold' as const,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.375,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.375,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 1.375,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.25,
    },
  },
} as const;
