import React from 'react';
import { storageManager } from '@/lib/storageManager';

type TimeFilter = 'today' | 'week' | '30days' | 'month' | '3months' | 'alltime';

const LeaderboardLocal: React.FC = () => {
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('week');

  const getFilteredLeaderboard = () => {
    const allTests = storageManager.getTypingHistory();
    const now = new Date();
    
    let filteredTests = allTests;
    
    switch (timeFilter) {
      case 'today':
        const today = now.toISOString().split('T')[0];
        filteredTests = allTests.filter(test => test.date.split('T')[0] === today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredTests = allTests.filter(test => new Date(test.date) >= weekAgo);
        break;
      case '30days':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredTests = allTests.filter(test => new Date(test.date) >= thirtyDaysAgo);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredTests = allTests.filter(test => new Date(test.date) >= monthStart);
        break;
      case '3months':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredTests = allTests.filter(test => new Date(test.date) >= threeMonthsAgo);
        break;
      case 'alltime':
        filteredTests = allTests;
        break;
    }
    
    // Sort by WPM and take top 10
    return filteredTests
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);
  };

  const leaderboard = getFilteredLeaderboard();

  const filterOptions: { value: TimeFilter; label: string; emoji: string }[] = [
    { value: 'today', label: 'Today', emoji: '📅' },
    { value: 'week', label: 'This Week', emoji: '📊' },
    { value: '30days', label: 'Last 30 Days', emoji: '📈' },
    { value: 'month', label: 'This Month', emoji: '🗓️' },
    { value: '3months', label: 'Last 3 Months', emoji: '📆' },
    { value: 'alltime', label: 'All Time', emoji: '🌟' }
  ];

  if (leaderboard.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 text-center">
        <p className="text-slate-400">Complete tests to appear on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-4">🏆 Leaderboard</h3>
        
        {/* Quick Stats Style Filter */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-semibold text-slate-300">Quick Filter</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setTimeFilter(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === option.value
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="mr-1">{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
              idx < 3
                ? idx === 0
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700'
                  : idx === 1
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                  : 'bg-gradient-to-r from-orange-700 to-orange-800'
                : 'bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            {/* Rank */}
            <div className="text-3xl font-bold text-white w-12">
              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{entry.wpm}</span>
                <span className="text-sm text-slate-300">WPM</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                <span className="text-green-300">{entry.accuracy}%</span> accuracy •{' '}
                <span className="capitalize">{entry.difficulty}</span> •{' '}
                <span>{new Date(entry.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Badge */}
            <div className="text-right">
              {entry.wpm >= 100 && <span className="text-2xl">⚡</span>}
              {entry.accuracy === 100 && <span className="text-2xl">💯</span>}
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-600">
          <p className="text-slate-400 text-sm text-center">
            🎯 Keep improving to reach the top!
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardLocal;
