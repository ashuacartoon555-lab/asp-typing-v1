import { useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Star, Clock, Target, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWordMasterGame } from '@/hooks/useWordMasterGame';

interface WordMasterGameProps {
  onBack: () => void;
}

const WordMasterGame = ({ onBack }: WordMasterGameProps) => {
  const {
    gameStarted,
    gameOver,
    score,
    level,
    currentChallenge,
    currentWordIndex,
    inputValue,
    timeLeft,
    wordsCompleted,
    perfectChallenges,
    highScore,
    startGame,
    resetGame,
    handleInput
  } = useWordMasterGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  const getCharClass = (charIndex: number, wordIndex: number) => {
    if (wordIndex !== currentWordIndex) return 'text-muted-foreground';
    if (charIndex >= inputValue.length) return 'text-foreground';
    
    const currentWord = currentChallenge?.words[currentWordIndex] || '';
    return inputValue[charIndex] === currentWord[charIndex] ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} disabled={gameStarted}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h2 className="text-2xl font-bold gradient-text">Word Master</h2>
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
            <h3 className="text-3xl font-bold mb-4">🏆 Word Master</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete typing challenges to level up!<br />
              Each level gets harder with more words and less time.
            </p>
            <Button onClick={startGame} className="gradient-bg text-white px-8 py-6 text-lg">
              Start Challenge
            </Button>
          </div>
        )}

        {/* Active game */}
        {gameStarted && currentChallenge && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className={`bg-muted/50 rounded-xl p-3 text-center ${timeLeft <= 10 ? 'animate-pulse bg-red-500/20' : ''}`}>
                <Clock className={`w-5 h-5 mx-auto mb-1 ${timeLeft <= 10 ? 'text-red-500' : 'text-primary'}`} />
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <div className="text-2xl font-bold">Level {level}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{currentWordIndex + 1}/{currentChallenge.words.length}</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
            </div>

            {/* Challenge words */}
            <div className="bg-muted/30 rounded-xl p-4 mb-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {currentChallenge.words.map((word, wordIndex) => (
                  <div 
                    key={wordIndex}
                    className={`px-3 py-2 rounded-lg font-mono text-lg ${
                      wordIndex < currentWordIndex 
                        ? 'bg-green-500/20 text-green-500 line-through' 
                        : wordIndex === currentWordIndex 
                          ? 'bg-primary/20 border-2 border-primary' 
                          : 'bg-muted/50'
                    }`}
                  >
                    {wordIndex === currentWordIndex ? (
                      word.split('').map((char, charIndex) => (
                        <span key={charIndex} className={getCharClass(charIndex, wordIndex)}>
                          {char}
                        </span>
                      ))
                    ) : (
                      word
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current word highlight */}
            <div className="text-center mb-4">
              <div className="text-3xl font-mono font-bold tracking-wider">
                {currentChallenge.words[currentWordIndex]?.split('').map((char, index) => (
                  <span key={index} className={getCharClass(index, currentWordIndex)}>
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
              placeholder="Type the highlighted word..."
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
            <h3 className="text-3xl font-bold mb-2">🏆 Challenge Complete!</h3>
            <p className="text-5xl font-bold gradient-text mb-6">{score} points</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{level}</div>
                <div className="text-xs text-muted-foreground">Level Reached</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold">{wordsCompleted}</div>
                <div className="text-xs text-muted-foreground">Words Typed</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 col-span-2 md:col-span-1">
                <div className="text-2xl font-bold">{perfectChallenges}</div>
                <div className="text-xs text-muted-foreground">Perfect Challenges</div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <p className="text-yellow-500 font-semibold mb-6">🏆 New High Score!</p>
            )}

            <div className="flex gap-3 justify-center">
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
      </div>

      {/* Instructions */}
      {gameStarted && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>⭐ Complete all words before time runs out! Bonus points for remaining time.</p>
        </div>
      )}
    </div>
  );
};

export default WordMasterGame;
