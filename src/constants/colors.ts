export const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Vert principal MrCook
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  accent: {
    orange: {
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
    },
    blue: {
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
    },
    red: {
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
    },
    yellow: {
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
    },
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = typeof colors[ColorKey];
