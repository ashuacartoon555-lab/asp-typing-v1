import React from 'react';
import { useTypingHistory } from '@/hooks/useTypingHistory';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Zap, Trophy, Clock, Crosshair } from 'lucide-react';

const SpeedInsightDashboard: React.FC = () => {
  const {
    stats,
    getLast10Tests,
    getWPMTrend,
    getAccuracyTrend,
    getStatsChange,
    getPerformanceByDifficulty,
    getBestDay,
    getTotalPracticeTime,
    getNextGoal,
    getTypingLevel
  } = useTypingHistory();

  const wpmTrend = getWPMTrend();
  const accuracyTrend = getAccuracyTrend();
  const statsChange = getStatsChange();
  const performanceByDifficulty = getPerformanceByDifficulty();
  const bestDay = getBestDay();
  const practiceTime = getTotalPracticeTime();
  const nextGoal = getNextGoal();
  const typingLevel = getTypingLevel();
  
  const difficultyData = Object.entries(performanceByDifficulty).map(([diff, data]) => ({
    name: diff.charAt(0).toUpperCase() + diff.slice(1),
    wpm: data.avgWPM,
    accuracy: data.avgAccuracy
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (stats.totalTests === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <Zap className="w-16 h-16 mx-auto mb-4 text-slate-500" />
        <h3 className="text-2xl font-bold text-white mb-2">No Tests Yet</h3>
        <p className="text-slate-400">Complete your first typing test to see your analytics and insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Typing Level */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-lg p-4 border border-indigo-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-semibold">Typing Level</p>
              <p className="text-2xl font-bold text-white mt-1">{typingLevel.level}</p>
            </div>
            <div className="text-4xl">{typingLevel.emoji}</div>
          </div>
          <p className="text-xs text-indigo-300 mt-2">{stats.averageWPM} WPM Average</p>
        </div>

        {/* Best Day */}
        {bestDay && (
          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 border border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-semibold">Best Day</p>
                <p className="text-2xl font-bold text-white mt-1">{bestDay.avgWPM} WPM</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
            <p className="text-xs text-orange-300 mt-2">
              {bestDay.date} • {bestDay.testCount} test{bestDay.testCount > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Total Practice Time */}
        <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-lg p-4 border border-cyan-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm font-semibold">Practice Time</p>
              <p className="text-2xl font-bold text-white mt-1">{practiceTime.formatted}</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
          <p className="text-xs text-cyan-300 mt-2">Total time invested</p>
        </div>

        {/* Next Goal */}
        {nextGoal && (
          <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-4 border border-pink-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-semibold">Next Goal</p>
                <p className="text-2xl font-bold text-white mt-1">{nextGoal.targetWPM} WPM</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
            <p className="text-xs text-pink-300 mt-2">{nextGoal.message}</p>
          </div>
        )}
      </div>

      {/* Original Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average WPM */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-semibold">Average WPM</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.averageWPM}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          {statsChange.wpmChange !== 0 && (
            <p className={`text-sm mt-2 ${statsChange.wpmChange > 0 ? 'text-green-300' : 'text-red-300'}`}>
              {statsChange.wpmChange > 0 ? '↑' : '↓'} {Math.abs(statsChange.wpmChange)} from last test
            </p>
          )}
        </div>

        {/* Best WPM */}
        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border border-yellow-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm font-semibold">Best WPM</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.bestWPM}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          <p className="text-xs text-yellow-300 mt-2">Personal Record</p>
        </div>

        {/* Average Accuracy */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-semibold">Avg Accuracy</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.averageAccuracy}%</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          {statsChange.accuracyChange !== 0 && (
            <p className={`text-sm mt-2 ${statsChange.accuracyChange > 0 ? 'text-green-300' : 'text-red-300'}`}>
              {statsChange.accuracyChange > 0 ? '↑' : '↓'} {Math.abs(statsChange.accuracyChange)}% from last test
            </p>
          )}
        </div>

        {/* Total Tests */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-semibold">Total Tests</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalTests}</p>
            </div>
            <div className="text-4xl">⌨️</div>
          </div>
          <p className="text-xs text-purple-300 mt-2">
            {stats.totalWordsTyped.toLocaleString()} words typed
          </p>
        </div>
      </div>

      {/* WPM Trend Chart */}
      {wpmTrend.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            WPM Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wpmTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="test" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Accuracy Trend Chart */}
      {accuracyTrend.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Accuracy Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="test" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance by Difficulty */}
      {difficultyData.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Performance by Difficulty</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Legend />
              <Bar dataKey="wpm" fill="#3b82f6" name="Avg WPM" />
              <Bar dataKey="accuracy" fill="#10b981" name="Avg Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Tests */}
      {getLast10Tests().length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Last 10 Tests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 text-slate-300">WPM</th>
                  <th className="text-left py-2 text-slate-300">Accuracy</th>
                  <th className="text-left py-2 text-slate-300">Difficulty</th>
                  <th className="text-left py-2 text-slate-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {getLast10Tests().map((test, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-2 text-blue-300 font-bold">{test.wpm}</td>
                    <td className={`py-2 font-semibold ${test.accuracy >= 95 ? 'text-green-300' : test.accuracy >= 90 ? 'text-yellow-300' : 'text-red-300'}`}>
                      {test.accuracy}%
                    </td>
                    <td className="py-2 text-slate-300 capitalize">{test.difficulty}</td>
                    <td className="py-2 text-slate-400">
                      {new Date(test.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedInsightDashboard;
