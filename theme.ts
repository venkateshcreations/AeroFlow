export const theme = {
  primary:      '#0F4C8A',
  primaryLight: '#1A6FBF',
  accent:       '#00C2A8',
  accentLight:  '#00E5C8',
  sky:          '#E8F4FD',
  dark:         '#0A1628',
  darkMid:      '#1C2E4A',
  mid:          '#3D5A80',
  light:        '#F0F6FF',
  white:        '#FFFFFF',
  text:         '#0A1628',
  textMid:      '#4A6080',
  textLight:    '#8A9BB0',
  warn:         '#FF6B35',
  success:      '#00B894',
  danger:       '#E84393',
  gold:         '#FFB800',
} as const;

export type ThemeColor = keyof typeof theme;
