interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="max-w-full mx-auto">
      <div className="flex justify-between mb-3 font-semibold text-sm" style={{ color: 'hsla(0, 0%, 85%, 0.95)' }}>
        <span>Test Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'hsla(178, 72%, 25%, 0.3)' }}>
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out relative"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, hsl(178, 72%, 40%), hsl(178, 72%, 50%))',
            boxShadow: '0 0 10px hsla(178, 72%, 45%, 0.6)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
