import { Fonts, Metrics, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) => {
  const maxWidth = isTablet ? 560 : 400;
  const titleFontSize = isTablet ? 30 : 24;
  const messageFontSize = isTablet ? 22 : 18;
  const padding = isTablet ? Spacing.five : Spacing.four;

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isTablet ? Spacing.five : Spacing.four,
    },
    container: {
      width: '100%',
      maxWidth,
      position: 'relative',
    },
    shadow: {
      position: 'absolute',
      top: Metrics.shadowOffset,
      left: Metrics.shadowOffset,
      right: -Metrics.shadowOffset,
      bottom: -Metrics.shadowOffset,
      borderRadius: Metrics.radiusCard,
    },
    content: {
      borderWidth: Metrics.borderWidth,
      borderRadius: Metrics.radiusCard,
      padding,
      zIndex: 1,
    },
    title: {
      fontFamily: Fonts.heading,
      fontSize: titleFontSize,
      marginBottom: Spacing.two,
    },
    message: {
      fontFamily: Fonts.body,
      fontSize: messageFontSize,
      marginBottom: Spacing.four,
      lineHeight: isTablet ? 28 : 24,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.two,
    },
    button: {
      flex: 1,
    },
  });
};
