import { useLetterChaosGame } from '@/hooks/useLetterChaosGame';
import { Button } from '@/components/ui/button';
import { useSound } from '@/contexts/SoundContext';
import { Shuffle, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface LetterChaosGameProps {
  onBack: () => void;
}

const LetterChaosGame = ({ onBack }: LetterChaosGameProps) => {
  const game = useLetterChaosGame();
  const { playSound } = useSound();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!game.gameStarted) game.startGame();
        return;
      }
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        game.handleInput((e.target as HTMLInputElement).value + e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game]);

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <Shuffle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Letter Chaos</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Unscramble the letters to form the correct word!
            <br />
            The more words you unscramble, the harder they get.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">⏱️ Time:</span>
              <span>120 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">🎯 Accuracy:</span>
              <span>Every word counts</span>
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
          <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
          <p className="text-muted-foreground text-xl mb-6">
            Great job unscrambling words!
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
              <div className="text-3xl font-bold text-purple-500">{game.correctAttempts}</div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-green-500">{game.accuracy}%</div>
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
          <div className="text-2xl font-bold text-orange-500">{game.correctAttempts}</div>
          <div className="text-xs text-muted-foreground">Solved</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-green-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Time warning */}
      {game.timeLeft <= 15 && (
        <div className="bg-red-500/20 border border-red-500 p-3 rounded-lg text-center animate-pulse">
          <span className="text-red-500 font-bold">⚠️ Time running out!</span>
        </div>
      )}

      {/* Unscramble Word */}
      <div className="bg-card p-8 rounded-xl border border-border">
        <div className="text-sm text-muted-foreground mb-4 text-center">Unscramble these letters:</div>
        
        {/* Scrambled letters with animation */}
        <div className="bg-background p-6 rounded-lg mb-6 text-center">
          <div className="text-4xl font-bold font-mono tracking-widest text-primary mb-2">
            {game.scrambledWord.split('').map((char, idx) => (
              <span key={idx} className="inline-block animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>
                {char.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {game.scrambledWord.length} letters
          </div>
        </div>

        {/* Input field */}
        <input
          type="text"
          value={game.input}
          onChange={e => game.handleInput(e.target.value)}
          placeholder="Type your answer..."
          className="w-full p-3 rounded-lg bg-background border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          autoFocus
        />

        {/* Hints */}
        {game.streak > 0 && (
          <div className="text-center text-sm text-green-500 font-semibold">
            🔥 {game.streak} word streak!
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        💡 Each correct word = {game.level * 15} points + {Math.min(10, game.level * 2)} bonus seconds
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default LetterChaosGame;
