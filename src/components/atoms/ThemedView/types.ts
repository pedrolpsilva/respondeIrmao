import { ThemeColor } from '@/constants/theme';
import { ComponentProps } from 'react';
import { View } from 'react-native';

export type ThemedViewProps = ComponentProps<typeof View> & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};
