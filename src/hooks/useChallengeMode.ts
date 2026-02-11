import { useEffect, useCallback, useRef, useState } from 'react';
import { ChallengeSettings } from '@/components/typing/ChallengeDropdown';

interface UseChallengeMode {
  settings: ChallengeSettings;
  testStarted: boolean;
  inputValue: string;
  promptText: string;
  errors: number;
  wpm: number;
  currentTime: number;
  totalTime: number;
  playSound?: (type: 'error' | 'challenge-warning') => void;
}

// Encryption map for displaying symbols instead of letters
const encryptionMap: { [key: string]: string } = {
  'a': 'α', 'b': 'β', 'c': 'γ', 'd': 'δ', 'e': 'ε',
  'f': 'φ', 'g': 'ψ', 'h': 'η', 'i': 'ι', 'j': 'θ',
  'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ο',
  'p': 'π', 'q': 'ω', 'r': 'ρ', 's': 'σ', 't': 'τ',
  'u': 'υ', 'v': 'ξ', 'w': 'ς', 'x': 'χ', 'y': 'ψ',
  'z': 'ζ', ' ': ' '
};

export function useChallengeMode({
  settings,
  testStarted,
  inputValue,
  promptText,
  errors,
  wpm,
  currentTime,
  totalTime,
  playSound,
}: UseChallengeMode) {
  const lastErrorCountRef = useRef(0);
  const shakeIntensityRef = useRef(0);
  const [memoryModeHidden, setMemoryModeHidden] = useState(false);
  const [suddenShiftStyle, setSuddenShiftStyle] = useState<{ fontSize: string; textTransform: string }>({ fontSize: '1.5rem', textTransform: 'none' });

  // NO BACKSPACE - Block backspace key
  useEffect(() => {
    if (!settings.noBackspace || !testStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.noBackspace, testStarted]);

  // MEMORY MODE - Hide text after 5 seconds
  useEffect(() => {
    if (!settings.memoryMode || !testStarted) {
      setMemoryModeHidden(false);
      return;
    }

    const timer = setTimeout(() => {
      setMemoryModeHidden(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [settings.memoryMode, testStarted]);

  // SUDDEN SHIFT - Change font size and case every 3 seconds
  useEffect(() => {
    if (!settings.suddenShift || !testStarted) {
      setSuddenShiftStyle({ fontSize: '1.5rem', textTransform: 'none' });
      return;
    }

    const interval = setInterval(() => {
      const fontSizes = ['1rem', '1.25rem', '1.5rem', '1.75rem', '2rem'];
      const textTransforms = ['none', 'uppercase', 'lowercase'];
      
      setSuddenShiftStyle({
        fontSize: fontSizes[Math.floor(Math.random() * fontSizes.length)],
        textTransform: textTransforms[Math.floor(Math.random() * textTransforms.length)]
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [settings.suddenShift, testStarted]);

  // ERROR FREEZE - Can't type until error is fixed
  const isErrorFreeze = useCallback(() => {
    if (!settings.errorFreeze || !testStarted) return false;
    
    const lastTypedChar = inputValue[inputValue.length - 1];
    const expectedChar = promptText[inputValue.length - 1];
    
    return lastTypedChar !== expectedChar;
  }, [settings.errorFreeze, testStarted, inputValue, promptText]);

  // LAST CHANCE - Test fails after 3 errors
  const hasExceededErrorLimit = useCallback(() => {
    return settings.lastChance && errors >= 3;
  }, [settings.lastChance, errors]);

  // HARDCORE MODE - Test fails after 1 error
  const hasHardcoreFailed = useCallback(() => {
    return settings.hardcoreMode && errors >= 1;
  }, [settings.hardcoreMode, errors]);

  // SPEED LOCK - Must maintain minimum WPM
  const isSpeedLockFailed = useCallback(() => {
    if (!settings.speedLock || !testStarted) return false;
    const minWPM = 30; // Minimum required WPM
    return wpm > 0 && wpm < minWPM && inputValue.length > 20;
  }, [settings.speedLock, testStarted, wpm, inputValue.length]);

  // PRESSURE MODE - Screen shake with errors
  useEffect(() => {
    if (!settings.pressureMode || !testStarted) {
      shakeIntensityRef.current = 0;
      return;
    }

    if (errors > lastErrorCountRef.current) {
      shakeIntensityRef.current = Math.min(errors * 2, 20);
      document.body.classList.add('shake');
      
      // Play error sound with pressure mode
      if (playSound) {
        playSound('error');
      }
      
      setTimeout(() => {
        document.body.classList.remove('shake');
        shakeIntensityRef.current = 0;
      }, 400);
    }
    
    lastErrorCountRef.current = errors;
  }, [settings.pressureMode, errors, testStarted, playSound]);

  // TURBO END - Timer speeds up in final 20%
  const getTurboMultiplier = useCallback(() => {
    if (!settings.turboEnd || !testStarted) return 1;
    
    const remainingPercentage = (currentTime / totalTime) * 100;
    if (remainingPercentage <= 20) {
      return 2; // 2x speed in final 20%
    }
    return 1;
  }, [settings.turboEnd, testStarted, currentTime, totalTime]);

  // REVERSE WORDS - Reverse each word's characters
  const transformPromptText = useCallback((text: string): string => {
    if (settings.reverseWords) {
      return text.split(' ').map(word => word.split('').reverse().join('')).join(' ');
    }
    return text;
  }, [settings.reverseWords]);

  // ENCRYPTION - Convert text to symbols
  const encryptText = useCallback((text: string): string => {
    if (!settings.encryption) return text;
    return text.toLowerCase().split('').map(char => encryptionMap[char] || char).join('');
  }, [settings.encryption]);

  // MIRROR MODE - Flip text horizontally
  const getMirrorStyle = useCallback((): React.CSSProperties => {
    if (settings.mirrorMode && testStarted) {
      return { transform: 'scaleX(-1)' };
    }
    return {};
  }, [settings.mirrorMode, testStarted]);

  // GHOST TEXT - Fade opacity as typing progresses
  const getGhostTextOpacity = useCallback((charIndex: number): number => {
    if (!settings.ghostText || !testStarted) return 1;
    
    if (charIndex < inputValue.length) {
      return Math.max(0.2, 1 - (inputValue.length - charIndex) / 50);
    }
    return 1;
  }, [settings.ghostText, testStarted, inputValue.length]);

  // ONE LINE ONLY - Show only current line
  const shouldShowOneLine = settings.oneLineOnly && testStarted;

  // FOCUS STRIP - Blur all except current word
  const shouldUseFocusStrip = settings.focusStrip && testStarted;

  // CALM MODE - Hide timer and stats
  const shouldHideTimer = settings.calmMode && testStarted;

  // MOVING TARGET - Text box moves around
  const shouldMoveTarget = settings.movingTarget && testStarted;

  // BLIND START - Blur first few lines
  const shouldBlindStart = useCallback((): boolean => {
    if (!settings.blindStart || !testStarted) return false;
    const elapsed = totalTime - currentTime;
    return elapsed < 10;
  }, [settings.blindStart, testStarted, totalTime, currentTime]);

  // VANISHING WORDS - Completed words disappear
  const shouldVanishWords = settings.vanishingWords && testStarted;

  // WORD SHUFFLE - Shuffle remaining words periodically
  const shouldWordShuffle = settings.wordShuffle && testStarted;

  // PROMPT CRAFTING - Terminal style UI
  const shouldUsePromptCrafting = settings.promptCrafting && testStarted;

  // PODCAST MODE - Audio-based typing
  const shouldUsePodcastMode = settings.podcastMode && testStarted;

  // AI HEATMAP - Show keyboard heatmap
  const shouldShowAiHeatmap = settings.aiHeatmap && testStarted;

  // GHOST RACING - Race against personal best
  const shouldShowGhostRacing = settings.ghostRacing && testStarted;

  // STAMINA MODE - Enforce minimum time
  const isStaminaMode = settings.staminaMode;
  const minimumStaminaTime = 300; // 5 minutes

  return {
    // State checks
    isErrorFreeze: isErrorFreeze(),
    hasExceededErrorLimit: hasExceededErrorLimit(),
    hasHardcoreFailed: hasHardcoreFailed(),
    isSpeedLockFailed: isSpeedLockFailed(),
    shouldShowOneLine,
    shouldUseFocusStrip,
    shouldHideTimer,
    shouldVanishWords,
    shouldMoveTarget,
    shouldWordShuffle,
    shouldUsePromptCrafting,
    shouldUsePodcastMode,
    shouldShowAiHeatmap,
    shouldShowGhostRacing,
    isStaminaMode,
    minimumStaminaTime,
    memoryModeHidden,
    suddenShiftStyle,
    
    // Functions
    getTurboMultiplier,
    transformPromptText,
    encryptText,
    getMirrorStyle,
    getGhostTextOpacity,
    shouldHideText: memoryModeHidden,
    shouldBlindStart: shouldBlindStart(),
  };
}
