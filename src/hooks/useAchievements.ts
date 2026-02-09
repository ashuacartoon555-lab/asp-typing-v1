import { useState, useEffect } from 'react';
import { storageManager, AchievementBadge } from '@/lib/storageManager';

export const useAchievements = () => {
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [newBadge, setNewBadge] = useState<AchievementBadge | null>(null);

  useEffect(() => {
    const loadBadges = () => {
      const loadedBadges = storageManager.getBadges();
      setBadges(loadedBadges);
    };

    loadBadges();

    // Listen for storage changes (other tabs)
    window.addEventListener('storage', loadBadges);
    // Listen for custom test completion event (same tab)
    window.addEventListener('test-completed', loadBadges);
    return () => {
      window.removeEventListener('storage', loadBadges);
      window.removeEventListener('test-completed', loadBadges);
    };
  }, []);

  const getBadgeCount = () => badges.length;

  const hasBadge = (badgeId: string) => badges.some(b => b.id === badgeId);

  const unlockNewBadge = (badge: AchievementBadge) => {
    if (!hasBadge(badge.id)) {
      storageManager.unlockBadge(badge);
      setBadges([...badges, badge]);
      setNewBadge(badge);
      setTimeout(() => setNewBadge(null), 3000);
    }
  };

  const getAllBadgesAvailable = () => [
    {
      id: 'speed-racer',
      name: 'Speed Racer',
      icon: '🚀',
      description: 'Reach 50 WPM',
      requirement: 'wpm >= 50'
    },
    {
      id: 'lightning',
      name: 'Lightning',
      icon: '⚡',
      description: 'Reach 75 WPM',
      requirement: 'wpm >= 75'
    },
    {
      id: 'champion',
      name: 'Champion',
      icon: '🏆',
      description: 'Reach 100 WPM',
      requirement: 'wpm >= 100'
    },
    {
      id: 'perfect',
      name: 'Perfect',
      icon: '💯',
      description: '100% Accuracy',
      requirement: 'accuracy === 100'
    },
    {
      id: 'on-fire',
      name: 'On Fire',
      icon: '🔥',
      description: '7-Day Streak',
      requirement: 'streak >= 7'
    },
    {
      id: 'legend',
      name: 'Legend',
      icon: '👑',
      description: '30-Day Streak',
      requirement: 'streak >= 30'
    },
    {
      id: 'sharpshooter',
      name: 'Sharpshooter',
      icon: '🎯',
      description: '5 Consecutive 99%+ Accuracy',
      requirement: '5 tests at 99%+'
    },
    {
      id: 'master',
      name: 'Master',
      icon: '🧠',
      description: 'Complete 100 Tests',
      requirement: '100 tests completed'
    },
    {
      id: 'iron-hands',
      name: 'Iron Hands',
      icon: '💪',
      description: '1000+ Words Typed',
      requirement: '1000+ words'
    }
  ];

  return {
    badges,
    newBadge,
    getBadgeCount,
    hasBadge,
    unlockNewBadge,
    getAllBadgesAvailable
  };
};
