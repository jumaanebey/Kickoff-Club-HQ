import { Audio } from 'expo-av';

// Sound effect manager
class SoundManager {
  private sounds: { [key: string]: Audio.Sound } = {};
  private enabled: boolean = true;

  async loadSound(name: string, file: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      this.sounds[name] = sound;
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
    }
  }

  async playSound(name: string, volume: number = 1.0) {
    if (!this.enabled) return;

    try {
      const sound = this.sounds[name];
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.setVolumeAsync(volume);
        await sound.playAsync();
      }
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Load sound effects (you'll need to add actual audio files)
      // For now, using haptics as fallback
      console.log('Sound system initialized');
    } catch (error) {
      console.error('Error initializing sound system:', error);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async unloadAll() {
    for (const soundName in this.sounds) {
      try {
        await this.sounds[soundName].unloadAsync();
      } catch (error) {
        console.error(`Error unloading sound ${soundName}:`, error);
      }
    }
    this.sounds = {};
  }
}

export const soundManager = new SoundManager();

// Sound effect types
export const SOUNDS = {
  TAP: 'tap',
  COLLECT: 'collect',
  UPGRADE_START: 'upgrade_start',
  UPGRADE_COMPLETE: 'upgrade_complete',
  BUILD: 'build',
  DRILL_PLANT: 'drill_plant',
  DRILL_HARVEST: 'drill_harvest',
  COIN: 'coin',
  XP_GAIN: 'xp_gain',
  MISSION_COMPLETE: 'mission_complete',
  ERROR: 'error',
  SUCCESS: 'success',
};

// Play sound helper
export const playSound = async (soundName: string, volume?: number) => {
  await soundManager.playSound(soundName, volume);
};

// Initialize sounds
export const initializeSounds = async () => {
  await soundManager.initialize();
};
