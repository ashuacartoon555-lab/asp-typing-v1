import { useState, useEffect } from 'react';
import { storageManager, TestResult } from '@/lib/storageManager';

export const useTypingHistory = () => {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageWPM: 0,
    bestWPM: 0,
    averageAccuracy: 0,
    totalWordsTyped: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    const loadHistory = () => {
      const loadedHistory = storageManager.getTypingHistory();
      setHistory(loadedHistory);

      const loadedStats = storageManager.getStats();
      setStats(loadedStats);
    };

    loadHistory();

    // Listen for storage changes
    window.addEventListener('storage', loadHistory);
    // Listen for custom test completion event (same tab)
    window.addEventListener('test-completed', loadHistory);
    
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('test-completed', loadHistory);
    };
  }, []);

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekHistory = history.filter(t => new Date(t.date) >= oneWeekAgo);

    return {
      count: weekHistory.length,
      avgWPM: weekHistory.length ? Math.round(weekHistory.reduce((s, t) => s + t.wpm, 0) / weekHistory.length) : 0,
      avgAccuracy: weekHistory.length ? Math.round(weekHistory.reduce((s, t) => s + t.accuracy, 0) / weekHistory.length) : 0,
      improvement: weekHistory.length >= 2 
        ? weekHistory[weekHistory.length - 1].wpm - weekHistory[0].wpm
        : 0
    };
  };

  const getLast10Tests = () => history.slice(-10).reverse();

  const getWPMTrend = () => {
    // Last 20 tests for trend line
    return history.slice(-20).map((t, idx) => ({
      test: idx + 1,
      wpm: t.wpm,
      accuracy: t.accuracy,
      date: t.date
    }));
  };

  const getAccuracyTrend = () => {
    return history.slice(-20).map((t, idx) => ({
      test: idx + 1,
      accuracy: t.accuracy,
      wpm: t.wpm
    }));
  };

  const getStatsChange = () => {
    if (history.length < 2) return { wpmChange: 0, accuracyChange: 0 };

    const last = history[history.length - 1];
    const secondLast = history[history.length - 2];

    return {
      wpmChange: last.wpm - secondLast.wpm,
      accuracyChange: last.accuracy - secondLast.accuracy
    };
  };

  const getPerformanceByDifficulty = (): Record<
    string,
    { count: number; avgWPM: number; avgAccuracy: number; bestWPM: number }
  > => {
    const byDifficulty: Record<string, TestResult[]> = { easy: [], medium: [], hard: [], custom: [] };

    history.forEach(t => {
      if (byDifficulty[t.difficulty]) {
        byDifficulty[t.difficulty].push(t);
      }
    });

    return Object.entries(byDifficulty).reduce((acc, [diff, tests]) => {
      if (tests.length === 0) return acc;

      acc[diff] = {
        count: tests.length,
        avgWPM: Math.round(tests.reduce((s, t) => s + t.wpm, 0) / tests.length),
        avgAccuracy: Math.round(tests.reduce((s, t) => s + t.accuracy, 0) / tests.length),
        bestWPM: Math.max(...tests.map(t => t.wpm))
      };

      return acc;
    }, {} as Record<string, { count: number; avgWPM: number; avgAccuracy: number; bestWPM: number }>);
  };

  const getTypingLevel = (): { level: string; emoji: string; color: string } => {
    const wpm = stats.averageWPM;
    if (wpm < 35) return { level: 'Beginner', emoji: '🌱', color: 'text-gray-400' };
    if (wpm < 55) return { level: 'Intermediate', emoji: '📈', color: 'text-blue-400' };
    if (wpm < 75) return { level: 'Pro', emoji: '🔥', color: 'text-orange-400' };
    return { level: 'Master', emoji: '👑', color: 'text-yellow-400' };
  };

  const getImprovementPercent = (): number => {
    if (history.length < 2) return 0;
    const firstTest = history[0];
    const latestTest = history[history.length - 1];
    if (firstTest.wpm === 0) return 0;
    return Math.round(((latestTest.wpm - firstTest.wpm) / firstTest.wpm) * 100);
  };

  const getBestDay = (): { date: string; avgWPM: number; testCount: number } | null => {
    if (history.length === 0) return null;

    // Group tests by date
    const testsByDate: Record<string, TestResult[]> = {};
    history.forEach(test => {
      const dateKey = new Date(test.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      if (!testsByDate[dateKey]) testsByDate[dateKey] = [];
      testsByDate[dateKey].push(test);
    });

    // Find day with highest average WPM
    let bestDay = { date: '', avgWPM: 0, testCount: 0 };
    Object.entries(testsByDate).forEach(([date, tests]) => {
      const avgWPM = Math.round(tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length);
      if (avgWPM > bestDay.avgWPM) {
        bestDay = { date, avgWPM, testCount: tests.length };
      }
    });

    return bestDay;
  };

  const getTotalPracticeTime = (): { hours: number; minutes: number; formatted: string } => {
    const totalSeconds = Math.round(stats.totalTimeSpent);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    let formatted = '';
    if (hours > 0) formatted += `${hours}h `;
    formatted += `${minutes}m`;
    
    return { hours, minutes, formatted };
  };

  const getPreferredTypingTime = (): string => {
    if (history.length === 0) return 'Not enough data';

    // Count tests by time of day
    const timeSlots = {
      morning: 0,   // 6AM-12PM
      afternoon: 0, // 12PM-6PM
      evening: 0,   // 6PM-10PM
      night: 0      // 10PM-6AM
    };

    history.forEach(test => {
      const hour = new Date(test.date).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
      else if (hour >= 18 && hour < 22) timeSlots.evening++;
      else timeSlots.night++;
    });

    // Find most common time
    const maxSlot = Object.entries(timeSlots).reduce((a, b) => 
      timeSlots[b[0] as keyof typeof timeSlots] > timeSlots[a[0] as keyof typeof timeSlots] ? b : a
    );

    const timeLabels = {
      morning: 'Morning (6AM–12PM)',
      afternoon: 'Afternoon (12PM–6PM)',
      evening: 'Evening (6PM–10PM)',
      night: 'Night (10PM–6AM)'
    };

    return timeLabels[maxSlot[0] as keyof typeof timeLabels];
  };

  const getNextGoal = (): { targetWPM: number; distance: number; message: string } | null => {
    if (history.length === 0) return null;

    const currentWPM = stats.averageWPM;
    const milestones = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
    
    const nextMilestone = milestones.find(m => m > currentWPM);
    
    if (!nextMilestone) {
      return {
        targetWPM: currentWPM + 10,
        distance: 10,
        message: 'Keep pushing to new heights!'
      };
    }

    return {
      targetWPM: nextMilestone,
      distance: nextMilestone - currentWPM,
      message: `Only ${nextMilestone - currentWPM} WPM away!`
    };
  };

  return {
    history,
    stats,
    getWeeklyStats,
    getLast10Tests,
    getWPMTrend,
    getAccuracyTrend,
    getStatsChange,
    getPerformanceByDifficulty,
    getTypingLevel,
    getImprovementPercent,
    getBestDay,
    getTotalPracticeTime,
    getPreferredTypingTime,
    getNextGoal
  };
};
