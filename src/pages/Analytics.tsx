import React from 'react';
import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import AchievementBadges from '@/components/AchievementBadgesNew';
import StreakTracker from '@/components/StreakTrackerNew';
import SpeedInsightDashboard from '@/components/SpeedInsightDashboard';
import PersonalBestCard from '@/components/PersonalBestCard';
import ProgressSummary from '@/components/ProgressSummary';
import LeaderboardLocal from '@/components/LeaderboardLocal';
import ChallengeLinksModal from '@/components/ChallengeLinksModal';
import { useTypingHistory } from '@/hooks/useTypingHistory';

const Analytics: React.FC = () => {
  const { stats, history, getImprovementPercent } = useTypingHistory();
  const hasTests = history.length > 0;
  const improvementPercent = getImprovementPercent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Page Header with Stats Overview */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                📊 Your Typing Analytics
              </h1>
              <p className="text-slate-300 text-lg">
                Track your progress, unlock achievements, and climb the leaderboard
              </p>
            </div>
            {hasTests && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-6 py-4 text-center shadow-lg border border-green-400">
                <div className="text-3xl font-bold text-white">{stats.totalTests}</div>
                <div className="text-green-100 text-sm font-semibold">Tests Completed</div>
              </div>
            )}
          </div>

          {/* Welcome Banner for Users with Tests */}
          {hasTests && (
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 shadow-xl border border-indigo-400 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">👋</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome Back, Typist! 
                  </h2>
                  <p className="text-white/90">
                    You've typed <span className="font-bold text-yellow-300">{stats.totalWordsTyped.toLocaleString()}</span> words 
                    with <span className="font-bold text-green-300">{stats.averageAccuracy}%</span> average accuracy. 
                    Keep up the amazing work! 🚀
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="text-center bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-300">{stats.averageWPM}</div>
                    <div className="text-xs text-white/80">Avg WPM</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-300">{stats.bestWPM}</div>
                    <div className="text-xs text-white/80">Best WPM</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!hasTests ? (
          <div className="space-y-6">
            {/* Empty State with More Info */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-8 border border-blue-700 text-center">
              <div className="text-6xl mb-4">⌨️</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Tests Yet</h2>
              <p className="text-blue-200 mb-6 max-w-md mx-auto">
                Complete your first typing test to see your analytics, achievements, and progress tracking!
              </p>
              <a
                href="/"
                className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all shadow-lg"
              >
                Start Typing Test →
              </a>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
                <p className="text-purple-200 text-sm">
                  See your WPM improve over time with detailed charts and insights
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-xl p-6 border border-orange-700">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">Unlock Badges</h3>
                <p className="text-orange-200 text-sm">
                  Earn achievements as you reach milestones and improve skills
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700">
                <div className="text-4xl mb-3">🔥</div>
                <h3 className="text-xl font-bold text-white mb-2">Build Streaks</h3>
                <p className="text-green-200 text-sm">
                  Practice daily to maintain your typing streak and stay motivated
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Personal Best Cards */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span> Quick Stats
              </h2>
              <PersonalBestCard />
              
              {/* Improvement % Line */}
              {history.length >= 2 && (
                <div className="mt-4 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 rounded-lg p-5 border border-blue-600 shadow-lg">
                  <p className="text-lg text-center">
                    <span className="text-blue-200 font-semibold">📈 Your WPM improved by </span>
                    <span className={`text-3xl font-extrabold ${improvementPercent > 0 ? 'text-green-400' : improvementPercent < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {improvementPercent > 0 ? '+' : ''}{improvementPercent}%
                    </span>
                    <span className="text-blue-200 font-semibold"> compared to your first test!</span>
                    {improvementPercent > 0 && <span className="ml-2 text-2xl">🎯</span>}
                  </p>
                </div>
              )}
            </section>

            {/* Speed Insights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📈 Smart Insights</h2>
              <SpeedInsightDashboard />
            </section>

            {/* Progress Summary - Above Leaderboard */}
            <section>
              <ProgressSummary />
            </section>

            {/* Achievements & Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section>
                <AchievementBadges />
              </section>
              <section>
                <StreakTracker />
              </section>
            </div>

            {/* Recent Activity Timeline */}
            {history.length > 0 && (
              <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📅</span> Recent Activity
                </h2>
                <div className="space-y-3">
                  {history.slice(-5).reverse().map((test, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            {test.wpm >= 70 ? '🚀' : test.wpm >= 50 ? '⚡' : test.wpm >= 30 ? '📈' : '🌱'}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-white">{test.wpm} WPM</span>
                              <span className={`text-sm font-semibold ${test.accuracy >= 95 ? 'text-green-400' : test.accuracy >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {test.accuracy}% accuracy
                              </span>
                              <span className="text-xs bg-slate-600 px-2 py-1 rounded text-slate-300 capitalize">
                                {test.difficulty}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {new Date(test.date).toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: 'numeric', 
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">
                            {test.wordsTyped} words
                          </div>
                          <div className="text-xs text-slate-500">
                            {Math.round(test.timeElapsed)}s
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {history.length > 5 && (
                  <div className="mt-4 text-center">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                      View All {history.length} Tests →
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Practice Recommendations */}
            <section className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-xl p-6 border border-cyan-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💡</span> Recommended for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.averageAccuracy < 95 && (
                  <div className="bg-cyan-800/30 rounded-lg p-4 border border-cyan-600">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="text-lg font-bold text-white mb-2">Improve Accuracy</h3>
                    <p className="text-cyan-200 text-sm mb-3">
                      Your accuracy is {stats.averageAccuracy}%. Focus on precision over speed.
                    </p>
                    <a href="/" className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold">
                      Practice Now →
                    </a>
                  </div>
                )}
                {stats.averageWPM < 60 && (
                  <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-600">
                    <div className="text-3xl mb-2">⚡</div>
                    <h3 className="text-lg font-bold text-white mb-2">Build Speed</h3>
                    <p className="text-blue-200 text-sm mb-3">
                      Try medium difficulty to push your speed to {stats.averageWPM + 10} WPM.
                    </p>
                    <a href="/" className="text-blue-300 hover:text-blue-200 text-sm font-semibold">
                      Start Challenge →
                    </a>
                  </div>
                )}
                <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="text-lg font-bold text-white mb-2">Learn Techniques</h3>
                  <p className="text-purple-200 text-sm mb-3">
                    Master touch typing with our comprehensive tutorial guide.
                  </p>
                  <a href="/tutorial" className="text-purple-300 hover:text-purple-200 text-sm font-semibold">
                    View Tutorial →
                  </a>
                </div>
              </div>
            </section>

            {/* Leaderboard */}
            <section>
              <LeaderboardLocal />
            </section>

            {/* Challenge Section */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">🚀 Share Your Challenge</h2>
                <p className="text-slate-300">Create custom typing challenges and share them with friends!</p>
              </div>
              <ChallengeLinksModal />
            </section>

            {/* Motivational Footer */}
            <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-xl p-6 text-center shadow-xl border border-yellow-400">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-2xl font-bold text-white mb-2">Keep Pushing Forward!</h3>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                {stats.averageWPM < 40 
                  ? "Every expert was once a beginner. Keep practicing and you'll see amazing results!"
                  : stats.averageWPM < 60 
                  ? "You're making great progress! With consistent practice, you'll reach pro level soon!"
                  : stats.averageWPM < 80 
                  ? "Impressive speed! You're in the top tier of typists. Keep refining your accuracy!"
                  : "Outstanding performance! You're a typing master. Challenge yourself with harder content!"}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
