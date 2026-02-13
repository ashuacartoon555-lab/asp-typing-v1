import { Target, TrendingDown, Zap, Brain } from 'lucide-react';
import { Button } from './ui/button';
import type { WeakKeyInfo } from '@/hooks/useWeaknessTracker';

interface WeakSpotTrainingProps {
  weakKeys: WeakKeyInfo[];
  onStartDrill: (drillText: string) => void;
  drillText?: string;
}

const WeakSpotTraining = ({ 
  weakKeys,
  onStartDrill,
  drillText,
}: WeakSpotTrainingProps) => {
  if (weakKeys.length === 0) {
    return (
      <div className="bg-card border border-border/30 rounded-xl p-5 space-y-3">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold mb-1">No Weak Keys Detected 🎯</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Complete more tests to identify weak keys. Each key needs 10+ samples for analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/30 rounded-xl p-5 space-y-4">
      {/* Header + Drill Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            Your Weak Keys ({weakKeys.length})
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            avg &gt;250ms OR error rate &gt;15% (min 10 samples)
          </p>
        </div>
        {drillText && (
          <Button
            onClick={() => onStartDrill(drillText)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs"
            size="sm"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Start Personalized Drill
          </Button>
        )}
      </div>

      {/* Weak Keys List */}
      <div className="space-y-1.5">
        {weakKeys.slice(0, 8).map((wk, idx) => (
          <div
            key={wk.key}
            className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium w-4">#{idx + 1}</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center font-mono font-bold text-red-400 text-sm">
                {wk.key.toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-medium text-white">
                  {wk.avgLatency}ms avg
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {wk.count} samples · {wk.errors} errors · {wk.errorRate}% error rate
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {wk.avgLatency > 250 && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-semibold">SLOW</span>
              )}
              {wk.errorRate > 15 && (
                <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[9px] font-semibold">ERROR</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Practice Ratio Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-[11px] text-muted-foreground">
          💡 <strong className="text-blue-300">Smart Drill Ratio:</strong> 60% weak key words · 30% normal words · 10% random words — designed for realistic muscle memory training
        </p>
      </div>

      {/* Recommendation */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 flex items-start gap-2">
        <TrendingDown className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">
          Focus on: <strong className="text-purple-300">{weakKeys.map(w => w.key.toUpperCase()).join(', ')}</strong>. 
          Train until 95%+ accuracy & &lt;200ms per key!
        </p>
      </div>
    </div>
  );
};

export default WeakSpotTraining;
