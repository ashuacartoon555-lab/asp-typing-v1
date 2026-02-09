import { useState, useEffect, useRef } from 'react';

export interface HangmanGameState {
  score: number;
  level: number;
  word: string;
  guessedLetters: string[];
  wrongGuesses: number;
  gameOver: boolean;
  gameStarted: boolean;
  isWon: boolean;
  accuracy: number;
  words: string[];
  totalGames: number;
  gamesWon: number;
}

const gameWords = {
  1: ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'book', 'fish', 'bird', 'home'],
  2: ['water', 'apple', 'music', 'house', 'plant', 'beach', 'cloud', 'river', 'dance', 'mountain'],
  3: ['programming', 'algorithm', 'keyboard', 'internet', 'database', 'network', 'software', 'developer'],
  4: ['typescript', 'javascript', 'asynchronous', 'performance', 'architecture', 'authentication', 'containerization'],
};

const MAX_WRONG_GUESSES = 6;

export const useHangmanGame = () => {
  const [state, setState] = useState<HangmanGameState>({
    score: 0,
    level: 1,
    word: '',
    guessedLetters: [],
    wrongGuesses: 0,
    gameOver: false,
    gameStarted: false,
    isWon: false,
    accuracy: 100,
    words: [],
    totalGames: 0,
    gamesWon: 0,
  });

  const getWordsForLevel = (level: number): string[] => {
    const key = Math.min(level, 4) as keyof typeof gameWords;
    return [...gameWords[key]].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const words = getWordsForLevel(1);
    const firstWord = words[0];
    setState(prev => ({
      ...prev,
      gameStarted: true,
      word: firstWord,
      words,
      guessedLetters: [],
      wrongGuesses: 0,
      totalGames: prev.totalGames + 1,
    }));
  };

  const guessLetter = (letter: string) => {
    if (!state.gameStarted || state.gameOver) return;
    if (state.guessedLetters.includes(letter)) return;

    const lowerLetter = letter.toLowerCase();
    const newGuessedLetters = [...state.guessedLetters, lowerLetter];
    const isCorrect = state.word.toLowerCase().includes(lowerLetter);
    const newWrongGuesses = isCorrect ? state.wrongGuesses : state.wrongGuesses + 1;

    // Check if word is complete
    const wordLetters = new Set(state.word.toLowerCase().split(''));
    const guessedLettersSet = new Set(newGuessedLetters);
    const isWon = Array.from(wordLetters).every(letter => guessedLettersSet.has(letter));

    // Check game over
    const isGameOver = newWrongGuesses >= MAX_WRONG_GUESSES || isWon;

    if (isWon) {
      setState(prev => ({
        ...prev,
        guessedLetters: newGuessedLetters,
        isWon: true,
        gameOver: true,
        score: prev.score + (prev.level * 20),
        gamesWon: prev.gamesWon + 1,
      }));
    } else if (isGameOver) {
      setState(prev => ({
        ...prev,
        guessedLetters: newGuessedLetters,
        wrongGuesses: newWrongGuesses,
        gameOver: true,
      }));
    } else {
      setState(prev => ({
        ...prev,
        guessedLetters: newGuessedLetters,
        wrongGuesses: newWrongGuesses,
      }));
    }
  };

  const nextWord = () => {
    const newLevel = state.isWon ? state.level + (state.gamesWon % 3 === 0 ? 1 : 0) : state.level;
    const words = getWordsForLevel(newLevel);
    const nextWord = words[0];

    setState(prev => ({
      ...prev,
      word: nextWord,
      words,
      guessedLetters: [],
      wrongGuesses: 0,
      gameOver: false,
      isWon: false,
      level: newLevel,
      totalGames: prev.totalGames + 1,
    }));
  };

  const resetGame = () => {
    setState({
      score: 0,
      level: 1,
      word: '',
      guessedLetters: [],
      wrongGuesses: 0,
      gameOver: false,
      gameStarted: false,
      isWon: false,
      accuracy: 100,
      words: [],
      totalGames: 0,
      gamesWon: 0,
    });
  };

  const getDisplayWord = () => {
    return state.word
      .split('')
      .map(letter => (state.guessedLetters.includes(letter.toLowerCase()) ? letter.toUpperCase() : '_'))
      .join(' ');
  };

  const accuracy = state.totalGames > 0 ? Math.round((state.gamesWon / state.totalGames) * 100) : 100;

  return {
    ...state,
    accuracy,
    displayWord: getDisplayWord(),
    maxWrongGuesses: MAX_WRONG_GUESSES,
    startGame,
    guessLetter,
    nextWord,
    resetGame,
  };
};
