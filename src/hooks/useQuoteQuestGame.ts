import { useState, useCallback, useEffect, useRef } from 'react';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" }
];

export const useQuoteQuestGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [inputValue, setInputValue] = useState('');
  const [quotesCompleted, setQuotesCompleted] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [wpm, setWpm] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('quoteQuestHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const usedQuotes = useRef<number[]>([]);

  const getRandomQuote = useCallback(() => {
    let availableIndices = quotes.map((_, i) => i).filter(i => !usedQuotes.current.includes(i));
    
    if (availableIndices.length === 0) {
      usedQuotes.current = [];
      availableIndices = quotes.map((_, i) => i);
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedQuotes.current.push(randomIndex);
    return quotes[randomIndex];
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setQuotesCompleted(0);
    setAccuracy(100);
    setTotalChars(0);
    setCorrectChars(0);
    setTimeLeft(120);
    setWpm(0);
    setInputValue('');
    usedQuotes.current = [];
    setCurrentQuote(getRandomQuote());
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
  }, [getRandomQuote]);

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameStarted(false);
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('quoteQuestHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);

    // Check accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentQuote.text[i]) {
        correct++;
      }
    }

    // Check if quote is complete
    if (value === currentQuote.text) {
      const quoteScore = currentQuote.text.length * 5;
      setScore(prev => prev + quoteScore);
      setQuotesCompleted(prev => prev + 1);
      setCorrectChars(prev => prev + currentQuote.text.length);
      setTotalChars(prev => prev + currentQuote.text.length);
      setInputValue('');
      setCurrentQuote(getRandomQuote());

      // Calculate WPM
      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      const totalWords = (correctChars + currentQuote.text.length) / 5;
      setWpm(Math.round(totalWords / elapsedMinutes));
    }

    // Update accuracy
    if (totalChars + value.length > 0) {
      const currentCorrect = correctChars + correct;
      const currentTotal = totalChars + value.length;
      setAccuracy(Math.round((currentCorrect / currentTotal) * 100));
    }
  }, [currentQuote, correctChars, totalChars, getRandomQuote]);

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
    score,
    currentQuote,
    inputValue,
    quotesCompleted,
    accuracy,
    timeLeft,
    wpm,
    highScore,
    startGame,
    endGame,
    resetGame,
    handleInput
  };
};
