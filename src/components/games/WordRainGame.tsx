import { useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Zap, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWordRainGame } from '@/hooks/useWordRainGame';

interface WordRainGameProps {
  onBack: () => void;
}

const WordRainGame = ({ onBack }: WordRainGameProps) => {
  const {
    gameStarted,
    gameOver,
    score,
    level,
    lives,
    words,
    inputValue,
    wordsTyped,
    highScore,
    containerHeight,
    startGame,
    resetGame,
    handleInput
  } = useWordRainGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} disabled={gameStarted}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h2 className="text-2xl font-bold gradient-text">Word Rain</h2>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">{highScore}</span>
        </div>
      </div>

      {/* Game area */}
      <div className="card-gradient p-6 rounded-3xl shadow-lg border border-border">
        {/* Stats bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold">Level {level}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Score: <strong>{score}</strong></span>
            <span>Words: <strong>{wordsTyped}</strong></span>
          </div>
        </div>

        {/* Game container */}
        <div 
          className="relative bg-gradient-to-b from-blue-900/20 to-blue-950/40 rounded-xl overflow-hidden mb-4"
          style={{ height: containerHeight }}
        >
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold mb-4">Word Rain</h3>
              <p className="text-muted-foreground mb-6 text-center px-4">
                Type the falling words before they hit the bottom!<br />
                Speed increases as you level up.
              </p>
              <Button onClick={startGame} className="gradient-bg text-white px-8">
                Start Game
              </Button>
            </div>
          )}

          {gameStarted && words.map(word => (
            <div
              key={word.id}
              className="absolute px-3 py-1 bg-primary/90 text-primary-foreground rounded-lg font-mono text-sm md:text-base shadow-lg transition-all"
              style={{
                left: `${word.x}%`,
                top: word.y,
                transform: 'translateX(-50%)'
              }}
            >
              {word.word}
            </div>
          ))}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-2">Game Over!</h3>
              <p className="text-4xl font-bold gradient-text mb-4">{score} points</p>
              <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                <span>Level: {level}</span>
                <span>Words: {wordsTyped}</span>
              </div>
              {score >= highScore && score > 0 && (
                <p className="text-yellow-500 font-semibold mb-4">🏆 New High Score!</p>
              )}
              <div className="flex gap-3">
                <Button onClick={startGame} className="gradient-bg text-white">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button onClick={onBack} variant="outline">
                  Exit
                </Button>
              </div>
            </div>
          )}

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-500/50" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          disabled={!gameStarted || gameOver}
          className="w-full p-4 rounded-xl border border-border bg-background font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          placeholder={gameStarted ? "Type the falling words..." : "Press Start to play"}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>💡 Tip: Focus on accuracy! Each word gives points based on length × level.</p>
      </div>
    </div>
  );
};

export default WordRainGame;
