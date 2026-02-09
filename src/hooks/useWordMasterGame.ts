import { useState, useCallback, useEffect, useRef } from 'react';
import { wordBanks } from '@/data/wordBanks';

interface Challenge {
  id: number;
  words: string[];
  timeLimit: number;
  completed: number;
}

export const useWordMasterGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [perfectChallenges, setPerfectChallenges] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('wordMasterHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const challengeIdRef = useRef(0);

  const generateChallenge = useCallback((): Challenge => {
    const wordCount = 5 + Math.floor(level / 2);
    const timeLimit = 30 + (level * 5);
    const difficulty = level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard';
    const words = wordBanks[difficulty];
    
    const challengeWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      challengeWords.push(words[Math.floor(Math.random() * words.length)]);
    }

    return {
      id: challengeIdRef.current++,
      words: challengeWords,
      timeLimit,
      completed: 0
    };
  }, [level]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setWordsCompleted(0);
    setPerfectChallenges(0);
    setInputValue('');
    setCurrentWordIndex(0);
    
    const challenge = generateChallenge();
    setCurrentChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
  }, [generateChallenge]);

  const nextChallenge = useCallback(() => {
    setLevel(prev => prev + 1);
    setCurrentWordIndex(0);
    setInputValue('');
    
    const challenge = generateChallenge();
    setCurrentChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
  }, [generateChallenge]);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(true);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('wordMasterHighScore', score.toString());
    }

    if (timerRef.current) clearInterval(timerRef.current);
  }, [score, highScore]);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);
    
    if (!currentChallenge) return;
    
    const currentWord = currentChallenge.words[currentWordIndex];
    const trimmedValue = value.trim();
    
    if (trimmedValue === currentWord) {
      const pointsEarned = currentWord.length * 10 * level;
      setScore(prev => prev + pointsEarned);
      setWordsCompleted(prev => prev + 1);
      setInputValue('');
      
      if (currentWordIndex + 1 >= currentChallenge.words.length) {
        // Challenge complete
        const bonus = timeLeft * 5;
        setScore(prev => prev + bonus);
        setPerfectChallenges(prev => prev + 1);
        
        if (level >= 10) {
          endGame();
        } else {
          nextChallenge();
        }
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
    }
  }, [currentChallenge, currentWordIndex, level, timeLeft, endGame, nextChallenge]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, endGame]);

  const resetGame = useCallback(() => {
    setGameOver(false);
    setGameStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    gameStarted,
    gameOver,
    score,
    level,
    currentChallenge,
    currentWordIndex,
    inputValue,
    timeLeft,
    wordsCompleted,
    perfectChallenges,
    highScore,
    startGame,
    endGame,
    resetGame,
    handleInput
  };
};
