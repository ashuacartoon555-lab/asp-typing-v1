import { storageManager } from '@/lib/storageManager';
import { useState, useEffect } from 'react';

type HeatmapMode = 'errors' | 'latency';

interface KeyHeatmapProps {
  errors: Array<{ character: string }>;
}

const KeyboardHeatmap = ({ errors }: KeyHeatmapProps) => {
  const [mode, setMode] = useState<HeatmapMode>('errors');
  const [keyLatencies, setKeyLatencies] = useState<{ key: string; avgLatency: number; count: number }[]>([]);

  useEffect(() => {
    const latencies = storageManager.getAllKeyLatencies();
    setKeyLatencies(latencies);
  }, [errors]);

  const QWERTY_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  // Count errors per key
  const errorCount: Record<string, number> = {};
  errors.forEach(({ character }) => {
    const key = character.toUpperCase();
    errorCount[key] = (errorCount[key] || 0) + 1;
  });

  const maxErrors = Math.max(...Object.values(errorCount), 1);

  // Build latency map
  const latencyMap: Record<string, number> = {};
  keyLatencies.forEach(({ key, avgLatency }) => {
    latencyMap[key.toUpperCase()] = avgLatency;
  });
  const maxLatency = Math.max(...Object.values(latencyMap), 1);

  const getKeyColor = (key: string): string => {
    if (mode === 'latency') {
      const latency = latencyMap[key] || 0;
      if (latency === 0) return 'bg-slate-700/30 text-slate-400';
      const intensity = latency / maxLatency;
      if (intensity >= 0.8) return 'bg-red-500 text-white';
      if (intensity >= 0.6) return 'bg-orange-500 text-white';
      if (intensity >= 0.4) return 'bg-yellow-500/70 text-foreground';
      if (intensity >= 0.2) return 'bg-cyan-500/50 text-foreground';
      return 'bg-green-500/30 text-green-300';
    }

    const count = errorCount[key] || 0;
    if (count === 0) return 'bg-success/20 text-success';
    const intensity = count / maxErrors;
    if (intensity >= 0.8) return 'bg-danger text-white';
    if (intensity >= 0.6) return 'bg-warning text-foreground';
    if (intensity >= 0.4) return 'bg-orange-500/70 text-white';
    if (intensity >= 0.2) return 'bg-yellow-500/50 text-foreground';
    return 'bg-muted/30 text-foreground';
  };

  const getKeyTooltip = (key: string): string => {
    if (mode === 'latency') {
      const latency = latencyMap[key] || 0;
      return latency > 0 ? `${key}: ${latency}ms avg` : `${key}: No data`;
    }
    return `${key}: ${errorCount[key] || 0} errors`;
  };

  return (
    <div className="w-full bg-card border border-border/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          {mode === 'latency' ? '🧠 AI Latency Heatmap' : '⌨️ Error Heatmap'}
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

      <div className="space-y-2 justify-center">
        {QWERTY_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button
                key={key}
                className={`w-8 h-8 rounded text-xs font-bold transition-all ${getKeyColor(key)} hover:scale-110 border border-border/30 relative group`}
                title={getKeyTooltip(key)}
              >
                {key}
                {mode === 'latency' && latencyMap[key] && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {latencyMap[key]}ms
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Slow Keys Alert */}
      {mode === 'latency' && keyLatencies.filter(k => k.avgLatency > 250).length > 0 && (
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
          <span className="text-red-400 font-semibold">⚠️ Slow Keys (&gt;250ms): </span>
          <span className="text-muted-foreground">
            {keyLatencies.filter(k => k.avgLatency > 250).map(k => `${k.key.toUpperCase()} (${k.avgLatency}ms)`).join(', ')}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="pt-3 border-t border-border/30 text-xs">
        <div className="font-bold mb-2">{mode === 'latency' ? 'Response Time:' : 'Error Frequency:'}</div>
        <div className="grid grid-cols-5 gap-2">
          {mode === 'latency' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/30"></div>
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cyan-500/50"></div>
                <span>Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500/70"></div>
                <span>Slow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span>Sluggish</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>Weak</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-success/20"></div>
                <span>None</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500/50"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500/70"></div>
                <span>Med</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-warning"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-danger"></div>
                <span>Max</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyboardHeatmap;
