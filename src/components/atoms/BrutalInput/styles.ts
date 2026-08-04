import { Fonts, Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) =>
  StyleSheet.create({
    shadowWrapper: {
      position: 'relative',
      width: '100%',
      marginBottom: isTablet ? Metrics.shadowOffset * 1.25 : Metrics.shadowOffset,
      marginRight: isTablet ? Metrics.shadowOffset * 1.25 : Metrics.shadowOffset,
    },
    shadowBackground: {
      position: 'absolute',
      top: Metrics.shadowOffset,
      left: Metrics.shadowOffset,
      right: -Metrics.shadowOffset,
      bottom: -Metrics.shadowOffset,
      borderRadius: Metrics.radiusButton,
      zIndex: 1,
    },
    inputFront: {
      zIndex: 2,
      borderWidth: Metrics.borderWidth,
      borderRadius: Metrics.radiusButton,
      height: isTablet ? 60 : Metrics.touchTargetMin,
      paddingHorizontal: isTablet ? 20 : 16,
      fontSize: isTablet ? 18 : 16,
      fontFamily: Fonts.body,
      fontWeight: '500',
    },
  });
