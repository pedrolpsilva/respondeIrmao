import { Audio } from 'expo-av';

const SOUND_PRESETS = {
    timeOut: require('../../assets/sounds/timeOut.mp3'),
    tenSeconds: require('../../assets/sounds/tenSeconds.mp3'),
};

export const playSoundPreset = async (presetName: 'timeOut' | 'tenSeconds') => {
    try {
        const soundModule = SOUND_PRESETS[presetName];
        if (!soundModule) return;

        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            interruptionModeIOS: 2,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeAndroid: 2,
        });
        const { sound } = await Audio.Sound.createAsync(soundModule);

        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error(`Erro ao tocar o preset ${presetName}:`, error);
    }
};