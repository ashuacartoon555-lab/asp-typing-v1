import { useEffect, useCallback, useRef } from 'react';
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

  // ERROR FREEZE - Can't type until error is fixed
  const isErrorFreeze = useCallback(() => {
    if (!settings.errorFreeze || !testStarted) return false;
    
    const currentChar = promptText[inputValue.length];
    const lastTypedChar = inputValue[inputValue.length - 1];
    const expectedChar = promptText[inputValue.length - 1];
    
    return lastTypedChar !== expectedChar;
  }, [settings.errorFreeze, testStarted, inputValue, promptText]);

  // LAST CHANCE - Test fails after 3 errors
  const hasExceededErrorLimit = useCallback(() => {
    return settings.lastChance && errors >= 3;
  }, [settings.lastChance, errors]);

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
      document.body.style.animation = `shake 0.5s ease-in-out`;
      
      // Play error sound with pressure mode
      if (playSound) {
        playSound('error');
      }
      
      setTimeout(() => {
        document.body.style.animation = '';
        shakeIntensityRef.current = 0;
      }, 500);
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

  // REVERSE WORDS - Reverse the prompt text
  const transformPromptText = useCallback((text: string): string => {
    if (settings.reverseWords) {
      return text.split(' ').reverse().join(' ');
    }
    return text;
  }, [settings.reverseWords]);

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

  // MEMORY MODE - Hide text after 5 seconds
  const shouldHideText = useCallback((): boolean => {
    if (!settings.memoryMode || !testStarted) return false;
    // This would need to track time since test start
    return false; // Placeholder - implement with timer
  }, [settings.memoryMode, testStarted]);

  // BLIND START - Hide text for first 10 seconds
  const shouldBlindStart = useCallback((): boolean => {
    if (!settings.blindStart || !testStarted) return false;
    const elapsed = totalTime - currentTime;
    return elapsed < 10;
  }, [settings.blindStart, testStarted, totalTime, currentTime]);

  // VANISHING WORDS - Completed words disappear
  const shouldVanishWords = settings.vanishingWords && testStarted;

  // STAMINA MODE - Enforce minimum time
  const isStaminaMode = settings.staminaMode;
  const minimumStaminaTime = 300; // 5 minutes

  return {
    // State checks
    isErrorFreeze: isErrorFreeze(),
    hasExceededErrorLimit: hasExceededErrorLimit(),
    isSpeedLockFailed: isSpeedLockFailed(),
    shouldShowOneLine,
    shouldUseFocusStrip,
    shouldHideTimer,
    shouldVanishWords,
    isStaminaMode,
    minimumStaminaTime,
    
    // Functions
    getTurboMultiplier,
    transformPromptText,
    getMirrorStyle,
    getGhostTextOpacity,
    shouldHideText: shouldHideText(),
    shouldBlindStart: shouldBlindStart(),
  };
}
