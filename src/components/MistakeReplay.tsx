import { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MistakeReplayProps {
  promptText: string;
  userInput: string;
  testDuration: number;
}

interface CharacterLog {
  index: number;
  character: string;
  expectedCharacter: string;
  timestamp: number;
  isCorrect: boolean;
}

const MistakeReplay = ({ promptText, userInput, testDuration }: MistakeReplayProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Generate character log
  const characterLog: CharacterLog[] = userInput.split('').map((char, index) => ({
    index,
    character: char,
    expectedCharacter: promptText[index] || '',
    timestamp: Math.floor((index / userInput.length) * testDuration),
    isCorrect: char === promptText[index],
  }));

  const mistakesOnly = characterLog.filter((log) => !log.isCorrect);

  // Auto-play functionality
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextMistakeIndex = mistakesOnly.findIndex((m) => m.index > currentIndex);
    if (nextMistakeIndex !== -1) {
      setCurrentIndex(mistakesOnly[nextMistakeIndex].index);
    }
  };

  const handlePrevious = () => {
    const prevMistakeIndex = mistakesOnly.findIndex((m) => m.index < currentIndex);
    if (prevMistakeIndex !== -1) {
      setCurrentIndex(mistakesOnly[prevMistakeIndex].index);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const currentLog = characterLog[currentIndex];

  return (
    <div className="w-full bg-card border border-border/30 rounded-lg p-6 space-y-4">
      <h3 className="text-sm font-bold">Mistake Replay</h3>

      {/* Main Display */}
      <div className="bg-muted/20 rounded-lg p-6 space-y-4 border border-border/30">
        {/* Character Display */}
        {currentLog ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">Character {currentIndex + 1}</div>
              <div className="flex gap-4 items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">You typed</div>
                  <div className="text-3xl font-bold text-danger bg-danger/20 px-6 py-3 rounded-lg">
                    {currentLog.character || '·'}
                  </div>
                </div>
                <div className="text-xl text-muted-foreground">→</div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Should be</div>
                  <div className="text-3xl font-bold text-success bg-success/20 px-6 py-3 rounded-lg">
                    {currentLog.expectedCharacter || '·'}
                  </div>
                </div>
              </div>
            </div>

            {/* Word Context */}
            <div className="bg-foreground/5 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Context</div>
              <div className="text-sm font-mono">
                {promptText.substring(Math.max(0, currentIndex - 15), currentIndex)}
                <span className="bg-danger/30 text-danger font-bold animate-pulse">
                  {currentLog.character}
                </span>
                <span className="text-muted-foreground">{promptText.substring(currentIndex + 1, currentIndex + 16)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2 bg-muted/30 rounded">
                <div className="text-muted-foreground">Position</div>
                <div className="font-bold">{currentIndex + 1} / {characterLog.length}</div>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="text-muted-foreground">Time</div>
                <div className="font-bold">{currentLog.timestamp}s</div>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="text-muted-foreground">Type</div>
                <div className="font-bold">Typo</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground">No mistakes to replay - Perfect typing! 🎉</div>
          </div>
        )}
      </div>

      {/* Controls */}
      {mistakesOnly.length > 0 && (
        <div className="space-y-4">
          {/* Mistake Navigation */}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleReset} variant="outline" className="gap-1">
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
            <Button size="sm" onClick={handlePrevious} variant="outline">
              ← Prev
            </Button>
            <Button size="sm" onClick={handlePlayPause} className="gap-1 flex-1">
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Play
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleNext} variant="outline">
              Next →
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-3">
            <FastForward className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg cursor-pointer accent-primary"
              />
            </div>
            <div className="text-xs font-bold text-primary min-w-8 text-right">{speed}x</div>
          </div>

          {/* Mistakes Summary */}
          <div className="bg-muted/20 p-3 rounded-lg">
            <div className="text-xs font-bold mb-2">Total Mistakes: {mistakesOnly.length}</div>
            <div className="text-xs text-muted-foreground">
              Click "Next" to jump through each mistake, or press "Play" to auto-replay them.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MistakeReplay;
