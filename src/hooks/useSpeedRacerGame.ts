import { useState, useCallback, useEffect, useRef } from 'react';
import { wordBanks } from '@/data/wordBanks';

export const useSpeedRacerGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [carPosition, setCarPosition] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('speedRacerHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getRandomWord = useCallback(() => {
    const allWords = [...wordBanks.easy, ...wordBanks.medium.slice(0, 30)];
    return allWords[Math.floor(Math.random() * allWords.length)];
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setWordsCompleted(0);
    setTimeLeft(60);
    setStreak(0);
    setMaxStreak(0);
    setWpm(0);
    setAccuracy(100);
    setTotalChars(0);
    setCorrectChars(0);
    setCarPosition(0);
    setInputValue('');
    setCurrentWord(getRandomWord());
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [getRandomWord]);

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameStarted(false);
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('speedRacerHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);

    // Calculate accuracy in real-time
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentWord[i]) {
        correct++;
      }
    }

    // Check if word is complete
    if (value === currentWord) {
      const wordScore = currentWord.length * 10 * (1 + streak * 0.1);
      setScore(prev => prev + Math.round(wordScore));
      setWordsCompleted(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
      setCorrectChars(prev => prev + currentWord.length);
      setTotalChars(prev => prev + currentWord.length);
      setCarPosition(prev => Math.min(prev + 5, 100));
      setInputValue('');
      setCurrentWord(getRandomWord());

      // Calculate WPM
      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      const totalWords = (correctChars + currentWord.length) / 5;
      setWpm(Math.round(totalWords / elapsedMinutes));
    } else if (value.length > 0 && value[value.length - 1] !== currentWord[value.length - 1]) {
      // Wrong character
      setStreak(0);
      setTotalChars(prev => prev + 1);
    }

    // Update accuracy
    const newAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(newAccuracy);
  }, [currentWord, streak, correctChars, totalChars, getRandomWord]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameOver(false);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameStarted,
    gameOver,
    currentWord,
    inputValue,
    score,
    wordsCompleted,
    timeLeft,
    streak,
    maxStreak,
    wpm,
    accuracy,
    carPosition,
    highScore,
    startGame,
    endGame,
    resetGame,
    handleInput
  };
};
