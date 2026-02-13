import { useState, useEffect, useRef, useCallback } from 'react';
import { storageManager, GhostReplay } from '@/lib/storageManager';

interface UseGhostRacingProps {
  enabled: boolean;
  testStarted: boolean;
  testCompleted: boolean;
  inputValue: string;
  promptText: string;
  wpm: number;
  timeTaken: number;   // seconds elapsed in current test
}

type RacePosition = 'ahead' | 'behind' | 'tied';

interface GhostState {
  ghostIndex: number;         // Ghost cursor position (char index)
  position: RacePosition;     // ahead / behind / tied
  ghostWpm: number;           // PB ghost's WPM
  gapChars: number;           // How many chars ahead/behind
  gapSeconds: number;         // Time gap in seconds (for result)
  pbReplay: GhostReplay | null;
  hasPB: boolean;
  raceFinished: boolean;      // True after test completes
  userBeatGhost: boolean;     // Did user win?
}

export function useGhostRacing({
  enabled,
  testStarted,
  testCompleted,
  inputValue,
  promptText,
  wpm,
  timeTaken,
}: UseGhostRacingProps) {
  const [ghostState, setGhostState] = useState<GhostState>({
    ghostIndex: 0,
    position: 'tied',
    ghostWpm: 0,
    gapChars: 0,
    gapSeconds: 0,
    pbReplay: null,
    hasPB: false,
    raceFinished: false,
    userBeatGhost: false,
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
    if (testCompleted && ghostStartedRef.current) {
      ghostStartedRef.current = false;

      // Compute final result
      const replay = pbReplayRef.current;
      const userFinishTime = timeTaken;
      const ghostFinishTime = replay ? replay.totalTime : 0;
      const userBeat = wpm > (replay?.wpm || 0);
      const timeDiff = Math.abs(userFinishTime - ghostFinishTime);

      setGhostState(prev => ({
        ...prev,
        raceFinished: true,
        userBeatGhost: userBeat,
        gapSeconds: Math.round(timeDiff),
      }));

      // Reload PB (may have been updated by useTypingTest)
      setTimeout(() => {
        const newReplay = storageManager.getBestGhostReplay();
        pbReplayRef.current = newReplay;
        setGhostState(prev => ({
          ...prev,
          pbReplay: newReplay,
          hasPB: !!newReplay,
          ghostWpm: newReplay?.wpm || 0,
        }));
      }, 100);
    }
  }, [testCompleted, timeTaken, wpm]);

  // Ghost animation using requestAnimationFrame (Step 6 & 13)
  // Ghost starts when user types first key (testStarted becomes true)
  // Ghost continues even if user pauses (Step 10)
  useEffect(() => {
    if (!enabled || !testStarted || testCompleted || !pbReplayRef.current) {
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

      // Find ghost position based on elapsed time vs recorded keystrokes (Step 7)
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

      // Step 8: Position logic with tolerance band
      let position: RacePosition;
      if (Math.abs(gap) <= 2) {
        position = 'tied';      // Within 2 chars = YELLOW / Matching Pace
      } else if (gap > 0) {
        position = 'ahead';     // GREEN
      } else {
        position = 'behind';    // RED
      }

      setGhostState(prev => ({
        ...prev,
        ghostIndex: ghostIdx,
        position,
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
  }, [enabled, testStarted, testCompleted, promptText.length]);

  // Reset ghost on new test start
  useEffect(() => {
    if (!testStarted && !testCompleted) {
      setGhostState(prev => ({
        ...prev,
        ghostIndex: 0,
        position: 'tied',
        gapChars: 0,
        gapSeconds: 0,
        raceFinished: false,
        userBeatGhost: false,
      }));
    }
  }, [testStarted, testCompleted]);

  // Step 8: Get border/cursor color based on position vs ghost
  const getCursorColor = useCallback((): string => {
    if (!enabled || !ghostState.hasPB) return 'text-primary';
    switch (ghostState.position) {
      case 'ahead':  return 'text-green-400';
      case 'behind': return 'text-red-400';
      case 'tied':   return 'text-yellow-400';
    }
  }, [enabled, ghostState.hasPB, ghostState.position]);

  // Step 8: Get border color for race track
  const getBorderColor = useCallback((): string => {
    if (!enabled || !ghostState.hasPB) return 'border-slate-500/30';
    switch (ghostState.position) {
      case 'ahead':  return 'border-green-500/40';
      case 'behind': return 'border-red-500/40';
      case 'tied':   return 'border-yellow-500/40';
    }
  }, [enabled, ghostState.hasPB, ghostState.position]);

  // Step 9: Get race status message
  const getRaceStatus = useCallback((): string => {
    if (!enabled || !ghostState.hasPB) return '';
    switch (ghostState.position) {
      case 'ahead':  return `🟢 ${ghostState.gapChars} chars ahead of PB`;
      case 'behind': return `🔴 ${ghostState.gapChars} chars behind PB`;
      case 'tied':   return '🟡 Matching Pace!';
    }
  }, [enabled, ghostState.hasPB, ghostState.position, ghostState.gapChars]);

  // Step 15: Get result message for post-test
  const getResultMessage = useCallback((): string => {
    if (!ghostState.raceFinished || !ghostState.hasPB) return '';
    if (ghostState.userBeatGhost) {
      return `🏆 You beat your ghost by ${ghostState.gapSeconds}s!`;
    }
    if (wpm === ghostState.ghostWpm) {
      return '⚔️ Exactly tied with your ghost!';
    }
    return `👻 Ghost was faster by ${ghostState.gapSeconds}s`;
  }, [ghostState.raceFinished, ghostState.hasPB, ghostState.userBeatGhost, ghostState.gapSeconds, wpm, ghostState.ghostWpm]);

  return {
    ghostState,
    getCursorColor,
    getBorderColor,
    getRaceStatus,
    getResultMessage,
  };
}
