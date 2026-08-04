import { useEffect, useRef, useState } from 'react';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useSettingsContext } from '@/hooks/useSettingsContext';

// ─── IDs ────────────────────────────────────────────────────────────────────
// Troque __DEV__ por false para forçar o ID de produção mesmo em dev
const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3347922540508260/7380790391';

const LOG_TAG = '[AdMob/Interstitial]';

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * Carrega um InterstitialAd e expõe `showAdThenNavigate(callback)`.
 * - Se o anúncio estiver carregado e o Modo Pró NÃO estiver ativado, exibe-o e chama o callback ao fechar.
 * - Se o anúncio ainda não estiver pronto ou Modo Pró ativado, chama o callback diretamente.
 */
export function useGameInterstitial() {
  const { isProMode } = useSettingsContext();
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isProMode) return;

    console.log(`${LOG_TAG} Criando instância do anúncio — unitId: ${AD_UNIT_ID}`);
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });
    interstitialRef.current = ad;

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      console.log(`${LOG_TAG} ✅ Anúncio carregado e pronto para exibição`);
      setAdLoaded(true);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn(`${LOG_TAG} ❌ Erro ao carregar anúncio:`, error.message);
      setAdLoaded(false);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log(`${LOG_TAG} 🚪 Anúncio fechado pelo usuário`);
      setAdLoaded(false);

      // Executa o callback pendente (navegação para /results)
      if (pendingCallbackRef.current) {
        console.log(`${LOG_TAG} ▶️  Executando callback pós-anúncio`);
        pendingCallbackRef.current();
        pendingCallbackRef.current = null;
      }

      // Pré-carrega o próximo para a próxima partida
      console.log(`${LOG_TAG} 🔄 Pré-carregando próximo anúncio`);
      ad.load();
    });

    const unsubscribeOpened = ad.addAdEventListener(AdEventType.OPENED, () => {
      console.log(`${LOG_TAG} 👁️  Anúncio aberto / sendo exibido`);
    });

    console.log(`${LOG_TAG} 📡 Iniciando carregamento do anúncio...`);
    ad.load();

    return () => {
      console.log(`${LOG_TAG} 🧹 Removendo listeners`);
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      unsubscribeOpened();
    };
  }, [isProMode]);

  /**
   * Tenta exibir o interstitial.
   * @param onAfterAd Callback chamado após o anúncio fechar (ou imediatamente se não estiver pronto ou Modo PRO)
   */
  const showAdThenNavigate = (onAfterAd: () => void) => {
    if (isProMode) {
      console.log(`${LOG_TAG} 👑 Modo PRÓ ativo: anúncio ignorado.`);
      onAfterAd();
      return;
    }

    const ad = interstitialRef.current;

    if (ad && adLoaded) {
      console.log(`${LOG_TAG} 🎬 Exibindo interstitial antes da tela de resultados`);
      pendingCallbackRef.current = onAfterAd;
      ad.show();
    } else {
      console.warn(
        `${LOG_TAG} ⚠️  Anúncio não estava pronto (loaded=${adLoaded}). Navegando diretamente.`
      );
      onAfterAd();
    }
  };

  return { showAdThenNavigate, adLoaded: isProMode ? false : adLoaded };
}
