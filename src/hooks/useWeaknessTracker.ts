import { useState, useEffect } from 'react';
import { storageManager } from '@/lib/storageManager';

export const useWeaknessTracker = () => {
  const [weakKeys, setWeakKeys] = useState<{ [key: string]: number }>({});
  const [topWeakKeys, setTopWeakKeys] = useState<string[]>([]);

  useEffect(() => {
    const loadWeakKeys = () => {
      const keys = storageManager.getWeakKeys();
      setWeakKeys(keys);

      const top = storageManager.getTopWeakKeys(5);
      setTopWeakKeys(top);
    };

    loadWeakKeys();

    // Listen for storage changes
    window.addEventListener('storage', loadWeakKeys);
    // Listen for custom test completion event (same tab)
    window.addEventListener('test-completed', loadWeakKeys);
    return () => {
      window.removeEventListener('storage', loadWeakKeys);
      window.removeEventListener('test-completed', loadWeakKeys);
    };
  }, []);

  const getWeaknessPercentage = (key: string) => {
    const total = Object.values(weakKeys).reduce((a, b) => a + b, 0);
    return total ? Math.round(((weakKeys[key] || 0) / total) * 100) : 0;
  };

  const getWeaknessLevel = (key: string) => {
    const count = weakKeys[key] || 0;
    if (count === 0) return 'excellent';
    if (count <= 2) return 'good';
    if (count <= 5) return 'fair';
    if (count <= 10) return 'weak';
    return 'very-weak';
  };

  const startWeaknessTraining = () => {
    // Generate practice content focusing on top weak keys
    const trainingText = generateTrainingText(topWeakKeys);
    return {
      weakKeys: topWeakKeys,
      trainingText,
      target: {
        accuracy: 95,
        message: 'Focus on accuracy. Train these weak keys until you reach 95%+ accuracy!'
      }
    };
  };

  const generateTrainingText = (keys: string[]) => {
    // Create training words using weak keys
    const commonWords = [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all',
      'can', 'her', 'was', 'one', 'our', 'out', 'day', 'had',
      'has', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
      'see', 'some', 'time', 'two', 'way', 'who', 'will', 'with'
    ];

    if (keys.length === 0) return 'No weak keys detected! Keep typing to identify them.';

    // Filter words that contain weak keys
    const relevantWords = commonWords.filter(word =>
      keys.some(key => word.includes(key))
    );

    // Shuffle and take 20 words
    const shuffled = relevantWords.sort(() => Math.random() - 0.5).slice(0, 20);
    return shuffled.join(' ');
  };

  const getTrainingFocus = () => {
    const sorted = Object.entries(weakKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return sorted.map(([key, count]) => ({
      key,
      errors: count,
      level: getWeaknessLevel(key)
    }));
  };

  return {
    weakKeys,
    topWeakKeys,
    getWeaknessPercentage,
    getWeaknessLevel,
    startWeaknessTraining,
    getTrainingFocus
  };
};
