import { useState, useEffect, useRef, useCallback } from 'react';
import { storageManager, GhostReplay } from '@/lib/storageManager';

interface UseGhostRacingProps {
  enabled: boolean;
  testStarted: boolean;
  inputValue: string;
  promptText: string;
  wpm: number;
}

interface GhostState {
  ghostIndex: number;         // Ghost cursor position (char index)
  userAhead: boolean;         // Is user ahead of ghost?
  ghostWpm: number;           // PB ghost's WPM
  gapChars: number;           // How many chars ahead/behind
  pbReplay: GhostReplay | null;
  hasPB: boolean;
}

export function useGhostRacing({
  enabled,
  testStarted,
  inputValue,
  promptText,
  wpm,
}: UseGhostRacingProps) {
  const [ghostState, setGhostState] = useState<GhostState>({
    ghostIndex: 0,
    userAhead: true,
    ghostWpm: 0,
    gapChars: 0,
    pbReplay: null,
    hasPB: false,
  });

  const ghostAnimRef = useRef<number | null>(null);
  const ghostStartTimeRef = useRef<number>(0);
  const ghostStartedRef = useRef<boolean>(false);
  const pbReplayRef = useRef<GhostReplay | null>(null);
  const inputLengthRef = useRef<number>(0);

  // Keep input length ref in sync without causing re-renders
  useEffect(() => {
    inputLengthRef.current = inputValue.length;
  }, [inputValue.length]);

  // Load PB replay on mount
  useEffect(() => {
    const replay = storageManager.getBestGhostReplay();
    pbReplayRef.current = replay;
    setGhostState(prev => ({
      ...prev,
      pbReplay: replay,
      hasPB: !!replay,
      ghostWpm: replay?.wpm || 0,
    }));
  }, []);

  // Reload PB after test completes (so post-test shows updated values)
  useEffect(() => {
    if (!testStarted && ghostStartedRef.current) {
      // Test just ended — reload PB
      ghostStartedRef.current = false;
      const replay = storageManager.getBestGhostReplay();
      pbReplayRef.current = replay;
      setGhostState(prev => ({
        ...prev,
        pbReplay: replay,
        hasPB: !!replay,
        ghostWpm: replay?.wpm || 0,
      }));
    }
  }, [testStarted]);

  // Start ghost animation ONCE when test starts (no inputValue.length dep)
  useEffect(() => {
    if (!enabled || !testStarted || !pbReplayRef.current) {
      if (ghostAnimRef.current) {
        cancelAnimationFrame(ghostAnimRef.current);
        ghostAnimRef.current = null;
      }
      return;
    }

    const replay = pbReplayRef.current;
    if (!replay || replay.keystrokes.length === 0) return;

    // Set start time ONCE
    ghostStartTimeRef.current = performance.now();
    ghostStartedRef.current = true;

    const animate = () => {
      const elapsed = performance.now() - ghostStartTimeRef.current;

      // Find ghost position based on elapsed time vs recorded keystrokes
      let ghostIdx = 0;
      for (let i = 0; i < replay.keystrokes.length; i++) {
        if (replay.keystrokes[i].timestamp <= elapsed) {
          ghostIdx = i + 1;
        } else {
          break;
        }
      }

      // Clamp to prompt length
      ghostIdx = Math.min(ghostIdx, promptText.length);

      // Read current user position from ref (no dependency needed)
      const userIdx = inputLengthRef.current;
      const gap = userIdx - ghostIdx;

      setGhostState(prev => ({
        ...prev,
        ghostIndex: ghostIdx,
        userAhead: gap >= 0,
        gapChars: Math.abs(gap),
      }));

      // Continue animation if test is still running
      ghostAnimRef.current = requestAnimationFrame(animate);
    };

    ghostAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (ghostAnimRef.current) {
        cancelAnimationFrame(ghostAnimRef.current);
        ghostAnimRef.current = null;
      }
    };
  }, [enabled, testStarted, promptText.length]);

  // Reset ghost on test end
  useEffect(() => {
    if (!testStarted) {
      setGhostState(prev => ({
        ...prev,
        ghostIndex: 0,
        userAhead: true,
        gapChars: 0,
      }));
    }
  }, [testStarted]);

  // Get cursor color based on position vs ghost
  const getCursorColor = useCallback((): string => {
    if (!enabled || !ghostState.hasPB) return 'text-primary';
    return ghostState.userAhead ? 'text-green-400' : 'text-red-400';
  }, [enabled, ghostState.hasPB, ghostState.userAhead]);

  // Get race status message
  const getRaceStatus = useCallback((): string => {
    if (!enabled || !ghostState.hasPB) return '';
    if (ghostState.gapChars === 0) return '⚔️ Tied with PB!';
    if (ghostState.userAhead) return `🟢 ${ghostState.gapChars} chars ahead of PB`;
    return `🔴 ${ghostState.gapChars} chars behind PB`;
  }, [enabled, ghostState.hasPB, ghostState.userAhead, ghostState.gapChars]);

  return {
    ghostState,
    getCursorColor,
    getRaceStatus,
  };
}
