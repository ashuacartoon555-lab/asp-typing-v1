import { useMemoryMatrixGame } from '@/hooks/useMemoryMatrixGame';
import { Button } from '@/components/ui/button';
import { Brain, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface MemoryMatrixGameProps {
  onBack: () => void;
}

const MemoryMatrixGame = ({ onBack }: MemoryMatrixGameProps) => {
  const game = useMemoryMatrixGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!game.gameStarted) {
          game.startGame();
        } else if (!game.showWords && !game.gameOver) {
          game.submitWord();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameStarted, game.showWords, game.gameOver]);

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Memory Matrix</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Words will flash briefly - memorize them!
            <br />
            Then type all words from memory. 70% accuracy to level up.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">🧠 Memory:</span>
              <span>Flash & recall words</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">⏱️ Flash Time:</span>
              <span>Decreases each level</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">🎯 Goal:</span>
              <span>70% accuracy to advance</span>
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
    const correctList = game.wordHistory.filter(w => w.isCorrect);
    const incorrectList = game.wordHistory.filter(w => !w.isCorrect);

    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
          <p className="text-muted-foreground text-xl mb-6">
            Less than 70% accuracy - Keep practicing!
          </p>
        </div>

        {/* Summary Stats */}
        <div className="bg-card p-8 rounded-xl border border-border w-full max-w-2xl">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-yellow-500">{Math.round(game.score)}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{game.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-green-500">{game.correctWords}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-purple-500">{game.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Correct Words Section */}
          {correctList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-green-500 mb-3 flex items-center gap-2">
                ✅ Correct Words ({correctList.length})
              </h3>
              <div className="bg-background rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {correctList.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span className="text-sm">
                      {idx + 1}. <span className="font-bold text-green-500">{record.word}</span>
                      <span className="text-xs text-muted-foreground ml-2">(Round {record.roundNumber})</span>
                    </span>
                    <span className="text-xs text-green-500">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incorrect Words Section */}
          {incorrectList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-2">
                ❌ Incorrect Words ({incorrectList.length})
              </h3>
              <div className="bg-background rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {incorrectList.map((record, idx) => (
                  <div key={idx} className="p-2 bg-red-500/10 rounded border border-red-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {idx + 1}. Expected: <span className="font-bold text-green-500">{record.word}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">Round {record.roundNumber}</span>
                    </div>
                    <div className="text-xs ml-4 text-red-500">
                      You typed: "{record.userTyped || '(empty)'}"
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
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-yellow-500">{Math.round(game.score)}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-blue-500">{game.level}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-green-500">{game.currentWordIndex}/{game.words.length}</div>
          <div className="text-xs text-muted-foreground">Progress</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-purple-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Word Display */}
      <div className="bg-card p-8 rounded-xl border border-border">
        {game.showWords ? (
          <>
            <div className="text-sm text-muted-foreground mb-4 text-center animate-pulse">
              🧠 Memorize these words! They will disappear in {game.flashDuration / 1000} seconds...
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/30">
              <div className="flex flex-wrap gap-4 justify-center">
                {game.displayWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="text-3xl font-bold text-purple-500 px-4 py-2 bg-background rounded-lg animate-bounce"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4 text-center">
              Type word #{game.currentWordIndex + 1} of {game.words.length} from memory:
            </div>
            <div className="bg-background p-6 rounded-lg mb-4 text-center min-h-[100px] flex items-center justify-center">
              <div className="text-6xl">🤔</div>
            </div>

            {/* Input field */}
            <input
              type="text"
              value={game.input}
              onChange={e => game.setInput(e.target.value)}
              placeholder="Type the word..."
              className="w-full p-3 rounded-lg bg-background border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              autoFocus
            />

            <Button className="w-full gradient-bg text-white" onClick={game.submitWord}>
              Submit Word ({game.currentWordIndex + 1}/{game.words.length})
            </Button>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        💡 Focus on memorizing word order. Need 70% accuracy to advance!
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default MemoryMatrixGame;
