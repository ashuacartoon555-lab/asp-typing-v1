interface ErrorVisualizerProps {
  promptText: string;
  userInput: string;
  testStarted: boolean;
}

const ErrorVisualizer = ({ promptText, userInput, testStarted }: ErrorVisualizerProps) => {
  const getCharClass = (index: number) => {
    if (!testStarted) return 'text-foreground';
    if (index >= userInput.length) return 'text-muted-foreground';
    
    const promptChar = promptText[index];
    const userChar = userInput[index];
    
    if (promptChar === userChar) {
      return 'text-success font-semibold'; // ✅ Correct
    } else {
      return 'text-danger font-semibold bg-danger/20'; // ❌ Error
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto mb-8">
      <div className="rounded-2xl p-6 md:p-8 bg-card border border-border/30 overflow-hidden">
        {/* Character-by-character visualization */}
        <div className="text-lg md:text-xl leading-relaxed font-mono break-words">
          {promptText.split('').map((char, index) => (
            <span
              key={index}
              className={`transition-all ${getCharClass(index)} ${
                index === userInput.length && testStarted ? 'animate-pulse border-r-2 border-primary' : ''
              }`}
              title={`Char ${index + 1}`}
            >
              {char === ' ' ? '·' : char}
            </span>
          ))}
        </div>

        {/* Legend */}
        {testStarted && (
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-danger"></span>
              <span>Error</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-muted"></span>
              <span>Not typed</span>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {testStarted && (
          <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-4 gap-4 text-center text-xs">
            <div>
              <div className="text-foreground font-semibold">{userInput.length}</div>
              <div className="text-muted-foreground">Typed</div>
            </div>
            <div>
              <div className="text-success font-semibold">
                {userInput.split('').filter((char, i) => char === promptText[i]).length}
              </div>
              <div className="text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-danger font-semibold">
                {userInput.split('').filter((char, i) => char !== promptText[i] && i < promptText.length).length}
              </div>
              <div className="text-muted-foreground">Errors</div>
            </div>
            <div>
              <div className="text-warning font-semibold">
                {Math.round(
                  (userInput.split('').filter((char, i) => char === promptText[i]).length / userInput.length) * 100
                ) || 0}%
              </div>
              <div className="text-muted-foreground">Accuracy</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorVisualizer;
