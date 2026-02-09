import { useState, useEffect, useRef } from 'react';

export interface WordRecord {
  word: string;
  userTyped: string;
  isCorrect: boolean;
  roundNumber: number;
}

export interface MemoryMatrixGameState {
  score: number;
  level: number;
  words: string[];
  displayWords: string[];
  showWords: boolean;
  input: string;
  currentWordIndex: number;
  gameOver: boolean;
  gameStarted: boolean;
  correctWords: number;
  totalWords: number;
  flashDuration: number;
  wordHistory: WordRecord[];
}

const wordSets = {
  1: ['cat', 'dog', 'sun', 'tree', 'book'],
  2: ['water', 'mountain', 'garden', 'ocean', 'forest', 'castle', 'bridge'],
  3: ['programming', 'algorithm', 'database', 'network', 'developer', 'interface', 'framework', 'component'],
};

export const useMemoryMatrixGame = () => {
  const [state, setState] = useState<MemoryMatrixGameState>({
    score: 0,
    level: 1,
    words: [],
    displayWords: [],
    showWords: false,
    input: '',
    currentWordIndex: 0,
    gameOver: false,
    gameStarted: false,
    correctWords: 0,
    totalWords: 0,
    flashDuration: 3000,
    wordHistory: [],
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getWordsForLevel = (level: number): string[] => {
    const key = Math.min(level, 3) as keyof typeof wordSets;
    const allWords = wordSets[key];
    const count = Math.min(3 + level, 8);
    return [...allWords].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const startGame = () => {
    const words = getWordsForLevel(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      words,
      displayWords: words,
      showWords: true,
      flashDuration: 3000,
    }));

    // Hide words after flash duration
    timerRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        showWords: false,
      }));
    }, 3000);
  };

  const submitWord = () => {
    if (!state.gameStarted || state.gameOver || state.showWords) return;
    if (state.input.trim() === '') return;

    const isCorrect = state.input.toLowerCase().trim() === state.words[state.currentWordIndex].toLowerCase();
    const newCorrect = isCorrect ? state.correctWords + 1 : state.correctWords;
    const newIndex = state.currentWordIndex + 1;

    // Record this word attempt
    const record: WordRecord = {
      word: state.words[state.currentWordIndex],
      userTyped: state.input.trim(),
      isCorrect,
      roundNumber: state.level,
    };

    // Check if all words typed
    if (newIndex >= state.words.length) {
      // Round complete
      const accuracy = Math.round((newCorrect / state.words.length) * 100);
      
      if (accuracy >= 70) {
        // Next level
        const newLevel = state.level + 1;
        const newWords = getWordsForLevel(newLevel);
        const newDuration = Math.max(1500, 3000 - (newLevel * 300));

        setState(prev => ({
          ...prev,
          level: newLevel,
          words: newWords,
          displayWords: newWords,
          showWords: true,
          input: '',
          currentWordIndex: 0,
          score: prev.score + (prev.level * 30 * accuracy / 100),
          correctWords: newCorrect,
          totalWords: prev.totalWords + prev.words.length,
          flashDuration: newDuration,
          wordHistory: [...prev.wordHistory, record],
        }));

        timerRef.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            showWords: false,
          }));
        }, newDuration);
      } else {
        // Game over
        setState(prev => ({
          ...prev,
          gameOver: true,
          correctWords: newCorrect,
          totalWords: prev.totalWords + prev.words.length,
          wordHistory: [...prev.wordHistory, record],
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        input: '',
        currentWordIndex: newIndex,
        correctWords: newCorrect,
        wordHistory: [...prev.wordHistory, record],
      }));
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({
      score: 0,
      wordHistory: [],
      level: 1,
      words: [],
      displayWords: [],
      showWords: false,
      input: '',
      currentWordIndex: 0,
      gameOver: false,
      gameStarted: false,
      correctWords: 0,
      totalWords: 0,
      flashDuration: 3000,
    });
  };

  const accuracy = state.totalWords > 0 ? Math.round((state.correctWords / state.totalWords) * 100) : 100;

  return {
    ...state,
    accuracy,
    submitWord,
    setInput: (value: string) => setState(prev => ({ ...prev, input: value })),
    resetGame,
    startGame,
  };
};
