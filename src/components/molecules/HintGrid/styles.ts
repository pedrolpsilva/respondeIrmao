import { Fonts } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) => {
  const btnSize = isTablet ? 54 : 42;
  const fontSize = isTablet ? 20 : 16;
  const revealedSize = isTablet ? 15 : 12;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: isTablet ? 12 : 8,
      justifyContent: 'center',
      paddingVertical: isTablet ? 12 : 8,
    },
    buttonWrapper: {
      position: 'relative',
      width: btnSize,
      height: btnSize,
      marginBottom: 3,
      marginRight: 3,
    },
    hintButton: {
      width: '100%',
      height: '100%',
      borderWidth: 2.5,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonShadow: {
      position: 'absolute',
      top: 3,
      left: 3,
      right: -3,
      bottom: -3,
      borderRadius: 8,
    },
    hintRevealed: {
      opacity: 0.6,
    },
    hintSelected: {},
    hintPressed: {
      transform: [{ translateX: 1.5 }, { translateY: 1.5 }],
    },
    hintNumber: {
      fontFamily: Fonts.heading,
      fontSize,
    },
    hintNumberRevealed: {
      fontSize: revealedSize,
      textDecorationLine: 'line-through',
    },
    hintNumberSelected: {
      color: '#FFFFFF',
    },
    checkMark: {
      position: 'absolute',
      top: 1,
      right: 3,
      fontSize: isTablet ? 10 : 7,
      fontFamily: Fonts.bodyBold,
    },
  });
};
