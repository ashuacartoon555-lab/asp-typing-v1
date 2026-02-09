import { useState, useEffect } from 'react';
import { storageManager } from '@/lib/storageManager';

export const useStreakTracker = () => {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [streakDates, setStreakDates] = useState<string[]>([]);

  useEffect(() => {
    const loadStreak = () => {
      const current = storageManager.getStreak();
      const best = storageManager.getBestStreak();
      const data = storageManager.getStreakData();

      setStreak(current);
      setBestStreak(best);
      setStreakDates(data.dates);
    };

    loadStreak();

    // Listen for storage changes
    window.addEventListener('storage', loadStreak);
    // Listen for custom test completion event (same tab)
    window.addEventListener('test-completed', loadStreak);
    return () => {
      window.removeEventListener('storage', loadStreak);
      window.removeEventListener('test-completed', loadStreak);
    };
  }, []);

  const getStreakStatus = () => {
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return '🔥 Day 1 - Keep going!';
    if (streak < 7) return `🔥 ${streak} days - On a roll!`;
    if (streak < 14) return `🔥🔥 ${streak} days - On fire!`;
    if (streak < 30) return `🔥🔥🔥 ${streak} days - Unstoppable!`;
    return `🔥🔥🔥🔥 ${streak} days - Legend status!`;
  };

  const getStreakCalendar = () => {
    // Generate 7-week calendar showing streak dates
    const today = new Date();
    const calendar = [];

    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const isStreakDay = streakDates.includes(dateStr);

      calendar.push({
        date: dateStr,
        day: date.getDate(),
        isStreakDay,
        dayOfWeek: date.getDay()
      });
    }

    return calendar;
  };

  const getMotivationalMessage = () => {
    const messages = {
      0: '🚀 Start your first test to begin the streak!',
      1: '🔥 Great start! Come back tomorrow to continue your streak.',
      3: '⚡ 3 days in! You\'re building a habit!',
      7: '🎉 7 days! You\'re officially a typing enthusiast!',
      14: '💪 Two weeks! This is getting serious!',
      30: '👑 One month! You\'re a typing legend!',
      100: '🏆 100 days! Absolutely incredible dedication!'
    };

    return messages[Math.min(streak, 100)] || `🔥 ${streak} day streak - Amazing dedication!`;
  };

  return {
    streak,
    bestStreak,
    streakDates,
    getStreakStatus,
    getStreakCalendar,
    getMotivationalMessage
  };
};
