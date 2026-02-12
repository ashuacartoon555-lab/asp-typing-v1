import React, { useState } from 'react';
import { useTypingHistory } from '@/hooks/useTypingHistory';
import { TrendingUp, Target, Download } from 'lucide-react';
import CertificateGenerator from './CertificateGenerator';

const ProgressSummary: React.FC = () => {
  const { history, stats, getTypingLevel, getImprovementPercent } = useTypingHistory();
  const [showCertGen, setShowCertGen] = useState(false);

  if (history.length === 0) return null;

  const typingLevel = getTypingLevel();
  const improvementPercent = getImprovementPercent();
  const firstTest = history[0];
  const latestTest = history[history.length - 1];

  // Calculate grade based on performance
  const getGrade = () => {
    if (latestTest.wpm >= 70 && latestTest.accuracy >= 95) return 'A+';
    if (latestTest.wpm >= 60 && latestTest.accuracy >= 90) return 'A';
    if (latestTest.wpm >= 50 && latestTest.accuracy >= 85) return 'B+';
    if (latestTest.wpm >= 40 && latestTest.accuracy >= 80) return 'B';
    if (latestTest.wpm >= 30) return 'C';
    return 'D';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl p-8 border border-indigo-700 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Your Progress Summary</h2>
          </div>
          <button
            onClick={() => setShowCertGen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-4 h-4" />
            Download Report (PDF)
          </button>
        </div>

        <div className="space-y-4 text-lg text-white/90">
          {/* Typing Level Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur">
            <span className="text-2xl">{typingLevel.emoji}</span>
            <span className={`font-bold ${typingLevel.color}`}>{typingLevel.level}</span>
            <span className="text-white/60">Typist</span>
          </div>

          {/* Progress Story */}
          <p className="text-xl leading-relaxed">
            You started at <span className="font-bold text-red-400">{firstTest.wpm} WPM</span>.
          </p>
          
          <p className="text-xl leading-relaxed">
            Now you type at <span className="font-bold text-green-400">{latestTest.wpm} WPM</span>.
          </p>

          {improvementPercent > 0 && (
            <p className="text-xl leading-relaxed">
              That's a <span className="font-bold text-yellow-400 text-2xl">{improvementPercent}%</span> improvement. 
              <span className="ml-2 text-yellow-300">Keep going! 🚀</span>
            </p>
          )}

          {improvementPercent === 0 && history.length > 1 && (
            <p className="text-xl leading-relaxed">
              You're maintaining consistency. Keep practicing to improve! 💪
            </p>
          )}

          {history.length === 1 && (
            <p className="text-xl leading-relaxed text-blue-300">
              Complete more tests to track your improvement journey!
            </p>
          )}

          {/* Additional stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.totalTests}</div>
              <div className="text-sm text-white/60">Tests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.bestWPM}</div>
              <div className="text-sm text-white/60">Personal Best</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.averageAccuracy}%</div>
              <div className="text-sm text-white/60">Avg Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Generator Modal */}
      {showCertGen && (
        <CertificateGenerator
          data={{
            name: prompt('Enter your name for the certificate:') || 'Participant',
            testType: 'Progress Report',
            wpm: latestTest.wpm,
            accuracy: latestTest.accuracy,
            grade: getGrade(),
            score: Math.round((latestTest.wpm * latestTest.accuracy) / 100),
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            duration: `${stats.totalTests} tests completed`,
          }}
          onClose={() => setShowCertGen(false)}
        />
      )}
    </div>
  );
};

export default ProgressSummary;
