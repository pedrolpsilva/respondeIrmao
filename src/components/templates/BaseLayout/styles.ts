import { Metrics } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean, isTabletLandscape: boolean) => {
  const maxWidth = isTabletLandscape ? 960 : isTablet ? 720 : '100%';
  const paddingHorizontal = isTablet ? 32 : Metrics.containerMargin;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal,
      paddingTop: isTablet ? 20 : 16,
      paddingBottom: isTablet ? 40 : 24,
    },
    nonScrollContent: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal,
      paddingTop: isTablet ? 20 : 16,
      paddingBottom: isTablet ? 40 : 24,
    },
    innerContainer: {
      width: '100%',
      maxWidth,
      flex: 1,
    },
  });
};
