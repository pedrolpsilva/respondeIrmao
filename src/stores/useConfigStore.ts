import { create } from 'zustand';
import { TorreLevel } from '@/constants/torreTypes';

export type GameMode = 'quiz' | 'compartilhar' | 'torre' | 'teologico' | 'quem-sou-eu';

export interface GameConfig {
  level: string;
  targetPoints: number;
  timerBase: number;
  repeatSamePlayer: boolean;
  repeatOtherPlayers: boolean;
  includeLowerLevels: boolean;
}

export interface WhoAmIConfig {
  targetPoints: number;
  timerEnabled: boolean;
  timerBase: number;
  selectedCategories: string[];
}

interface ConfigState {
  gameMode: GameMode;
  config: GameConfig;
  whoAmIConfig: WhoAmIConfig;
  torreSelectedLevel: TorreLevel;
  setGameMode: (mode: GameMode) => void;
  updateConfig: (updates: Partial<GameConfig>) => void;
  updateWhoAmIConfig: (updates: Partial<WhoAmIConfig>) => void;
  setTorreSelectedLevel: (level: TorreLevel) => void;
}

const defaultGameConfig: GameConfig = {
  level: 'multidao',
  targetPoints: 10,
  timerBase: 30,
  repeatSamePlayer: false,
  repeatOtherPlayers: false,
  includeLowerLevels: false,
};

const defaultWhoAmIConfig: WhoAmIConfig = {
  targetPoints: 20,
  timerEnabled: false,
  timerBase: 30,
  selectedCategories: [],
};

export const useConfigStore = create<ConfigState>((set) => ({
  gameMode: 'compartilhar',
  config: defaultGameConfig,
  whoAmIConfig: defaultWhoAmIConfig,
  torreSelectedLevel: 'muito_facil',
  setGameMode: (mode) => set({ gameMode: mode }),
  updateConfig: (updates) => set((state) => ({ config: { ...state.config, ...updates } })),
  updateWhoAmIConfig: (updates) => set((state) => ({ whoAmIConfig: { ...state.whoAmIConfig, ...updates } })),
  setTorreSelectedLevel: (level) => set({ torreSelectedLevel: level }),
}));
