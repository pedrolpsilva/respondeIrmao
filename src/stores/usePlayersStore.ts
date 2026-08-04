import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

export interface Player {
  id: string;
  name: string;
  points: number;
  playedIds?: string[];
  photoUri?: string;
}

interface PlayersState {
  players: Player[];
  currentPlayerIndex: number;
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setCurrentPlayerIndex: (index: number) => void;
  addPlayer: (name: string, photoUri?: string) => boolean;
  removePlayer: (id: string) => void;
  handleAnswer: (isCorrect: boolean) => void;
  handleWhoAmIAnswer: (points: number) => void;
  nextTurn: () => void;
  resetPlayers: () => void;
}

export const usePlayersStore = create<PlayersState>((set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  
  setPlayers: (players) => set((state) => ({ players: typeof players === 'function' ? players(state.players) : players })),
  setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
  
  addPlayer: (name, photoUri) => {
    const { players } = get();
    const normalized = name.trim();
    if (!normalized) return false;
    if (players.some(p => p.name.toLowerCase() === normalized.toLowerCase())) return false;

    const newPlayer: Player = {
      id: Crypto.randomUUID(),
      name: normalized,
      points: 0,
      photoUri,
    };

    set({ players: [...players, newPlayer] });
    return true;
  },
  
  removePlayer: (id) => {
    const { players, currentPlayerIndex } = get();
    const playerToRemove = players.find(p => p.id === id);
    
    if (playerToRemove?.photoUri) {
      FileSystem.deleteAsync(playerToRemove.photoUri, { idempotent: true }).catch(err => {
        console.warn('Failed to delete player photo:', err);
      });
    }
    
    const newPlayers = players.filter(p => p.id !== id);
    
    // FIX: Adjust currentPlayerIndex if out of bounds or if we removed someone before the current player
    const removedIndex = players.findIndex(p => p.id === id);
    let nextIndex = currentPlayerIndex;
    
    if (newPlayers.length === 0) {
      nextIndex = 0;
    } else if (removedIndex < currentPlayerIndex) {
      nextIndex = currentPlayerIndex - 1;
    } else if (removedIndex === currentPlayerIndex) {
      // If we removed the current player, the new player at this index becomes the current player, 
      // but we need to ensure it's not out of bounds.
      nextIndex = Math.min(currentPlayerIndex, newPlayers.length - 1);
    }
    
    set({ players: newPlayers, currentPlayerIndex: nextIndex });
  },
  
  handleAnswer: (isCorrect) => {
    if (!isCorrect) return; // "quando apertar em Errou não altere a pontuação"

    set((state) => ({
      players: state.players.map((player, index) =>
        index === state.currentPlayerIndex
          ? { ...player, points: player.points + 1 }
          : player
      )
    }));
  },
  
  handleWhoAmIAnswer: (points) => {
    const awarded = Math.max(1, points);
    set((state) => ({
      players: state.players.map((player, index) =>
        index === state.currentPlayerIndex
          ? { ...player, points: player.points + awarded }
          : player
      )
    }));
  },
  
  nextTurn: () => {
    const { players, currentPlayerIndex } = get();
    if (players.length === 0) return;
    set({ currentPlayerIndex: (currentPlayerIndex + 1) % players.length });
  },
  
  resetPlayers: () => {
    set((state) => ({
      players: state.players.map(p => ({ ...p, points: 0, playedIds: [] })),
      currentPlayerIndex: 0,
    }));
  }
}));
