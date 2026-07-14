import { Audio } from 'expo-av';
import { stopAllSounds, playSoundPreset, playClickSound } from '../soundManager';

const mockSoundInstance = {
    playAsync: jest.fn().mockResolvedValue(undefined),
    getStatusAsync: jest.fn(),
    stopAsync: jest.fn().mockResolvedValue(undefined),
    unloadAsync: jest.fn().mockResolvedValue(undefined),
    setOnPlaybackStatusUpdate: jest.fn(),
};

jest.mock('expo-av', () => {
    return {
        Audio: {
            setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
            Sound: {
                createAsync: jest.fn().mockImplementation(() => Promise.resolve({ sound: mockSoundInstance })),
            },
        },
    };
});

describe('soundManager', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        mockSoundInstance.getStatusAsync.mockResolvedValue({ isLoaded: true });
        await stopAllSounds();
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    describe('playSoundPreset', () => {
        it('should return early if preset does not exist', async () => {
            const result = await playSoundPreset('nonexistent' as any);
            expect(result).toBeUndefined();
            expect(Audio.setAudioModeAsync).not.toHaveBeenCalled();
        });

        it('should stop previous sound and play new preset', async () => {
            mockSoundInstance.getStatusAsync.mockResolvedValue({ isLoaded: true });

            await playSoundPreset('timeOut');

            expect(Audio.setAudioModeAsync).toHaveBeenCalled();
            expect(Audio.Sound.createAsync).toHaveBeenCalled();
            expect(mockSoundInstance.playAsync).toHaveBeenCalled();

            jest.clearAllMocks();
            mockSoundInstance.getStatusAsync.mockResolvedValue({ isLoaded: true });

            await playSoundPreset('tenSeconds');

            expect(mockSoundInstance.getStatusAsync).toHaveBeenCalled();
            expect(mockSoundInstance.stopAsync).toHaveBeenCalled();
            expect(mockSoundInstance.unloadAsync).toHaveBeenCalled();
            expect(mockSoundInstance.setOnPlaybackStatusUpdate).toHaveBeenCalledWith(null);

            expect(Audio.setAudioModeAsync).toHaveBeenCalled();
            expect(Audio.Sound.createAsync).toHaveBeenCalled();
            expect(mockSoundInstance.playAsync).toHaveBeenCalled();
        });

        it('should register onPlaybackStatusUpdate and handle didJustFinish', async () => {
            await playSoundPreset('timeOut');

            expect(mockSoundInstance.setOnPlaybackStatusUpdate).toHaveBeenCalled();

            const callback = mockSoundInstance.setOnPlaybackStatusUpdate.mock.calls[0][0];

            jest.clearAllMocks();
            callback({ isLoaded: true, didJustFinish: true });

            expect(mockSoundInstance.setOnPlaybackStatusUpdate).toHaveBeenCalledWith(null);
            expect(mockSoundInstance.unloadAsync).toHaveBeenCalled();
        });

        it('should catch and log errors during playSoundPreset', async () => {
            const error = new Error('Test Error');
            (Audio.setAudioModeAsync as jest.Mock).mockRejectedValueOnce(error);

            await playSoundPreset('timeOut');

            expect(console.error).toHaveBeenCalledWith('Erro ao tocar o preset timeOut:', error);
        });
    });

    describe('stopAllSounds', () => {
        it('should not throw if no sound is playing', async () => {
            await expect(stopAllSounds()).resolves.not.toThrow();
        });

        it('should stop and unload current sound if it is loaded', async () => {
            await playSoundPreset('timeOut');
            jest.clearAllMocks();

            mockSoundInstance.getStatusAsync.mockResolvedValue({ isLoaded: true });
            await stopAllSounds();

            expect(mockSoundInstance.getStatusAsync).toHaveBeenCalled();
            expect(mockSoundInstance.setOnPlaybackStatusUpdate).toHaveBeenCalledWith(null);
            expect(mockSoundInstance.stopAsync).toHaveBeenCalled();
            expect(mockSoundInstance.unloadAsync).toHaveBeenCalled();
        });

        it('should do nothing if status is not loaded', async () => {
            await playSoundPreset('timeOut');
            jest.clearAllMocks();

            mockSoundInstance.getStatusAsync.mockResolvedValue({ isLoaded: false });
            await stopAllSounds();

            expect(mockSoundInstance.getStatusAsync).toHaveBeenCalled();
            expect(mockSoundInstance.setOnPlaybackStatusUpdate).not.toHaveBeenCalled();
            expect(mockSoundInstance.stopAsync).not.toHaveBeenCalled();
            expect(mockSoundInstance.unloadAsync).not.toHaveBeenCalled();
        });

        it('should catch and ignore errors during stopAllSounds', async () => {
            await playSoundPreset('timeOut');
            jest.clearAllMocks();

            mockSoundInstance.getStatusAsync.mockRejectedValue(new Error('Status error'));

            await expect(stopAllSounds()).resolves.not.toThrow();
        });
    });

    describe('playClickSound', () => {
        it('should create and play click sound', async () => {
            await playClickSound();

            expect(Audio.setAudioModeAsync).toHaveBeenCalled();
            expect(Audio.Sound.createAsync).toHaveBeenCalled();
            expect(mockSoundInstance.playAsync).toHaveBeenCalled();
            expect(mockSoundInstance.setOnPlaybackStatusUpdate).toHaveBeenCalled();
        });

        it('should handle onPlaybackStatusUpdate and unload when finished', async () => {
            await playClickSound();

            const callback = mockSoundInstance.setOnPlaybackStatusUpdate.mock.calls[0][0];

            jest.clearAllMocks();
            callback({ isLoaded: true, didJustFinish: true });

            expect(mockSoundInstance.setOnPlaybackStatusUpdate).toHaveBeenCalledWith(null);
            expect(mockSoundInstance.unloadAsync).toHaveBeenCalled();
        });

        it('should catch and log errors during playClickSound', async () => {
            const error = new Error('Click error');
            (Audio.setAudioModeAsync as jest.Mock).mockRejectedValueOnce(error);

            await playClickSound();

            expect(console.error).toHaveBeenCalledWith('Erro ao tocar o som de click:', error);
        });
    });
});
