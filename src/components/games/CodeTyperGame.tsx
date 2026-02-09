import { useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Clock, Code, Flame, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCodeTyperGame } from '@/hooks/useCodeTyperGame';

interface CodeTyperGameProps {
  onBack: () => void;
}

const CodeTyperGame = ({ onBack }: CodeTyperGameProps) => {
  const {
    gameStarted,
    gameOver,
    score,
    currentSnippet,
    inputValue,
    snippetsCompleted,
    accuracy,
    timeLeft,
    streak,
    maxStreak,
    highScore,
    startGame,
    resetGame,
    handleInput
  } = useCodeTyperGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  const getCharClass = (index: number) => {
    if (index >= inputValue.length) return 'text-muted-foreground';
    return inputValue[index] === currentSnippet.code[index] ? 'text-green-400' : 'text-red-500 bg-red-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} disabled={gameStarted}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h2 className="text-2xl font-bold gradient-text">Code Typer</h2>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">{highScore}</span>
        </div>
      </div>

      {/* Game area */}
      <div className="card-gradient p-6 rounded-3xl shadow-lg border border-border">
        {/* Pre-game state */}
        {!gameStarted && !gameOver && (
          <div className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4">💻 Code Typer</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Practice typing code snippets in JavaScript, Python, and React!<br />
              Build streaks for bonus points.
            </p>
            <Button onClick={startGame} className="gradient-bg text-white px-8 py-6 text-lg">
              Start Coding
            </Button>
          </div>
        )}

        {/* Active game */}
        {gameStarted && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className={`bg-muted/50 rounded-xl p-3 text-center ${timeLeft <= 15 ? 'animate-pulse bg-red-500/20' : ''}`}>
                <Clock className={`w-5 h-5 mx-auto mb-1 ${timeLeft <= 15 ? 'text-red-500' : 'text-primary'}`} />
                <div className={`text-2xl font-bold ${timeLeft <= 15 ? 'text-red-500' : ''}`}>{timeLeft}s</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Code className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{snippetsCompleted}</div>
                <div className="text-xs text-muted-foreground">Snippets</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center col-span-2 md:col-span-1">
                <Flame className={`w-5 h-5 mx-auto mb-1 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <div className={`text-2xl font-bold ${streak > 0 ? 'text-orange-500' : ''}`}>{streak}x</div>
              </div>
            </div>

            {/* Language badge */}
            <div className="flex justify-center mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                currentSnippet.language === 'JavaScript' ? 'bg-yellow-500/20 text-yellow-500' :
                currentSnippet.language === 'Python' ? 'bg-blue-500/20 text-blue-500' :
                'bg-cyan-500/20 text-cyan-500'
              }`}>
                {currentSnippet.language}
              </span>
            </div>

            {/* Code display */}
            <div className="bg-gray-900 rounded-xl p-6 mb-4 font-mono">
              <div className="text-xl md:text-2xl leading-relaxed">
                {currentSnippet.code.split('').map((char, index) => (
                  <span key={index} className={getCharClass(index)}>
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-gray-900 font-mono text-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type the code..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </>
        )}

        {/* Game over */}
        {gameOver && (
          <div className="text-center py-8">
            <h3 className="text-3xl font-bold mb-2">💻 Coding Complete!</h3>
            <p className="text-5xl font-bold gradient-text mb-6">{score} points</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{snippetsCompleted}</div>
                <div className="text-xs text-muted-foreground">Snippets</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{maxStreak}x</div>
                <div className="text-xs text-muted-foreground">Max Streak</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 col-span-2 md:col-span-1">
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <p className="text-yellow-500 font-semibold mb-6">🏆 New High Score!</p>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={startGame} className="gradient-bg text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Code Again
              </Button>
              <Button onClick={onBack} variant="outline">
                Exit
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {gameStarted && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>🔥 Type code exactly as shown. Build streaks for bonus points!</p>
        </div>
      )}
    </div>
  );
};

export default CodeTyperGame;
