import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { View } from 'react-native';
import { ThemedViewProps } from './types';

export const ThemedView: React.FC<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}) => {
  const theme = useTheme();

  return (
    <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />
  );
};

export * from './types';
export default ThemedView;
