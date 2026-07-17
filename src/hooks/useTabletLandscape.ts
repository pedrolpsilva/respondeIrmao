import { useWindowDimensions } from 'react-native';

/**
 * Hook que detecta se o dispositivo é um tablet em modo paisagem.
 * Considera tablet: largura >= 768px
 * Considera landscape: largura > altura
 */
export function useTabletLandscape() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const isTabletLandscape = isTablet && isLandscape;

  return { isTabletLandscape, isTablet, isLandscape, width, height };
}
