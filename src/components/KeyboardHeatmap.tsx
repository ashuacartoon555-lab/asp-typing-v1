interface KeyHeatmapProps {
  errors: Array<{ character: string }>;
}

const KeyboardHeatmap = ({ errors }: KeyHeatmapProps) => {
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

  const getKeyColor = (key: string): string => {
    const count = errorCount[key] || 0;
    if (count === 0) return 'bg-success/20 text-success';

    const intensity = count / maxErrors;
    if (intensity >= 0.8) return 'bg-danger text-white';
    if (intensity >= 0.6) return 'bg-warning text-foreground';
    if (intensity >= 0.4) return 'bg-orange-500/70 text-white';
    if (intensity >= 0.2) return 'bg-yellow-500/50 text-foreground';
    return 'bg-muted/30 text-foreground';
  };

  return (
    <div className="w-full bg-card border border-border/30 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-bold">Keyboard Heat Map</h3>
      <div className="space-y-2 justify-center">
        {QWERTY_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button
                key={key}
                className={`w-8 h-8 rounded text-xs font-bold transition-all ${getKeyColor(
                  key
                )} hover:scale-110 border border-border/30`}
                title={`${key}: ${errorCount[key] || 0} errors`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-border/30 text-xs">
        <div className="font-bold mb-2">Error Frequency:</div>
        <div className="grid grid-cols-5 gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default KeyboardHeatmap;
