import { Fonts, Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) =>
  StyleSheet.create({
    shadowWrapper: {
      position: 'relative',
      marginBottom: isTablet ? Metrics.shadowOffset * 1.25 : Metrics.shadowOffset,
      marginRight: isTablet ? Metrics.shadowOffset * 1.25 : Metrics.shadowOffset,
    },
    fullWidth: {
      width: '100%',
      alignSelf: 'stretch',
    },
    shadowBackground: {
      position: 'absolute',
      top: Metrics.shadowOffset,
      left: Metrics.shadowOffset,
      right: -Metrics.shadowOffset,
      bottom: -Metrics.shadowOffset,
      zIndex: 1,
    },
    buttonFront: {
      zIndex: 2,
      borderWidth: Metrics.borderWidth,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonText: {
      fontFamily: Fonts.subheading,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
