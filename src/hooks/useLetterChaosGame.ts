import { useState, useEffect, useRef } from 'react';

export interface LetterChaosGameState {
  score: number;
  level: number;
  scrambledWord: string;
  originalWord: string;
  words: string[];
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  wpm: number;
  accuracy: number;
  totalAttempts: number;
  correctAttempts: number;
  timeLeft: number;
  streak: number;
}

const levelWords = {
  1: ['cat', 'dog', 'sun', 'moon', 'star', 'book', 'tree', 'fish', 'bird', 'home', 'car', 'pen'],
  2: ['water', 'apple', 'music', 'house', 'plant', 'stone', 'beach', 'cloud', 'river', 'dance'],
  3: ['programming', 'algorithm', 'database', 'network', 'keyboard', 'monitor', 'internet', 'software'],
  4: ['typescript', 'javascript', 'asynchronous', 'performance', 'architecture', 'authentication'],
};

const scrambleWord = (word: string): string => {
  return word.split('').sort(() => Math.random() - 0.5).join('');
};

export const useLetterChaosGame = () => {
  const [state, setState] = useState<LetterChaosGameState>({
    score: 0,
    level: 1,
    scrambledWord: '',
    originalWord: '',
    words: [],
    input: '',
    gameOver: false,
    gameStarted: false,
    wpm: 0,
    accuracy: 100,
    totalAttempts: 0,
    correctAttempts: 0,
    timeLeft: 120,
    streak: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getWordsForLevel = (level: number): string[] => {
    const key = Math.min(level, 4) as keyof typeof levelWords;
    return [...levelWords[key]].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const words = getWordsForLevel(1);
    const firstWord = words[0];
    setState(prev => ({
      ...prev,
      gameStarted: true,
      words,
      originalWord: firstWord,
      scrambledWord: scrambleWord(firstWord),
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
    if (!state.gameStarted || state.gameOver) return;

    setState(prev => ({
      ...prev,
      input: value,
    }));

    if (value.toLowerCase() === state.originalWord.toLowerCase()) {
      const newWords = getWordsForLevel(state.level);
      const nextWord = newWords[0];
      const newLevel = state.level + (state.totalAttempts > 0 && state.totalAttempts % 5 === 0 ? 1 : 0);

      setState(prev => ({
        ...prev,
        score: prev.score + (prev.level * 15),
        input: '',
        originalWord: nextWord,
        scrambledWord: scrambleWord(nextWord),
        words: newWords,
        level: newLevel,
        totalAttempts: prev.totalAttempts + 1,
        correctAttempts: prev.correctAttempts + 1,
        streak: prev.streak + 1,
        timeLeft: Math.min(prev.timeLeft + 10, 180),
      }));
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      score: 0,
      level: 1,
      scrambledWord: '',
      originalWord: '',
      words: [],
      input: '',
      gameOver: false,
      gameStarted: false,
      wpm: 0,
      accuracy: 100,
      totalAttempts: 0,
      correctAttempts: 0,
      timeLeft: 120,
      streak: 0,
    });
  };

  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;
    const minutes = (Date.now() - startTimeRef.current) / 60000;
    return Math.round((state.correctAttempts * 5) / minutes) || 0;
  };

  const accuracy = state.totalAttempts > 0 ? Math.round((state.correctAttempts / state.totalAttempts) * 100) : 100;

  return {
    ...state,
    accuracy,
    wpm: calculateWPM(),
    startGame,
    handleInput,
    resetGame,
  };
};
