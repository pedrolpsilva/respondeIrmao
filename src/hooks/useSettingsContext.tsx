import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Colors } from '@/constants/theme';
import { setSoundMuted } from '@/services/soundManager';
import { AppSettings, ColorblindType, ThemeColors } from '@/types/settings';

const STORAGE_KEY = '@responde_irmao:app_settings';

const defaultSettings: AppSettings = {
  soundEnabled: true,
  darkMode: false,
  colorblindMode: false,
  colorblindType: 'deuteranopia',
  isProMode: false,
};

export function getThemeColors(
  darkMode: boolean,
  colorblindMode: boolean,
  colorblindType: ColorblindType
): ThemeColors {
  let colors: ThemeColors = { ...Colors };

  if (darkMode) {
    colors = {
      ...colors,
      background: '#18181B',
      surface: '#27272A',
      text: '#FAFAFA',
      textSecondary: '#A1A1AA',
      muted: '#71717A',
      border: '#3F3F46',
      backgroundElement: '#27272A',
    };
  }

  if (colorblindMode) {
    switch (colorblindType) {
      case 'protanopia':
        colors = {
          ...colors,
          accent1: '#0072B2',
          accent2: '#D55E00',
          primary: '#56B4E9',
          purple: '#CC79A7',
          warning: '#E69F00',
          accent: '#0072B2',
        };
        break;
      case 'deuteranopia':
        colors = {
          ...colors,
          accent1: '#009E73',
          accent2: '#D55E00',
          primary: '#0072B2',
          purple: '#CC79A7',
          warning: '#F0E442',
          accent: '#009E73',
        };
        break;
      case 'tritanopia':
        colors = {
          ...colors,
          primary: '#CC79A7',
          warning: '#009E73',
          accent1: '#E69F00',
          accent2: '#D55E00',
          purple: '#0072B2',
          accent: '#E69F00',
        };
        break;
      case 'achromatopsia':
        colors = {
          ...colors,
          primary: '#52525B',
          warning: '#71717A',
          accent1: '#3F3F46',
          accent2: '#27272A',
          purple: '#18181B',
          accent: '#3F3F46',
        };
        break;
    }
  }

  return colors;
}

interface SettingsContextType extends AppSettings {
  theme: ThemeColors;
  setSoundEnabled: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setColorblindMode: (enabled: boolean) => void;
  setColorblindType: (type: ColorblindType) => void;
  setIsProMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<AppSettings>;
          const updated = { ...defaultSettings, ...parsed };
          setSettings(updated);
          setSoundMuted(!updated.soundEnabled);
        }
      } catch (e) {
        console.warn('Failed to load settings from AsyncStorage:', e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    setSoundMuted(!newSettings.soundEnabled);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed to save settings to AsyncStorage:', e);
    }
  };

  const setSoundEnabled = (enabled: boolean) => {
    saveSettings({ ...settings, soundEnabled: enabled });
  };

  const setDarkMode = (enabled: boolean) => {
    saveSettings({ ...settings, darkMode: enabled });
  };

  const setColorblindMode = (enabled: boolean) => {
    saveSettings({ ...settings, colorblindMode: enabled });
  };

  const setColorblindType = (type: ColorblindType) => {
    saveSettings({ ...settings, colorblindType: type });
  };

  const setIsProMode = (enabled: boolean) => {
    saveSettings({ ...settings, isProMode: enabled });
  };

  const theme = useMemo(() => {
    return getThemeColors(settings.darkMode, settings.colorblindMode, settings.colorblindType);
  }, [settings.darkMode, settings.colorblindMode, settings.colorblindType]);

  const value = {
    ...settings,
    theme,
    setSoundEnabled,
    setDarkMode,
    setColorblindMode,
    setColorblindType,
    setIsProMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {isLoaded ? children : null}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
