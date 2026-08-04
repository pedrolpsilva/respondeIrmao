export type ColorblindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export interface AppSettings {
  soundEnabled: boolean;
  darkMode: boolean;
  colorblindMode: boolean;
  colorblindType: ColorblindType;
  isProMode: boolean;
}

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent1: string;
  accent2: string;
  warning: string;
  purple: string;
  border: string;
  error: string;
  accent: string;
  backgroundElement: string;
  backgroundSelected: string;
  textSecondary: string;
}
