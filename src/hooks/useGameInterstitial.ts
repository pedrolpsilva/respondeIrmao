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

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout: NodeJS.Timeout | null = null;

    console.log(`${LOG_TAG} Criando instância do anúncio — unitId: ${AD_UNIT_ID}`);
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });
    interstitialRef.current = ad;

    const loadAd = () => {
      if (!isMounted) return;
      console.log(`${LOG_TAG} 📡 Iniciando carregamento do anúncio...`);
      ad.load();
    };

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      console.log(`${LOG_TAG} ✅ Anúncio carregado e pronto para exibição`);
      retryCount = 0;
      setAdLoaded(true);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn(`${LOG_TAG} ❌ Erro ao carregar anúncio:`, error.message);
      setAdLoaded(false);
      
      if (retryCount < maxRetries && isMounted) {
        retryCount++;
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`${LOG_TAG} ⏳ Tentando recarregar em ${delay}ms... (Tentativa ${retryCount})`);
        retryTimeout = setTimeout(() => {
          loadAd();
        }, delay);
      }
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
      if (isMounted) {
        console.log(`${LOG_TAG} 🔄 Pré-carregando próximo anúncio`);
        retryCount = 0;
        loadAd();
      }
    });

    const unsubscribeOpened = ad.addAdEventListener(AdEventType.OPENED, () => {
      console.log(`${LOG_TAG} 👁️  Anúncio aberto / sendo exibido`);
    });

    loadAd();

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
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
