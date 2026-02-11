import { useState } from 'react';
import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Gamepad2, Zap, Clock, Trophy, Star, Target, Flame, Shuffle, HelpCircle, BookOpen, FileText, Hash, Brain, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WordRainGame from '@/components/games/WordRainGame';
import SpeedRacerGame from '@/components/games/SpeedRacerGame';
import KeyboardWarriorGame from '@/components/games/KeyboardWarriorGame';
import WordMasterGame from '@/components/games/WordMasterGame';
import QuoteQuestGame from '@/components/games/QuoteQuestGame';
import CodeTyperGame from '@/components/games/CodeTyperGame';
import TimeBombGame from '@/components/games/TimeBombGame';
import LetterChaosGame from '@/components/games/LetterChaosGame';
import HangmanGame from '@/components/games/HangmanGame';
import SpellBeeGame from '@/components/games/SpellBeeGame';
import TypingPanicGame from '@/components/games/TypingPanicGame';
import SentenceBuilderGame from '@/components/games/SentenceBuilderGame';
import NumberSpeedGame from '@/components/games/NumberSpeedGame';
import MemoryMatrixGame from '@/components/games/MemoryMatrixGame';
import MathSpeedGame from '@/components/games/MathSpeedGame';

type GameType = 'word-rain' | 'speed-racer' | 'keyboard-warrior' | 'word-master' | 'quote-quest' | 'code-typer' | 'time-bomb' | 'letter-chaos' | 'hangman' | 'spell-bee' | 'typing-panic' | 'sentence-builder' | 'number-speed' | 'memory-matrix' | 'math-speed' | null;

const games = [
  { id: 'word-rain' as const, title: "Word Rain", category: "Action", description: "Type falling words before they reach the bottom.", icon: Zap, difficulty: "Easy" as const, color: "from-green-500 to-emerald-500" },
  { id: 'speed-racer' as const, title: "Speed Racer", category: "Action", description: "Race against the clock! Type as many words as you can.", icon: Clock, difficulty: "Medium" as const, color: "from-blue-500 to-cyan-500" },
  { id: 'keyboard-warrior' as const, title: "Keyboard Warrior", category: "Action", description: "Defend your castle by typing words to destroy enemies.", icon: Target, difficulty: "Medium" as const, color: "from-purple-500 to-pink-500" },
  { id: 'time-bomb' as const, title: "Time Bomb", category: "Action", description: "Type words before time runs out! Correct words add bonus time.", icon: Flame, difficulty: "Hard" as const, color: "from-orange-500 to-red-500" },
  { id: 'typing-panic' as const, title: "Typing Panic", category: "Action", description: "Type words as fast as you can! Speed increases with each level.", icon: Zap, difficulty: "Hard" as const, color: "from-yellow-500 to-orange-500" },
  { id: 'letter-chaos' as const, title: "Letter Chaos", category: "Puzzle", description: "Unscramble the letters to form the correct word.", icon: Shuffle, difficulty: "Medium" as const, color: "from-purple-500 to-indigo-500" },
  { id: 'hangman' as const, title: "Hangman", category: "Puzzle", description: "Guess the word letter by letter before running out of chances.", icon: HelpCircle, difficulty: "Easy" as const, color: "from-cyan-500 to-blue-500" },
  { id: 'spell-bee' as const, title: "Spell Bee", category: "Puzzle", description: "Spell challenging words correctly to earn points.", icon: BookOpen, difficulty: "Hard" as const, color: "from-blue-500 to-indigo-500" },
  { id: 'word-master' as const, title: "Word Master", category: "Focus", description: "Complete typing challenges to level up and climb ranks.", icon: Trophy, difficulty: "Hard" as const, color: "from-yellow-500 to-orange-500" },
  { id: 'quote-quest' as const, title: "Quote Quest", category: "Focus", description: "Type famous quotes accurately to earn points.", icon: Star, difficulty: "Easy" as const, color: "from-red-500 to-rose-500" },
  { id: 'sentence-builder' as const, title: "Sentence Builder", category: "Focus", description: "Type complete sentences with perfect accuracy.", icon: FileText, difficulty: "Medium" as const, color: "from-purple-500 to-pink-500" },
  { id: 'code-typer' as const, title: "Code Typer", category: "Technical", description: "Practice typing code snippets in various languages.", icon: Gamepad2, difficulty: "Hard" as const, color: "from-indigo-500 to-violet-500" },
  { id: 'number-speed' as const, title: "Number Speed", category: "Technical", description: "Type number sequences as fast as you can.", icon: Hash, difficulty: "Medium" as const, color: "from-indigo-500 to-blue-500" },
  { id: 'memory-matrix' as const, title: "Memory Matrix", category: "Puzzle", description: "Memorize flashing words and type them back from memory.", icon: Brain, difficulty: "Hard" as const, color: "from-purple-500 to-pink-500" },
  { id: 'math-speed' as const, title: "Math Speed", category: "Technical", description: "Solve math equations as fast as possible! Typing + mental math.", icon: Calculator, difficulty: "Hard" as const, color: "from-green-500 to-emerald-500" }
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const renderGame = () => {
    const gameComponents: Record<string, JSX.Element> = {
      'word-rain': <WordRainGame onBack={() => setActiveGame(null)} />,
      'speed-racer': <SpeedRacerGame onBack={() => setActiveGame(null)} />,
      'keyboard-warrior': <KeyboardWarriorGame onBack={() => setActiveGame(null)} />,
      'word-master': <WordMasterGame onBack={() => setActiveGame(null)} />,
      'quote-quest': <QuoteQuestGame onBack={() => setActiveGame(null)} />,
      'code-typer': <CodeTyperGame onBack={() => setActiveGame(null)} />,
      'time-bomb': <TimeBombGame onBack={() => setActiveGame(null)} />,
      'letter-chaos': <LetterChaosGame onBack={() => setActiveGame(null)} />,
      'hangman': <HangmanGame onBack={() => setActiveGame(null)} />,
      'spell-bee': <SpellBeeGame onBack={() => setActiveGame(null)} />,
      'typing-panic': <TypingPanicGame onBack={() => setActiveGame(null)} />,
      'memory-matrix': <MemoryMatrixGame onBack={() => setActiveGame(null)} />,
      'math-speed': <MathSpeedGame onBack={() => setActiveGame(null)} />,
      'sentence-builder': <SentenceBuilderGame onBack={() => setActiveGame(null)} />,
      'number-speed': <NumberSpeedGame onBack={() => setActiveGame(null)} />
    };
    return activeGame ? gameComponents[activeGame] : null;
  };

  const renderGameCard = (game: typeof games[0]) => (
    <div key={game.id} className="card-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-border hover:shadow-xl transition-all hover:-translate-y-1">
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r ${game.color} flex items-center justify-center mb-3 sm:mb-4`}>
        <game.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{game.title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full ${game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' : game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
          {game.difficulty}
        </span>
        <Button size="sm" className="gradient-bg text-white" onClick={() => setActiveGame(game.id)}>Play Now</Button>
      </div>
    </div>
  );

  if (activeGame) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-5xl mx-auto px-5 py-6">{renderGame()}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-3 sm:mb-4">
            <Gamepad2 className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            Typing Games
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">15 engaging games to improve typing speed, accuracy, and consistency while having fun.</p>
        </div>

        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded mr-3"></div>
            ⚡ Action Games (5)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {games.filter(g => g.category === 'Action').map(renderGameCard)}
          </div>
        </div>

        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded mr-3"></div>
            🧩 Puzzle Games (4)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {games.filter(g => g.category === 'Puzzle').map(renderGameCard)}
          </div>
        </div>

        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded mr-3"></div>
            🎯 Focus Games (3)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {games.filter(g => g.category === 'Focus').map(renderGameCard)}
          </div>
        </div>

        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded mr-3"></div>
            💻 Technical Games (3)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {games.filter(g => g.category === 'Technical').map(renderGameCard)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Games;
