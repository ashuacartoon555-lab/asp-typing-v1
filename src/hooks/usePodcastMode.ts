import { useState, useCallback, useRef, useEffect } from 'react';
import { getRandomPodcastChallenge, DIFFICULTY_CONFIG, type PodcastChallenge } from '@/data/podcastChallenges';

// ── Types ──────────────────────────────────────────────────
interface UsePodcastModeProps {
  enabled: boolean;
  testStarted: boolean;
  testCompleted: boolean;
  promptText: string;
  inputValue: string;
  timeTaken: number; // seconds elapsed
}

export type ListeningLagStatus = 'ahead' | 'behind' | 'in-sync';

export interface PodcastResult {
  wpm: number;
  accuracy: number;
  listeningLag: number;          // chars behind (−) or ahead (+)
  lagStatus: ListeningLagStatus; // readable label
  lagPercent: number;            // 0-100 how far off from audio
  revealedCount: number;         // correct chars revealed
  totalChars: number;
  challengeTitle: string;
  difficulty: PodcastChallenge['difficulty'];
  completionPercent: number;     // % of text typed
}

interface PodcastState {
  isPlaying: boolean;
  isSpeaking: boolean;
  playbackSpeed: number;
  revealedChars: Set<number>;
  progress: number;              // TTS progress 0-100
  isPaused: boolean;
  listeningLag: number;          // current lag in chars
  lagStatus: ListeningLagStatus;
}

// Available playback speeds (serial 0.25 increments)
const SPEEDS = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00];

export function usePodcastMode({
  enabled,
  testStarted,
  testCompleted,
  promptText,
  inputValue,
  timeTaken,
}: UsePodcastModeProps) {
  const [podcastState, setPodcastState] = useState<PodcastState>({
    isPlaying: false,
    isSpeaking: false,
    playbackSpeed: 1.0,
    revealedChars: new Set(),
    progress: 0,
    isPaused: false,
    listeningLag: 0,
    lagStatus: 'in-sync',
  });

  // Challenge management
  const [currentChallenge, setCurrentChallenge] = useState<PodcastChallenge | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isStoppedRef = useRef(false);
  const speedRef = useRef(1.0);
  const audioCharIndexRef = useRef(0);       // TTS boundary char index
  const hasStartedSpeakingRef = useRef(false); // first-keypress gate
  const startTimeRef = useRef<number>(0);
  const errorPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if TTS is available
  const ttsAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // ── Preload voices ───────────────────────────────────────
  useEffect(() => {
    if (!ttsAvailable) return;
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [ttsAvailable]);

  // ── Load a new challenge (called from Index) ─────────────
  const loadChallenge = useCallback((difficulty?: PodcastChallenge['difficulty']) => {
    const challenge = getRandomPodcastChallenge(difficulty);
    setCurrentChallenge(challenge);
    speedRef.current = challenge.ttsRate;
    setPodcastState(prev => ({ ...prev, playbackSpeed: challenge.ttsRate }));
    return challenge;
  }, []);

  // ── Cleanup TTS on unmount ─────────────────────────────
  useEffect(() => {
    return () => {
      if (ttsAvailable) window.speechSynthesis.cancel();
    };
  }, [ttsAvailable]);

  // ── Step 3: Start TTS on FIRST KEYPRESS (not on testStarted) ──
  useEffect(() => {
    if (!enabled || !testStarted || !ttsAvailable || !promptText) return;
    if (inputValue.length >= 1 && !hasStartedSpeakingRef.current) {
      // First keypress detected → start audio
      hasStartedSpeakingRef.current = true;
      isStoppedRef.current = false;
      startTimeRef.current = performance.now();
      startSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.length, enabled, testStarted, ttsAvailable, promptText]);

  // ── Steps 4-5: Update revealed chars on correct typing ───
  useEffect(() => {
    if (!enabled || !testStarted) return;

    setPodcastState(prev => {
      const newRevealed = new Set(prev.revealedChars);
      let changed = false;
      for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] === promptText[i] && !newRevealed.has(i)) {
          newRevealed.add(i);
          changed = true;
        }
      }
      return changed ? { ...prev, revealedChars: newRevealed } : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, promptText, enabled, testStarted]);

  // ── Step 8: Idle detection — pause after 3s no typing ────
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idlePausedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !testStarted || !ttsAvailable || !podcastState.isPlaying) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    // Resume if previously idle-paused
    if (idlePausedRef.current) {
      idlePausedRef.current = false;
      window.speechSynthesis.resume();
      setPodcastState(prev => ({ ...prev, isPaused: false }));
    }

    // Pause after 3s idle
    idleTimerRef.current = setTimeout(() => {
      if (!isStoppedRef.current && podcastState.isPlaying && !podcastState.isPaused) {
        idlePausedRef.current = true;
        window.speechSynthesis.pause();
        setPodcastState(prev => ({ ...prev, isPaused: true }));
      }
    }, 3000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.length, enabled, testStarted, ttsAvailable, podcastState.isPlaying]);

  // ── Step 6: Brief pause on error ─────────────────────────
  useEffect(() => {
    if (!enabled || !testStarted || !ttsAvailable) return;

    if (inputValue.length > 0) {
      const lastTypedChar = inputValue[inputValue.length - 1];
      const expectedChar = promptText[inputValue.length - 1];

      if (lastTypedChar !== expectedChar && podcastState.isPlaying) {
        window.speechSynthesis.pause();
        setPodcastState(prev => ({ ...prev, isPaused: true }));

        // Clear any previous error-pause timer
        if (errorPauseTimerRef.current) clearTimeout(errorPauseTimerRef.current);

        errorPauseTimerRef.current = setTimeout(() => {
          if (!isStoppedRef.current && !idlePausedRef.current) {
            window.speechSynthesis.resume();
            setPodcastState(prev => ({ ...prev, isPaused: false }));
          }
        }, 300);
      }
    }

    return () => {
      if (errorPauseTimerRef.current) clearTimeout(errorPauseTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.length]);

  // ── Step 11: Listening Lag — compare audio pos vs typing pos ──
  useEffect(() => {
    if (!enabled || !testStarted || !podcastState.isPlaying) return;

    const userIndex = inputValue.length;
    const audioIndex = audioCharIndexRef.current;
    const diff = userIndex - audioIndex;  // positive = ahead, negative = behind

    let status: ListeningLagStatus = 'in-sync';
    if (diff > 3) status = 'ahead';
    else if (diff < -3) status = 'behind';

    setPodcastState(prev => ({
      ...prev,
      listeningLag: diff,
      lagStatus: status,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.length, podcastState.progress, enabled, testStarted]);

  // ── Step 9: Completion detection ─────────────────────────
  useEffect(() => {
    if (!enabled || !testStarted) return;
    if (inputValue.length >= promptText.length && promptText.length > 0) {
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue.length, promptText.length, enabled, testStarted]);

  // ── TTS Engine ───────────────────────────────────────────
  const startSpeaking = useCallback(() => {
    if (!ttsAvailable || !promptText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(promptText);
    utterance.rate = speedRef.current;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Find a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setPodcastState(prev => ({ ...prev, isPlaying: true, isSpeaking: true }));
    };

    utterance.onend = () => {
      setPodcastState(prev => ({ ...prev, isPlaying: false, isSpeaking: false, progress: 100 }));
    };

    // Step 11: Track audio char position for listening lag
    utterance.onboundary = (event) => {
      if (event.charIndex !== undefined) {
        audioCharIndexRef.current = event.charIndex;
        const progress = Math.round((event.charIndex / promptText.length) * 100);
        setPodcastState(prev => ({ ...prev, progress }));
      }
    };

    utterance.onerror = () => {
      setPodcastState(prev => ({ ...prev, isPlaying: false, isSpeaking: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsAvailable, promptText]);

  const stopSpeaking = useCallback(() => {
    isStoppedRef.current = true;
    if (ttsAvailable) {
      window.speechSynthesis.cancel();
    }
    setPodcastState(prev => ({
      ...prev,
      isPlaying: false,
      isSpeaking: false,
    }));
  }, [ttsAvailable]);

  const togglePause = useCallback(() => {
    if (!ttsAvailable || !podcastState.isPlaying) return;

    if (podcastState.isPaused) {
      window.speechSynthesis.resume();
      setPodcastState(prev => ({ ...prev, isPaused: false }));
    } else {
      window.speechSynthesis.pause();
      setPodcastState(prev => ({ ...prev, isPaused: true }));
    }
  }, [ttsAvailable, podcastState.isPaused, podcastState.isPlaying]);

  const setPlaybackSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    setPodcastState(prev => ({ ...prev, playbackSpeed: speed }));

    if (podcastState.isSpeaking && ttsAvailable) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (!isStoppedRef.current) {
          startSpeaking();
        }
      }, 100);
    }
  }, [podcastState.isSpeaking, ttsAvailable, startSpeaking]);

  // ── Step 5: Char opacity (blind transcription) ───────────
  const getCharOpacity = useCallback((charIndex: number): number => {
    if (!enabled) return 1;
    // Correctly typed → fully visible
    if (podcastState.revealedChars.has(charIndex)) return 1;
    // Current cursor → faint hint
    if (charIndex === inputValue.length) return 0.12;
    // Future → hidden
    return 0.04;
  }, [enabled, podcastState.revealedChars, inputValue.length]);

  // ── Step 10: Generate result metrics ─────────────────────
  const getResult = useCallback((): PodcastResult | null => {
    if (!enabled || !promptText) return null;

    const totalChars = promptText.length;
    const revealedCount = podcastState.revealedChars.size;
    const elapsedMin = timeTaken / 60;
    const words = revealedCount / 5;
    const wpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;

    // Accuracy = correct reveals / total typed
    const totalTyped = inputValue.length;
    const accuracy = totalTyped > 0 ? Math.round((revealedCount / totalTyped) * 100) : 0;

    // Listening lag
    const lag = inputValue.length - audioCharIndexRef.current;
    let lagStatus: ListeningLagStatus = 'in-sync';
    if (lag > 3) lagStatus = 'ahead';
    else if (lag < -3) lagStatus = 'behind';
    const lagPercent = totalChars > 0 ? Math.round((Math.abs(lag) / totalChars) * 100) : 0;

    const completionPercent = totalChars > 0 ? Math.round((inputValue.length / totalChars) * 100) : 0;

    return {
      wpm,
      accuracy: Math.min(accuracy, 100),
      listeningLag: lag,
      lagStatus,
      lagPercent,
      revealedCount,
      totalChars,
      challengeTitle: currentChallenge?.title || 'Podcast Challenge',
      difficulty: currentChallenge?.difficulty || 'medium',
      completionPercent: Math.min(completionPercent, 100),
    };
  }, [enabled, promptText, podcastState.revealedChars, inputValue, timeTaken, currentChallenge]);

  // ── Step 11: Lag status label for live display ───────────
  const getLagLabel = useCallback((): string => {
    const { lagStatus, listeningLag } = podcastState;
    const absDiff = Math.abs(listeningLag);
    if (lagStatus === 'ahead') return `⚡ ${absDiff} chars ahead of audio`;
    if (lagStatus === 'behind') return `🐢 ${absDiff} chars behind audio`;
    return '✅ In sync with audio';
  }, [podcastState]);

  const getLagColor = useCallback((): string => {
    const { lagStatus } = podcastState;
    if (lagStatus === 'ahead') return 'text-green-400';
    if (lagStatus === 'behind') return 'text-red-400';
    return 'text-yellow-400';
  }, [podcastState]);

  // ── Reset state ──────────────────────────────────────────
  useEffect(() => {
    if (!testStarted) {
      stopSpeaking();
      hasStartedSpeakingRef.current = false;
      audioCharIndexRef.current = 0;
      setPodcastState(prev => ({
        ...prev,
        revealedChars: new Set(),
        progress: 0,
        isPaused: false,
        listeningLag: 0,
        lagStatus: 'in-sync',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted]);

  return {
    podcastState,
    ttsAvailable,
    currentChallenge,
    loadChallenge,
    startSpeaking,
    stopSpeaking,
    togglePause,
    setPlaybackSpeed,
    getCharOpacity,
    getResult,
    getLagLabel,
    getLagColor,
    SPEEDS,
    DIFFICULTY_CONFIG,
  };
}
