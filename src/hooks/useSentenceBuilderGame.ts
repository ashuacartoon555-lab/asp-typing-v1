import { useState, useEffect, useRef } from 'react';

export interface SentenceBuilderGameState {
  score: number;
  level: number;
  sentence: string;
  input: string;
  gameOver: boolean;
  gameStarted: boolean;
  correctSentences: number;
  totalSentences: number;
  accuracy: number;
  timeLeft: number;
}

const sentences = {
  1: [
    'The cat is on the mat.',
    'I love to read books.',
    'She plays in the park.',
    'He runs very fast.',
    'Birds fly in the sky.',
    'Flowers bloom in spring.',
    'The sun is very bright.',
    'I like to drink coffee.',
  ],
  2: [
    'The quick brown fox jumps over the lazy dog.',
    'Programming is an essential skill in modern technology.',
    'She decided to pursue her dreams despite the challenges.',
    'The conference was attended by experts from around the world.',
    'Technology has significantly transformed our daily lives.',
    'Reading books provides knowledge and entertainment.',
  ],
  3: [
    'Artificial intelligence is revolutionizing industries across the globe.',
    'Sustainable development requires collaboration between governments and communities.',
    'The implementation of new policies resulted in significant improvements.',
    'Cybersecurity has become increasingly important in digital transformation.',
  ],
};

export const useSentenceBuilderGame = () => {
  const [state, setState] = useState<SentenceBuilderGameState>({
    score: 0,
    level: 1,
    sentence: '',
    input: '',
    gameOver: false,
    gameStarted: false,
    correctSentences: 0,
    totalSentences: 0,
    accuracy: 100,
    timeLeft: 150,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getSentencesForLevel = (level: number): string[] => {
    const key = Math.min(level, 3) as keyof typeof sentences;
    return [...sentences[key]].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const sentenceList = getSentencesForLevel(1);
    setState(prev => ({
      ...prev,
      gameStarted: true,
      sentence: sentenceList[0],
      timeLeft: 150,
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

  const handleInput = (value: string) => {
    setState(prev => ({
      ...prev,
      input: value,
    }));

    if (value === state.sentence) {
      const sentenceList = getSentencesForLevel(state.level);
      const nextSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
      const newCorrect = state.correctSentences + 1;
      const newLevel = state.level + (newCorrect > 0 && newCorrect % 4 === 0 ? 1 : 0);

      setState(prev => ({
        ...prev,
        score: prev.score + (prev.level * 50),
        sentence: nextSentence,
        input: '',
        correctSentences: newCorrect,
        totalSentences: prev.totalSentences + 1,
        level: newLevel,
        timeLeft: Math.min(prev.timeLeft + 15, 180),
      }));
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      score: 0,
      level: 1,
      sentence: '',
      input: '',
      gameOver: false,
      gameStarted: false,
      correctSentences: 0,
      totalSentences: 0,
      accuracy: 100,
      timeLeft: 150,
    });
  };

  const accuracy = state.totalSentences > 0 ? Math.round((state.correctSentences / state.totalSentences) * 100) : 100;

  return {
    ...state,
    accuracy,
    startGame,
    handleInput,
    resetGame,
  };
};
