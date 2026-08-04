import { Fonts, Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean, isTabletLandscape: boolean) => {
  const minHeight = isTablet ? 240 : 180;
  const padding = isTablet ? 32 : 24;
  const categoryFontSize = isTablet ? 20 : 16;
  const questionFontSize = isTablet ? (isTabletLandscape ? 40 : 44) : 34;
  const questionLineHeight = isTablet ? (isTabletLandscape ? 48 : 52) : 42;
  const answerBelowTextSize = isTablet ? 28 : 22;

  return StyleSheet.create({
    cardContainer: {
      position: 'relative',
      width: '100%',
      flex: 1,
      minHeight,
      marginBottom: Metrics.shadowOffset + 12,
    },
    cardShadow: {
      position: 'absolute',
      top: Metrics.shadowOffset,
      left: Metrics.shadowOffset,
      right: -Metrics.shadowOffset,
      bottom: -Metrics.shadowOffset,
      borderRadius: Metrics.radiusCard,
      zIndex: 1,
    },
    cardFront: {
      zIndex: 2,
      flex: 1,
      borderWidth: Metrics.borderWidth,
      borderRadius: Metrics.radiusCard,
      alignItems: 'center',
      padding,
      justifyContent: 'flex-start',
      backfaceVisibility: 'hidden',
    },
    categoryContainer: {
      marginBottom: isTablet ? 16 : 10,
    },
    categoryText: {
      fontFamily: Fonts.bodyBold,
      fontSize: categoryFontSize,
      letterSpacing: 2,
      textAlign: 'center',
    },
    questionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    questionText: {
      fontFamily: Fonts.heading,
      fontSize: questionFontSize,
      textAlign: 'center',
      lineHeight: questionLineHeight,
    },
    buttonWrapper: {
      width: '100%',
      marginTop: isTablet ? 28 : 20,
    },
    answerButton: {
      marginBottom: 0,
    },
    buttonLabel: {
      fontFamily: Fonts.subheading,
      fontSize: isTablet ? 22 : 18,
    },
    answerBelowContainer: {
      marginTop: isTablet ? 24 : 16,
      paddingTop: isTablet ? 16 : 12,
      borderTopWidth: 2,
      width: '100%',
      alignItems: 'center',
    },
    answerBelowLabel: {
      fontFamily: Fonts.bodyBold,
      fontSize: isTablet ? 16 : 14,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    answerBelowText: {
      fontFamily: Fonts.heading,
      fontSize: answerBelowTextSize,
      textAlign: 'center',
    },
  });
};
