import { renderHook, act } from '@testing-library/react-hooks';
import { GameProvider, useGame } from '../useGameContext';

// We mock the service entirely to avoid unhandled async updates
jest.mock('@/services/questionsService', () => ({
  questionsService: {
    loadLocalQuestions: jest.fn().mockResolvedValue({
      quiz: {}, compartilhar: {}, torre: [], teologico: []
    }),
    fetchAndSyncQuestions: jest.fn().mockResolvedValue({
      quiz: {}, compartilhar: {}, torre: [], teologico: []
    })
  }
}));

// Suppress console.error in tests to avoid the unhandled act warnings
// from the async loading of questions
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && /was not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('useGameContext - handleAnswer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not update score when answer is incorrect', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    // render the hook
    const { result, waitForNextUpdate } = renderHook(() => useGame(), { wrapper });

    act(() => {
      // Add a player to the game
      result.current.addPlayer('Test Player');
    });

    // Verify initial score
    expect(result.current.players[0].points).toBe(0);

    act(() => {
      // Answer incorrectly
      result.current.handleAnswer(false);
    });

    // Score should remain the same
    expect(result.current.players[0].points).toBe(0);
  });

  it('should update score when answer is correct', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    // render the hook
    const { result, waitForNextUpdate } = renderHook(() => useGame(), { wrapper });

    act(() => {
      // Add a player to the game
      result.current.addPlayer('Test Player');
    });

    // Verify initial score
    expect(result.current.players[0].points).toBe(0);

    act(() => {
      // Answer correctly
      result.current.handleAnswer(true);
    });

    // Score should increase by 1
    expect(result.current.players[0].points).toBe(1);
  });
});
