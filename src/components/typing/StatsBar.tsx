interface StatsBarProps {
  wpm: number;
  accuracy: number;
  errors: number;
  currentTime: number;
}

const StatsBar = ({ wpm, accuracy, errors, currentTime }: StatsBarProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="stat-card flex flex-col items-center text-center">
        <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{wpm}</div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">WPM</div>
      </div>
      <div className="stat-card flex flex-col items-center text-center">
        <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{accuracy}%</div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Accuracy</div>
      </div>
      <div className="stat-card flex flex-col items-center text-center">
        <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{errors}</div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Errors</div>
      </div>
      <div className="stat-card flex flex-col items-center text-center">
        <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{currentTime}</div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Seconds</div>
      </div>
    </div>
  );
};

export default StatsBar;
