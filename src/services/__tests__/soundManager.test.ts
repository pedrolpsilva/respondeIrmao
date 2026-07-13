import { Audio } from 'expo-av';
import { playSoundPreset } from '../soundManager';

jest.mock('expo-av', () => {
    return {
        Audio: {
            setAudioModeAsync: jest.fn(),
            Sound: {
                createAsync: jest.fn(),
            },
        },
    };
});

describe('soundManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('playSoundPreset', () => {
        it('should log an error if Audio.Sound.createAsync throws an error', async () => {
            const mockError = new Error('Failed to create sound');
            (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(mockError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await playSoundPreset('timeOut');

            expect(Audio.Sound.createAsync).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao tocar o preset timeOut:', mockError);

            consoleSpy.mockRestore();
        });
    });
});
