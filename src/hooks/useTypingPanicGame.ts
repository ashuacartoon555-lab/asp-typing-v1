import { useState, useEffect, useRef } from 'react';

export interface TypingPanicGameState {
  score: number;
  level: number;
  words: string[];
  currentWordIndex: number;
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  wpm: number;
  accuracy: number;
  correctWords: number;
  totalWords: number;
  timeLeft: number;
  difficulty: number;
}

const panicWords = {
  1: ['cat', 'dog', 'sun', 'rain', 'tree', 'book', 'fish', 'bird', 'home', 'car', 'pen', 'desk', 'lamp', 'door', 'wall'],
  2: ['water', 'mountain', 'forest', 'person', 'family', 'friend', 'school', 'office', 'market', 'garden', 'corner', 'shadow', 'moment', 'reason', 'nature'],
  3: ['programming', 'algorithm', 'database', 'network', 'internet', 'keyboard', 'monitor', 'software', 'developer', 'framework', 'interface', 'component', 'variable', 'function', 'operation'],
};

export const useTypingPanicGame = () => {
  const [state, setState] = useState<TypingPanicGameState>({
    score: 0,
    level: 1,
    words: [],
    currentWordIndex: 0,
    input: '',
    gameOver: false,
    gameStarted: false,
    wpm: 0,
    accuracy: 100,
    correctWords: 0,
    totalWords: 0,
    timeLeft: 90,
    difficulty: 1,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getWordsForLevel = (level: number): string[] => {
    const key = Math.min(level, 3) as keyof typeof panicWords;
    return [...panicWords[key]].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const initialWords = getWordsForLevel(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      words: initialWords,
      timeLeft: 90,
      difficulty: 1,
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

    if (newInput === currentWord) {
      const newWords = getWordsForLevel(state.level);
      const newCorrect = state.correctWords + 1;
      const newLevel = state.level + (newCorrect > 0 && newCorrect % 8 === 0 ? 1 : 0);

      setState(prev => ({
        ...prev,
        score: prev.score + (prev.level * 8),
        input: '',
        currentWordIndex: 0,
        words: newWords,
        level: newLevel,
        correctWords: newCorrect,
        totalWords: prev.totalWords + 1,
        timeLeft: Math.min(prev.timeLeft + 3, 120),
      }));
    } else if (!currentWord.startsWith(newInput)) {
      setState(prev => ({
        ...prev,
        input: '',
        totalWords: prev.totalWords + 1,
      }));
    } else {
      setState(prev => ({
        ...prev,
        input: newInput,
      }));
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      score: 0,
      level: 1,
      words: [],
      currentWordIndex: 0,
      input: '',
      gameOver: false,
      gameStarted: false,
      wpm: 0,
      accuracy: 100,
      correctWords: 0,
      totalWords: 0,
      timeLeft: 90,
      difficulty: 1,
    });
  };

  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;
    const minutes = (Date.now() - startTimeRef.current) / 60000;
    return Math.round((state.correctWords * 5) / minutes) || 0;
  };

  const accuracy = state.totalWords > 0 ? Math.round((state.correctWords / state.totalWords) * 100) : 100;

  return {
    ...state,
    accuracy,
    wpm: calculateWPM(),
    startGame,
    handleInput,
    resetGame,
  };
};
