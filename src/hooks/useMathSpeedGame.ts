import { useState, useEffect, useRef } from 'react';

export interface AnswerRecord {
  equation: string;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
}

export interface MathSpeedGameState {
  score: number;
  level: number;
  equation: string;
  answer: number;
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  correctAnswers: number;
  totalAnswers: number;
  timeLeft: number;
  wpm: number;
  answerHistory: AnswerRecord[];
}

const generateEquation = (level: number): { equation: string; answer: number } => {
  const maxNum = Math.min(10 + level * 5, 100);
  
  if (level <= 2) {
    // Addition and Subtraction
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    
    if (op === '+') {
      return { equation: `${a} + ${b}`, answer: a + b };
    } else {
      const larger = Math.max(a, b);
      const smaller = Math.min(a, b);
      return { equation: `${larger} - ${smaller}`, answer: larger - smaller };
    }
  } else if (level <= 4) {
    // Include multiplication
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * (maxNum / 2)) + 1;
    const b = Math.floor(Math.random() * (maxNum / 2)) + 1;
    
    switch (op) {
      case '+':
        return { equation: `${a} + ${b}`, answer: a + b };
      case '-':
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        return { equation: `${larger} - ${smaller}`, answer: larger - smaller };
      case '×':
        return { equation: `${a} × ${b}`, answer: a * b };
      default:
        return { equation: `${a} + ${b}`, answer: a + b };
    }
  } else {
    // Include division
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    if (op === '÷') {
      const divisor = Math.floor(Math.random() * 9) + 2;
      const quotient = Math.floor(Math.random() * 12) + 1;
      const dividend = divisor * quotient;
      return { equation: `${dividend} ÷ ${divisor}`, answer: quotient };
    } else {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      
      switch (op) {
        case '+':
          return { equation: `${a} + ${b}`, answer: a + b };
        case '-':
          const larger = Math.max(a, b);
          const smaller = Math.min(a, b);
          return { equation: `${larger} - ${smaller}`, answer: larger - smaller };
        case '×':
          return { equation: `${a} × ${b}`, answer: a * b };
        default:
          return { equation: `${a} + ${b}`, answer: a + b };
      }
    }
  }
};

export const useMathSpeedGame = () => {
  const [state, setState] = useState<MathSpeedGameState>({
    score: 0,
    level: 1,
    equation: '',
    answer: 0,
    input: '',
    gameOver: false,
    gameStarted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    timeLeft: 90,
    wpm: 0,
    answerHistory: [],
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    const { equation, answer } = generateEquation(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      equation,
      answer,
      timeLeft: 90,
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

  const submitAnswer = () => {
    if (!state.gameStarted || state.gameOver) return;
    if (state.input.trim() === '') return;

    const userAnswer = parseInt(state.input.trim());
    const isCorrect = userAnswer === state.answer;
    const newCorrect = isCorrect ? state.correctAnswers + 1 : state.correctAnswers;
    const newLevel = state.level + (newCorrect > 0 && newCorrect % 10 === 0 ? 1 : 0);
// Record this answer
    const record: AnswerRecord = {
      equation: state.equation,
      correctAnswer: state.answer,
      userAnswer: isNaN(userAnswer) ? 0 : userAnswer,
      isCorrect,
    };

    const { equation, answer } = generateEquation(newLevel);

    setState(prev => ({
      ...prev,
      equation,
      answer,
      input: '',
      score: prev.score + (isCorrect ? prev.level * 15 : 0),
      correctAnswers: newCorrect,
      totalAnswers: prev.totalAnswers + 1,
      level: newLevel,
      timeLeft: isCorrect ? Math.min(prev.timeLeft + 5, 120) : prev.timeLeft,
      answerHistory: [...prev.answerHistory, record],
    }));
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      score: 0,
      level: 1,
      answerHistory: [],
      equation: '',
      answer: 0,
      input: '',
      gameOver: false,
      gameStarted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      timeLeft: 90,
      wpm: 0,
    });
  };

  const calculateWPM = () => {
    if (!startTimeRef.current) return 0;
    const minutes = (Date.now() - startTimeRef.current) / 60000;
    return Math.round((state.correctAnswers * 5) / minutes) || 0;
  };

  const accuracy = state.totalAnswers > 0 ? Math.round((state.correctAnswers / state.totalAnswers) * 100) : 100;

  return {
    ...state,
    accuracy,
    wpm: calculateWPM(),
    submitAnswer,
    setInput: (value: string) => setState(prev => ({ ...prev, input: value })),
    resetGame,
    startGame,
  };
};
