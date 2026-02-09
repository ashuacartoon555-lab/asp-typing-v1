import { useSpellBeeGame } from '@/hooks/useSpellBeeGame';
import { Button } from '@/components/ui/button';
import { BookOpen, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface SpellBeeGameProps {
  onBack: () => void;
}

const SpellBeeGame = ({ onBack }: SpellBeeGameProps) => {
  const game = useSpellBeeGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!game.gameStarted) game.startGame();
        else game.submitWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game]);

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Spell Bee</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Spell words correctly to earn points!
            <br />
            3 wrong spellings and it's game over.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">🎯 Goal:</span>
              <span>Spell words correctly</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">❌ Wrong Allowed:</span>
              <span>3 mistakes</span>
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
          <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
          <p className="text-muted-foreground text-xl mb-6">
            You made 3 spelling mistakes
          </p>
        </div>
        <div className="bg-card p-8 rounded-xl border border-border max-w-md">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-yellow-500">{game.score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-green-500">{game.correctWords}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
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
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">{game.score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
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
          <div className="text-2xl font-bold text-red-500">{3 - game.wrongWords}</div>
          <div className="text-xs text-muted-foreground">Lives</div>
        </div>
      </div>

      {/* Spell Word Section */}
      <div className="bg-card p-8 rounded-xl border border-border">
        <div className="text-sm text-muted-foreground mb-4 text-center">Spell this word:</div>
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-lg mb-6 text-center border border-blue-500/30">
          <audio className="hidden" id="word-audio" />
          <div className="text-3xl font-bold mb-4 text-blue-500">{game.word}</div>
          <Button size="sm" variant="outline" onClick={() => {
            const speech = new SpeechSynthesisUtterance(game.word);
            speechSynthesis.speak(speech);
          }}>
            🔊 Hear Word
          </Button>
        </div>

        {/* Input field */}
        <input
          type="text"
          value={game.input}
          onChange={e => game.setInput(e.target.value)}
          placeholder="Type the spelling..."
          className="w-full p-3 rounded-lg bg-background border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          autoFocus
        />

        <div className="flex gap-3">
          <Button className="flex-1 gradient-bg text-white" onClick={game.submitWord}>
            Submit
          </Button>
          <Button className="flex-1" variant="outline" onClick={onBack}>
            Quit
          </Button>
        </div>
      </div>

      {/* Wrong Guesses */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground mb-2">Mistakes Remaining:</div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < game.wrongWords ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
              }`}
            >
              {i < game.wrongWords ? '✗' : '✓'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpellBeeGame;
