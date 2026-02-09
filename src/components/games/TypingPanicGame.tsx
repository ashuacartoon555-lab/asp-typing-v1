import { useTypingPanicGame } from '@/hooks/useTypingPanicGame';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface TypingPanicGameProps {
  onBack: () => void;
}

const TypingPanicGame = ({ onBack }: TypingPanicGameProps) => {
  const game = useTypingPanicGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !game.gameStarted) {
        e.preventDefault();
        game.startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameStarted]);

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Typing Panic</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Type words as fast as you can!
            <br />
            Speed increases with difficulty. Wrong input skips the word.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">⏱️ Time:</span>
              <span>90 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">⚡ Challenge:</span>
              <span>Type fast to survive</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">📈 Levels:</span>
              <span>Increase with correct words</span>
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
          <p className="text-muted-foreground text-xl mb-6">
            Great typing performance!
          </p>
        </div>
        <div className="bg-card p-8 rounded-xl border border-border max-w-md">
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
              <div className="text-3xl font-bold text-green-500">{game.wpm}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-purple-500">{game.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>
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

  const currentWord = game.words[game.currentWordIndex] || '';
  const progress = (game.input.length / currentWord.length) * 100 || 0;

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
          <div className="text-2xl font-bold text-green-500">{game.correctWords}</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-purple-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Current Word */}
      <div className="bg-card p-8 rounded-xl border border-border text-center">
        <div className="text-sm text-muted-foreground mb-4">Type this word:</div>
        <div className="text-6xl font-bold mb-4 font-mono">
          {currentWord.split('').map((char, idx) => (
            <span
              key={idx}
              className={`${
                idx < game.input.length
                  ? char === game.input[idx]
                    ? 'text-green-500'
                    : 'text-red-500'
                  : 'text-muted-foreground'
              }`}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-background rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Input field */}
        <input
          type="text"
          value={game.input}
          onChange={e => {
            const newValue = e.target.value;
            if (newValue.length > game.input.length) {
              // User typed a character
              game.handleInput(newValue[newValue.length - 1]);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace') {
              // Let default backspace work
            }
          }}
          placeholder="Start typing..."
          className="w-full p-3 rounded-lg bg-background border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        ⚡ Correct word = +{game.level * 8} points + 3 bonus seconds
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default TypingPanicGame;
