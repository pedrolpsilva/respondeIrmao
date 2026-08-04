import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface BaseLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}
