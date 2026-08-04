import { COMPARTILHAR_QUESTIONS, Question, QUIZ_QUESTIONS, TEOLOGICO_QUESTIONS, TORRE_QUESTIONS, WHO_AM_I_CARDS, WhoAmICard } from '@/constants/questions';
import { TorreLevel } from '@/constants/torreTypes';
import React, { ReactNode, useEffect } from 'react';
import { useConfigStore, GameMode, GameConfig, WhoAmIConfig } from '../stores/useConfigStore';
import { usePlayersStore, Player } from '../stores/usePlayersStore';
import { useQuestionsStore } from '../stores/useQuestionsStore';

export { GameMode, Player, GameConfig, WhoAmIConfig };

interface GameContextType {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  players: Player[];
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  config: GameConfig;
  updateConfig: (updates: Partial<GameConfig>) => void;
  whoAmIConfig: WhoAmIConfig;
  updateWhoAmIConfig: (updates: Partial<WhoAmIConfig>) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  playedQuestionIds: string[];
  setPlayedQuestionIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  quizQuestions: Record<string, Question[]>;
  compartilharQuestions: Record<string, Question[]>;
  torreQuestions: Question[];
  teologicoQuestions: Question[];
  whoAmICards: WhoAmICard[];
  isSyncingQuestions: boolean;
  randomNames: string[];
  torreSelectedLevel: TorreLevel;
  setTorreSelectedLevel: (level: TorreLevel) => void;

  resetGame: () => void;
  addPlayer: (name: string, photoUri?: string) => boolean;
  removePlayer: (id: string) => void;
  handleAnswer: (isCorrect: boolean) => void;
  handleWhoAmIAnswer: (points: number) => void;
  nextTurn: () => void;
  syncQuestions: (onStepUpdate?: (stepKey: string, status: 'loading' | 'success' | 'error') => void) => Promise<void>;
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const initializeQuestions = useQuestionsStore(state => state.initializeQuestions);
  
  useEffect(() => {
    initializeQuestions();
  }, []);

  return <>{children}</>;
};

export const useGame = (): GameContextType => {
  const configState = useConfigStore();
  const playersState = usePlayersStore();
  const questionsState = useQuestionsStore();

  return {
    gameMode: configState.gameMode,
    setGameMode: configState.setGameMode,
    players: playersState.players,
    setPlayers: playersState.setPlayers,
    config: configState.config,
    updateConfig: configState.updateConfig,
    whoAmIConfig: configState.whoAmIConfig,
    updateWhoAmIConfig: configState.updateWhoAmIConfig,
    currentPlayerIndex: playersState.currentPlayerIndex,
    setCurrentPlayerIndex: playersState.setCurrentPlayerIndex,
    playedQuestionIds: questionsState.playedQuestionIds,
    setPlayedQuestionIds: questionsState.setPlayedQuestionIds,
    quizQuestions: questionsState.quizQuestions,
    compartilharQuestions: questionsState.compartilharQuestions,
    torreQuestions: questionsState.torreQuestions,
    teologicoQuestions: questionsState.teologicoQuestions,
    whoAmICards: questionsState.whoAmICards,
    isSyncingQuestions: questionsState.isSyncingQuestions,
    randomNames: questionsState.randomNames,
    torreSelectedLevel: configState.torreSelectedLevel,
    setTorreSelectedLevel: configState.setTorreSelectedLevel,

    resetGame: () => {
      playersState.resetPlayers();
      questionsState.setPlayedQuestionIds([]);
    },
    addPlayer: playersState.addPlayer,
    removePlayer: playersState.removePlayer,
    handleAnswer: playersState.handleAnswer,
    handleWhoAmIAnswer: playersState.handleWhoAmIAnswer,
    nextTurn: playersState.nextTurn,
    syncQuestions: questionsState.syncQuestions,
  };
};
