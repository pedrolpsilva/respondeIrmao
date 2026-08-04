import { Fonts, Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) => {
  const containerHeight = isTablet ? 84 : 70;
  const backBtnSize = isTablet ? 52 : 44;
  const titleFontSize = isTablet ? 28 : 22;
  const titleTransFontSize = isTablet ? 34 : 28;

  return StyleSheet.create({
    container: {
      height: containerHeight,
      marginBottom: isTablet ? 24 : 20,
      position: 'relative',
    },
    containerTransparent: {
      height: isTablet ? 72 : 60,
      marginBottom: isTablet ? 16 : 10,
    },
    shadow: {
      position: 'absolute',
      top: 6,
      left: 6,
      right: -6,
      bottom: -6,
      borderBottomLeftRadius: Metrics.radiusXl,
      borderBottomRightRadius: Metrics.radiusXl,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: Metrics.borderWidth,
      borderBottomLeftRadius: Metrics.radiusXl,
      borderBottomRightRadius: Metrics.radiusXl,
      paddingHorizontal: isTablet ? 24 : 16,
    },
    contentTransparent: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      paddingHorizontal: 0,
    },
    backButton: {
      width: backBtnSize,
      height: backBtnSize,
      borderRadius: 8,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: isTablet ? 16 : 12,
    },
    finish: {
      width: isTablet ? 110 : 90,
      height: isTablet ? 54 : 48,
      borderRadius: 4,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    title: {
      fontFamily: Fonts.heading,
      fontSize: titleFontSize,
      flex: 1,
    },
    titleTransparent: {
      fontSize: titleTransFontSize,
      letterSpacing: -1,
    },
    buttonText: {
      fontFamily: Fonts.subheading,
      fontWeight: '700',
      textAlign: 'center',
      fontSize: isTablet ? 16 : 14,
    },
    rightSide: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isTablet ? 16 : 12,
    },
  });
};
