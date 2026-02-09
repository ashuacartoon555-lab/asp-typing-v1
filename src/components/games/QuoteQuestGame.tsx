import { useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Clock, Quote, Target, RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuoteQuestGame } from '@/hooks/useQuoteQuestGame';

interface QuoteQuestGameProps {
  onBack: () => void;
}

const QuoteQuestGame = ({ onBack }: QuoteQuestGameProps) => {
  const {
    gameStarted,
    gameOver,
    score,
    currentQuote,
    inputValue,
    quotesCompleted,
    accuracy,
    timeLeft,
    wpm,
    highScore,
    startGame,
    resetGame,
    handleInput
  } = useQuoteQuestGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  const getCharClass = (index: number) => {
    if (index >= inputValue.length) return 'text-muted-foreground';
    return inputValue[index] === currentQuote.text[index] ? 'text-green-500' : 'text-red-500 bg-red-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} disabled={gameStarted}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h2 className="text-2xl font-bold gradient-text">Quote Quest</h2>
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
            <h3 className="text-3xl font-bold mb-4">📜 Quote Quest</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Type famous quotes accurately to earn points!<br />
              Complete as many quotes as you can in 2 minutes.
            </p>
            <Button onClick={startGame} className="gradient-bg text-white px-8 py-6 text-lg">
              Start Quest
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
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center col-span-2 md:col-span-1">
                <Quote className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{quotesCompleted}</div>
              </div>
            </div>

            {/* Quote display */}
            <div className="bg-muted/30 rounded-xl p-6 mb-4">
              <div className="text-xl md:text-2xl font-serif leading-relaxed mb-4">
                <span className="text-3xl text-primary">"</span>
                {currentQuote.text.split('').map((char, index) => (
                  <span key={index} className={`${getCharClass(index)} transition-colors`}>
                    {char}
                  </span>
                ))}
                <span className="text-3xl text-primary">"</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <User className="w-4 h-4" />
                — {currentQuote.author}
              </div>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-background font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type the quote..."
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
            <h3 className="text-3xl font-bold mb-2">📜 Quest Complete!</h3>
            <p className="text-5xl font-bold gradient-text mb-6">{score} points</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{quotesCompleted}</div>
                <div className="text-xs text-muted-foreground">Quotes Completed</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
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
                Quest Again
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
          <p>📝 Type the quote exactly as shown. Accuracy earns more points!</p>
        </div>
      )}
    </div>
  );
};

export default QuoteQuestGame;
