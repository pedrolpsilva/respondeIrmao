import { useWindowDimensions } from 'react-native';

/**
 * Hook universal de responsividade para tablets e telas grandes.
 * Detecta tablet por dimensão mínima (>= 600dp) ou largura (>= 768dp).
 */
export function useTabletLandscape() {
  const { width, height } = useWindowDimensions();
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);

  // Considera tablet se a menor dimensão for >= 600 (ex: 600x960, 768x1024, 800x1280)
  const isTablet = minDimension >= 600 || width >= 768;
  const isLandscape = width > height;
  const isTabletLandscape = isTablet && isLandscape;
  const isTabletPortrait = isTablet && !isLandscape;

  // Fator de escala para ajuste dinâmico de elementos em tablet
  const tabletScale = isTablet ? 1.25 : 1.0;

  // Largura máxima recomendada para containers no tablet
  const contentMaxWidth = isTabletLandscape ? 960 : isTabletPortrait ? 720 : '100%';

  /**
   * Helper para dimensionar fontes proporcionalmente no tablet.
   */
  const scaleFont = (size: number): number => {
    if (!isTablet) return size;
    return Math.round(size * 1.2);
  };

  return {
    isTablet,
    isLandscape,
    isTabletLandscape,
    isTabletPortrait,
    width,
    height,
    tabletScale,
    contentMaxWidth,
    scaleFont,
  };
}

