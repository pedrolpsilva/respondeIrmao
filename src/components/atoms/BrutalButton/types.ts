import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type BrutalButtonVariant = 'primary' | 'secondary' | 'accent1' | 'accent2' | 'surface' | 'purple';
export type BrutalButtonSize = 'small' | 'medium' | 'large';

export interface BrutalButtonProps {
  children: React.ReactNode | string;
  onPress?: () => void;
  variant?: BrutalButtonVariant;
  size?: BrutalButtonSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  analyticsEventName?: string;
  analyticsParams?: Record<string, any>;
}
