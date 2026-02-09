import React, { useState } from 'react';
import { useTypingHistory } from '@/hooks/useTypingHistory';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { storageManager } from '@/lib/storageManager';

const PersonalBestCard: React.FC = () => {
  const { stats } = useTypingHistory();
  const { streak } = useStreakTracker();
  const personalBests = storageManager.getPersonalBests();

  const improvementPercent = personalBests.allTime > 0
    ? Math.round(((stats.averageWPM - stats.averageWPM + 10) / personalBests.allTime) * 100)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {/* Session Best */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-3 sm:p-5 border border-blue-700">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-blue-200">Session Best</h3>
          <span className="text-lg sm:text-2xl">⚡</span>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
          {personalBests.currentSession || 0}
        </div>
        <p className="text-blue-300 text-xs">WPM this session</p>
      </div>

      {/* All-Time Best */}
      <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-3 sm:p-5 border border-yellow-700">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-yellow-200">All-Time Best</h3>
          <span className="text-lg sm:text-2xl">🏆</span>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
          {personalBests.allTime || 0}
        </div>
        {personalBests.allTimeDate && (
          <p className="text-yellow-300 text-xs">
            Set on {new Date(personalBests.allTimeDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Current Streak */}
      <div className="bg-gradient-to-br from-red-900 to-orange-800 rounded-lg p-3 sm:p-5 border border-red-700">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-orange-200">Current Streak</h3>
          <span className="text-lg sm:text-2xl">🔥</span>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
          {streak}
        </div>
        <p className="text-orange-300 text-xs">Days typing in a row</p>
      </div>
    </div>
  );
};

export default PersonalBestCard;
