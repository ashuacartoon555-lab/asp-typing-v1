import { TrendingDown, TrendingUp, BarChart3, Zap } from 'lucide-react';

interface ErrorStats {
  totalErrors: number;
  errorRate: number;
  mostCommonMistake: string;
  fastestWord: string;
  slowestWord: string;
  correctionRate: number;
}

interface ErrorStatsProps {
  errors: Array<{ character: string; corrected: boolean }>;
  userInput: string;
  promptText: string;
  testDuration: number;
}

const ErrorStatsDashboard = ({
  errors,
  userInput,
  promptText,
  testDuration,
}: ErrorStatsProps) => {
  // Calculate statistics
  const totalErrors = errors.length;
  const correctedErrors = errors.filter((e) => e.corrected).length;
  const correctionRate = totalErrors > 0 ? Math.round((correctedErrors / totalErrors) * 100) : 0;
  const errorRate = userInput.length > 0 ? Math.round((totalErrors / userInput.length) * 100) : 0;

  // Find most common mistake
  const mistakeFreq: Record<string, number> = {};
  errors.forEach(({ character }) => {
    mistakeFreq[character] = (mistakeFreq[character] || 0) + 1;
  });
  const mostCommonMistake = Object.entries(mistakeFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Calculate WPM
  const wordsTyped = userInput.split(' ').length;
  const minutesElapsed = testDuration / 60;
  const wpm = Math.round(wordsTyped / minutesElapsed);

  return (
    <div className="w-full space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Error Rate */}
        <div className="bg-card border border-border/30 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Error Rate</span>
            <TrendingDown className="w-4 h-4 text-danger" />
          </div>
          <div className="text-2xl font-bold text-danger">{errorRate}%</div>
          <div className="text-xs text-muted-foreground">{totalErrors} mistakes</div>
        </div>

        {/* Correction Rate */}
        <div className="bg-card border border-border/30 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Correction Rate</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-success">{correctionRate}%</div>
          <div className="text-xs text-muted-foreground">{correctedErrors} corrected</div>
        </div>

        {/* Most Common Mistake */}
        <div className="bg-card border border-border/30 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Common Mistake</span>
            <Zap className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning font-mono">{mostCommonMistake}</div>
          <div className="text-xs text-muted-foreground">{mistakeFreq[mostCommonMistake] || 0}x mistakes</div>
        </div>

        {/* WPM */}
        <div className="bg-card border border-border/30 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Speed</span>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{wpm}</div>
          <div className="text-xs text-muted-foreground">WPM</div>
        </div>
      </div>

      {/* Error Distribution */}
      {Object.keys(mistakeFreq).length > 0 && (
        <div className="bg-card border border-border/30 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-bold">Top Mistakes</h3>
          <div className="space-y-2">
            {Object.entries(mistakeFreq)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([char, count]) => (
                <div key={char} className="flex items-center gap-2">
                  <div className="w-12 font-mono font-bold text-danger">{char || '·'}</div>
                  <div className="flex-1 bg-muted/30 rounded-lg h-6 relative overflow-hidden">
                    <div
                      className="bg-danger/60 h-full transition-all"
                      style={{
                        width: `${(count / Object.values(mistakeFreq).reduce((a, b) => a + b, 0)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground min-w-8 text-right">{count}x</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-info/10 border border-info/30 rounded-lg p-4 space-y-2">
        <div className="text-sm font-bold text-info">💡 Insights</div>
        <ul className="text-xs space-y-1 text-foreground">
          {errorRate < 5 && <li>✨ Excellent accuracy! Focus on speed now.</li>}
          {errorRate >= 5 && errorRate < 10 && <li>🎯 Good progress! Keep practicing.</li>}
          {errorRate >= 10 && <li>📚 Focus on accuracy first, speed will follow.</li>}
          {correctionRate > 80 && <li>✓ Great self-correction skills!</li>}
          {mistakeFreq[mostCommonMistake] > 3 && (
            <li>⚠️ Practice words with "{mostCommonMistake}" to improve.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ErrorStatsDashboard;
