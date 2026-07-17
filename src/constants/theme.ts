import { Platform } from 'react-native';

export const Colors = {
  primary: '#2959F8',
  background: '#FEFCE8',
  surface: '#FFFFFF',
  text: '#1C1917',
  muted: '#A8A29E',
  accent1: '#4D7C0F', // Verde / Destaques Positivos
  accent2: '#BE123C', // Rosa / Ações Destrutivas/Timer
  warning: '#F59E0B',
  purple: '#7C3AED', // Roxo para o modo Quem Sou Eu
  border: '#1C1917',
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#2959F8',
  textSecondary: '#A8A29E',
} as const;

export type ThemeColor = keyof typeof Colors;

export const Fonts = {
  heading: 'Outfit_800ExtraBold',
  subheading: 'Outfit_700Bold',
  body: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'Courier' })!,
};

export const Metrics = {
  borderWidth: 3,
  shadowOffset: 4,
  radiusCard: 16,
  radiusButton: 12,
  radiusXl: 24,
  buttonHeight: 64,
  touchTargetMin: 56,
  containerMargin: 24,
  gap: 16,
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 500;
export const MaxContentWidthTablet = 900;
export const TabletBreakpoint = 768;
