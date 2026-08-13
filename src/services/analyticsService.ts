import { app } from './firebaseClient';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';

let analyticsInstance: Analytics | null = null;
let isInitialized = false;

const initAnalytics = async (): Promise<Analytics | null> => {
  if (isInitialized) return analyticsInstance;
  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  } catch (error) {
    console.warn('[Analytics] Firebase Analytics not supported in this environment:', error);
  } finally {
    isInitialized = true;
  }
  return analyticsInstance;
};

export const analyticsService = {
  /**
   * Logs a custom event to Firebase Analytics.
   */
  async logEvent(eventName: string, eventParams?: Record<string, any>) {
    try {
      const analytics = await initAnalytics();
      if (analytics) {
        logEvent(analytics, eventName, eventParams);
      }
    } catch (error) {
      console.warn('[Analytics] Failed to log event:', eventName, error);
    }
  },

  /**
   * Logs a button click event automatically.
   */
  async logButtonClick(buttonLabel: string, extraParams?: Record<string, any>) {
    const cleanLabel = buttonLabel ? buttonLabel.trim().slice(0, 100) : 'unnamed_button';
    await this.logEvent('button_click', {
      button_name: cleanLabel,
      button_label: cleanLabel,
      ...extraParams,
    });
  },

  /**
   * Logs screen view event.
   */
  async logScreenView(screenName: string, screenClass?: string) {
    await this.logEvent('screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenClass || screenName,
    });
  }
};

export default analyticsService;
