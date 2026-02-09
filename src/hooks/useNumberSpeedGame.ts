import { useState, useEffect, useRef } from 'react';

export interface NumberSpeedGameState {
  score: number;
  level: number;
  numbers: string;
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  correctNumbers: number;
  totalNumbers: number;
  timeLeft: number;
  wpm: number;
}

const numberPatterns = {
  1: [
    '123456', '789012', '345678', '901234', '567890',
    '147258', '369147', '258369', '159357', '246813'
  ],
  2: [
    '1234567890', '9876543210', '2468013579', '1357924680',
    '5678901234', '4567890123', '3456789012', '2345678901'
  ],
  3: [
    '12345678901234', '98765432109876', '13579246802468',
    '24681357902468', '56789012345678', '11223344556677'
  ],
};

export const useNumberSpeedGame = () => {
  const [state, setState] = useState<NumberSpeedGameState>({
    score: 0,
    level: 1,
    numbers: '',
    input: '',
    gameOver: false,
    gameStarted: false,
    correctNumbers: 0,
    totalNumbers: 0,
    timeLeft: 120,
    wpm: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getNumbersForLevel = (level: number): string => {
    const key = Math.min(level, 3) as keyof typeof numberPatterns;
    const patterns = numberPatterns[key];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const startGame = () => {
    const firstNumbers = getNumbersForLevel(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      numbers: firstNumbers,
      timeLeft: 120,
    }));
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!state.gameStarted || state.gameOver) return;

    timerRef.current = setInterval(() => {
      setState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          return { ...prev, gameOver: true, timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.gameStarted, state.gameOver]);

  const handleInput = (value: string) => {
    setState(prev => ({
      ...prev,
      input: value,
    }));

    if (value === state.numbers) {
      const newNumbers = getNumbersForLevel(state.level);
      const newCorrect = state.correctNumbers + 1;
      const newLevel = state.level + (newCorrect > 0 && newCorrect % 6 === 0 ? 1 : 0);

      setState(prev => ({
        ...prev,
        score: prev.score + (prev.level * 12),
        numbers: newNumbers,
        input: '',
        correctNumbers: newCorrect,
        totalNumbers: prev.totalNumbers + 1,
        level: newLevel,
        timeLeft: Math.min(prev.timeLeft + 8, 150),
      }));
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      score: 0,
      level: 1,
      numbers: '',
      input: '',
      gameOver: false,
      gameStarted: false,
      correctNumbers: 0,
      totalNumbers: 0,
      timeLeft: 120,
      wpm: 0,
    });
  };

  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;
    const minutes = (Date.now() - startTimeRef.current) / 60000;
    return Math.round((state.correctNumbers * 5) / minutes) || 0;
  };

  const accuracy = state.totalNumbers > 0 ? Math.round((state.correctNumbers / state.totalNumbers) * 100) : 100;

  return {
    ...state,
    accuracy,
    wpm: calculateWPM(),
    startGame,
    handleInput,
    resetGame,
  };
};
