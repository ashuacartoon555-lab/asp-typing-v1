import { useHangmanGame } from '@/hooks/useHangmanGame';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

interface HangmanGameProps {
  onBack: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const HangmanGame = ({ onBack }: HangmanGameProps) => {
  const game = useHangmanGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!game.gameStarted) game.startGame();
        return;
      }
      if (/[a-zA-Z]/.test(e.key)) {
        game.guessLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game]);

  const hangmanStages = [
    '😊', // 0 wrong
    '😐', // 1 wrong
    '😕', // 2 wrong
    '😟', // 3 wrong
    '😢', // 4 wrong
    '😭', // 5 wrong
    '💀', // 6 wrong
  ];

  if (!game.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold mb-2">Hangman Game</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Guess the word letter by letter!
            <br />
            You have 6 wrong guesses before the game ends.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border max-w-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">🎯 Goal:</span>
              <span>Guess the hidden word</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">❌ Wrong Guesses:</span>
              <span>6 allowed</span>
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
          <div className="text-6xl mb-4">{game.isWon ? '🎉' : '😢'}</div>
          <h2 className="text-4xl font-bold mb-2">
            {game.isWon ? 'You Won!' : 'Game Over!'}
          </h2>
          <p className="text-muted-foreground text-xl mb-4">
            The word was: <span className="text-primary font-bold">{game.word.toUpperCase()}</span>
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
              <div className="text-3xl font-bold text-green-500">{game.gamesWon}</div>
              <div className="text-sm text-muted-foreground">Won</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-3xl font-bold text-purple-500">{game.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 gradient-bg text-white" onClick={game.nextWord}>
              Next Word
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
          <div className="text-2xl font-bold text-red-500">{game.maxWrongGuesses - game.wrongGuesses}</div>
          <div className="text-xs text-muted-foreground">Lives</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-purple-500">{game.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Win Rate</div>
        </div>
      </div>

      {/* Hangman Display */}
      <div className="bg-card p-8 rounded-xl border border-border text-center">
        <div className="text-7xl mb-6">{hangmanStages[game.wrongGuesses]}</div>
        <div className="text-sm text-muted-foreground mb-4">
          Wrong Guesses: {game.wrongGuesses} / {game.maxWrongGuesses}
        </div>
        <div className="w-full bg-red-500/20 rounded-full h-2">
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${(game.wrongGuesses / game.maxWrongGuesses) * 100}%` }}
          />
        </div>
      </div>

      {/* Word Display */}
      <div className="bg-card p-8 rounded-xl border border-border text-center">
        <div className="text-5xl font-bold font-mono tracking-widest text-primary mb-4">
          {game.displayWord}
        </div>
        <div className="text-sm text-muted-foreground">
          {game.word.length} letters
        </div>
      </div>

      {/* Alphabet Buttons */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="text-sm font-semibold text-muted-foreground mb-4">Click or press a letter:</div>
        <div className="grid grid-cols-7 gap-2">
          {ALPHABET.map(letter => (
            <Button
              key={letter}
              onClick={() => game.guessLetter(letter)}
              disabled={game.guessedLetters.includes(letter.toLowerCase()) || game.gameOver}
              className={`p-2 h-auto text-sm font-bold ${
                game.guessedLetters.includes(letter.toLowerCase())
                  ? game.word.toLowerCase().includes(letter.toLowerCase())
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                  : ''
              }`}
              variant={game.guessedLetters.includes(letter.toLowerCase()) ? 'default' : 'outline'}
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>

      {/* Guessed Letters Display */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground mb-2">Guessed Letters:</div>
        <div className="flex flex-wrap gap-2">
          {game.guessedLetters.length > 0 ? (
            game.guessedLetters.map((letter, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded text-sm font-bold ${
                  game.word.toLowerCase().includes(letter)
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}
              >
                {letter.toUpperCase()}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No guesses yet</span>
          )}
        </div>
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Quit Game
      </Button>
    </div>
  );
};

export default HangmanGame;
