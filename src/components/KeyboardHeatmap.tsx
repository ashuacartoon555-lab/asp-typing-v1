import { storageManager } from '@/lib/storageManager';
import { useState, useEffect } from 'react';

type HeatmapMode = 'errors' | 'latency';

interface KeyHeatmapProps {
  errors?: Array<{ character: string }>;
}

const KeyboardHeatmap = ({ errors = [] }: KeyHeatmapProps) => {
  const [mode, setMode] = useState<HeatmapMode>('latency');
  const [keyLatencies, setKeyLatencies] = useState<{ key: string; avgLatency: number; count: number; errors: number; errorRate: number }[]>([]);

  // Reload on mount + whenever errors change (test completed)
  useEffect(() => {
    // Small delay to ensure localStorage batch flush has completed
    const timer = setTimeout(() => {
      const latencies = storageManager.getAllKeyLatencies();
      setKeyLatencies(latencies);
    }, 100);
    return () => clearTimeout(timer);
  }, [errors]);

  const QWERTY_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  // Count errors per key (from current test)
  const errorCount: Record<string, number> = {};
  errors.forEach(({ character }) => {
    const key = character.toUpperCase();
    errorCount[key] = (errorCount[key] || 0) + 1;
  });
  const maxErrors = Math.max(...Object.values(errorCount), 1);

  // Build latency map from keyStats
  const latencyMap: Record<string, { avg: number; count: number; errors: number; errorRate: number }> = {};
  keyLatencies.forEach(({ key, avgLatency, count, errors: errs, errorRate }) => {
    latencyMap[key.toUpperCase()] = { avg: avgLatency, count, errors: errs, errorRate };
  });

  /**
   * Heatmap color per spec:
   * Green: <180ms (Fast)
   * Yellow: 180-250ms (Medium)  
   * Red: >250ms (Weak)
   * Also red if errorRate > 15% (with sufficient samples)
   */
  const getKeyColor = (key: string): string => {
    if (mode === 'latency') {
      const data = latencyMap[key];
      if (!data || data.count < 2) return 'bg-slate-700/40 text-slate-500 border-slate-600/40';
      const avg = data.avg;
      const isHighError = data.count >= 10 && data.errorRate > 15;
      // Red: avg > 250ms OR errorRate > 15% (with enough samples)
      if (avg > 250 || isHighError) return 'bg-red-600 text-white border-red-500/60 shadow-red-500/30 shadow-sm';
      // Yellow: 180-250ms
      if (avg >= 180) return 'bg-yellow-500 text-black border-yellow-400/60';
      // Green: <180ms
      return 'bg-emerald-600 text-white border-emerald-500/60';
    }

    // Error mode
    const count = errorCount[key] || 0;
    if (count === 0) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    const intensity = count / maxErrors;
    if (intensity >= 0.6) return 'bg-red-600 text-white border-red-500/60';
    if (intensity >= 0.3) return 'bg-orange-500 text-white border-orange-400/60';
    return 'bg-yellow-500/50 text-foreground border-yellow-400/40';
  };

  const getKeyTooltip = (key: string): string => {
    if (mode === 'latency') {
      const data = latencyMap[key];
      if (!data || data.count < 2) return `${key}: No data yet`;
      return `${key}: ${data.avg}ms avg | ${data.count} samples | ${data.errorRate}% error rate`;
    }
    return `${key}: ${errorCount[key] || 0} errors`;
  };

  // Get count of weak keys (>250ms, min 10 samples)
  const weakKeysCount = keyLatencies.filter(k => k.avgLatency > 250 && k.count >= 10).length;

  return (
    <div className="w-full bg-card border border-border/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          {mode === 'latency' ? '🧠 AI Weakness Heatmap' : '⌨️ Error Heatmap'}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('errors')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              mode === 'errors' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            Errors
          </button>
          <button
            onClick={() => setMode('latency')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              mode === 'latency' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            Speed (ms)
          </button>
        </div>
      </div>

      {/* Keyboard Layout */}
      <div className="space-y-2 justify-center">
        {QWERTY_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button
                key={key}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs font-bold transition-all ${getKeyColor(key)} hover:scale-110 relative group`}
                title={getKeyTooltip(key)}
              >
                {key}
                {mode === 'latency' && latencyMap[key] && (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-1 py-0.5 rounded z-10">
                    {latencyMap[key].avg}ms
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Weak Keys Alert */}
      {mode === 'latency' && weakKeysCount > 0 && (
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
          <span className="text-red-400 font-semibold">⚠️ Weak Keys ({weakKeysCount}): </span>
          <span className="text-muted-foreground">
            {keyLatencies
              .filter(k => k.avgLatency > 250 && k.count >= 10)
              .map(k => `${k.key.toUpperCase()} (${k.avgLatency}ms, ${k.errorRate}% err)`)
              .join(', ')}
          </span>
        </div>
      )}

      {/* Legend — matches the exact spec */}
      <div className="pt-3 border-t border-border/30 text-xs">
        <div className="font-bold mb-2">{mode === 'latency' ? 'Response Time:' : 'Error Frequency:'}</div>
        <div className="flex gap-4 flex-wrap">
          {mode === 'latency' ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600"></div>
                <span className="text-emerald-300">Fast (&lt;180ms)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-yellow-500"></div>
                <span className="text-yellow-300">Medium (180-250ms)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-red-600"></div>
                <span className="text-red-300">Weak (&gt;250ms)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-700/40"></div>
                <span className="text-slate-400">No Data</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500/20"></div>
                <span>None</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-yellow-500/40"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-orange-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-red-500"></div>
                <span>High</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyboardHeatmap;
