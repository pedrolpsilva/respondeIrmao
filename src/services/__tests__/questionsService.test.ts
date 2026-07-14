import { questionsService } from '../questionsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPARTILHAR_QUESTIONS, QUIZ_QUESTIONS, TORRE_QUESTIONS, TEOLOGICO_QUESTIONS } from '@/constants/questions';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('questionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadLocalQuestions', () => {
    it('should return fallback defaults when AsyncStorage.getItem throws an error', async () => {
      // Setup the mock to throw an error
      const mockError = new Error('AsyncStorage failed');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(mockError);

      // We should optionally mock console.error to avoid noise in the test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await questionsService.loadLocalQuestions();

      // Verify AsyncStorage.getItem was called for all keys
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(4);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@respondeirmao:quiz_questions');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@respondeirmao:compartilhar_questions');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@respondeirmao:torre_questions');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@respondeirmao:teologico_questions');

      // Verify it returns the default questions
      expect(result).toEqual({
        quiz: QUIZ_QUESTIONS,
        compartilhar: COMPARTILHAR_QUESTIONS,
        torre: TORRE_QUESTIONS,
        teologico: expect.any(Array),
      });

      // Verify the error was logged
      expect(consoleSpy).toHaveBeenCalledWith('[QuestionsService] Failed to read local cache:', mockError);

      consoleSpy.mockRestore();
    });

    it('should load successfully from cache if data exists', async () => {
      // Setup successful response
      const mockQuiz = {
        level1: [{ id: 'q1', text: 'Q1', correctAnswer: 'A', level: 'level1' }]
      };
      const mockCompartilhar = {
        level2: [{ id: 'c1', text: 'C1', level: 'level2' }]
      };
      const mockTorre = [
        { id: 't1', text: 'T1', correctAnswer: 'T', wrongAnswers: ['W'], level: 'facil' }
      ];
      const mockTeologico = [
        { id: 'teo1', text: 'TEO1', correctAnswer: 'A', level: 'teologico' }
      ];

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@respondeirmao:quiz_questions') {
          return Promise.resolve(JSON.stringify(mockQuiz));
        }
        if (key === '@respondeirmao:compartilhar_questions') {
          return Promise.resolve(JSON.stringify(mockCompartilhar));
        }
        if (key === '@respondeirmao:torre_questions') {
          return Promise.resolve(JSON.stringify(mockTorre));
        }
        if (key === '@respondeirmao:teologico_questions') {
          return Promise.resolve(JSON.stringify(mockTeologico));
        }
        return Promise.resolve(null);
      });

      const result = await questionsService.loadLocalQuestions();

      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(4);

      expect(result).toEqual({
        quiz: mockQuiz,
        compartilhar: mockCompartilhar,
        torre: mockTorre,
        teologico: mockTeologico,
      });
    });

    it('should fallback to defaults when cache is empty (returns null)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await questionsService.loadLocalQuestions();

      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(4);

      expect(result).toEqual({
        quiz: QUIZ_QUESTIONS,
        compartilhar: COMPARTILHAR_QUESTIONS,
        torre: TORRE_QUESTIONS,
        teologico: expect.any(Array),
      });
    });
  });
});
