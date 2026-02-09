import { useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Trophy, Zap, Target, RotateCcw, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeedRacerGame } from '@/hooks/useSpeedRacerGame';

interface SpeedRacerGameProps {
  onBack: () => void;
}

const SpeedRacerGame = ({ onBack }: SpeedRacerGameProps) => {
  const {
    gameStarted,
    gameOver,
    currentWord,
    inputValue,
    score,
    wordsCompleted,
    timeLeft,
    streak,
    maxStreak,
    wpm,
    accuracy,
    carPosition,
    highScore,
    startGame,
    resetGame,
    handleInput
  } = useSpeedRacerGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  const getCharClass = (index: number) => {
    if (index >= inputValue.length) return 'text-muted-foreground';
    return inputValue[index] === currentWord[index] ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} disabled={gameStarted}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h2 className="text-2xl font-bold gradient-text">Speed Racer</h2>
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
            <h3 className="text-3xl font-bold mb-4">🏎️ Speed Racer</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Type as many words as you can in 60 seconds!<br />
              Build streaks for bonus points.
            </p>
            <Button onClick={startGame} className="gradient-bg text-white px-8 py-6 text-lg">
              Start Race
            </Button>
          </div>
        )}

        {/* Active game */}
        {gameStarted && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className={`bg-muted/50 rounded-xl p-3 text-center ${timeLeft <= 10 ? 'animate-pulse bg-red-500/20' : ''}`}>
                <Clock className={`w-5 h-5 mx-auto mb-1 ${timeLeft <= 10 ? 'text-red-500' : 'text-primary'}`} />
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{wpm} WPM</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{wordsCompleted}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center col-span-2 md:col-span-1">
                <Flame className={`w-5 h-5 mx-auto mb-1 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <div className={`text-2xl font-bold ${streak > 0 ? 'text-orange-500' : ''}`}>{streak}x</div>
              </div>
            </div>

            {/* Race track */}
            <div className="relative h-16 bg-muted/30 rounded-xl mb-6 overflow-hidden">
              <div className="absolute inset-0 flex items-center">
                {/* Track lanes */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
              </div>
              {/* Car */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 text-3xl"
                style={{ left: `${Math.min(carPosition, 90)}%` }}
              >
                🏎️
              </div>
              {/* Finish line */}
              <div className="absolute right-4 top-0 bottom-0 w-1 bg-gradient-to-b from-black via-white to-black opacity-50" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">🏁</div>
            </div>

            {/* Current word */}
            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider">
                {currentWord.split('').map((char, index) => (
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
              className="w-full p-4 rounded-xl border border-border bg-background font-mono text-2xl text-center focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type here..."
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
            <h3 className="text-3xl font-bold mb-2">🏁 Race Complete!</h3>
            <p className="text-5xl font-bold gradient-text mb-6">{score} points</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto mb-6">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{wordsCompleted}</div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{maxStreak}x</div>
                <div className="text-xs text-muted-foreground">Max Streak</div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <p className="text-yellow-500 font-semibold mb-6">🏆 New High Score!</p>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={startGame} className="gradient-bg text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Race Again
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
          <p>🔥 Build streaks for bonus points! Accuracy matters!</p>
        </div>
      )}
    </div>
  );
};

export default SpeedRacerGame;
