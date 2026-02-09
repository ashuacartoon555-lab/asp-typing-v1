import { useState, useCallback, useEffect, useRef } from 'react';
import { wordBanks } from '@/data/wordBanks';

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

export const useWordRainGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [wordsTyped, setWordsTyped] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('wordRainHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const wordIdRef = useRef(0);
  const containerHeight = 400;

  const getRandomWord = useCallback(() => {
    const allWords = [...wordBanks.easy, ...wordBanks.medium.slice(0, 20)];
    return allWords[Math.floor(Math.random() * allWords.length)];
  }, []);

  const spawnWord = useCallback(() => {
    const newWord: FallingWord = {
      id: wordIdRef.current++,
      word: getRandomWord(),
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: 0,
      speed: 0.5 + (level * 0.2) + (Math.random() * 0.3)
    };
    setWords(prev => [...prev, newWord]);
  }, [level, getRandomWord]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    setWords([]);
    setInputValue('');
    setWordsTyped(0);
    wordIdRef.current = 0;
  }, []);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(true);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('wordRainHighScore', score.toString());
    }

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
  }, [score, highScore]);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);
    
    const trimmedValue = value.trim().toLowerCase();
    const matchedIndex = words.findIndex(w => w.word.toLowerCase() === trimmedValue);
    
    if (matchedIndex !== -1) {
      const matchedWord = words[matchedIndex];
      const pointsEarned = matchedWord.word.length * 10 * level;
      
      setScore(prev => prev + pointsEarned);
      setWordsTyped(prev => prev + 1);
      setWords(prev => prev.filter(w => w.id !== matchedWord.id));
      setInputValue('');

      // Level up every 10 words
      if ((wordsTyped + 1) % 10 === 0) {
        setLevel(prev => Math.min(prev + 1, 10));
      }
    }
  }, [words, level, wordsTyped]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setWords(prev => {
        const updated = prev.map(word => ({
          ...word,
          y: word.y + word.speed
        }));

        // Check for words that hit the bottom
        const fallen = updated.filter(w => w.y >= containerHeight - 30);
        if (fallen.length > 0) {
          setLives(l => {
            const newLives = l - fallen.length;
            if (newLives <= 0) {
              endGame();
            }
            return Math.max(0, newLives);
          });
        }

        return updated.filter(w => w.y < containerHeight - 30);
      });
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, endGame]);

  // Spawn words
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = Math.max(2000 - (level * 150), 800);
    
    spawnRef.current = setInterval(spawnWord, spawnInterval);
    spawnWord(); // Spawn first word immediately

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameStarted, gameOver, level, spawnWord]);

  const resetGame = useCallback(() => {
    setGameOver(false);
    setGameStarted(false);
  }, []);

  return {
    gameStarted,
    gameOver,
    score,
    level,
    lives,
    words,
    inputValue,
    wordsTyped,
    highScore,
    containerHeight,
    startGame,
    endGame,
    resetGame,
    handleInput
  };
};
