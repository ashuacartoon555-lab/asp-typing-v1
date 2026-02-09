import { useEffect, useRef } from 'react';
import { ArrowLeft, Shield, Swords, Trophy, RotateCcw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKeyboardWarriorGame } from '@/hooks/useKeyboardWarriorGame';

interface KeyboardWarriorGameProps {
  onBack: () => void;
}

const KeyboardWarriorGame = ({ onBack }: KeyboardWarriorGameProps) => {
  const {
    gameStarted,
    gameOver,
    score,
    wave,
    castleHealth,
    enemies,
    inputValue,
    enemiesDefeated,
    highScore,
    startGame,
    resetGame,
    handleInput
  } = useKeyboardWarriorGame();

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
        <h2 className="text-2xl font-bold gradient-text">Keyboard Warrior</h2>
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
            <h3 className="text-3xl font-bold mb-4">⚔️ Keyboard Warrior</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Defend your castle by typing words to destroy incoming enemies!<br />
              Type fast before they reach your walls.
            </p>
            <Button onClick={startGame} className="gradient-bg text-white px-8 py-6 text-lg">
              Start Battle
            </Button>
          </div>
        )}

        {/* Active game */}
        {gameStarted && (
          <>
            {/* Stats bar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${castleHealth > 50 ? 'bg-green-500' : castleHealth > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${castleHealth}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{castleHealth}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Swords className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Wave {wave}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>Score: <strong>{score}</strong></span>
                <span>Defeated: <strong>{enemiesDefeated}</strong></span>
              </div>
            </div>

            {/* Battle field */}
            <div className="relative h-[300px] bg-gradient-to-r from-red-900/20 via-background to-blue-900/20 rounded-xl overflow-hidden mb-4 border border-border">
              {/* Castle on the left */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl">🏰</div>
              
              {/* Enemies */}
              {enemies.map(enemy => (
                <div
                  key={enemy.id}
                  className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all"
                  style={{ left: `${enemy.x}%` }}
                >
                  <span className="text-2xl">👹</span>
                  <span className="px-2 py-1 bg-red-500/90 text-white rounded font-mono text-sm shadow-lg">
                    {enemy.word}
                  </span>
                </div>
              ))}

              {enemies.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Enemies approaching...
                </div>
              )}
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-background font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type enemy words to destroy them!"
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
            <h3 className="text-3xl font-bold mb-2">⚔️ Battle Over!</h3>
            <p className="text-5xl font-bold gradient-text mb-6">{score} points</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{enemiesDefeated}</div>
                <div className="text-xs text-muted-foreground">Enemies Defeated</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{wave}</div>
                <div className="text-xs text-muted-foreground">Wave Reached</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 col-span-2 md:col-span-1">
                <div className="text-2xl font-bold">{castleHealth}%</div>
                <div className="text-xs text-muted-foreground">Castle Remaining</div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <p className="text-yellow-500 font-semibold mb-6">🏆 New High Score!</p>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={startGame} className="gradient-bg text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Battle Again
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
          <p>⚔️ Type the words attached to enemies to destroy them before they reach your castle!</p>
        </div>
      )}
    </div>
  );
};

export default KeyboardWarriorGame;
