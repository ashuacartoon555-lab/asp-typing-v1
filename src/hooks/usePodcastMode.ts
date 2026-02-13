import { useState, useCallback, useRef, useEffect } from 'react';

interface UsePodcastModeProps {
  enabled: boolean;
  testStarted: boolean;
  promptText: string;
  inputValue: string;
}

interface PodcastState {
  isPlaying: boolean;
  isSpeaking: boolean;
  playbackSpeed: number;
  revealedChars: Set<number>;  // Set of char indices revealed by correct typing
  progress: number;            // 0-100% of text spoken
  isPaused: boolean;
}

// Available playback speeds
const SPEEDS = [0.15, 0.25, 0.50, 0.75, 1.0, 1.25, 1.5, 2.0];

export function usePodcastMode({
  enabled,
  testStarted,
  promptText,
  inputValue,
}: UsePodcastModeProps) {
  const [podcastState, setPodcastState] = useState<PodcastState>({
    isPlaying: false,
    isSpeaking: false,
    playbackSpeed: 1.0,
    revealedChars: new Set(),
    progress: 0,
    isPaused: false,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isStoppedRef = useRef(false);
  const speedRef = useRef(1.0);

  // Check if TTS is available
  const ttsAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Preload voices (some browsers load asynchronously)
  useEffect(() => {
    if (!ttsAvailable) return;
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [ttsAvailable]);

  // Start TTS when test begins with podcast mode
  useEffect(() => {
    if (!enabled || !testStarted || !ttsAvailable || !promptText) return;
    
    isStoppedRef.current = false;
    startSpeaking();

    return () => {
      stopSpeaking();
    };
  }, [enabled, testStarted]);

  // Update revealed chars based on correct typing
  useEffect(() => {
    if (!enabled || !testStarted) return;

    const newRevealed = new Set(podcastState.revealedChars);
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] === promptText[i]) {
        newRevealed.add(i);
      }
    }

    setPodcastState(prev => ({
      ...prev,
      revealedChars: newRevealed,
    }));
  }, [inputValue, promptText, enabled, testStarted]);

  // Auto-pause TTS if user stops typing for >3 seconds
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idlePausedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !testStarted || !ttsAvailable || !podcastState.isPlaying) return;

    // Clear existing idle timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    // If we previously idle-paused, resume now that user is typing again
    if (idlePausedRef.current) {
      idlePausedRef.current = false;
      window.speechSynthesis.resume();
      setPodcastState(prev => ({ ...prev, isPaused: false }));
    }

    // Set new idle timer — pause audio after 3s of no typing
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
  }, [inputValue.length, enabled, testStarted, ttsAvailable, podcastState.isPlaying]);

  // Pause TTS on error (optional extreme difficulty)
  useEffect(() => {
    if (!enabled || !testStarted || !ttsAvailable) return;

    if (inputValue.length > 0) {
      const lastTypedChar = inputValue[inputValue.length - 1];
      const expectedChar = promptText[inputValue.length - 1];

      if (lastTypedChar !== expectedChar && podcastState.isPlaying) {
        // Brief pause on error (300ms)
        window.speechSynthesis.pause();
        setPodcastState(prev => ({ ...prev, isPaused: true }));

        setTimeout(() => {
          if (!isStoppedRef.current) {
            window.speechSynthesis.resume();
            setPodcastState(prev => ({ ...prev, isPaused: false }));
          }
        }, 300);
      }
    }
  }, [inputValue.length]);

  const startSpeaking = useCallback(() => {
    if (!ttsAvailable || !promptText) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(promptText);
    utterance.rate = speedRef.current;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to find a natural-sounding voice
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

    utterance.onboundary = (event) => {
      if (event.charIndex !== undefined) {
        const progress = Math.round((event.charIndex / promptText.length) * 100);
        setPodcastState(prev => ({ ...prev, progress }));
      }
    };

    utterance.onerror = () => {
      setPodcastState(prev => ({ ...prev, isPlaying: false, isSpeaking: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsAvailable, promptText, podcastState.playbackSpeed]);

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
    if (!ttsAvailable) return;

    if (podcastState.isPaused) {
      window.speechSynthesis.resume();
      setPodcastState(prev => ({ ...prev, isPaused: false }));
    } else {
      window.speechSynthesis.pause();
      setPodcastState(prev => ({ ...prev, isPaused: true }));
    }
  }, [ttsAvailable, podcastState.isPaused]);

  const setPlaybackSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    setPodcastState(prev => ({ ...prev, playbackSpeed: speed }));
    
    // Restart speech with new speed if currently speaking
    if (podcastState.isSpeaking && ttsAvailable) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (!isStoppedRef.current) {
          startSpeaking();
        }
      }, 100);
    }
  }, [podcastState.isSpeaking, ttsAvailable, startSpeaking]);

  // Should a character be visible? (blind transcription logic)
  const isCharRevealed = useCallback((charIndex: number): boolean => {
    if (!enabled) return true;
    // Characters are transparent until correctly typed
    return podcastState.revealedChars.has(charIndex);
  }, [enabled, podcastState.revealedChars]);

  // Get text opacity for a character (for CSS)
  const getCharOpacity = useCallback((charIndex: number): number => {
    if (!enabled) return 1;
    // Already typed correctly => fully visible
    if (podcastState.revealedChars.has(charIndex)) return 1;
    // Current cursor position => hint opacity
    if (charIndex === inputValue.length) return 0.15;
    // Future characters => transparent
    return 0.05;
  }, [enabled, podcastState.revealedChars, inputValue.length]);

  // Reset state
  useEffect(() => {
    if (!testStarted) {
      stopSpeaking();
      setPodcastState(prev => ({
        ...prev,
        revealedChars: new Set(),
        progress: 0,
        isPaused: false,
      }));
    }
  }, [testStarted, stopSpeaking]);

  return {
    podcastState,
    ttsAvailable,
    startSpeaking,
    stopSpeaking,
    togglePause,
    setPlaybackSpeed,
    isCharRevealed,
    getCharOpacity,
    SPEEDS,
  };
}
