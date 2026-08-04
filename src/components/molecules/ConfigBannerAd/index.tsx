import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { Platform, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { styles } from './styles';
import { ConfigBannerAdProps } from './types';

const AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3347922540508260/3387107432';

const LOG_TAG = '[AdMob/Banner]';

export const ConfigBannerAd: React.FC<ConfigBannerAdProps> = () => {
  const { isProMode } = useSettingsContext();

  if (isProMode || Platform.OS === 'web') return null;

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
          console.log(`${LOG_TAG} 👁️ Banner clicado / aberto`);
        }}
        onAdClosed={() => {
          console.log(`${LOG_TAG} 🚪 Banner fechado`);
        }}
      />
    </View>
  );
};

export default ConfigBannerAd;
