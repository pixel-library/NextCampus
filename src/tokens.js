/**
 * NextCampus Design System Tokens
 * Institutional Palette: Forest & Intelligent Green
 */

export const colors = {
  // Brand
  brandForest: '#142D28',
  brandPrimary: '#168567',
  brandPrimaryHover: '#0F6B52',
  brandSoft: '#EAF5EF',
  brandSoftBorder: '#CBE2D4',

  // Surfaces & Canvas
  canvas: '#F6F8F6',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0F4F1',
  surfaceMuted: '#E8EFEA',

  // Typography
  textPrimary: '#202A27',
  textSecondary: '#65736B',
  textMuted: '#87968D',
  textPlaceholder: '#A3B0A8',
  textInverse: '#FFFFFF',

  // Borders
  borderSubtle: '#E4EAE5',
  borderInteractive: '#D0DAD2',
  borderFocus: '#168567',

  // Semantic
  warning: '#B7791F',
  warningBg: '#FEF8EC',
  warningBorder: '#F6E3B8',

  danger: '#C43D4B',
  dangerBg: '#FDF2F3',
  dangerBorder: '#FACBD0',

  info: '#3478B8',
  infoBg: '#EEF5FA',
  infoBorder: '#C9DFEE',

  success: '#168567',
  successBg: '#EAF5EF',
  successBorder: '#CBE2D4',
};

export const typography = {
  fontHeading: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  fontBody: "'Inter', system-ui, -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

export const radii = {
  xs: '6px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '14px',
  '2xl': '18px',
  pill: '9999px',
};

export const shadows = {
  xs: '0 1px 2px 0 rgba(20, 45, 40, 0.03)',
  sm: '0 1px 3px 0 rgba(20, 45, 40, 0.05), 0 1px 2px -1px rgba(20, 45, 40, 0.03)',
  md: '0 4px 12px -2px rgba(20, 45, 40, 0.06), 0 2px 4px -2px rgba(20, 45, 40, 0.03)',
  lg: '0 12px 28px -4px rgba(20, 45, 40, 0.08), 0 4px 10px -4px rgba(20, 45, 40, 0.03)',
};

export default {
  colors,
  typography,
  radii,
  shadows,
};
