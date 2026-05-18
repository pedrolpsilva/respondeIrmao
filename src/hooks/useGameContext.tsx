import { COMPARTILHAR_QUESTIONS, Question, QUIZ_QUESTIONS } from '@/constants/questions';
import { questionsService } from '@/services/questionsService';
import * as Crypto from 'expo-crypto';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type GameMode = 'quiz' | 'compartilhar';

export interface Player {
  id: string;
  name: string;
  points: number;
  playedIds?: string[];
}

export interface GameConfig {
  level: string; // 'multidao' | 'discipulo' | 'apostolo' | 'comunhao' | 'testemunho' | 'confissao'
  targetPoints: number; // 10, 15, 20
  timerBase: number; // seconds: 30, 60, 90, 120
  repeatSamePlayer: boolean;
  repeatOtherPlayers: boolean;
}

interface GameContextType {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  config: GameConfig;
  updateConfig: (updates: Partial<GameConfig>) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  playedQuestionIds: string[];
  setPlayedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  quizQuestions: Record<string, Question[]>;
  compartilharQuestions: Record<string, Question[]>;
  isSyncingQuestions: boolean;

  // Helpers to manage state transitions
  resetGame: () => void;
  addPlayer: (name: string) => boolean;
  removePlayer: (id: string) => void;
  handleAnswer: (isCorrect: boolean) => void;
  nextTurn: () => void;
}

const defaultGameConfig: GameConfig = {
  level: 'multidao',
  targetPoints: 10,
  timerBase: 30,
  repeatSamePlayer: false,
  repeatOtherPlayers: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameMode, setGameMode] = useState<GameMode>('compartilhar');
  const [players, setPlayers] = useState<Player[]>([]);
  const [config, setConfig] = useState<GameConfig>(defaultGameConfig);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [playedQuestionIds, setPlayedQuestionIds] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, Question[]>>(QUIZ_QUESTIONS);
  const [compartilharQuestions, setCompartilharQuestions] = useState<Record<string, Question[]>>(COMPARTILHAR_QUESTIONS);
  const [isSyncingQuestions, setIsSyncingQuestions] = useState<boolean>(false);

  useEffect(() => {
    const initializeAndSync = async () => {
      // 1. Immediate load of local cache
      const local = await questionsService.loadLocalQuestions();
      setQuizQuestions(local.quiz);
      setCompartilharQuestions(local.compartilhar);

      // 2. Try fetching from Sheets in background
      setIsSyncingQuestions(true);
      try {
        const updated = await questionsService.fetchAndSyncQuestions();
        setQuizQuestions(updated.quiz);
        setCompartilharQuestions(updated.compartilhar);
        // console.log('[GameProvider] Synced latest questions successfully.');
      } catch (err) {
        // console.log('[GameProvider] Cloud sync not updated:', (err as Error).message);
      } finally {
        setIsSyncingQuestions(false);
      }
    };

    initializeAndSync();
  }, []);

  const updateConfig = (updates: Partial<GameConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    setPlayers(prev => prev.map(p => ({ ...p, points: 0, playedIds: [] })));
    setCurrentPlayerIndex(0);
    setPlayedQuestionIds([]);
  };

  const addPlayer = (name: string): boolean => {
    const normalized = name.trim();
    if (!normalized) return false;
    if (players.some(p => p.name.toLowerCase() === normalized.toLowerCase())) return false;

    const newPlayer: Player = {
      id: Crypto.randomUUID(),
      name: normalized,
      points: 0,
    };

    setPlayers(prev => [...prev, newPlayer]);
    return true;
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) return; // "quando apertar em Errou não altere a pontuação"

    setPlayers(prev => {
      const updated = [...prev];
      const player = updated[currentPlayerIndex];
      if (!player) return prev;

      updated[currentPlayerIndex] = {
        ...player,
        points: player.points + 1,
      };
      return updated;
    });
  };

  const nextTurn = () => {
    if (players.length === 0) return;
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  };

  return (
    <GameContext.Provider
      value={{
        gameMode,
        setGameMode,
        players,
        setPlayers,
        config,
        updateConfig,
        currentPlayerIndex,
        setCurrentPlayerIndex,
        playedQuestionIds,
        setPlayedQuestionIds,
        quizQuestions,
        compartilharQuestions,
        isSyncingQuestions,
        resetGame,
        addPlayer,
        removePlayer,
        handleAnswer,
        nextTurn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
