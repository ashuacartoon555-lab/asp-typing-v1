import { useState, useEffect, useRef } from 'react';

export interface SpellBeeGameState {
  score: number;
  level: number;
  word: string;
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  correctWords: number;
  wrongWords: number;
  wpm: number;
  totalWords: number;
}

const spellWords = {
  1: ['beautiful', 'necessary', 'accommodate', 'definitely', 'separate', 'privilege', 'believe', 'receive', 'achieve', 'conceive'],
  2: ['conscience', 'bureaucracy', 'lieutenant', 'rhythm', 'amateur', 'liaison', 'parallel', 'questionnaire', 'maintenance', 'surveillance'],
  3: ['onomatopoeia', 'pneumonia', 'diarrhea', 'colleague', 'bureaucrat', 'pharmaceutical', 'conscientious', 'unconscionable', 'serendipity', 'miscellaneous'],
};

export const useSpellBeeGame = () => {
  const [state, setState] = useState<SpellBeeGameState>({
    score: 0,
    level: 1,
    word: '',
    input: '',
    gameOver: false,
    gameStarted: false,
    correctWords: 0,
    wrongWords: 0,
    wpm: 0,
    totalWords: 0,
  });

  const startTimeRef = useRef<number>(0);

  const getWordsForLevel = (level: number): string[] => {
    const key = Math.min(level, 3) as keyof typeof spellWords;
    return [...spellWords[key]].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const words = getWordsForLevel(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      word: words[0],
    }));
    startTimeRef.current = Date.now();
  };

  const submitWord = () => {
    if (!state.gameStarted || state.gameOver) return;
    if (state.input.trim() === '') return;

    const isCorrect = state.input.toLowerCase().trim() === state.word.toLowerCase();
    const newCorrect = isCorrect ? state.correctWords + 1 : state.correctWords;
    const newWrong = isCorrect ? state.wrongWords : state.wrongWords + 1;
    const newTotal = newCorrect + newWrong;

    if (newWrong >= 3) {
      setState(prev => ({
        ...prev,
        gameOver: true,
        correctWords: newCorrect,
        wrongWords: newWrong,
        totalWords: newTotal,
      }));
    } else {
      const words = getWordsForLevel(state.level);
      const nextWord = words[Math.floor(Math.random() * words.length)];
      const newLevel = state.level + (newCorrect > 0 && newCorrect % 5 === 0 ? 1 : 0);

      setState(prev => ({
        ...prev,
        word: nextWord,
        input: '',
        score: prev.score + (isCorrect ? prev.level * 10 : 0),
        correctWords: newCorrect,
        wrongWords: newWrong,
        totalWords: newTotal,
        level: newLevel,
      }));
    }
  };

  const resetGame = () => {
    setState({
      score: 0,
      level: 1,
      word: '',
      input: '',
      gameOver: false,
      gameStarted: false,
      correctWords: 0,
      wrongWords: 0,
      wpm: 0,
      totalWords: 0,
    });
  };

  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;
    const minutes = (Date.now() - startTimeRef.current) / 60000;
    return Math.round((state.correctWords * 5) / minutes) || 0;
  };

  return {
    ...state,
    wpm: calculateWPM(),
    accuracy: state.totalWords > 0 ? Math.round((state.correctWords / state.totalWords) * 100) : 100,
    startGame,
    submitWord,
    setInput: (value: string) => setState(prev => ({ ...prev, input: value })),
    resetGame,
  };
};
