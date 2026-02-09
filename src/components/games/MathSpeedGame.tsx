import { useMathSpeedGame } from '@/hooks/useMathSpeedGame';
import { Button } from '@/components/ui/button';
import { Calculator, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface MathSpeedGameProps {
  onBack: () => void;
}

const MathSpeedGame = ({ onBack }: MathSpeedGameProps) => {
  const game = useMathSpeedGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!game.gameStarted) {
          game.startGame();
        } else if (!game.gameOver) {
          game.submitAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameStarted, game.gameOver]);

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <Calculator className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Math Speed</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Solve math equations as fast as you can!
            <br />
            Typing speed + mental calculation challenge.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">⏱️ Time:</span>
              <span>90 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">➕ Operations:</span>
              <span>+, -, ×, ÷</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">📈 Bonus:</span>
              <span>+5 seconds per correct answer</span>
            </div>
          </div>
          <Button className="w-full gradient-bg text-white h-12 text-lg" onClick={game.startGame}>
            Start Game
          </Button>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Games
        </Button>
      </div>
    );
  }

  if (game.gameOver) {
    const correctList = game.answerHistory.filter(a => a.isCorrect);
    const incorrectList = game.answerHistory.filter(a => !a.isCorrect);

    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
          <p className="text-muted-foreground text-xl mb-6">
            Great math & typing performance!
          </p>
        </div>

        {/* Summary Stats */}
        <div className="bg-card p-8 rounded-xl border border-border w-full max-w-2xl">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-yellow-500">{game.score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{game.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-green-500">{game.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-purple-500">{game.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Correct Answers Section */}
          {correctList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-green-500 mb-3 flex items-center gap-2">
                ✅ Correct Answers ({correctList.length})
              </h3>
              <div className="bg-background rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {correctList.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span className="font-mono text-sm">
                      {idx + 1}. {record.equation} = <span className="font-bold text-green-500">{record.correctAnswer}</span>
                    </span>
                    <span className="text-xs text-green-500">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incorrect Answers Section */}
          {incorrectList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-2">
                ❌ Incorrect Answers ({incorrectList.length})
              </h3>
              <div className="bg-background rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {incorrectList.map((record, idx) => (
                  <div key={idx} className="p-2 bg-red-500/10 rounded border border-red-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm">
                        {idx + 1}. {record.equation} = ?
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs ml-4">
                      <span className="text-red-500">Your answer: {record.userAnswer}</span>
                      <span className="text-green-500">Correct: {record.correctAnswer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="flex-1 gradient-bg text-white" onClick={game.resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button className="flex-1" variant="outline" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] flex flex-col gap-6">
      {/* Header Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">{game.score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className={`bg-card p-4 rounded-lg border ${game.timeLeft <= 10 ? 'border-red-500' : 'border-border'} text-center`}>
          <div className={`text-2xl font-bold ${game.timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-500'}`}>{game.timeLeft}</div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-blue-500">{game.level}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-green-500">{game.correctAnswers}</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-purple-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Equation Display */}
      <div className="bg-card p-8 rounded-xl border border-border">
        <div className="text-sm text-muted-foreground mb-4 text-center">Solve this equation:</div>
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-8 rounded-lg border border-green-500/30 mb-6">
          <div className="text-7xl font-bold text-center text-green-500 font-mono mb-4">
            {game.equation} = ?
          </div>
        </div>

        {/* Input field */}
        <input
          type="number"
          value={game.input}
          onChange={e => game.setInput(e.target.value)}
          placeholder="Type your answer..."
          inputMode="numeric"
          className="w-full p-4 rounded-lg bg-background border border-border text-center text-3xl font-mono focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          autoFocus
        />

        <Button className="w-full gradient-bg text-white h-12 text-lg" onClick={game.submitAnswer}>
          Submit Answer (Press Enter)
        </Button>
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        🧮 Correct answer = {game.level * 15} points + 5 bonus seconds
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default MathSpeedGame;
