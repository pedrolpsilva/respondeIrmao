import { create } from 'zustand';
import { Question, WhoAmICard, QUIZ_QUESTIONS, COMPARTILHAR_QUESTIONS, TORRE_QUESTIONS, TEOLOGICO_QUESTIONS, WHO_AM_I_CARDS } from '@/constants/questions';
import { questionsService } from '@/services/questionsService';

interface QuestionsState {
  quizQuestions: Record<string, Question[]>;
  compartilharQuestions: Record<string, Question[]>;
  torreQuestions: Question[];
  teologicoQuestions: Question[];
  whoAmICards: WhoAmICard[];
  randomNames: string[];
  isSyncingQuestions: boolean;
  playedQuestionIds: string[];
  
  setPlayedQuestionIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  syncQuestions: (onStepUpdate?: (stepKey: string, status: 'loading' | 'success' | 'error') => void) => Promise<void>;
  initializeQuestions: () => Promise<void>;
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  quizQuestions: QUIZ_QUESTIONS,
  compartilharQuestions: COMPARTILHAR_QUESTIONS,
  torreQuestions: TORRE_QUESTIONS,
  teologicoQuestions: TEOLOGICO_QUESTIONS,
  whoAmICards: WHO_AM_I_CARDS,
  randomNames: [],
  isSyncingQuestions: false,
  playedQuestionIds: [],
  
  setPlayedQuestionIds: (ids) => set((state) => ({
    playedQuestionIds: typeof ids === 'function' ? ids(state.playedQuestionIds) : ids
  })),
  
  initializeQuestions: async () => {
    // 1. Immediate load of local cache
    try {
      const local = await questionsService.loadLocalQuestions();
      set({
        quizQuestions: local.quiz,
        compartilharQuestions: local.compartilhar,
        torreQuestions: local.torre,
        teologicoQuestions: local.teologico,
      });
      if (local.whoAmI.length > 0) set({ whoAmICards: local.whoAmI });
      if (local.names.length > 0) set({ randomNames: local.names });
    } catch (e) {
      console.warn('Failed to load local questions cache', e);
    }

    // 2. Try fetching from Cloud in background
    set({ isSyncingQuestions: true });
    try {
      const updated = await questionsService.fetchAndSyncQuestions();
      set({
        quizQuestions: updated.quiz,
        compartilharQuestions: updated.compartilhar,
        torreQuestions: updated.torre,
        teologicoQuestions: updated.teologico,
      });
      if (updated.whoAmI.length > 0) set({ whoAmICards: updated.whoAmI });
      if (updated.names.length > 0) set({ randomNames: updated.names });
    } catch (err) {
      console.warn('[GameProvider] Cloud sync not updated:', (err as Error).message);
    } finally {
      set({ isSyncingQuestions: false });
    }
  },

  syncQuestions: async (onStepUpdate) => {
    try {
      const updated = await questionsService.fetchAndSyncQuestions(onStepUpdate);
      set({
        quizQuestions: updated.quiz,
        compartilharQuestions: updated.compartilhar,
        torreQuestions: updated.torre,
        teologicoQuestions: updated.teologico,
      });
      if (updated.whoAmI.length > 0) set({ whoAmICards: updated.whoAmI });
      if (updated.names.length > 0) set({ randomNames: updated.names });
    } catch (err) {
      console.error('[QuestionsStore] Error syncing questions:', err);
      throw err;
    }
  },
}));
