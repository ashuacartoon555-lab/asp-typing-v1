import React, { useState } from 'react';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { useTypingHistory } from '@/hooks/useTypingHistory';
import { Flame, Trophy, X, TrendingUp, Target, Clock } from 'lucide-react';
import { storageManager, TestResult } from '@/lib/storageManager';

const StreakTracker: React.FC = () => {
  const { streak, bestStreak, getStreakStatus, getStreakCalendar, getMotivationalMessage } =
    useStreakTracker();
  const { getPreferredTypingTime } = useTypingHistory();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateStats, setDateStats] = useState<TestResult[]>([]);

  const calendar = getStreakCalendar();
  const preferredTime = getPreferredTypingTime();

  const handleDateClick = (date: string, hasActivity: boolean) => {
    if (!hasActivity) return;
    
    setSelectedDate(date);
    // Get all tests from that date
    const allTests = storageManager.getTypingHistory();
    const testsOnDate = allTests.filter(test => {
      const testDate = new Date(test.date).toDateString();
      const clickedDate = new Date(date).toDateString();
      return testDate === clickedDate;
    });
    setDateStats(testsOnDate);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setDateStats([]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          Typing Streak
        </h3>

        {/* Main Streak Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Current Streak */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 border border-orange-400">
            <div className="text-5xl font-bold text-white text-center mb-2">
              {streak}
            </div>
            <div className="text-center text-orange-100 font-semibold">Current Streak</div>
            {streak > 0 && <div className="text-center text-2xl mt-2">🔥</div>}
          </div>

          {/* Best Streak */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 border border-yellow-400">
            <div className="text-5xl font-bold text-white text-center mb-2">
              {bestStreak}
            </div>
            <div className="text-center text-yellow-100 font-semibold">Best Streak</div>
            {bestStreak > 0 && <div className="text-center text-2xl mt-2">🏆</div>}
          </div>
        </div>

        {/* Preferred Typing Time */}
        {preferredTime !== 'Not enough data' && (
          <div className="bg-slate-700/50 rounded-lg p-3 mb-4 border-l-4 border-blue-500">
            <p className="text-slate-300 text-sm">
              <span className="text-blue-400 font-semibold">⏰ You type mostly on:</span>{' '}
              {preferredTime}
            </p>
          </div>
        )}

        {/* Status Message */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border-l-4 border-orange-500">
          <p className="text-white font-semibold text-lg text-center">{getStreakStatus()}</p>
        </div>

        {/* Motivational Message */}
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
          <p className="text-blue-200 text-center">{getMotivationalMessage()}</p>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="mt-6 pt-6 border-t border-slate-600">
        <h4 className="text-sm font-bold text-slate-300 mb-3">Last 6 Weeks Activity</h4>
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, idx) => (
            <div key={idx} className="text-center">
              {idx % 7 === 0 && (
                <div className="text-xs text-slate-500 font-bold mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.dayOfWeek]}
                </div>
              )}
              <div
                onClick={() => handleDateClick(day.date, day.isStreakDay)}
                className={`
                  h-8 w-8 rounded-sm text-xs font-bold flex items-center justify-center transition-all
                  ${
                    day.isStreakDay
                      ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg cursor-pointer hover:scale-110 hover:shadow-xl'
                      : 'bg-slate-700 text-slate-500'
                  }
                `}
                title={day.date}
              >
                {day.day}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span>Typed (Click to view)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-700"></div>
            <span>No activity</span>
          </div>
        </div>
      </div>

      {/* Tips & Encouragement */}
      <div className="mt-6 pt-6 border-t border-slate-600 space-y-3">
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <p className="text-blue-200 text-sm font-semibold mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Pro Tips for Building Streaks
          </p>
          <ul className="space-y-2 text-xs text-blue-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Type at the same time each day to build a habit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Even 5 minutes of practice counts - consistency is key!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Set reminders to help you remember your daily practice</span>
            </li>
          </ul>
        </div>

        {streak > 0 && (
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 font-semibold flex items-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              You're on Fire!
            </p>
            <p className="text-green-200 text-sm">
              You're on a {streak}-day streak! Don't break it - come back tomorrow and keep the momentum going! 🔥
            </p>
          </div>
        )}
        
        {streak === 0 && (
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700 rounded-lg p-4">
            <p className="text-purple-300 font-semibold flex items-center gap-2 mb-2">
              <span className="text-2xl">🚀</span>
              Start Your Streak Today!
            </p>
            <p className="text-purple-200 text-sm">
              Begin your typing journey and build a streak that shows your dedication. Every great achievement starts with day one!
            </p>
          </div>
        )}
      </div>

      {/* Date Detail Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {formatDate(selectedDate)}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {dateStats.length} test{dateStats.length !== 1 ? 's' : ''} completed
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Day Summary Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(dateStats.reduce((sum, t) => sum + t.wpm, 0) / dateStats.length)}
                  </div>
                  <div className="text-xs text-blue-300">Avg WPM</div>
                </div>
                <div className="bg-green-900/30 rounded-lg p-3 border border-green-700">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(dateStats.reduce((sum, t) => sum + t.accuracy, 0) / dateStats.length)}%
                  </div>
                  <div className="text-xs text-green-300">Avg Accuracy</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.max(...dateStats.map(t => t.wpm))}
                  </div>
                  <div className="text-xs text-purple-300">Best WPM</div>
                </div>
              </div>

              {/* Individual Tests */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  All Tests
                </h4>
                {dateStats.map((test, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300 font-semibold">{formatTime(test.date)}</span>
                        <span className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                          test.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                          test.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                          test.difficulty === 'hard' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                        }`}>
                          {test.difficulty}
                        </span>
                      </div>
                      {test.wpm === Math.max(...dateStats.map(t => t.wpm)) && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                          🏆 Best
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-slate-400">Speed</div>
                        <div className="text-lg font-bold text-white flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          {test.wpm}
                        </div>
                        <div className="text-xs text-slate-500">WPM</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Accuracy</div>
                        <div className="text-lg font-bold text-white flex items-center gap-1">
                          <Target className="w-4 h-4 text-green-400" />
                          {test.accuracy}%
                        </div>
                        <div className="text-xs text-slate-500">Precision</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Errors</div>
                        <div className="text-lg font-bold text-white">
                          {test.errorsCount}
                        </div>
                        <div className="text-xs text-slate-500">Mistakes</div>
                      </div>
                    </div>

                    {test.timeElapsed && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-xs text-slate-400">
                          Duration: <span className="text-slate-300 font-semibold">{test.timeElapsed}s</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakTracker;
