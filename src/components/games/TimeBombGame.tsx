import { useTimeBombGame } from '@/hooks/useTimeBombGame';
import { Button } from '@/components/ui/button';
import { useSound } from '@/contexts/SoundContext';
import { Flame, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface TimeBombGameProps {
  onBack: () => void;
}

const TimeBombGame = ({ onBack }: TimeBombGameProps) => {
  const game = useTimeBombGame();
  const { playSound } = useSound();

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
          <Flame className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Time Bomb</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Race against time! Type words before the bomb explodes.
            <br />
            Wrong words cost lives. Correct words give bonus time!
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">⏱️ Time:</span>
              <span>60 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">❤️ Lives:</span>
              <span>3</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">📈 Levels:</span>
              <span>4 difficulty levels</span>
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
          <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
          <p className="text-muted-foreground text-xl mb-6">
            {game.lives > 0 ? 'Time\'s up!' : 'All lives lost!'}
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
  const progress = (game.input.length / currentWord.length) * 100;

  return (
    <div className="min-h-[600px] flex flex-col gap-6">
      {/* Header Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">{game.score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-red-500">{game.timeLeft}</div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-blue-500">{game.level}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-red-500">{game.lives}</div>
          <div className="text-xs text-muted-foreground">Lives</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-green-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Time warning */}
      {game.timeLeft <= 10 && (
        <div className="bg-red-500/20 border border-red-500 p-3 rounded-lg text-center animate-pulse">
          <span className="text-red-500 font-bold">⚠️ Time running out!</span>
        </div>
      )}

      {/* Current Word */}
      <div className="bg-card p-8 rounded-xl border border-border text-center">
        <div className="text-sm text-muted-foreground mb-2">Type this word:</div>
        <div className="text-5xl font-bold mb-4 font-mono">
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
        <div className="w-full bg-background rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
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
              e.preventDefault();
              game.handleBackspace();
            }
          }}
          placeholder="Start typing..."
          className="w-full p-3 rounded-lg bg-background border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        💡 Correct word = +5 seconds | Wrong word = -1 life
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default TimeBombGame;
