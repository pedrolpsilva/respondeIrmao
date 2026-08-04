export type TorreLevel = 'muito_facil' | 'facil' | 'medio' | 'dificil' | 'muito_dificil' | 'impossivel';
export type QuestionClasse = 'facil' | 'medio' | 'dificil';

export interface TorreLevelConfig {
  key: TorreLevel;
  label: string;
  emoji: string;
  description: string;
  distribution: Record<QuestionClasse, number>;
  timerSeconds: number | null;
  color: string;
}

export const TORRE_LEVELS: TorreLevelConfig[] = [
  {
    key: 'muito_facil',
    label: 'Muito Fácil',
    emoji: '🟢',
    description: '80 fáceis, 20 médias',
    distribution: { facil: 80, medio: 20, dificil: 0 },
    timerSeconds: null,
    color: '#22C55E',
  },
  {
    key: 'facil',
    label: 'Fácil',
    emoji: '🔵',
    description: '75 fáceis, 21 médias, 4 difíceis',
    distribution: { facil: 75, medio: 21, dificil: 4 },
    timerSeconds: null,
    color: '#3B82F6',
  },
  {
    key: 'medio',
    label: 'Médio',
    emoji: '🟡',
    description: '65 fáceis, 30 médias, 5 difíceis',
    distribution: { facil: 65, medio: 30, dificil: 5 },
    timerSeconds: null,
    color: '#F59E0B',
  },
  {
    key: 'dificil',
    label: 'Difícil',
    emoji: '🟠',
    description: '40 fáceis, 40 médias, 20 difíceis',
    distribution: { facil: 40, medio: 40, dificil: 20 },
    timerSeconds: 90,
    color: '#F97316',
  },
  {
    key: 'muito_dificil',
    label: 'Muito Difícil',
    emoji: '🔴',
    description: '20 fáceis, 45 médias, 35 difíceis',
    distribution: { facil: 20, medio: 45, dificil: 35 },
    timerSeconds: 90,
    color: '#EF4444',
  },
  {
    key: 'impossivel',
    label: 'Impossível',
    emoji: '💀',
    description: '40 médias, 60 difíceis',
    distribution: { facil: 0, medio: 40, dificil: 60 },
    timerSeconds: 60,
    color: '#7C3AED',
  },
];

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;
