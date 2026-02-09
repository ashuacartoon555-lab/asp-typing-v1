import { useSentenceBuilderGame } from '@/hooks/useSentenceBuilderGame';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface SentenceBuilderGameProps {
  onBack: () => void;
}

const SentenceBuilderGame = ({ onBack }: SentenceBuilderGameProps) => {
  const game = useSentenceBuilderGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!game.gameStarted) game.startGame();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game]);

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Sentence Builder</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Type complete sentences accurately!
            <br />
            Each correct sentence earns bonus time.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">⏱️ Time:</span>
              <span>150 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">📝 Focus:</span>
              <span>Complete sentences</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">📈 Levels:</span>
              <span>3 difficulty levels</span>
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
            Excellent sentence typing!
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
              <div className="text-3xl font-bold text-green-500">{game.correctSentences}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
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

  const progress = (game.input.length / game.sentence.length) * 100 || 0;

  return (
    <div className="min-h-[600px] flex flex-col gap-6">
      {/* Header Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">{game.score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className={`bg-card p-4 rounded-lg border ${game.timeLeft <= 15 ? 'border-red-500' : 'border-border'} text-center`}>
          <div className={`text-2xl font-bold ${game.timeLeft <= 15 ? 'text-red-500 animate-pulse' : 'text-cyan-500'}`}>{game.timeLeft}</div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-blue-500">{game.level}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-green-500">{game.correctSentences}</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-purple-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Sentence Display */}
      <div className="bg-card p-8 rounded-xl border border-border">
        <div className="text-sm text-muted-foreground mb-4 text-center">Type this sentence:</div>
        <div className="bg-background p-4 rounded-lg mb-6 text-lg font-mono text-center">
          {game.sentence.split('').map((char, idx) => (
            <span
              key={idx}
              className={`${
                idx < game.input.length
                  ? char === game.input[idx]
                    ? 'text-green-500 bg-green-500/10'
                    : 'text-red-500 bg-red-500/10'
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
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Input field */}
        <input
          type="text"
          value={game.input}
          onChange={e => game.handleInput(e.target.value)}
          placeholder="Start typing the sentence..."
          className="w-full p-3 rounded-lg bg-background border border-border text-center focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        📝 Correct sentence = {game.level * 50} points + 15 bonus seconds
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default SentenceBuilderGame;
