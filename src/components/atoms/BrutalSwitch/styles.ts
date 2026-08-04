import { Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) => {
  const scale = isTablet ? 1.2 : 1;
  const width = Math.round(64 * scale);
  const height = Math.round(36 * scale);
  const thumbSize = Math.round(24 * scale);

  return StyleSheet.create({
    container: {
      width,
      height,
      position: 'relative',
    },
    shadowBackground: {
      position: 'absolute',
      top: 3,
      left: 3,
      right: -3,
      bottom: -3,
      borderRadius: Math.round(20 * scale),
      zIndex: 1,
    },
    track: {
      zIndex: 2,
      flex: 1,
      borderRadius: Math.round(20 * scale),
      borderWidth: Metrics.borderWidth,
      padding: 3,
      justifyContent: 'center',
    },
    thumb: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: Math.round(thumbSize / 2),
      borderWidth: 2,
    },
  });
};
