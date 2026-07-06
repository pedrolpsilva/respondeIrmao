import { Audio } from 'expo-av';

const SOUND_PRESETS = {
    timeOut: require('../../assets/sounds/timeOut.mp3'),
    tenSeconds: require('../../assets/sounds/tenSeconds.mp3'),
};

let currentSoundInstance: Audio.Sound | null = null;

export const stopAllSounds = async () => {
    if (currentSoundInstance) {
        try {
            const status = await currentSoundInstance.getStatusAsync();
            if (status.isLoaded) {
                currentSoundInstance.setOnPlaybackStatusUpdate(null);
                await currentSoundInstance.stopAsync();
                await currentSoundInstance.unloadAsync();
            }
        } catch (error) {
            // Ignore error since sound might already be unloaded or in an invalid state
        } finally {
            currentSoundInstance = null;
        }
    }
};

export const playSoundPreset = async (presetName: 'timeOut' | 'tenSeconds') => {
    try {
        const soundModule = SOUND_PRESETS[presetName];
        if (!soundModule) return;

        // Stop and unload any currently playing preset first
        await stopAllSounds();

        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            interruptionModeIOS: 2,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeAndroid: 2,
        });
        const { sound } = await Audio.Sound.createAsync(soundModule);

        currentSoundInstance = sound;
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.setOnPlaybackStatusUpdate(null);
                sound.unloadAsync().catch(() => {});
                if (currentSoundInstance === sound) {
                    currentSoundInstance = null;
                }
            }
        });

        return sound;
    } catch (error) {
        console.error(`Erro ao tocar o preset ${presetName}:`, error);
    }
};

export const playClickSound = async () => {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            interruptionModeIOS: 2,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeAndroid: 2,
        });
        const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/click.mp3'));
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.setOnPlaybackStatusUpdate(null);
                sound.unloadAsync().catch(() => {});
            }
        });
    } catch (error) {
        console.error('Erro ao tocar o som de click:', error);
    }
};