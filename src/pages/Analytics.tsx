import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import AchievementBadges from '@/components/AchievementBadgesNew';
import StreakTracker from '@/components/StreakTrackerNew';
import SpeedInsightDashboard from '@/components/SpeedInsightDashboard';
import PersonalBestCard from '@/components/PersonalBestCard';
import ProgressSummary from '@/components/ProgressSummary';
import LeaderboardLocal from '@/components/LeaderboardLocal';
import ChallengeLinksModal from '@/components/ChallengeLinksModal';
import ShareCardGenerator from '@/components/ShareCardGenerator';
import CertificateGenerator from '@/components/CertificateGenerator';
import { useTypingHistory } from '@/hooks/useTypingHistory';

const Analytics: React.FC = () => {
  const { stats, history, getImprovementPercent } = useTypingHistory();
  const hasTests = history.length > 0;
  const improvementPercent = getImprovementPercent();
  const [showReportGen, setShowReportGen] = React.useState(false);
  const [showCertForTest, setShowCertForTest] = React.useState<any>(null);

  // Calculate extra stats
  const avgTimePerTest = hasTests ? Math.round(stats.totalTimeSpent / stats.totalTests) : 0;
  const totalMinutes = Math.round(stats.totalTimeSpent / 60);
  const lastTest = hasTests ? history[history.length - 1] : null;
  const bestAccuracy = hasTests ? Math.max(...history.map(t => t.accuracy)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        
        {/* Hero Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-cyan-900/80 border border-indigo-500/20 p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left Side - Title and Button */}
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Your Typing Analytics
                    </span>
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-xl">
                    Track progress, unlock achievements, master challenges & climb the leaderboard
                  </p>
                  
                  {hasTests && (
                    <button
                      onClick={() => setShowReportGen(true)}
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download Report
                    </button>
                  )}
                </div>

                {/* Right Side - Stat Boxes */}
                {hasTests && (
                  <div className="flex gap-3 lg:gap-4">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur border border-cyan-400/20 rounded-xl px-6 py-4 text-center min-w-[100px] hover:border-cyan-400/40 transition-all">
                      <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.totalTests}</div>
                      <div className="text-[10px] text-cyan-300/70 uppercase tracking-wider font-semibold">Tests</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur border border-purple-400/20 rounded-xl px-6 py-4 text-center min-w-[100px] hover:border-purple-400/40 transition-all">
                      <div className="text-3xl font-bold text-purple-400 mb-1">{stats.bestWPM}</div>
                      <div className="text-[10px] text-purple-300/70 uppercase tracking-wider font-semibold">Best WPM</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur border border-emerald-400/20 rounded-xl px-6 py-4 text-center min-w-[100px] hover:border-emerald-400/40 transition-all">
                      <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.averageAccuracy}%</div>
                      <div className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">Accuracy</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick stat pills */}
              {hasTests && (
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-4 py-2 bg-blue-500/15 border border-blue-500/25 rounded-full text-xs text-blue-300 font-medium backdrop-blur-sm">
                    ⏱ {totalMinutes} min total practice
                  </span>
                  <span className="px-4 py-2 bg-amber-500/15 border border-amber-500/25 rounded-full text-xs text-amber-300 font-medium backdrop-blur-sm">
                    📝 {stats.totalWordsTyped.toLocaleString()} words typed
                  </span>
                  <span className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/25 rounded-full text-xs text-emerald-300 font-medium backdrop-blur-sm">
                    📊 {stats.averageWPM} avg WPM
                  </span>
                  {history.length >= 2 && (
                    <span className={`px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm ${improvementPercent > 0 ? 'bg-green-500/15 border border-green-500/25 text-green-300' : improvementPercent < 0 ? 'bg-red-500/15 border border-red-500/25 text-red-300' : 'bg-gray-500/15 border border-gray-500/25 text-gray-300'}`}>
                      {improvementPercent > 0 ? '📈' : improvementPercent < 0 ? '📉' : '➡️'} {improvementPercent > 0 ? '+' : ''}{improvementPercent}% improvement
                    </span>
                  )}
                  <span className="px-4 py-2 bg-purple-500/15 border border-purple-500/25 rounded-full text-xs text-purple-300 font-medium backdrop-blur-sm">
                    🎯 {bestAccuracy}% best accuracy
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!hasTests ? (
          <div className="space-y-6">
            {/* Empty State */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl p-10 border border-slate-700/50 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-4xl">⌨️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Start Your Journey</h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
                Complete your first typing test to unlock analytics, achievements, progress tracking & more!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>⚡</span> Start Typing Test
              </Link>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center mb-3">
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Track Progress</h3>
                <p className="text-slate-400 text-xs">See your WPM improve over time with detailed charts and insights</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 hover:border-amber-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3">
                  <span className="text-xl">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Unlock Badges</h3>
                <p className="text-slate-400 text-xs">Earn achievements as you reach milestones and improve skills</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center mb-3">
                  <span className="text-xl">🔥</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Build Streaks</h3>
                <p className="text-slate-400 text-xs">Practice daily to maintain your typing streak and stay motivated</p>
              </div>
            </div>

            {/* Challenge Preview */}
            <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>⚡</span> 25 Typing Challenges Await
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                {['📝','🔦','🧘','👻','🚫','🧊','🔒','💀','🔄','🔀','💫','✨','🧠','🙈','🪞','🎯','🔥','⏳','💪','🔐','🎧','✍️','🤖','👤','☠️'].map((e, i) => (
                  <div key={i} className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm hover:scale-110 transition-transform">
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-3">Complete a test to start tracking challenge progress</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Last Test Summary */}
            {lastTest && (
              <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Last Test</h3>
                  <span className="text-[10px] text-slate-500">
                    {new Date(lastTest.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-cyan-400">{lastTest.wpm}</div>
                    <div className="text-[10px] text-slate-500">WPM</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-emerald-400">{lastTest.accuracy}%</div>
                    <div className="text-[10px] text-slate-500">Accuracy</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-amber-400">{lastTest.wordsTyped}</div>
                    <div className="text-[10px] text-slate-500">Words</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-purple-400">{Math.round(lastTest.timeElapsed)}s</div>
                    <div className="text-[10px] text-slate-500">Time</div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Best Cards */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-sm">⚡</span> 
                Quick Stats
              </h2>
              <PersonalBestCard />
            </section>

            {/* Speed Insights */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-sm">📈</span>
                Smart Insights
              </h2>
              <SpeedInsightDashboard />
            </section>

            {/* Progress Summary */}
            <section>
              <ProgressSummary />
            </section>

            {/* Achievements & Streak side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section>
                <AchievementBadges />
              </section>
              <section>
                <StreakTracker />
              </section>
            </div>

            {/* Recent Activity */}
            {history.length > 0 && (
              <section className="bg-slate-900/60 rounded-xl p-5 sm:p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-sm">📅</span>
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  {history.slice(-8).reverse().map((test, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5 hover:border-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {test.wpm >= 70 ? '🚀' : test.wpm >= 50 ? '⚡' : test.wpm >= 30 ? '📈' : '🌱'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{test.wpm} WPM</span>
                            <span className={`text-xs ${test.accuracy >= 95 ? 'text-green-400' : test.accuracy >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {test.accuracy}%
                            </span>
                            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 capitalize">
                              {test.difficulty}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(test.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">{test.wordsTyped} words</div>
                          <div className="text-[10px] text-slate-500">{Math.round(test.timeElapsed)}s</div>
                        </div>
                        <button
                          onClick={() => setShowCertForTest(test)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                          title="Download certificate for this test"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {history.length > 8 && (
                  <div className="mt-3 text-center">
                    <span className="text-blue-400 text-xs font-medium">
                      Showing 8 of {history.length} tests
                    </span>
                  </div>
                )}
              </section>
            )}

            {/* Recommendations */}
            <section className="bg-slate-900/60 rounded-xl p-5 sm:p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-sm">💡</span>
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stats.averageAccuracy < 95 && (
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5 hover:border-cyan-500/20 transition-colors">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="text-sm font-bold text-white mb-1">Improve Accuracy</h3>
                    <p className="text-slate-400 text-xs mb-2">
                      Your accuracy is {stats.averageAccuracy}%. Focus on precision over speed.
                    </p>
                    <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Practice Now →</Link>
                  </div>
                )}
                {stats.averageWPM < 60 && (
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5 hover:border-blue-500/20 transition-colors">
                    <div className="text-2xl mb-2">⚡</div>
                    <h3 className="text-sm font-bold text-white mb-1">Build Speed</h3>
                    <p className="text-slate-400 text-xs mb-2">
                      Try medium difficulty to push your speed to {stats.averageWPM + 10} WPM.
                    </p>
                    <Link to="/" className="text-blue-400 hover:text-blue-300 text-xs font-semibold">Start Challenge →</Link>
                  </div>
                )}
                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5 hover:border-purple-500/20 transition-colors">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="text-sm font-bold text-white mb-1">Learn Techniques</h3>
                  <p className="text-slate-400 text-xs mb-2">
                    Master touch typing with our comprehensive tutorial guide.
                  </p>
                  <Link to="/tutorial" className="text-purple-400 hover:text-purple-300 text-xs font-semibold">View Tutorial →</Link>
                </div>
              </div>
            </section>

            {/* Leaderboard */}
            <section>
              <LeaderboardLocal />
            </section>

            {/* Challenge Share */}
            <section className="bg-slate-900/60 rounded-xl p-5 sm:p-6 border border-slate-700/50">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-sm">🚀</span>
                  Share Your Challenge
                </h2>
                <p className="text-slate-400 text-xs">Create custom typing challenges and share them with friends!</p>
              </div>
              <ChallengeLinksModal />
            </section>

            {/* Motivation Footer */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-900/40 via-orange-900/40 to-red-900/40 border border-amber-500/20 p-6 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.08),transparent_70%)]"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-2">💪</div>
                <h3 className="text-lg font-bold text-white mb-1">Keep Pushing Forward!</h3>
                <p className="text-slate-300 text-sm max-w-xl mx-auto">
                  {stats.averageWPM < 40 
                    ? "Every expert was once a beginner. Keep practicing and you'll see amazing results!"
                    : stats.averageWPM < 60 
                    ? "Great progress! With consistent practice, you'll reach pro level soon!"
                    : stats.averageWPM < 80 
                    ? "Impressive speed! You're in the top tier. Keep refining your accuracy!"
                    : "Outstanding! You're a typing master. Try Hardcore challenges!"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Report Generator */}
      {showReportGen && (
        <ShareCardGenerator
          data={{
            type: 'analytics',
            title: '📊 My Typing Analytics',
            wpm: stats.averageWPM,
            accuracy: stats.averageAccuracy,
            tests: stats.totalTests,
            bestWPM: stats.bestWPM,
            totalWords: stats.totalWordsTyped,
            link: 'https://onlinetypingtest.in',
          }}
          onClose={() => setShowReportGen(false)}
        />
      )}

      {/* Certificate for specific test */}
      {showCertForTest && (
        <CertificateGenerator
          data={{
            name: prompt('Enter your name for the certificate:') || 'Participant',
            testType: 'Typing Speed Test',
            wpm: showCertForTest.wpm,
            accuracy: showCertForTest.accuracy,
            grade: showCertForTest.wpm >= 70 ? 'A+' : showCertForTest.wpm >= 60 ? 'A' : showCertForTest.wpm >= 50 ? 'B+' : showCertForTest.wpm >= 40 ? 'B' : 'C',
            score: Math.round((showCertForTest.wpm * showCertForTest.accuracy) / 100),
            date: new Date(showCertForTest.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            duration: `${Math.round(showCertForTest.timeElapsed)}s`,
          }}
          onClose={() => setShowCertForTest(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Analytics;
