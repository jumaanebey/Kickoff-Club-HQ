import { Audio } from 'expo-av';

const SOUND_FILES = {
    collect_coin: require('../../assets/sounds/collect_coin.mp3'),
    upgrade_start: require('../../assets/sounds/upgrade_start.mp3'),
    upgrade_complete: require('../../assets/sounds/upgrade_complete.mp3'),
    drill_plant: require('../../assets/sounds/drill_plant.mp3'),
    drill_harvest: require('../../assets/sounds/drill_harvest.mp3'),
    button_tap: require('../../assets/sounds/button_tap.mp3'),
    error: require('../../assets/sounds/error.mp3'),
};

export type SoundName = keyof typeof SOUND_FILES;

class SoundManager {
    private sounds: Record<string, Audio.Sound> = {};
    private isMuted: boolean = false;

    constructor() {
        // Initialize audio mode
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        }).catch(console.warn);
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    async loadSounds() {
        try {
            // Preload sounds
            for (const [name, source] of Object.entries(SOUND_FILES)) {
                // @ts-ignore
                const { sound } = await Audio.Sound.createAsync(source);
                this.sounds[name] = sound;
            }
        } catch (error) {
            console.warn('Failed to load sounds', error);
        }
    }

    async playSound(name: string) { // Changed to string to allow calling even if types are commented out
        if (this.isMuted) return;

        try {
            // @ts-ignore
            const source = SOUND_FILES[name];
            if (!source) {
                // console.log(`Sound ${name} not found (or commented out)`);
                return;
            }

            const sound = this.sounds[name];
            if (sound) {
                await sound.replayAsync();
            } else {
                // Try to load and play on demand
                const { sound: newSound } = await Audio.Sound.createAsync(source);
                this.sounds[name] = newSound;
                // Clean up after playing
                newSound.setOnPlaybackStatusUpdate(async (status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        await newSound.unloadAsync();
                    }
                });
                await newSound.playAsync();
            }
        } catch (error) {
            console.warn(`Failed to play sound: ${name}`, error);
        }
    }

    async unloadSounds() {
        for (const sound of Object.values(this.sounds)) {
            await sound.unloadAsync();
        }
        this.sounds = {};
    }
}

export const soundManager = new SoundManager();
