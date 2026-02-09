import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export type SoundIntensity = 'relaxed' | 'focus' | 'silent';
export type ErrorSoundProfile = 'classic' | 'sci-fi' | 'gentle' | 'gaming';

interface SoundSettings {
  errorSound: boolean;
  startSound: boolean;
  endSound: boolean;
  keypressSound: boolean;
  masterEnabled: boolean;
  intensity?: SoundIntensity;
  errorProfile?: ErrorSoundProfile;
  volume?: number;
}

interface SoundContextType {
  settings: SoundSettings;
  toggleSetting: (key: keyof SoundSettings) => void;
  toggleMaster: () => void;
  playSound: (type: 'error' | 'start' | 'end' | 'keypress' | 'challenge-fail' | 'challenge-warning' | 'challenge-success') => void;
}

const defaultSettings: SoundSettings = {
  errorSound: true,
  startSound: false,
  endSound: false,
  keypressSound: false,
  masterEnabled: true,
  intensity: 'focus',
  errorProfile: 'classic',
  volume: 70,
};


const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Cached AudioContext for better performance
let audioContextInstance: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  try {
    if (!audioContextInstance) {
      audioContextInstance = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextInstance.state === 'suspended') {
      audioContextInstance.resume();
    }
    return audioContextInstance;
  } catch {
    return null;
  }
};

// Simple beep sounds using Web Audio API with profiles
const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  const audioContext = getAudioContext();
  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

// Profile-specific error sounds
const playErrorSound = (profile: ErrorSoundProfile, volume: number = 0.3) => {
  switch (profile) {
    case 'classic':
      // Quick double buzz for error
      createBeep(250, 0.1, 'square', volume * 0.6);
      setTimeout(() => createBeep(250, 0.1, 'square', volume * 0.6), 80);
      break;
    case 'sci-fi':
      // Descending laser error
      createBeep(500, 0.08, 'sine', volume * 0.5);
      setTimeout(() => createBeep(300, 0.08, 'sine', volume * 0.4), 60);
      break;
    case 'gentle':
      // Soft warning tone
      createBeep(350, 0.12, 'sine', volume * 0.4);
      break;
    case 'gaming':
      // 8-bit style error
      createBeep(180, 0.08, 'square', volume * 0.5);
      setTimeout(() => createBeep(120, 0.08, 'square', volume * 0.4), 70);
      break;
  }
};

const playStartSound = (volume: number = 0.3) => {
  // Start: ascending tones (test begins)
  createBeep(600, 0.08, 'sine', volume);
  setTimeout(() => createBeep(800, 0.08, 'sine', volume), 70);
  setTimeout(() => createBeep(1000, 0.12, 'sine', volume), 140);
};

const playEndSound = (volume: number = 0.3) => {
  // End: celebratory ascending tones (test finished)
  createBeep(500, 0.1, 'sine', volume);
  setTimeout(() => createBeep(750, 0.1, 'sine', volume), 100);
  setTimeout(() => createBeep(1200, 0.15, 'sine', volume), 200);
};

const playKeypressSound = (volume: number = 0.3) => {
  // Keypress: simple quick click
  createBeep(1200, 0.04, 'sine', volume * 0.4);
};

// Challenge-related sounds
const playChallengeFailSound = (volume: number = 0.3) => {
  // Dramatic fail sound: descending tones
  createBeep(400, 0.15, 'square', volume);
  setTimeout(() => createBeep(300, 0.15, 'square', volume * 0.8), 150);
  setTimeout(() => createBeep(200, 0.25, 'square', volume * 0.6), 300);
};

const playChallengeWarningSound = (volume: number = 0.3) => {
  // Warning beep: double tone
  createBeep(700, 0.1, 'sine', volume);
  setTimeout(() => createBeep(700, 0.1, 'sine', volume), 150);
};

const playChallengeSuccessSound = (volume: number = 0.3) => {
  // Success: ascending tones
  createBeep(600, 0.1, 'sine', volume);
  setTimeout(() => createBeep(800, 0.1, 'sine', volume), 100);
  setTimeout(() => createBeep(1000, 0.15, 'sine', volume), 200);
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('typing-sounds');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('typing-sounds', JSON.stringify(settings));
  }, [settings]);

  // Ensure AudioContext is resumed after a user gesture (autoplay policies)
  useEffect(() => {
    let unlocked = false;
    const unlock = async () => {
      if (unlocked) return;
      const ac = getAudioContext();
      try {
        if (ac && ac.state === 'suspended') {
          await ac.resume();
        }
      } catch (e) {
        // ignore
      }
      unlocked = true;
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('touchstart', unlock);
    };

    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });

    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, []);

  const toggleSetting = (key: keyof SoundSettings) => {
    setSettings(prev => {
      // Only toggle boolean settings; avoid inverting non-boolean fields
      const current = prev[key] as unknown;
      if (typeof current === 'boolean') {
        return { ...prev, [key]: !current } as SoundSettings;
      }
      return prev;
    });
  };

  const toggleMaster = () => {
    setSettings(prev => ({ ...prev, masterEnabled: !prev.masterEnabled }));
  };

  const playSound = useCallback((type: 'error' | 'start' | 'end' | 'keypress' | 'challenge-fail' | 'challenge-warning' | 'challenge-success') => {
    if (!settings.masterEnabled) return;
    
    const intensity = (settings.intensity as SoundIntensity) || 'focus';
    const profile = (settings.errorProfile as ErrorSoundProfile) || 'classic';
    const volume = (settings.volume || 70) / 100;
    
    // Adjust volume based on intensity
    let adjustedVolume = volume;
    if (intensity === 'relaxed') adjustedVolume = volume * 0.6;
    else if (intensity === 'silent') return; // No sound in silent mode
    
    try {
      switch (type) {
        case 'error':
          if (settings.errorSound) playErrorSound(profile, adjustedVolume);
          break;
        case 'start':
          if (settings.startSound) playStartSound(adjustedVolume);
          break;
        case 'end':
          if (settings.endSound) playEndSound(adjustedVolume);
          break;
        case 'keypress':
          if (settings.keypressSound) playKeypressSound(adjustedVolume);
          break;
        case 'challenge-fail':
          playChallengeFailSound(adjustedVolume);
          break;
        case 'challenge-warning':
          playChallengeWarningSound(adjustedVolume);
          break;
        case 'challenge-success':
          playChallengeSuccessSound(adjustedVolume);
          break;
      }
    } catch (e) {
      // Audio not supported
    }
  }, [settings]);

  return (
    <SoundContext.Provider value={{ settings, toggleSetting, toggleMaster, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

