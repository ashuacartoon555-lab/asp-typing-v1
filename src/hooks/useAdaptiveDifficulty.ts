import { useState, useEffect } from 'react';

interface DifficultyMetrics {
  wpm: number;
  accuracy: number;
  errors: number;
  consecutiveTests: number;
}

interface AdaptiveDifficultyState {
  currentLevel: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
  suggestedDifficulty: string;
  shouldIncrease: boolean;
  shouldDecrease: boolean;
  reasoning: string;
}

export const useAdaptiveDifficulty = () => {
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveDifficultyState>({
    currentLevel: 'easy',
    suggestedDifficulty: 'medium',
    shouldIncrease: false,
    shouldDecrease: false,
    reasoning: ''
  });

  const analyzePerformance = (metrics: DifficultyMetrics): AdaptiveDifficultyState => {
    const { wpm, accuracy, errors, consecutiveTests } = metrics;

    // Get historical performance
    const history = getPerformanceHistory();
    
    // Calculate trend
    const avgWPM = history.length > 0 
      ? history.reduce((sum, h) => sum + h.wpm, 0) / history.length 
      : wpm;
    
    const avgAccuracy = history.length > 0
      ? history.reduce((sum, h) => sum + h.accuracy, 0) / history.length
      : accuracy;

    let newLevel: AdaptiveDifficultyState['currentLevel'] = 'easy';
    let shouldIncrease = false;
    let shouldDecrease = false;
    let reasoning = '';

    // Beginner criteria (0-25 WPM)
    if (wpm < 25) {
      newLevel = 'beginner';
      reasoning = 'Starting with fundamentals to build solid foundation.';
    }
    // Easy criteria (25-40 WPM, 90%+ accuracy)
    else if (wpm >= 25 && wpm < 40) {
      newLevel = 'easy';
      if (accuracy >= 95 && wpm > 35 && consecutiveTests >= 3) {
        shouldIncrease = true;
        reasoning = 'Excellent consistency! Ready for more challenging words.';
      } else {
        reasoning = 'Building speed and accuracy with common words.';
      }
    }
    // Medium criteria (40-60 WPM)
    else if (wpm >= 40 && wpm < 60) {
      newLevel = 'medium';
      if (accuracy < 85) {
        shouldDecrease = true;
        reasoning = 'Focus on accuracy first. Slowing down slightly will help.';
      } else if (accuracy >= 95 && wpm > 55 && consecutiveTests >= 3) {
        shouldIncrease = true;
        reasoning = 'Strong performance! Time for technical vocabulary.';
      } else {
        reasoning = 'Developing intermediate skills with varied vocabulary.';
      }
    }
    // Hard criteria (60-80 WPM)
    else if (wpm >= 60 && wpm < 80) {
      newLevel = 'hard';
      if (accuracy < 90) {
        shouldDecrease = true;
        reasoning = 'Speed is good, but accuracy needs work. Try medium difficulty.';
      } else if (accuracy >= 96 && wpm > 75 && consecutiveTests >= 3) {
        shouldIncrease = true;
        reasoning = 'Outstanding! Ready for expert-level challenges.';
      } else {
        reasoning = 'Advanced practice with complex words and punctuation.';
      }
    }
    // Expert criteria (80+ WPM)
    else {
      newLevel = 'expert';
      if (accuracy < 93) {
        shouldDecrease = true;
        reasoning = 'Impressive speed! Dial back to hard to refine precision.';
      } else {
        reasoning = 'Elite performance with maximum difficulty.';
      }
    }

    // Save current performance
    savePerformance({ wpm, accuracy, errors, level: newLevel });

    const suggestedDifficulty = shouldIncrease 
      ? getNextLevel(newLevel)
      : shouldDecrease 
      ? getPreviousLevel(newLevel)
      : newLevel;

    return {
      currentLevel: newLevel,
      suggestedDifficulty,
      shouldIncrease,
      shouldDecrease,
      reasoning
    };
  };

  const getNextLevel = (current: AdaptiveDifficultyState['currentLevel']): string => {
    const levels = ['beginner', 'easy', 'medium', 'hard', 'expert'];
    const currentIndex = levels.indexOf(current);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current;
  };

  const getPreviousLevel = (current: AdaptiveDifficultyState['currentLevel']): string => {
    const levels = ['beginner', 'easy', 'medium', 'hard', 'expert'];
    const currentIndex = levels.indexOf(current);
    return currentIndex > 0 ? levels[currentIndex - 1] : current;
  };

  const getPerformanceHistory = () => {
    const history = localStorage.getItem('adaptiveDifficultyHistory');
    return history ? JSON.parse(history) : [];
  };

  const savePerformance = (data: any) => {
    const history = getPerformanceHistory();
    history.push({
      ...data,
      timestamp: Date.now()
    });

    // Keep last 50 tests
    if (history.length > 50) {
      history.shift();
    }

    localStorage.setItem('adaptiveDifficultyHistory', JSON.stringify(history));
  };

  return {
    adaptiveState,
    analyzePerformance
  };
};
