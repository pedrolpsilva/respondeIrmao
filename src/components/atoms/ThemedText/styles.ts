import { Fonts } from '@/constants/theme';
import { Platform, StyleSheet } from 'react-native';

export const createStyles = (isTablet: boolean) => {
  const scale = isTablet ? 1.2 : 1.0;

  return StyleSheet.create({
    small: {
      fontSize: Math.round(14 * scale),
      lineHeight: Math.round(20 * scale),
      fontWeight: '500',
    },
    smallBold: {
      fontSize: Math.round(14 * scale),
      lineHeight: Math.round(20 * scale),
      fontWeight: '700',
    },
    default: {
      fontSize: Math.round(16 * scale),
      lineHeight: Math.round(24 * scale),
      fontWeight: '500',
    },
    title: {
      fontSize: Math.round(48 * scale),
      fontWeight: '600',
      lineHeight: Math.round(52 * scale),
    },
    subtitle: {
      fontSize: Math.round(32 * scale),
      lineHeight: Math.round(44 * scale),
      fontWeight: '600',
    },
    link: {
      lineHeight: Math.round(30 * scale),
      fontSize: Math.round(14 * scale),
    },
    linkPrimary: {
      lineHeight: Math.round(30 * scale),
      fontSize: Math.round(14 * scale),
      color: '#3c87f7',
    },
    code: {
      fontFamily: Fonts.mono,
      fontWeight: Platform.select({ android: '700' }) ?? '500',
      fontSize: Math.round(12 * scale),
    },
  });
};
