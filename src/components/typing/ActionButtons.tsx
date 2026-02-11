import { PlayCircle, RotateCcw, Flag } from 'lucide-react';

interface ActionButtonsProps {
  testStarted: boolean;
  testReady?: boolean;
  testCompleted: boolean;
  onStart: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const ActionButtons = ({ testStarted, testReady, testCompleted, onStart, onReset, onFinish }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      {!testStarted && !testReady && !testCompleted && (
        <button 
          onClick={onStart}
          className="flex items-center justify-center gap-3 px-8 py-4 text-black rounded-full font-semibold text-lg min-w-[200px] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, hsl(178, 72%, 45%), hsl(42, 98%, 58%))',
            boxShadow: '0 6px 25px hsla(178, 72%, 45%, 0.4)'
          }}
        >
          <PlayCircle className="w-5 h-5" /> Start Test
        </button>
      )}
      
      {!testStarted && testReady && !testCompleted && (
        <div 
          className="px-8 py-4 rounded-full font-semibold text-lg min-w-[200px] text-center animate-pulse"
          style={{
            background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(158, 64%, 52%))',
            boxShadow: '0 6px 25px hsla(142, 76%, 36%, 0.5)',
            color: 'white',
            animation: 'slideIn 0.3s ease-out, pulse 2s ease-in-out infinite'
          }}
        >
          ⌨️ Ready - Start Typing!
        </div>
      )}
      
      {testStarted && (
        <button 
          onClick={onFinish}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-success text-success-foreground rounded-full font-semibold text-lg min-w-[200px] hover:-translate-y-1 hover:shadow-lg transition-all"
          style={{ boxShadow: '0 6px 25px hsla(158, 64%, 52%, 0.4)' }}
        >
          <Flag className="w-5 h-5" /> Finish Early
        </button>
      )}
      
      <button 
        onClick={onReset}
        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-lg min-w-[200px] hover:-translate-y-1 transition-all"
        style={{
          background: 'hsla(0, 0%, 100%, 0.1)',
          border: '1px solid hsla(0, 0%, 100%, 0.2)'
        }}
      >
        <RotateCcw className="w-5 h-5" /> Reset Test
      </button>
      
      <div className="w-full text-center text-muted-foreground text-sm mt-2">
        <p className="text-xs opacity-80">
          {!testStarted && !testReady && !testCompleted ? (
            <>• Shortcuts: Alt+S (Start) • Alt+R (Reset)</>
          ) : testReady && !testStarted && !testCompleted ? (
            <>⌨️ Start typing now! Timer will begin automatically on your first keystroke • Alt+R (Reset)</>
          ) : testStarted && !testCompleted ? (
            <>⏱️ Typing in progress... • Alt+F (Finish Early) • Alt+R (Reset)</>
          ) : null}
        </p>
      </div>
    </div>
  );
};

const Keyboard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
    <line x1="6" y1="8" x2="6.01" y2="8"/>
    <line x1="10" y1="8" x2="10.01" y2="8"/>
    <line x1="14" y1="8" x2="14.01" y2="8"/>
    <line x1="18" y1="8" x2="18.01" y2="8"/>
    <line x1="8" y1="12" x2="8.01" y2="12"/>
    <line x1="12" y1="12" x2="12.01" y2="12"/>
    <line x1="16" y1="12" x2="16.01" y2="12"/>
    <line x1="7" y1="16" x2="17" y2="16"/>
  </svg>
);

export default ActionButtons;
