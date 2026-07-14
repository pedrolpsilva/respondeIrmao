import { COMPARTILHAR_QUESTIONS, Question, QUIZ_QUESTIONS, TEOLOGICO_QUESTIONS, TORRE_QUESTIONS, WHO_AM_I_CARDS, WhoAmICard } from '@/constants/questions';
import { questionsService } from '@/services/questionsService';
import * as Crypto from 'expo-crypto';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type GameMode = 'quiz' | 'compartilhar' | 'torre' | 'teologico' | 'quem-sou-eu';

export interface Player {
  id: string;
  name: string;
  points: number;
  playedIds?: string[];
}

export interface GameConfig {
  level: string; // 'multidao' | 'discipulo' | 'apostolo' | 'comunhao' | 'testemunho' | 'confissao' | 'teologico'
  targetPoints: number; // 10, 15, 20
  timerBase: number; // seconds: 30, 60, 90, 120
  repeatSamePlayer: boolean;
  repeatOtherPlayers: boolean;
  includeLowerLevels: boolean;
}

export interface WhoAmIConfig {
  targetPoints: number;    // 20, 30, 40
  timerEnabled: boolean;
  timerBase: number;       // 30, 40, 50, 60, 70, 80, 90 seconds
  selectedCategories: string[]; // [] means all
}

interface GameContextType {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  config: GameConfig;
  updateConfig: (updates: Partial<GameConfig>) => void;
  whoAmIConfig: WhoAmIConfig;
  updateWhoAmIConfig: (updates: Partial<WhoAmIConfig>) => void;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (index: number) => void;
  playedQuestionIds: string[];
  setPlayedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  quizQuestions: Record<string, Question[]>;
  compartilharQuestions: Record<string, Question[]>;
  torreQuestions: Question[];
  teologicoQuestions: Question[];
  whoAmICards: WhoAmICard[];
  isSyncingQuestions: boolean;

  // Helpers to manage state transitions
  resetGame: () => void;
  addPlayer: (name: string) => boolean;
  removePlayer: (id: string) => void;
  handleAnswer: (isCorrect: boolean) => void;
  handleWhoAmIAnswer: (points: number) => void;
  nextTurn: () => void;
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

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameMode, setGameMode] = useState<GameMode>('compartilhar');
  const [players, setPlayers] = useState<Player[]>([]);
  const [config, setConfig] = useState<GameConfig>(defaultGameConfig);
  const [whoAmIConfig, setWhoAmIConfig] = useState<WhoAmIConfig>(defaultWhoAmIConfig);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [playedQuestionIds, setPlayedQuestionIds] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, Question[]>>(QUIZ_QUESTIONS);
  const [compartilharQuestions, setCompartilharQuestions] = useState<Record<string, Question[]>>(COMPARTILHAR_QUESTIONS);
  const [torreQuestions, setTorreQuestions] = useState<Question[]>(TORRE_QUESTIONS);
  const [teologicoQuestions, setTeologicoQuestions] = useState<Question[]>(TEOLOGICO_QUESTIONS);
  const [whoAmICards, setWhoAmICards] = useState<WhoAmICard[]>(WHO_AM_I_CARDS);
  const [isSyncingQuestions, setIsSyncingQuestions] = useState<boolean>(false);

  useEffect(() => {
    const initializeAndSync = async () => {
      // 1. Immediate load of local cache
      const local = await questionsService.loadLocalQuestions();
      setQuizQuestions(local.quiz);
      setCompartilharQuestions(local.compartilhar);
      setTorreQuestions(local.torre);
      setTeologicoQuestions(local.teologico);
      if (local.whoAmI.length > 0) setWhoAmICards(local.whoAmI);

      // 2. Try fetching from Sheets in background
      setIsSyncingQuestions(true);
      try {
        const updated = await questionsService.fetchAndSyncQuestions();
        setQuizQuestions(updated.quiz);
        setCompartilharQuestions(updated.compartilhar);
        setTorreQuestions(updated.torre);
        setTeologicoQuestions(updated.teologico);
        if (updated.whoAmI.length > 0) setWhoAmICards(updated.whoAmI);
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

  const updateWhoAmIConfig = (updates: Partial<WhoAmIConfig>) => {
    setWhoAmIConfig(prev => ({ ...prev, ...updates }));
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

    setPlayers(prev =>
      prev.map((player, index) =>
        index === currentPlayerIndex
          ? { ...player, points: player.points + 1 }
          : player
      )
    );
  };

  // Quem Sou Eu?: award variable points (at least 1) to current player
  const handleWhoAmIAnswer = (points: number) => {
    const awarded = Math.max(1, points);
    setPlayers(prev =>
      prev.map((player, index) =>
        index === currentPlayerIndex
          ? { ...player, points: player.points + awarded }
          : player
      )
    );
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
        whoAmIConfig,
        updateWhoAmIConfig,
        currentPlayerIndex,
        setCurrentPlayerIndex,
        playedQuestionIds,
        setPlayedQuestionIds,
        quizQuestions,
        compartilharQuestions,
        torreQuestions,
        teologicoQuestions,
        whoAmICards,
        isSyncingQuestions,
        resetGame,
        addPlayer,
        removePlayer,
        handleAnswer,
        handleWhoAmIAnswer,
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
