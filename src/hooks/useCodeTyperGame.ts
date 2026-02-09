import { useState, useCallback, useEffect, useRef } from 'react';

const codeSnippets = [
  { code: "const x = 10;", language: "JavaScript" },
  { code: "let name = 'Hello';", language: "JavaScript" },
  { code: "function add(a, b) { return a + b; }", language: "JavaScript" },
  { code: "const arr = [1, 2, 3];", language: "JavaScript" },
  { code: "console.log('Hello World');", language: "JavaScript" },
  { code: "if (x > 5) { return true; }", language: "JavaScript" },
  { code: "for (let i = 0; i < 10; i++) {}", language: "JavaScript" },
  { code: "const obj = { key: 'value' };", language: "JavaScript" },
  { code: "arr.map(x => x * 2);", language: "JavaScript" },
  { code: "arr.filter(x => x > 5);", language: "JavaScript" },
  { code: "def hello(): print('Hi')", language: "Python" },
  { code: "for i in range(10): pass", language: "Python" },
  { code: "if x == 5: return True", language: "Python" },
  { code: "list = [1, 2, 3, 4, 5]", language: "Python" },
  { code: "dict = {'key': 'value'}", language: "Python" },
  { code: "<div className='box'></div>", language: "React" },
  { code: "useState(false);", language: "React" },
  { code: "useEffect(() => {}, []);", language: "React" },
  { code: "export default App;", language: "React" },
  { code: "import React from 'react';", language: "React" }
];

export const useCodeTyperGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentSnippet, setCurrentSnippet] = useState(codeSnippets[0]);
  const [inputValue, setInputValue] = useState('');
  const [snippetsCompleted, setSnippetsCompleted] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(90);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('codeTyperHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedSnippets = useRef<number[]>([]);

  const getRandomSnippet = useCallback(() => {
    let availableIndices = codeSnippets.map((_, i) => i).filter(i => !usedSnippets.current.includes(i));
    
    if (availableIndices.length === 0) {
      usedSnippets.current = [];
      availableIndices = codeSnippets.map((_, i) => i);
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedSnippets.current.push(randomIndex);
    return codeSnippets[randomIndex];
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSnippetsCompleted(0);
    setAccuracy(100);
    setTimeLeft(90);
    setStreak(0);
    setMaxStreak(0);
    setTotalChars(0);
    setCorrectChars(0);
    setInputValue('');
    usedSnippets.current = [];
    setCurrentSnippet(getRandomSnippet());

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [getRandomSnippet]);

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameStarted(false);
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('codeTyperHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);

    // Check if snippet is complete
    if (value === currentSnippet.code) {
      const snippetScore = currentSnippet.code.length * 10 * (1 + streak * 0.1);
      setScore(prev => prev + Math.round(snippetScore));
      setSnippetsCompleted(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
      setCorrectChars(prev => prev + currentSnippet.code.length);
      setTotalChars(prev => prev + currentSnippet.code.length);
      setInputValue('');
      setCurrentSnippet(getRandomSnippet());
    } else if (value.length > 0 && value[value.length - 1] !== currentSnippet.code[value.length - 1]) {
      setStreak(0);
      setTotalChars(prev => prev + 1);
    }

    // Update accuracy
    const newAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(newAccuracy);
  }, [currentSnippet, streak, correctChars, totalChars, getRandomSnippet]);

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
    currentSnippet,
    inputValue,
    snippetsCompleted,
    accuracy,
    timeLeft,
    streak,
    maxStreak,
    highScore,
    startGame,
    endGame,
    resetGame,
    handleInput
  };
};
