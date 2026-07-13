export const palette = {
  primary: '#0f8a58',
  primaryLight: '#1aa76c',
  primaryDark: '#0d4832',
  accent: '#ff6b00',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

export const lightColors = {
  background: '#f5f7f6',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#12181a',
  textMuted: '#5b6664',
  border: '#e5e9e7',
  ...palette,
};

export const darkColors = {
  background: '#0b0f10',
  surface: '#151c1d',
  card: '#1b2325',
  text: '#f2f6f4',
  textMuted: '#9fb0ac',
  border: '#243030',
  ...palette,
};

export type AppColors = typeof lightColors;
