import { useState, useEffect, useRef } from 'react';

export interface TimeBombGameState {
  score: number;
  level: number;
  timeLeft: number;
  words: string[];
  currentWordIndex: number;
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  wpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  lives: number;
}

const wordSets = {
  level1: ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'book', 'fish', 'bird', 'home'],
  level2: ['water', 'river', 'mountain', 'forest', 'ocean', 'island', 'valley', 'castle', 'bridge', 'garden'],
  level3: ['programming', 'algorithm', 'database', 'network', 'security', 'developer', 'framework', 'interface', 'component', 'variable'],
  level4: ['typescript', 'javascript', 'asynchronous', 'optimization', 'performance', 'architecture', 'authentication', 'deployment', 'containerization', 'infrastructure'],
};

export const useTimeBombGame = () => {
  const [state, setState] = useState<TimeBombGameState>({
    score: 0,
    level: 1,
    timeLeft: 60,
    words: [],
    currentWordIndex: 0,
    input: '',
    gameOver: false,
    gameStarted: false,
    wpm: 0,
    accuracy: 100,
    totalChars: 0,
    correctChars: 0,
    lives: 3,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getWordsForLevel = (level: number): string[] => {
    const key = `level${Math.min(level, 4)}` as keyof typeof wordSets;
    return [...wordSets[key]].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const initialWords = getWordsForLevel(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      words: initialWords,
      timeLeft: 60,
      lives: 3,
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

  const handleInput = (char: string) => {
    if (!state.gameStarted || state.gameOver) return;

    const currentWord = state.words[state.currentWordIndex];
    const newInput = state.input + char;

    let newCorrect = state.correctChars;
    let newTotal = state.totalChars + 1;

    if (char === currentWord[state.input.length]) {
      newCorrect += 1;
    }

    if (newInput === currentWord) {
      const newWords = getWordsForLevel(state.level);
      const newLevel = state.level + (state.currentWordIndex >= 5 ? 1 : 0);
      setState(prev => ({
        ...prev,
        score: prev.score + (prev.level * 10),
        input: '',
        currentWordIndex: 0,
        words: newWords,
        level: newLevel,
        totalChars: newTotal,
        correctChars: newCorrect,
        timeLeft: Math.min(prev.timeLeft + 5, 99),
      }));
    } else if (!currentWord.startsWith(newInput)) {
      if (state.lives <= 1) {
        setState(prev => ({ ...prev, gameOver: true, lives: 0 }));
      } else {
        setState(prev => ({
          ...prev,
          input: '',
          lives: prev.lives - 1,
          totalChars: newTotal,
          correctChars: newCorrect,
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        input: newInput,
        totalChars: newTotal,
        correctChars: newCorrect,
      }));
    }
  };

  const handleBackspace = () => {
    if (!state.gameStarted || state.gameOver) return;
    setState(prev => ({
      ...prev,
      input: prev.input.slice(0, -1),
    }));
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      score: 0,
      level: 1,
      timeLeft: 60,
      words: [],
      currentWordIndex: 0,
      input: '',
      gameOver: false,
      gameStarted: false,
      wpm: 0,
      accuracy: 100,
      totalChars: 0,
      correctChars: 0,
      lives: 3,
    });
  };

  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;
    const minutes = (Date.now() - startTimeRef.current) / 60000;
    return Math.round((state.score / 10) / minutes) || 0;
  };

  const accuracy = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 100;

  return {
    ...state,
    accuracy,
    wpm: calculateWPM(),
    startGame,
    handleInput,
    handleBackspace,
    resetGame,
  };
};
