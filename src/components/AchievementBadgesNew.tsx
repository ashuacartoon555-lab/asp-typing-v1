import React, { useEffect } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { useTypingHistory } from '@/hooks/useTypingHistory';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AchievementBadges: React.FC = () => {
  const { badges, newBadge, getAllBadgesAvailable } = useAchievements();
  const { stats, history } = useTypingHistory();
  const { streak } = useStreakTracker();
  
  const [showNewBadgePopup, setShowNewBadgePopup] = React.useState(false);

  useEffect(() => {
    if (newBadge) {
      setShowNewBadgePopup(true);
      const timer = setTimeout(() => setShowNewBadgePopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [newBadge]);

  const allBadges = getAllBadgesAvailable();
  const unlockedIds = new Set(badges.map(b => b.id));

  // Check if badge should be unlocked based on current stats
  const isBadgeUnlockable = (badgeId: string): boolean => {
    switch (badgeId) {
      case 'speed-racer':
        return stats.bestWPM >= 50;
      case 'lightning':
        return stats.bestWPM >= 70;
      case 'champion':
        return stats.bestWPM >= 100;
      case 'perfect':
        return history.some(test => test.accuracy === 100);
      case 'on-fire':
        return streak >= 7;
      case 'legend':
        return streak >= 30;
      case 'sharpshooter':
        // Check last 5 tests for 95%+ accuracy
        const last5 = history.slice(-5);
        return last5.length === 5 && last5.every(test => test.accuracy >= 95);
      case 'master':
        return stats.totalTests >= 50;
      case 'iron-hands':
        return stats.totalWordsTyped >= 1000;
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      {/* New Badge Popup */}
      {newBadge && showNewBadgePopup && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-2xl p-6 text-center border-2 border-yellow-200">
            <div className="text-5xl mb-2">{newBadge.icon}</div>
            <div className="text-xl font-bold text-gray-900">{newBadge.name}</div>
            <div className="text-sm text-gray-800">Achievement Unlocked!</div>
          </div>
        </div>
      )}

      {/* Badges Display Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Achievements</h3>
            <p className="text-slate-400 text-sm">
              {badges.length} / {allBadges.length} badges unlocked
            </p>
          </div>
          <div className="text-4xl font-bold text-yellow-400">{badges.length}</div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {allBadges.map(badge => {
            const isUnlocked = unlockedIds.has(badge.id);
            const canUnlock = isBadgeUnlockable(badge.id);
            const unlockedBadge = badges.find(b => b.id === badge.id);

            return (
              <div
                key={badge.id}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 cursor-pointer relative ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg border-2 border-yellow-300'
                    : canUnlock
                    ? 'bg-gradient-to-br from-green-600 to-green-700 shadow-md border-2 border-green-400 animate-pulse'
                    : 'bg-slate-700 opacity-50 grayscale border-2 border-slate-600'
                }`}
                title={badge.description}
              >
                {canUnlock && !isUnlocked && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-xs font-bold text-center px-2 line-clamp-2">
                  {badge.name}
                </div>
                {isUnlocked && unlockedBadge && (
                  <div className="text-xs mt-1 text-yellow-100">
                    {new Date(unlockedBadge.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-semibold">Achievement Progress</span>
            <span className="text-slate-400 text-xs">{Math.round((badges.length / allBadges.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${(badges.length / allBadges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Locked Badges Info */}
        {allBadges.length - badges.length > 0 && (
          <div className="mt-6">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>Locked Achievements ({allBadges.length - badges.length} remaining)</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {allBadges.filter(b => !unlockedIds.has(b.id)).map(badge => {
                  const canUnlock = isBadgeUnlockable(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`text-xs p-3 rounded-lg transition-all ${
                        canUnlock 
                          ? 'bg-green-900/40 border border-green-600 text-green-200' 
                          : 'bg-slate-700/50 border border-slate-600 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{badge.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-xs opacity-80">{badge.requirement}</div>
                        </div>
                        {canUnlock && (
                          <span className="text-green-400 text-lg">✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Badge Categories Section */}
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📂</span> Badge Categories
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Speed Badges */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-4 border border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span className="text-white font-semibold">Speed Badges</span>
                </div>
                <span className="text-blue-300 text-sm font-bold">
                  {['speed-racer', 'lightning', 'champion'].filter(id => unlockedIds.has(id)).length}/3
                </span>
              </div>
              <div className="space-y-1">
                {['speed-racer', 'lightning', 'champion'].map(id => {
                  const badge = allBadges.find(b => b.id === id);
                  const isUnlocked = unlockedIds.has(id);
                  return badge ? (
                    <div key={id} className={`text-xs flex items-center justify-between ${isUnlocked ? 'text-green-300' : 'text-slate-400'}`}>
                      <span>{badge.icon} {badge.name}</span>
                      {isUnlocked && <span>✓</span>}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Accuracy Badges */}
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-lg p-4 border border-green-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-white font-semibold">Accuracy Badges</span>
                </div>
                <span className="text-green-300 text-sm font-bold">
                  {['perfect', 'sharpshooter'].filter(id => unlockedIds.has(id)).length}/2
                </span>
              </div>
              <div className="space-y-1">
                {['perfect', 'sharpshooter'].map(id => {
                  const badge = allBadges.find(b => b.id === id);
                  const isUnlocked = unlockedIds.has(id);
                  return badge ? (
                    <div key={id} className={`text-xs flex items-center justify-between ${isUnlocked ? 'text-green-300' : 'text-slate-400'}`}>
                      <span>{badge.icon} {badge.name}</span>
                      {isUnlocked && <span>✓</span>}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Consistency Badges */}
            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 rounded-lg p-4 border border-orange-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-white font-semibold">Consistency Badges</span>
                </div>
                <span className="text-orange-300 text-sm font-bold">
                  {['on-fire', 'legend'].filter(id => unlockedIds.has(id)).length}/2
                </span>
              </div>
              <div className="space-y-1">
                {['on-fire', 'legend'].map(id => {
                  const badge = allBadges.find(b => b.id === id);
                  const isUnlocked = unlockedIds.has(id);
                  return badge ? (
                    <div key={id} className={`text-xs flex items-center justify-between ${isUnlocked ? 'text-green-300' : 'text-slate-400'}`}>
                      <span>{badge.icon} {badge.name}</span>
                      {isUnlocked && <span>✓</span>}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Milestone Badges */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-4 border border-purple-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💪</span>
                  <span className="text-white font-semibold">Milestone Badges</span>
                </div>
                <span className="text-purple-300 text-sm font-bold">
                  {['master', 'iron-hands'].filter(id => unlockedIds.has(id)).length}/2
                </span>
              </div>
              <div className="space-y-1">
                {['master', 'iron-hands'].map(id => {
                  const badge = allBadges.find(b => b.id === id);
                  const isUnlocked = unlockedIds.has(id);
                  return badge ? (
                    <div key={id} className={`text-xs flex items-center justify-between ${isUnlocked ? 'text-green-300' : 'text-slate-400'}`}>
                      <span>{badge.icon} {badge.name}</span>
                      {isUnlocked && <span>✓</span>}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {badges.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-4 border border-blue-700">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌟</span>
              <div>
                <p className="text-blue-200 font-semibold">
                  {badges.length === allBadges.length 
                    ? "🎉 Incredible! You've unlocked all achievements! You're a true typing master!"
                    : badges.length >= allBadges.length * 0.75
                    ? "Amazing progress! You're so close to unlocking everything!"
                    : badges.length >= allBadges.length * 0.5
                    ? "Great work! You're halfway there. Keep practicing!"
                    : badges.length >= allBadges.length * 0.25
                    ? "Nice start! Complete more tests to unlock more badges!"
                    : "Every badge tells a story. Start yours today!"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementBadges;
