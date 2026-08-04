import { Fonts } from '@/constants/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const createStyles = (isTablet: boolean) => {
  const viewfinderSize = isTablet
    ? Math.min(520, Math.min(screenWidth, screenHeight) * 0.7)
    : screenWidth;

  return StyleSheet.create({
    modalSafeArea: {
      flex: 1,
      backgroundColor: '#000000',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isTablet ? 48 : 32,
      maxWidth: isTablet ? 600 : '100%',
      alignSelf: 'center',
    },
    permissionText: {
      fontFamily: Fonts.subheading,
      fontSize: isTablet ? 24 : 20,
      textAlign: 'center',
      marginBottom: 24,
    },
    permissionBtn: {
      width: '100%',
      marginBottom: 12,
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: '#000000',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    header: {
      height: isTablet ? 76 : 64,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isTablet ? 24 : 16,
      backgroundColor: '#000000',
    },
    headerTitle: {
      fontFamily: Fonts.heading,
      fontSize: isTablet ? 22 : 18,
      color: '#FFFFFF',
    },
    iconButton: {
      width: isTablet ? 52 : 44,
      height: isTablet ? 52 : 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewfinderContainer: {
      width: viewfinderSize,
      height: viewfinderSize,
      position: 'relative',
      backgroundColor: '#000000',
      borderWidth: 2,
      borderColor: '#333333',
      borderRadius: isTablet ? 16 : 0,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    cameraView: {
      width: '100%',
      height: '100%',
    },
    gridOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    gridRow: {
      flex: 1,
      flexDirection: 'row',
    },
    gridCell: {
      flex: 1,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    borderHorizontal: {
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    borderVertical: {
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    crosshairH: {
      position: 'absolute',
      width: 16,
      height: 2,
      backgroundColor: '#FCD34D',
    },
    crosshairV: {
      position: 'absolute',
      width: 2,
      height: 16,
      backgroundColor: '#FCD34D',
    },
    footer: {
      width: '100%',
      maxWidth: isTablet ? 600 : '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: isTablet ? 32 : 24,
      paddingTop: 16,
      backgroundColor: '#000000',
    },
    footerButton: {
      width: isTablet ? 68 : 56,
      height: isTablet ? 68 : 56,
      borderRadius: isTablet ? 34 : 28,
      backgroundColor: '#1C1917',
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureButtonContainer: {
      width: isTablet ? 96 : 80,
      height: isTablet ? 96 : 80,
      borderRadius: isTablet ? 48 : 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureButtonOuter: {
      width: isTablet ? 88 : 72,
      height: isTablet ? 88 : 72,
      borderRadius: isTablet ? 44 : 36,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureButtonInner: {
      width: isTablet ? 68 : 56,
      height: isTablet ? 68 : 56,
      borderRadius: isTablet ? 34 : 28,
      backgroundColor: '#FFFFFF',
    },
    captureButtonInnerLoading: {
      width: isTablet ? 88 : 72,
      height: isTablet ? 88 : 72,
      borderRadius: isTablet ? 44 : 36,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
