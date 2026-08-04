import { Fonts, Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) => {
  const chipSize = isTablet ? 112 : 92;
  return StyleSheet.create({
    chipContainer: {
      position: 'relative',
      marginRight: isTablet ? 16 : 12,
      marginBottom: isTablet ? 16 : 12,
      width: chipSize,
      height: chipSize,
    },
    chipShadow: {
      position: 'absolute',
      top: 4,
      left: 4,
      right: -4,
      bottom: -4,
      borderRadius: Metrics.radiusButton,
      zIndex: 1,
    },
    chipFront: {
      zIndex: 2,
      width: '100%',
      height: '100%',
      borderWidth: Metrics.borderWidth,
      borderRadius: Metrics.radiusButton,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playerImage: {
      width: '100%',
      height: '100%',
    },
    defaultAvatarContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    defaultAvatarText: {
      fontFamily: Fonts.heading,
      fontSize: isTablet ? 40 : 32,
    },
    nameOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(28, 25, 23, 0.75)',
      paddingVertical: isTablet ? 4 : 3,
      paddingHorizontal: 4,
      alignItems: 'center',
    },
    nameText: {
      fontFamily: Fonts.bodyBold,
      fontSize: isTablet ? 13 : 11,
      color: '#FFFFFF',
      textAlign: 'center',
      width: '100%',
    },
    removeButton: {
      position: 'absolute',
      top: -4,
      right: -4,
      zIndex: 10,
      width: isTablet ? 28 : 22,
      height: isTablet ? 28 : 22,
      borderRadius: isTablet ? 14 : 11,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
