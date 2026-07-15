import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Metrics } from '@/constants/theme';

// ─── IDs ────────────────────────────────────────────────────────────────────
const AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3347922540508260/3387107432';

const LOG_TAG = '[AdMob/Banner]';

// ─── Tamanho ─────────────────────────────────────────────────────────────────
// BrutalInput height = Metrics.touchTargetMin (56px)
// Banner height     = 150% = 84px  →  mais próximo de BANNER (320×50) ou LARGE_BANNER (320×100)
// Usamos ANCHORED_ADAPTIVE_BANNER para preencher 100% da largura automaticamente
// e fixamos a altura mínima via container (84px).
const BANNER_HEIGHT = Math.round(Metrics.touchTargetMin * 1.5); // 84

/**
 * Banner AdMob exibido nas telas de configuração.
 * Posicionado logo abaixo do BrutalHeader, com 100% de largura e
 * altura equivalente a 150% do componente de input (84px).
 */
export default function ConfigBannerAd() {
  if (Platform.OS === 'web') return null;

  return (
    <View style={styles.wrapper}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={() => {
          console.log(`${LOG_TAG} ✅ Banner carregado`);
        }}
        onAdFailedToLoad={(error) => {
          console.warn(`${LOG_TAG} ❌ Falha ao carregar banner:`, error.message);
        }}
        onAdOpened={() => {
          console.log(`${LOG_TAG} 👁️  Banner clicado / aberto`);
        }}
        onAdClosed={() => {
          console.log(`${LOG_TAG} 🚪 Banner fechado`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Vai de borda a borda quebrando o padding do container pai
    alignSelf: 'stretch',
    marginHorizontal: -Metrics.containerMargin,
    marginTop: -20,      // cancela o marginBottom do BrutalHeader
    minHeight: BANNER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
});
